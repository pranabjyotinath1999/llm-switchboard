/**
 * Router Implementation
 *
 * Manages the global state and provides the main routing function.
 */

import { classifyByRules } from "./classifier.js";
import { DEFAULT_ROUTING_CONFIG } from "../config/defaults.js";
import { deepMerge } from "../utils/merge.js";
import type { 
  RouterOptions, 
  RecursivePartial, 
  RoutingConfig 
} from "../types/index.js";

// Global active configuration state, fully cloned from defaults
export let ACTIVE_CONFIG: RoutingConfig = JSON.parse(JSON.stringify(DEFAULT_ROUTING_CONFIG));

/**
 * Configure the global router settings.
 * Accepts a partial object that will be deeply merged with defaults.
 */
export function configureRouter(customConfig: RecursivePartial<RoutingConfig>) {
  ACTIVE_CONFIG = deepMerge(ACTIVE_CONFIG, customConfig);
}

/**
 * Reset the global router settings back to the default llm-switchboard config.
 */
export function resetRouter() {
  ACTIVE_CONFIG = JSON.parse(JSON.stringify(DEFAULT_ROUTING_CONFIG));
}

/**
 * Route a request to the cheapest capable model.
 *
 * @param prompt The user's input text/prompt
 * @param options Contextual overrides for tiers or agentic mode
 * @returns The selected model ID string
 */
export function getProductionModel(prompt: string, options?: RouterOptions): string {
  const config = ACTIVE_CONFIG;

  // Estimate input tokens (~4 chars per token)
  const estimatedTokens = Math.ceil(prompt.length / 4);

  // --- Rule-based classification (runs first to get agenticScore) ---
  const ruleResult = classifyByRules(prompt, undefined, estimatedTokens, config.scoring);

  // Auto profile: intelligent routing with agentic detection
  const agenticScore = ruleResult.agenticScore ?? 0;
  const isAutoAgentic = agenticScore >= 0.5;
  const isExplicitAgentic = options?.agenticMode ?? config.overrides.agenticMode ?? false;
  const useAgenticTiers = (isAutoAgentic || isExplicitAgentic) && config.agenticTiers != null;
  
  // Decide which base tier configs to use, merging with request-specific overrides if provided.
  let tierConfigs = useAgenticTiers ? config.agenticTiers! : config.tiers;
  
  if (options?.customTiers && !useAgenticTiers) {
    // shallow merge base config with custom requested tiers
    tierConfigs = { ...tierConfigs, ...options.customTiers } as any;
  } else if (options?.customAgenticTiers && useAgenticTiers) {
    tierConfigs = { ...tierConfigs, ...options.customAgenticTiers } as any;
  }

  // --- Override: large context → force COMPLEX ---
  if (estimatedTokens > config.overrides.maxTokensForceComplex) {
    return tierConfigs["COMPLEX"]?.primary ?? config.tiers["COMPLEX"].primary;
  }

  let tier = ruleResult.tier;
  if (tier === null) {
    // Ambiguous — default to configurable tier (no external API call)
    tier = config.overrides.ambiguousDefaultTier;
  }

  return tierConfigs[tier]?.primary ?? config.tiers[tier].primary;
}
