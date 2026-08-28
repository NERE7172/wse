# WSE Token Optimization Layer

A lightweight, standalone context-management layer designed to reduce unnecessary LLM token usage.

## Scope

This repository contains only the public-safe token-efficiency component of WSE.

It does not contain the full WSE engine, world-simulation orchestration, campaign systems, hidden rules, proprietary runtime logic, or provider infrastructure.

## Goals

- Reduce repeated context sent to an LLM
- Remove duplicate information
- Prioritize important state
- Emit state deltas instead of repeating unchanged state
- Compact structured state before transmission
- Respect configurable token or character budgets

## Conceptual Pipeline

Raw Context
→ Normalize
→ Deduplicate
→ Prioritize
→ Compute State Delta
→ Compact Payload
→ LLM Request

## Safety Boundary

The public package is deliberately separated from the complete WSE engine.

No provider credentials, customer secrets, service-role keys, or private core logic belong in this repository.

## Status

WSE Token Optimization Layer v1.0.0
