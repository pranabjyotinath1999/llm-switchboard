import { getProductionModel, configureRouter, resetRouter } from "./src/index.js";

async function runExamples() {
  console.log("=== Running Standard getProductionModel examples ===\n");

  const examples = [
    {
      name: "Simple Greeting",
      query: "Hi there! How are you doing today?",
    },
    {
      name: "Simple Question",
      query: "What is the capital of France?",
    },
    {
      name: "Coding Task",
      query: "Write a React component for a login form using Tailwind CSS.",
      systemPrompt: "You are an expert frontend developer.",
    },
    {
      name: "Reasoning / Math",
      query: "Prove that there are infinitely many prime numbers using proof by contradiction. Lay it out step by step logically.",
    },
    {
      name: "Agentic / Multi-step",
      query: "Read the user.json file, modify the age field to 30, and then deploy the changes.",
    },
  ];

  for (const ex of examples) {
    const model = getProductionModel(ex.query);
    console.log(`[Default] ${ex.name} -> Selected Model: ${model}`);
  }

  console.log("\n=== Testing Global Configuration (configureRouter) ===");
  // Configure the router globally (e.g., at app startup)
  configureRouter({
    tiers: {
      SIMPLE: {
        primary: "my-custom-local-llama-3",
        // Notice we don't specify fallback here, the deep merge will preserve the default fallbacks!
      },
    },
    agenticTiers: {
      SIMPLE: {
        primary: "my-custom-agentic-model",
      }
    },
    overrides: {
      agenticMode: true // Force all queries to use agentic tiers if available
    }
  });

  const globalModel = getProductionModel("Hi there! How are you doing today?");
  console.log(`[Global Override] Simple Greeting -> Selected Model: ${globalModel} (Expected: my-custom-agentic-model)`);

  const globalAgentic = getProductionModel("What is the capital of France?");
  console.log(`[Global Agentic=true] Simple Question -> Selected Model: ${globalAgentic} (Expected: my-custom-agentic-model)`);

  
  console.log("\n=== Testing Per-Request Contextual Overrides ===");
  resetRouter(); // Reset to defaults for clean test

  // Contextual override for a specific request without affecting global config
  // Use a query that definitely scores as MEDIUM (or write an override for all tiers to be safe).
  const lengthyComplexPrompt = "Analyze the complex distributed microservice architecture of this kubernetes database deployment and optimize the algorithm for maximum throughput while staying under budget limits.";
  const customModel = getProductionModel(lengthyComplexPrompt, {
    customTiers: {
      MEDIUM: {
        primary: "claude-3-5-sonnet-latest",
        fallback: []
      }
    }
  });

  console.log(`[Per-Request Override] Task -> Selected Model: ${customModel} (Expected: claude-3-5-sonnet-latest)`);
  
  // Verify global config wasn't touched by the local override
  const normalModel = getProductionModel(lengthyComplexPrompt);
  console.log(`[After Override] Task -> Selected Model: ${normalModel} (Expected: xai/grok-code-fast-1)`);
}

runExamples().catch(console.error);
