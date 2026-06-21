// SPDX-License-Identifier: AGPL-3.0-only
// Copyright 2026-present the Unsloth AI Inc. team. All rights reserved. See /studio/LICENSE.AGPL-3.0

import {
  DEFAULT_INFERENCE_PARAMS,
  type InferenceParams,
} from "../types/runtime";

export const defaultInferenceParams = DEFAULT_INFERENCE_PARAMS;

export interface Preset {
  name: string;
  params: InferenceParams;
}

export type PresetOwnedParams = Pick<
  InferenceParams,
  | "temperature"
  | "topP"
  | "topK"
  | "minP"
  | "repetitionPenalty"
  | "presencePenalty"
  | "maxTokens"
  | "systemPrompt"
  // Tier 1
  | "seed"
  | "stop"
  // Tier 2
  | "frequencyPenalty"
  // Tier 3 — Advanced sampling
  | "typicalP"
  | "tfsZ"
  | "topA"
  | "topNSigma"
  | "smoothingFactor"
  // Mirostat
  | "mirostat"
  | "mirostatTau"
  | "mirostatEta"
  // XTC
  | "xtcProbability"
  | "xtcThreshold"
  // DRY
  | "dryMultiplier"
  | "dryBase"
  | "dryAllowedLength"
  | "drySequenceBreakers"
  | "dryPenaltyLastN"
  // Penalties
  | "repeatLastN"
  | "penalizeNl"
  // Dynamic temperature
  | "dynatempRange"
  | "dynatempExponent"
  // Adaptive
  | "adaptiveTarget"
  | "adaptiveDecay"
  // Logit bias
  | "logitBias"
  // Sampler order
  | "samplers"
  // Grammar
  | "grammar"
  | "jsonSchema"
  // Logprobs
  | "logprobs"
  | "topLogprobs"
  | "nProbs"
  // Generation control
  | "ignoreEos"
  | "minKeep"
>;

export const BUILTIN_PRESETS: Preset[] = [
  { name: "Default", params: { ...defaultInferenceParams } },
];

export const BUILTIN_PRESET_NAMES = new Set(
  BUILTIN_PRESETS.map((preset) => preset.name),
);

export type ChatPresetSource = "builtin-default" | "custom" | "modified";

export function getPresetSource(name: string): ChatPresetSource {
  return name === "Default" ? "builtin-default" : "custom";
}

export function getUniquePresetName(
  baseName: string,
  usedNames: Set<string>,
): string {
  const normalizedBase = baseName.trim() || "Imported Prompt";
  let nextName = normalizedBase;
  let suffix = 2;
  while (usedNames.has(nextName)) {
    nextName = `${normalizedBase} ${suffix}`;
    suffix += 1;
  }
  usedNames.add(nextName);
  return nextName;
}

export function getBuiltinVariantName(
  baseName: string,
  usedNames: Set<string>,
): string {
  const normalizedBase = baseName.trim() || "Imported Prompt";
  let suffix = 1;
  let nextName = `${normalizedBase} ${suffix}`;
  while (usedNames.has(nextName)) {
    suffix += 1;
    nextName = `${normalizedBase} ${suffix}`;
  }
  usedNames.add(nextName);
  return nextName;
}

export function normalizeCustomPresets(presets: Preset[]): Preset[] {
  const usedNames = new Set(BUILTIN_PRESET_NAMES);
  return presets
    .map((preset): Preset | null => {
      const trimmedName = preset.name.trim();
      if (!trimmedName) {
        return null;
      }
      const name = usedNames.has(trimmedName)
        ? getBuiltinVariantName(trimmedName, usedNames)
        : trimmedName;
      usedNames.add(name);
      return {
        name,
        params: preset.params,
      };
    })
    .filter((preset): preset is Preset => preset !== null);
}

export function getOrderedPresets(customPresets: Preset[]): Preset[] {
  return [...BUILTIN_PRESETS, ...normalizeCustomPresets(customPresets)];
}

