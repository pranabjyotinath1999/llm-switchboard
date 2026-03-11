<div align="center">
  <h1>🔀 llm-switchboard</h1>
  <p><strong>Blazing-fast, zero-overhead local LLM router for production AI apps.</strong></p>

[![NPM Version](https://img.shields.io/npm/v/llm-switchboard?style=flat-square&color=CB3837)](https://www.npmjs.com/package/llm-switchboard)
[![License](https://img.shields.io/github/license/Uo1428/llm-switchboard?style=flat-square&color=blue)](https://github.com/Uo1428/llm-switchboard/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Uo1428/llm-switchboard?style=flat-square&color=ffd700)](https://github.com/Uo1428/llm-switchboard/stargazers)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

  <p>
    Optimize LLM costs and latency by routing prompts to the right model locally. No extra API calls, no network overhead, just smart heuristic classification in <b>&lt; 1ms</b>.
  </p>
</div>

---

## 🌟 Key Features

- 💸 **Zero-Cost Routing:** Runs 100% locally. No expensive LLM-based classification calls.
- ⚡ **Ultra-Low Latency:** Heuristic-based classification adds less than **1ms** to your stack.
- 🧠 **Tiered Intelligence:** Automatically maps prompts to `SIMPLE`, `MEDIUM`, `COMPLEX`, or `REASONING` tiers.
- 🤖 **Agentic Detection:** Specialized logic to identify multi-step, tool-heavy tasks.
- 🌍 **Multilingual Support:** Native intent detection for 10+ major languages.
- 🛠️ **Developer First:** Type-safe, customizable, and works with Bun, Node.js, and Deno.

---

## 🚀 Why llm-switchboard?

In high-volume AI applications, using high-end models (like GPT-4o or Claude 3.5 Sonnet) for every request is a waste of both time and money. Traditional routers use *another* LLM call to classify the prompt, which adds latency and cost.

**llm-switchboard** solves this by using a high-performance heuristic engine that scores prompts across **14 weighted dimensions** instantly.

---

## 📦 Installation

```bash
# Using Bun (Recommended)
bun install llm-switchboard

# Using NPM
npm install llm-switchboard

# Using Yarn
yarn add llm-switchboard
```

---

## 🚦 Smart Tiering System

llm-switchboard classifies every prompt into one of four tiers, allowing you to map specific models to specific task complexities.

| Tier | Task Type | Ideal For | Default Model |
| :--- | :--- | :--- | :--- |
| 🟢 **`SIMPLE`** | Utility | Greetings, yes/no, simple data extraction. | `moonshot/kimi-k2.5` |
| 🟡 **`MEDIUM`** | Creative | Summarization, standard chat, basic coding. | `xai/grok-code-fast-1` |
| 🔴 **`COMPLEX`** | Technical | Systems design, deep analysis, large context. | `google/gemini-3.1-pro-preview` |
| 🧠 **`REASONING`**| Logic | Math, proofs, complex debugging, multi-step logic. | `xai/grok-4-1-fast-reasoning` |

---

## 📖 Usage

### ⚙️ Global Configuration
Set your model preferences once at application startup.

```typescript
import { configureRouter, getProductionModel } from "llm-switchboard";

// Configure your routing table
configureRouter({
  tiers: {
    SIMPLE: { primary: "meta-llama/llama-3-8b-instruct" },
    MEDIUM: { primary: "anthropic/claude-3-haiku" }
  },
  overrides: {
    agenticMode: true
  }
});

// Get the best model for a prompt
const model = getProductionModel("What is the weather like in Tokyo?");
console.log(model); // => "meta-llama/llama-3-8b-instruct"
```

### 🎯 Per-Request Overrides
Override global settings for specific, high-priority, or sensitive prompts.

```typescript
const model = getProductionModel(prompt, {
  customTiers: {
    COMPLEX: { 
      primary: "local-mixtral-8x7b",
      fallback: [] // No cloud fallbacks for privacy
    }
  }
});
```

---

## 📊 How it Works

The classification engine analyzes prompts across multiple dimensions including:
- **Token Density:** Estimating semantic weight vs. length.
- **Syntactic Markers:** Detecting code chunks, mathematical notation, and imperative verbs.
- **Instruction Depth:** Identifying complex formatting demands (JSON, Tables, CSV).
- **Agentic Signatures:** Multi-step planning patterns and tool-use intent.
- **Domain Context:** Scanning for technical terminology and high-entropy keywords.

---

## 🧪 Development & Testing

We include a comprehensive test suite to help you benchmark classification accuracy.

```bash
bun run test
```

---

## 📄 License
MIT © [Uo1428](https://github.com/Uo1428)

<div align="center">
  <sub>Built with ❤️ for the open-source AI community.</sub>
</div>

