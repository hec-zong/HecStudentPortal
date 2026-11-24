# Architecture

## Overview

This application uses the Next.js App Router with TypeScript and source code under `src/`.

## Current Request Flow

Browser request → Next.js route or layout → Server Component, Route Handler, or Server Action → Application service or utility → Rendered response or structured response

## Directory Boundaries

### `src/app`

Routing, layouts, pages, route handlers, loading states, error boundaries, and route-specific composition.

### `src/components`

Reusable presentation and interaction components.

### `src/features`

Feature-specific domain code, including components, schemas, actions, and services.

### `src/lib`

Shared framework-independent utilities and server-side infrastructure.

### `src/config`

Typed application configuration and environment access.

### `src/store`

Zustand client state stores.

## Rendering

Server Components are preferred.
Client Components are introduced only for browser APIs, stateful interactions, effects, or event handling.

## Data Layer

No database or ORM is currently configured.
When introduced, database access must remain server-side and isolated behind an explicit data access or service boundary.

## Authentication and Authorization

Not configured.
Authentication and authorization must be treated as separate concerns when introduced.

## External Integrations

None configured.

## Deployment

The application should remain compatible with standard Next.js deployment environments, including Vercel, unless a future decision changes this requirement.

## Architecture Changes

Update this file when the current architecture changes.
Record the reasoning for significant choices in `DECISIONS.md`.