export function getPresetOwnedParams(
  params: InferenceParams,
): PresetOwnedParams {
  return {
    temperature: params.temperature,
    topP: params.topP,
    topK: params.topK,
    minP: params.minP,
    repetitionPenalty: params.repetitionPenalty,
    presencePenalty: params.presencePenalty,
    maxTokens: params.maxTokens,
    systemPrompt: params.systemPrompt,
    // Tier 1
    seed: params.seed,
    stop: params.stop,
    // Tier 2
    frequencyPenalty: params.frequencyPenalty,
    // Tier 3 — Advanced sampling
    typicalP: params.typicalP,
    tfsZ: params.tfsZ,
    topA: params.topA,
    topNSigma: params.topNSigma,
    smoothingFactor: params.smoothingFactor,
    mirostat: params.mirostat,
    mirostatTau: params.mirostatTau,
    mirostatEta: params.mirostatEta,
    xtcProbability: params.xtcProbability,
    xtcThreshold: params.xtcThreshold,
    dryMultiplier: params.dryMultiplier,
    dryBase: params.dryBase,
    dryAllowedLength: params.dryAllowedLength,
    drySequenceBreakers: params.drySequenceBreakers,
    dryPenaltyLastN: params.dryPenaltyLastN,
    repeatLastN: params.repeatLastN,
    penalizeNl: params.penalizeNl,
    dynatempRange: params.dynatempRange,
    dynatempExponent: params.dynatempExponent,
    adaptiveTarget: params.adaptiveTarget,
    adaptiveDecay: params.adaptiveDecay,
    logitBias: params.logitBias,
    samplers: params.samplers,
    grammar: params.grammar,
    jsonSchema: params.jsonSchema,
    logprobs: params.logprobs,
    topLogprobs: params.topLogprobs,
    nProbs: params.nProbs,
    ignoreEos: params.ignoreEos,
    minKeep: params.minKeep,
  };
}

export function isSamePresetConfig(
  a: InferenceParams,
  b: InferenceParams,
): boolean {
  const left = getPresetOwnedParams(a);
  const right = getPresetOwnedParams(b);
  return (
    left.temperature === right.temperature &&
    left.topP === right.topP &&
    left.topK === right.topK &&
    left.minP === right.minP &&
    left.repetitionPenalty === right.repetitionPenalty &&
    left.presencePenalty === right.presencePenalty &&
    left.maxTokens === right.maxTokens &&
    left.systemPrompt === right.systemPrompt &&
    left.seed === right.seed &&
    left.frequencyPenalty === right.frequencyPenalty &&
    left.typicalP === right.typicalP &&
    left.tfsZ === right.tfsZ &&
    left.topA === right.topA &&
    left.topNSigma === right.topNSigma &&
    left.smoothingFactor === right.smoothingFactor &&
    left.mirostat === right.mirostat &&
    left.mirostatTau === right.mirostatTau &&
    left.mirostatEta === right.mirostatEta &&
    left.xtcProbability === right.xtcProbability &&
    left.xtcThreshold === right.xtcThreshold &&
    left.dryMultiplier === right.dryMultiplier &&
    left.dryBase === right.dryBase &&
    left.dryAllowedLength === right.dryAllowedLength &&
    left.dryPenaltyLastN === right.dryPenaltyLastN &&
    left.repeatLastN === right.repeatLastN &&
    left.penalizeNl === right.penalizeNl &&
    left.dynatempRange === right.dynatempRange &&
    left.dynatempExponent === right.dynatempExponent &&
    left.adaptiveTarget === right.adaptiveTarget &&
    left.adaptiveDecay === right.adaptiveDecay &&
    left.logprobs === right.logprobs &&
    left.topLogprobs === right.topLogprobs &&
    left.nProbs === right.nProbs &&
    left.ignoreEos === right.ignoreEos &&
    left.minKeep === right.minKeep &&
    // Reference-equal complex fields — shallow compare by JSON serialization
    // so two presets with identical array/record values are seen as the same.
    JSON.stringify(left.stop) === JSON.stringify(right.stop) &&
    JSON.stringify(left.drySequenceBreakers) === JSON.stringify(right.drySequenceBreakers) &&
    JSON.stringify(left.logitBias) === JSON.stringify(right.logitBias) &&
    JSON.stringify(left.samplers) === JSON.stringify(right.samplers) &&
    left.grammar === right.grammar &&
    left.jsonSchema === right.jsonSchema
  );
}

export function getPresetOwnedConfigKey(params: InferenceParams): string {
  return JSON.stringify(getPresetOwnedParams(params));
}

export function toPresetParams(params: InferenceParams): InferenceParams {
  return {
    ...defaultInferenceParams,
    ...getPresetOwnedParams(params),
  };
}

export function applyPresetParams(
  current: InferenceParams,
  preset: InferenceParams,
): InferenceParams {
  return {
    ...current,
    ...getPresetOwnedParams(preset),
  };
}

export type PresetSaveMode =
  | "disabled"
  | "overwrite-active"
  | "overwrite-other"
  | "copy-builtin"
  | "create";

export interface PresetSaveState {
  mode: PresetSaveMode;
  canSubmit: boolean;
  isSaveReady: boolean;
  buttonLabel: string;
  title: string;
}

