// SPDX-License-Identifier: AGPL-3.0-only
// Copyright 2026-present the Unsloth AI Inc. team. All rights reserved. See /studio/LICENSE.AGPL-3.0

export interface InferenceParams {
  // ── Existing core params ──
  temperature: number;
  topP: number;
  topK: number;
  minP: number;
  repetitionPenalty: number;
  presencePenalty: number;
  maxSeqLength: number;
  maxTokens: number;
  systemPrompt: string;
  checkpoint: string;
  /** Allow loading models with custom code (e.g. NVIDIA Nemotron). Only enable for repos you trust. */
  trustRemoteCode?: boolean;
  /**
   * Anthropic fast-mode toggle. Opus 4.6 / 4.7 only; higher OTPS at 6x Opus
   * pricing. Default false.
   * https://platform.claude.com/docs/en/build-with-claude/fast-mode
   */
  fastMode?: boolean;

  // ── Tier 1 — Already sent by backend ──
  /** PRNG seed. -1 = random, 0-2147483647 = deterministic. Default -1. */
  seed?: number;
  /** Stop sequences. Default []. */
  stop?: string[];

  // ── Tier 2 — Backend now forwards ──
  /** Frequency penalty (0-2, step 0.1). Default 0. */
  frequencyPenalty?: number;
  /** Number of completions to generate for each prompt (1-10). Default 1. */
  n?: number;
  /** Alternative to maxTokens. Defaults to backend-configured value. */
  maxCompletionTokens?: number;

  // ── Tier 3 — Advanced sampling ──
  /** Typical sampling (0-1, step 0.01). Default 1.0. */
  typicalP?: number;
  /** Tail-free sampling z value (0-1, step 0.01). Default 1.0. */
  tfsZ?: number;
  /** Top-a sampling (0-1, step 0.01). Default 0. */
  topA?: number;
  /** Top-n-sigma. Default -1. */
  topNSigma?: number;
  /** Smoothing factor (0-1, step 0.01). Default 0. */
  smoothingFactor?: number;

  // ── Mirostat ──
  /** Mirostat mode: 0=off, 1=v1, 2=v2. Default 0. */
  mirostat?: number;
  /** Mirostat tau (0-10, step 0.1). Default 5.0. */
  mirostatTau?: number;
  /** Mirostat eta (0-1, step 0.01). Default 0.1. */
  mirostatEta?: number;

  // ── XTC (Exclude Top Choices) ──
  /** XTC probability (0-1, step 0.01). Default 0. */
  xtcProbability?: number;
  /** XTC threshold (0-1, step 0.01). Default 0.1. */
  xtcThreshold?: number;

  // ── DRY (Don't Repeat Yourself) ──
  /** DRY multiplier (0-10, step 0.1). Default 0. */
  dryMultiplier?: number;
  /** DRY base (1-3, step 0.05). Default 1.75. */
  dryBase?: number;
  /** DRY allowed length (0-20, step 1). Default 2. */
  dryAllowedLength?: number;
  /** DRY sequence breakers. Default ['\n',':','"','*']. */
  drySequenceBreakers?: string[];
  /** DRY penalty last N. Default -1. */
  dryPenaltyLastN?: number;

  // ── Penalties ──
  /** Last N tokens to consider for repetition penalty (-1 to 2048). Default 64. */
  repeatLastN?: number;
  /** Penalize newlines. Default false. */
  penalizeNl?: boolean;

  // ── Dynamic Temperature ──
  /** Dynamic temperature range (0-10, step 0.1). Default 0. */
  dynatempRange?: number;
  /** Dynamic temperature exponent (0-5, step 0.1). Default 1.0. */
  dynatempExponent?: number;

  // ── Adaptive ──
  /** Adaptive target. Default -1. */
  adaptiveTarget?: number;
  /** Adaptive decay (0-1, step 0.01). Default 0.9. */
  adaptiveDecay?: number;

  // ── Logit Bias ──
  /** Token-level logit bias. Default null. */
  logitBias?: Record<string, number> | null;

  // ── Sampler Order ──
  /** Custom sampler order. Default null. */
  samplers?: string[] | null;

  // ── Grammar ──
  /** GBNF grammar string. Default "". */
  grammar?: string;
  /** JSON schema for constrained decoding. Default "". */
  jsonSchema?: string;

  // ── Logprobs ──
  /** Return log probabilities. Default false. */
  logprobs?: boolean;
  /** Number of top logprobs to return (0-20). Default 0. */
  topLogprobs?: number;
  /** Number of probabilities to return (0-100). Default 0. */
  nProbs?: number;

  // ── Generation control ──
  /** Ignore EOS token and keep generating. Default false. */
  ignoreEos?: boolean;
  /** Minimum tokens to keep on context shift (0-100). Default 0. */
  minKeep?: number;

