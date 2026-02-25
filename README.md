<div align="center">
  <h1>🔀 llm-switchboard</h1>
  <p><strong>Zero-cost, blazing-fast local routing for LLMs.</strong></p>
  <p>
    Navigate the chaotic world of LLM models with a smart, <strong>&lt; 1ms latency</strong> router. It categorizes prompts and executes them against your best, cheapest, or most specialized models automatically.
  </p>
</div>

---

## 🚀 Why llm-switchboard?

Traditional LLM routing relies on making expensive API calls to another LLM just to decide where a prompt should go. **llm-switchboard** changes the game: It uses highly optimized, local heuristic rules to parse prompts instantly and route them to designated **tiers**. 

* 💸 **Zero-Cost Routing:** Runs 100% locally. No API calls to classify prompts.
* ⚡ **Blazing Fast:** `< 1ms` latency overhead.
* 🧠 **Smart Categorization:** Distinguishes between `SIMPLE`, `MEDIUM`, `COMPLEX`, and `REASONING` tasks.
* 🤖 **Agentic Detection:** Automatically detects multi-step, iterative "agentic" tasks and routes them to models that excel at tool use and persistence.
* 🛠️ **Highly Customizable:** Set global defaults at startup or override models per-request.

---

## 📦 Installation

Works out of the box with [Bun](https://bun.com/), Node.js, and other modern JS environments.

```bash
bun install llm-switchboard  # or npm install / yarn add
```

---

## 🚦 Core Concepts (Tiers)

Every incoming prompt is assigned a tier. You map which LLM handles which tier.

| Tier | Difficulty | Best For | Typical Default Model |
| :--- | :---: | :--- | :--- |
| 🟢 **`SIMPLE`** | Low | Greetings, basic translation, simple facts, yes/no questions. | `moonshot/kimi-k2.5` |
| 🟡 **`MEDIUM`** | Moderate | Standard coding questions, simple architecture, moderate logic. | `xai/grok-code-fast-1` |
| 🔴 **`COMPLEX`** | High | Large context tracing, heavy constraints, complex output formats. | `google/gemini-3.1-pro-preview` |
| 🧠 **`REASONING`**| Extreme | Deep math, formal proofs, strict step-by-step logic chains. | `xai/grok-4-1-fast-reasoning` |

---

## 🧬 How It Works (The Logic)

`llm-switchboard` doesn't guess. It parses every prompt and scores it across **14 weighted dimensions** to calculate a confidence score, mapping the aggregate to a specific tier boundary. 

### 📊 The 14 Dimensions Analyzed
* ✅ Estimated Token Count (Short vs Long)
* ✅ Code Keywords & Technical Terminology
* ✅ Reasoning Markers ("step by step") & Multi-step Patterns
* ✅ Imperative Verbs ("build", "create")
* ✅ Constraint Indicators ("under budget", "limit")
* ✅ Formatting Demands ("json", "table") & Reference Complexity
* ✅ Negation Complexity & Domain Specificity
* ✅ Explicit Agentic Task Signatures (File operations, execution commands)

### 🌍 Multilingual Support
The heuristic engine natively understands intent signatures in **10 languages**:
🇺🇸 English | 🇨🇳 Chinese | 🇯🇵 Japanese | 🇷🇺 Russian | 🇩🇪 German | 🇪🇸 Spanish | 🇵🇹 Portuguese | 🇰🇷 Korean | 🇸🇦 Arabic

---

## 📖 Usage Guide

You have two powerful ways to configure routing.

<details open>
<summary><b>1. Global Setup (Application Startup)</b></summary>
<br>

Ideal for setting up your preferred models once when your server boots. This deep-merges with the default logic.

```typescript
import { configureRouter, getProductionModel } from "llm-switchboard";

// Initialize switchboard with your custom choices
configureRouter({
  tiers: {
    SIMPLE: { 
      primary: "my-custom-llama-3", // Overrides the default SIMPLE primary model
    }
  },
  overrides: { 
    agenticMode: true // Optional: Force agentic detection natively
  }
});

// Route!
const bestModel = getProductionModel("Hello, what is the capital of France?");
console.log(bestModel); // => "my-custom-llama-3"
```
</details>

<details>
<summary><b>2. Per-Request Overrides (Dynamic Routing)</b></summary>
<br>

Need absolute certainty for a specific task? Override the global configuration for a single request. Perfect for multi-tenant apps or privacy-sensitive endpoints.

```typescript
import { getProductionModel } from "llm-switchboard";

const sensitivePrompt = "Analyze this highly confidential dataset.";

const isolatedModel = getProductionModel(sensitivePrompt, {
  customTiers: {
    COMPLEX: { 
      primary: "local-mixtral-8x7b", // Forces this model for this request only
      fallback: [] // Disables any cloud fallbacks for total privacy
    }
  }
});

console.log(isolatedModel); // => "local-mixtral-8x7b"
```
</details>

---

## 🧪 Testing

Want to see how exactly it classifies different prompts? Run the built-in test suite:

```bash
bun run test
```

*This test runs through a suite of examples (Greetings, Code, Math, Agentic) and will print out the standard, globally overridden, and contextually overridden model selections to your console.*

---
<div align="center">
  <i>Built for the modern AI engineering stack.</i>
</div>
