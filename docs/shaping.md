---
shaping: true
---

# FE Almanac — Shaping

## Frame

**Source:** Tweet listing ~85 advanced frontend concepts with the challenge "slap yourself if you can't explain at least 10." User wants to build a beautiful, interactive, demonstrative glossary.

**Problem:** These ~85 concepts are scattered across blog posts, docs, and tribal knowledge. No single resource exists that explains them concisely with visual demonstrations in an organized, browsable way.

**Outcome:** A shareable community resource where someone can browse advanced frontend concepts by category, read a concise explanation, and see an animated visualization that makes the concept click.

---

## Requirements (R)

| ID | Requirement | Status |
|----|-------------|--------|
| R0 | Browse ~85 frontend concepts organized by category | Core goal |
| R1 | Each concept has a concise explanation (2-3 sentences) | Core goal |
| R2 | Each concept has an animated visualization/diagram | Core goal |
| R3 | Shareable as a community resource (public URL, works on any device) | Must-have |
| R4 | Concepts are searchable and filterable by category | Must-have |
| R5 | Works without requiring users to install anything or run code | Must-have |
| R6 | Visually beautiful — not a wiki, not a textbook | Must-have |
| R7 | Curated entry experience | Must-have |
| R8 | Deep-linkable to specific concept | Must-have |
| R9 | Desktop-first, mobile nice-to-have (sidebar collapses) | Nice-to-have |
| R10 | Visualizations play/animate on view, not all at once | Must-have |
| R11 | Respects `prefers-reduced-motion` — static fallback for all animations | Must-have |
| R12 | Scalable approach — can realistically produce 85 visualizations | Must-have |

---

## Shape B (Selected): Single-Page Explorer with Side-by-Side Detail

| Part | Mechanism |
|------|-----------|
| **B1** | Sidebar: collapsible category tree with concept names |
| **B2** | Main panel: side-by-side — explanation left, animated visualization right |
| **B3** | Search input at top of sidebar filters the tree |
| **B4** | URL hash for deep linking (`#concept-slug`) |
| **B5** | Landing state: hero with purpose statement + prompt to explore |
| **B6** | Visualizations trigger on concept selection, not on page load |
| **B7** | Visualization toolkit: reusable animation primitives (flow arrows, tree diagrams, step-through sequences, before/after comparisons) composed per concept |
| **B8** | Each visualization has play/pause/replay controls |
| **B9** | Monochromatic design system — restrained palette, one accent color, generous whitespace |

---

## Fit Check: R × B

| Req | Requirement | Status | B |
|-----|-------------|--------|---|
| R0 | Browse ~85 concepts organized by category | Core goal | ✅ |
| R1 | Concise explanation per concept | Core goal | ✅ |
| R2 | Animated visualization per concept | Core goal | ✅ |
| R3 | Shareable public URL, works on any device | Must-have | ✅ |
| R4 | Searchable and filterable by category | Must-have | ✅ |
| R5 | No install required | Must-have | ✅ |
| R6 | Visually beautiful | Must-have | ✅ |
| R7 | Curated entry experience | Must-have | ✅ |
| R8 | Deep-linkable to specific concept | Must-have | ✅ |
| R9 | Desktop-first, mobile nice-to-have | Nice-to-have | ✅ |
| R10 | Visualizations play on view | Must-have | ✅ |
| R11 | Respects prefers-reduced-motion | Must-have | ✅ |
| R12 | Scalable visualization approach | Must-have | ✅ |

---

## Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Framework | Next.js (App Router) | SSR, routing, deployment |
| Styling | Tailwind CSS | Utility-first styling |
| Component animation | Motion (Framer Motion) | Layout transitions, mount/unmount, gestures |
| Timeline animation | GSAP (free) | Complex multi-step SVG animations, scrubbing |
| Structural diagrams | D3.js | Tree/graph/flow visualizations |
| Acceleration | AI-scaffolded SVG + GSAP | Generate initial animation code, human refines |
| Hosting | Vercel | Deploy from GitHub |

---

## Visualization Strategy

**Layered approach:**

1. **Motion** — all 85 concepts get component-level animation (entrance, transitions)
2. **GSAP timelines** — ~30-40 concepts with multi-step sequences (event loop, data flow, etc.)
3. **D3.js** — ~10-15 concepts that ARE trees/graphs/flows (DOM diffing, component trees)
4. **AI scaffolding** — generate initial SVG + animation code, refine manually

**Reusable primitives to build:**
- Flow diagram (data/events moving through stages)
- Tree diff (before/after with highlight)
- Timeline stepper (sequential events with playhead)
- Before/after comparison (side-by-side or toggle)
- Layer stack (stacked visualization with peel-away)
- Cycle/loop (repeating process animation)

---

## Concept Categories

| Category | Count | Concepts |
|----------|-------|----------|
| Rendering & Hydration | 12 | Hydration, partial hydration, islands architecture, streaming SSR, concurrent rendering, time slicing, selective hydration, server components, edge rendering, speculative prerendering, deterministic rendering, render waterfalls |
| React Internals | 5 | Reconciliation algorithm, fiber architecture, virtual DOM diffing complexity, suspense boundaries, scheduler priorities |
| Data & State Patterns | 6 | Structural sharing, immutable data patterns, referential equality, memoization pitfalls, stale closure problem, race conditions in UI state |
| JavaScript Runtime | 4 | Event loop (macro vs microtasks), task starvation, priority inversion in async code, long tasks API |
| Browser Rendering | 8 | Layout thrashing, critical rendering path, render blocking resources, browser compositing layers, paint vs composite vs layout, GPU acceleration in CSS, CSS containment, subpixel rendering |
| Observers & APIs | 4 | IntersectionObserver internals, ResizeObserver loop limits, MutationObserver cost, PerformanceObserver API |
| Networking & Caching | 8 | Stale-while-revalidate, ETag vs Cache-Control, HTTP/3 and QUIC, priority hints, preload vs prefetch vs preconnect, CORS preflight, service worker lifecycle traps, cache invalidation strategies |
| Security | 6 | CSRF vs XSS mitigation, content security policy (CSP), trusted types, DOM clobbering, prototype pollution, SameSite cookie modes |
| Concurrency & Async | 5 | Tearing in concurrent UI, AbortController, backpressure in streams API, streaming fetch response handling, optimistic UI rollback strategy |
| Web Platform | 7 | Web Workers vs Service Workers, SharedArrayBuffer, transferable objects, OffscreenCanvas, WebAssembly integration, shadow DOM, custom elements lifecycle |
| Build & Bundling | 5 | Tree shaking internals, code splitting strategies, dynamic import chunking, module federation, web components interoperability |
| Architecture | 5 | Micro-frontend orchestration, finite state modeling, event sourcing in frontend, offline conflict resolution, CRDT basics for collaboration |
| Web Vitals | 4 | First Input Delay (FID), Interaction to Next Paint (INP), Cumulative Layout Shift (CLS), Largest Contentful Paint (LCP) |
| Memory & Performance | 4 | Browser memory leak detection, detached DOM nodes, garbage collection timing, idempotent UI actions |
| Accessibility | 3 | Accessibility tree, ARIA live regions internals, pointer events |
| Media & Communication | 2 | WebRTC, IndexedDB |

---

## Slicing Plan

### V1: Shell + JavaScript Runtime category (~4 concepts)
- App shell (sidebar, search, routing, layout, design system)
- Landing hero
- Event loop, microtasks, task starvation, priority inversion
- Proves the concept and visual language

### V2-V16: Remaining categories (1 category per slice)
- Each slice adds one complete category with explanations + visualizations
