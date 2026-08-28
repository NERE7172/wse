export {
  optimizeContext,
  type ContextItem,
  type OptimizerOptions,
} from "./optimizer.js";

export {
  estimateTokens,
  estimateContextTokens,
  type TokenEstimate,
  type TokenEstimatorOptions,
} from "./token-estimator.js";

export {
  computeStateDelta,
  type StateRecord,
  type StateDelta,
} from "./state-delta.js";

export {
  compactPayload,
  type CompactPayloadOptions,
  type CompactPayloadResult,
} from "./compact-payload.js";

export {
  verifyPayload,
  type VerificationResult,
  type VerifyOptions,
} from "./verifier.js";

export {
  processContext,
  type PipelineOptions,
  type PipelineInput,
  type PipelineResult,
} from "./pipeline.js";

export {
  resolveSecret,
  type SecretSource,
  type SecretBoundaryResult,
} from "./secret-boundary.js";