export function getPresetSaveState({
  rawName,
  activePreset,
  presets,
  hasUnsavedPresetChanges,
}: {
  rawName: string;
  activePreset: string;
  presets: Preset[];
  hasUnsavedPresetChanges: boolean;
}): PresetSaveState {
  const trimmedName = rawName.trim();
  if (!trimmedName) {
    return {
      mode: "disabled",
      canSubmit: false,
      isSaveReady: false,
      buttonLabel: "Save",
      title: "Enter a preset name",
    };
  }

  if (BUILTIN_PRESET_NAMES.has(trimmedName)) {
    const variantName = getBuiltinVariantName(
      trimmedName,
      new Set(presets.map((preset) => preset.name)),
    );
    return {
      mode: "copy-builtin",
      canSubmit: activePreset !== trimmedName || hasUnsavedPresetChanges,
      isSaveReady: activePreset !== trimmedName || hasUnsavedPresetChanges,
      buttonLabel:
        activePreset === trimmedName && !hasUnsavedPresetChanges
          ? "Saved"
          : "Save",
      title:
        activePreset === trimmedName && !hasUnsavedPresetChanges
          ? "No unsaved changes"
          : `Save current settings as "${variantName}"`,
    };
  }

  const matchingPreset = presets.find((preset) => preset.name === trimmedName);
  if (matchingPreset) {
    const isActiveMatch = matchingPreset.name === activePreset;
    return {
      mode: isActiveMatch ? "overwrite-active" : "overwrite-other",
      canSubmit: !isActiveMatch || hasUnsavedPresetChanges,
      isSaveReady: !isActiveMatch || hasUnsavedPresetChanges,
      buttonLabel: isActiveMatch && !hasUnsavedPresetChanges ? "Saved" : "Save",
      title: isActiveMatch
        ? hasUnsavedPresetChanges
          ? "Save current settings to this preset"
          : "No unsaved changes"
        : `Overwrite preset "${trimmedName}"`,
    };
  }

  return {
    mode: "create",
    canSubmit: true,
    isSaveReady: true,
    buttonLabel: "Save",
    title: `Save current settings as "${trimmedName}"`,
  };
}

function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  return value;
}

interface BackendInferenceDefaults {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  min_p?: number;
  presence_penalty?: number;
  trust_remote_code?: boolean;
}

export interface BackendInferenceEnvelope {
  is_gguf?: boolean;
  context_length?: number | null;
  inference?: BackendInferenceDefaults | null;
}

export function mergeBackendRecommendedInference({
  current,
  response,
  modelId,
  presetSource,
}: {
  current: InferenceParams;
  response: BackendInferenceEnvelope;
  modelId: string;
  presetSource: ChatPresetSource;
}): InferenceParams {
  const inference = response.inference;
  const next: InferenceParams = {
    ...current,
    checkpoint: modelId,
    trustRemoteCode:
      typeof inference?.trust_remote_code === "boolean"
        ? inference.trust_remote_code
        : current.trustRemoteCode,
  };

  if (presetSource !== "builtin-default") {
    return next;
  }

  const defaultMaxTokens = response.is_gguf
    ? (response.context_length ?? current.maxTokens)
    : 4096;
  return {
    ...next,
    maxTokens: defaultMaxTokens,
    temperature:
      toFiniteNumber(inference?.temperature) ??
      defaultInferenceParams.temperature,
    topP: toFiniteNumber(inference?.top_p) ?? defaultInferenceParams.topP,
    topK: toFiniteNumber(inference?.top_k) ?? defaultInferenceParams.topK,
    minP: toFiniteNumber(inference?.min_p) ?? defaultInferenceParams.minP,
    presencePenalty:
      toFiniteNumber(inference?.presence_penalty) ??
      defaultInferenceParams.presencePenalty,
  };
}

export function resolveLoadMaxSeqLength({
  modelId,
  ggufVariant,
  isGguf,
  customContextLength,
  ggufContextLength,
  currentCheckpoint,
  activeGgufVariant,
  maxSeqLength,
  presetSource,
}: {
  modelId: string;
  ggufVariant?: string | null;
  isGguf?: boolean | null;
  customContextLength: number | null;
  ggufContextLength: number | null;
  currentCheckpoint: string;
  activeGgufVariant?: string | null;
  maxSeqLength: number;
  presetSource: ChatPresetSource;
}): number {
  const isDirectGgufFile = modelId.toLowerCase().endsWith(".gguf");
  const isGgufLoad = isGguf === true || ggufVariant != null || isDirectGgufFile;
  const isReloadingCurrentGguf =
    isGgufLoad &&
    currentCheckpoint === modelId &&
    (ggufVariant ?? null) === (activeGgufVariant ?? null);

  if (customContextLength != null) {
    return customContextLength;
  }
  if (isGgufLoad && presetSource === "builtin-default") {
    return 0;
  }
  if (isReloadingCurrentGguf) {
    return ggufContextLength ?? 0;
  }
  if (isGgufLoad) {
    return 0;
  }
  return maxSeqLength;
}