  // ── Tier 4 — Advanced ──

  // ── Reasoning ──
  /** Reasoning format hint ("auto"|"none"|"deepseek"). Default "auto". */
  reasoningFormat?: string;
  /** Reasoning control toggle. Default false. */
  reasoningControl?: boolean;
  /** Reasoning budget in tokens. Default -1. */
  reasoningBudgetTokens?: number;
  /** Reasoning budget start tag. */
  reasoningBudgetStartTag?: string;
  /** Reasoning budget end tag. */
  reasoningBudgetEndTag?: string;
  /** Reasoning budget message. */
  reasoningBudgetMessage?: string;

  // ── Generation Control ──
  /** Number of tokens to keep from prompt (0-4096). Default 0. */
  nKeep?: number;
  /** Number of tokens to discard (0-4096). Default 0. */
  nDiscard?: number;
  /** Indentation tokens (0-100). Default 0. */
  nIndent?: number;
  /** Prompt cache reuse (0-4096). Default 0. */
  nCacheReuse?: number;
  /** Max prediction time in ms (0-600000). Default 0. */
  tMaxPredictMs?: number;

  // ── Output Control ──
  /** Return individual tokens in response. Default false. */
  returnTokens?: boolean;
  /** Return progress updates. Default false. */
  returnProgress?: boolean;
  /** Return post-sampling probabilities. Default false. */
  postSamplingProbs?: boolean;
  /** Return per-token timings. Default false. */
  timingsPerToken?: boolean;
  /** Response fields to return. Default []. */
  responseFields?: string[];
  /** Use backend-side sampling. Default false. */
  backendSampling?: boolean;

  // ── Advanced Grammar ──
  /** Lazy grammar evaluation. Default false. */
  grammarLazy?: boolean;
  /** Grammar trigger tokens. Default []. */
  grammarTriggers?: unknown[];
  /** Preserved token IDs. Default []. */
  preservedTokens?: number[];
}

export const DEFAULT_INFERENCE_PARAMS: InferenceParams = {
  temperature: 0.6,
  topP: 0.95,
  topK: 20,
  minP: 0.01,
  repetitionPenalty: 1.0,
  presencePenalty: 0.0,
  maxSeqLength: 4096,
  maxTokens: 8192,
  systemPrompt: "",
  checkpoint: "",
  trustRemoteCode: false,
  fastMode: false,

  // Tier 1
  seed: -1,
  stop: [],

  // Tier 2
  frequencyPenalty: 0,
  n: 1,
  maxCompletionTokens: 0,

  // Tier 3 — Advanced sampling
  typicalP: 1.0,
  tfsZ: 1.0,
  topA: 0,
  topNSigma: -1,
  smoothingFactor: 0,
  mirostat: 0,
  mirostatTau: 5.0,
  mirostatEta: 0.1,
  xtcProbability: 0,
  xtcThreshold: 0.1,
  dryMultiplier: 0,
  dryBase: 1.75,
  dryAllowedLength: 2,
  drySequenceBreakers: ["\n", ":", '"', "*"],
  dryPenaltyLastN: -1,
  repeatLastN: 64,
  penalizeNl: false,
  dynatempRange: 0,
  dynatempExponent: 1.0,
  adaptiveTarget: -1,
  adaptiveDecay: 0.9,
  logitBias: null,
  samplers: null,
  grammar: "",
  jsonSchema: "",
  logprobs: false,
  topLogprobs: 0,
  nProbs: 0,
  ignoreEos: false,
  minKeep: 0,

  // Tier 4 — Advanced
  reasoningFormat: "auto",
  reasoningControl: false,
  reasoningBudgetTokens: -1,
  reasoningBudgetStartTag: "",
  reasoningBudgetEndTag: "",
  reasoningBudgetMessage: "",
  nKeep: 0,
  nDiscard: 0,
  nIndent: 0,
  nCacheReuse: 0,
  tMaxPredictMs: 0,
  returnTokens: false,
  returnProgress: false,
  postSamplingProbs: false,
  timingsPerToken: false,
  responseFields: [],
  backendSampling: false,
  grammarLazy: false,
  grammarTriggers: [],
  preservedTokens: [],
};

export interface ChatModelSummary {
  id: string;
  name: string;
  description?: string;
  isVision: boolean;
  isLora: boolean;
  isGguf?: boolean;
  isMlx?: boolean;
  isAudio?: boolean;
  audioType?: string | null;
  hasAudioInput?: boolean;
}

export interface ChatLoraSummary {
  id: string;
  name: string;
  baseModel: string;
  updatedAt?: number;
  source?: "training" | "exported";
  exportType?: "lora" | "merged" | "gguf";
}
