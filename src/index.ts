/**
 * llm-switchboard
 *
 * Fast, local, zero-cost LLM routing.
 */

export * from "./types/index.js";
export { 
  getProductionModel, 
  configureRouter, 
  resetRouter,
  ACTIVE_CONFIG 
} from "./core/router.js";
export { classifyByRules } from "./core/classifier.js";
export { DEFAULT_ROUTING_CONFIG } from "./config/defaults.js";
