import {
  optimizeContext,
  type ContextItem,
  type OptimizerOptions,
} from "./optimizer";

import {
  estimateTokens,
  type TokenEstimate,
  type TokenEstimatorOptions,
} from "./token-estimator";

import {
  computeStateDelta,
  type StateRecord,
  type StateDelta,
} from "./state-delta";

import {
  compactPayload,
  type CompactPayloadOptions,
  type CompactPayloadResult,
} from "./compact-payload";

import {
  verifyPayload,
  type VerificationResult,
  type VerifyOptions,
} from "./verifier";

export type PipelineOptions = {
  optimizer?: OptimizerOptions;
  tokenizer?: TokenEstimatorOptions;
  compact?: CompactPayloadOptions;
  verify?: VerifyOptions;
};

export type PipelineInput = {
  previousState?: StateRecord;
  currentState?: StateRecord;
  context: ContextItem[];
};

export type PipelineResult = {
  optimized: ReturnType<typeof optimizeContext>;
  delta: StateDelta | null;
  payload: CompactPayloadResult;
  tokens: TokenEstimate;
  verification: VerificationResult;
};

export function processContext(
  input: PipelineInput,
  options: PipelineOptions = {},
): PipelineResult {
  const optimized = optimizeContext(
    input.context,
    options.optimizer,
  );

  const delta =
    input.previousState !== undefined &&
    input.currentState !== undefined
      ? computeStateDelta(
          input.previousState,
          input.currentState,
        )
      : null;

  const source = {
    context: optimized.items,
    stateDelta: delta,
  };

  const payload = compactPayload(
    source,
    options.compact,
  );

  let compactedValue: unknown = source;

  try {
    compactedValue = JSON.parse(payload.payload);
  } catch {
    compactedValue = null;
  }

  const verification = verifyPayload(
    source,
    compactedValue,
    options.verify,
  );

  const tokens = estimateTokens(
    payload.payload,
    options.tokenizer,
  );

  return {
    optimized,
    delta,
    payload,
    tokens,
    verification,
  };
}
