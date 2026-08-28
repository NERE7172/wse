# WSE Token Optimization Layer

A lightweight, standalone TypeScript layer for reducing unnecessary LLM context and payload size while preserving important state and information.

## What it does

- Context optimization
- Priority-based information selection
- Deduplication
- Token estimation
- State delta extraction
- Compact payload generation
- Payload verification
- Context processing pipeline
- Secret boundary and redaction utilities
- Configurable context and payload limits

## Design goal

The layer sits between application state and an LLM request.

It helps reduce redundant context before it is sent to the model, making long-running applications more efficient while keeping important information available.

```text
Application State
       ↓
Context Optimization
       ↓
State / Delta Processing
       ↓
Compact Payload
       ↓
Verification
       ↓
LLM Request
npm install wse-token-optimization-layer
npm install
npm test

