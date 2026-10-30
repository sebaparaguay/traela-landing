# Product discovery and product pages

The chat and `/api/search` share `lib/search-service.ts`. Text searches use a ten-minute Next.js Data Cache keyed only by the normalized product query and provider mode. No conversation keys, chat history, user photos or quotations enter that cache. Photos, links and contact-like strings bypass it. Cached entries are discovery snapshots, never final price or stock confirmation.

With a server-only `SERPAPI_API_KEY`, text search calls SerpAPI Google Shopping directly (`google_shopping`, US market, English results), with a 12-second upstream timeout. Set the key separately for the intended Preview/Production environments in Vercel, then redeploy. Never prefix this variable with `NEXT_PUBLIC_`, commit it, or put it in a URL sent to the client. Without the key, the existing n8n workflow remains the provider with a 28-second timeout. Photo search always uses n8n. An explicitly configured `TRAELA_CHAT_WEBHOOK_URL` continues to own the custom conversational flow.

Ranking runs locally over up to 60 returned candidates. It checks model numbers, explicit gender/color conflicts, child products and accessories, deduplicates matching seller/title pairs, and prefers textual relevance over ratings. Used/refurbished listings lose priority unless requested. This is relevance ranking, not a quality endorsement or guaranteed specification match. Missing candidates cannot be repaired by reranking: an exact-model search can correctly return no compatible results. Retail and landed estimates are not treated as confirmed quotations.

Only actual quotation/order/exception requests request operator handoff. Successful discovery stays automated so customers can refine the search.

Each card opens `/product?id=...&q=...`. A bounded browser-session snapshot opens immediately without another provider call. Shared URLs restore the selection through `/api/product` and the same text cache. Image-only results need the original browser snapshot. A refreshed search that no longer contains the selected ID shows a recovery state rather than substituting a different product.

The PDP shows source images, title, listing ratings when available, matching reasons, any available provider description/highlights, source link and confirmation requirements. No specs, final prices or delivery dates are fabricated. Its purchase and question actions prefill the existing chat for the customer to submit.

## Verification

- `node scripts/test-product-search.cjs`: ranking regressions and cache boundary checks with a mocked Next cache/provider.
- `npm run build`: production compilation, TypeScript and route generation.
- `/api/search` includes a `Server-Timing` header for real deployment measurements.
- Baseline on 2026-10-30: n8n returned 5 candidates for each of three queries in 16.71, 16.87 and 24.51 seconds. The men's Pegasus 41 query contained no exact compatible model. No speed claim for direct SerpAPI should be made until a key is configured and live tests are run.

The current preview environment has no conversation database credentials. Its automated search/PDP path can be evaluated independently; production operator persistence is not proven by that preview.
