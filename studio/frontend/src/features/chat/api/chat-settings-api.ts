// SPDX-License-Identifier: AGPL-3.0-only
// Copyright 2026-present the Unsloth AI Inc. team. All rights reserved. See /studio/LICENSE.AGPL-3.0

import { authFetch } from "@/features/auth";
import type { ChatPresetSource } from "../presets/preset-policy";
import type { ReasoningEffort } from "../stores/chat-runtime-store";
import type { InferenceParams } from "../types/runtime";

export type PersistedInferenceParams = Partial<
  Omit<InferenceParams, "checkpoint">
>;

export interface PersistedChatPreset {
  name: string;
  params: PersistedInferenceParams;
}

/**
 * Persisted model-loading settings: knobs shown in the Settings sheet before
 * loading a local model (KV cache dtype, tensor parallelism, speculative
 * decoding, context length override, chat template override, and GPU offload).
 * Nullable numeric fields use `null` to mean "auto/not set" so the backend
 * can apply per-model defaults.
 */
export interface ModelLoadingSettings {
  kvCacheDtype: string | null;
  tensorParallel: boolean;
  speculativeType: string | null;
  specDraftNMax: number | null;
  customContextLength: number | null;
  chatTemplateOverride: string | null;
  /** Number of layers to offload to GPU. null = auto, -1 = all GPU, 0 = all CPU. */
  gpuLayers: number | null;
  /** When true, the backend chooses GPU offload automatically (n_gpu_layers omitted). */
  autoOffload: boolean;
}

export interface PersistedChatSettings {
  inferenceParams?: PersistedInferenceParams;
  customPresets?: PersistedChatPreset[];
  activePreset?: string;
  activePresetSource?: ChatPresetSource;
  autoTitle?: boolean;
  reasoningEffort?: ReasoningEffort;
  preserveThinking?: boolean;
  collapseHtmlArtifacts?: boolean;
  allowArtifactNetworkAccess?: boolean;
  autoHealToolCalls?: boolean;
  maxToolCallsPerMessage?: number;
  toolCallTimeout?: number;
  modelLoading?: ModelLoadingSettings;
}

interface ChatSettingsResponse {
  settings: PersistedChatSettings;
}

function parseErrorText(status: number, body: unknown): string {
  if (
    body &&
    typeof body === "object" &&
    "detail" in body &&
    typeof body.detail === "string"
  ) {
    return body.detail;
  }
  if (
    body &&
    typeof body === "object" &&
    "detail" in body &&
    body.detail != null
  ) {
    return `Request failed (${status}): ${JSON.stringify(body.detail)}`;
  }
  if (
    body &&
    typeof body === "object" &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message;
  }
  return `Request failed (${status})`;
}

async function parseJsonOrThrow<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(parseErrorText(response.status, body));
  }
  return body as T;
}

export async function getChatSettings(): Promise<PersistedChatSettings> {
  const response = await authFetch("/api/chat/settings");
  const data = await parseJsonOrThrow<ChatSettingsResponse>(response);
  return data.settings;
}

export async function saveChatSettingsPatch(
  patch: PersistedChatSettings,
  options: { keepalive?: boolean } = {},
): Promise<PersistedChatSettings> {
  const response = await authFetch("/api/chat/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
    // keepalive lets the PUT survive a tab close from the beforeunload flush.
    keepalive: options.keepalive,
  });
  const data = await parseJsonOrThrow<ChatSettingsResponse>(response);
  return data.settings;
}
