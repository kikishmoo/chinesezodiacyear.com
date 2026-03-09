# Contradiction Log

> **Purpose:** When conflicting instructions or rules are encountered, record them here instead of silently choosing one. This prevents the agent from drifting into inconsistent behaviour over time.
> **Rule:** Never silently resolve a contradiction. Log it, resolve it, and document the reasoning.
> **Last updated:** 2026-03-09

---

## Format

| Date | Instruction A | Instruction B | Resolution | Resolved by |
|------|---------------|---------------|------------|-------------|

---

## Log Entries

| Date | Instruction A | Instruction B | Resolution | Resolved by |
|------|---------------|---------------|------------|-------------|
| 2026-03-09 | "All encyclopaedia pages should have TC/SC translations" (content strategy) | "If Chinese-language pages get minimal traffic after 60 days, deprioritise further translation" (TODO.md Day 90 review) | These don't conflict — the first is the current goal, the second is a future review trigger. Continue translating per the current plan; evaluate traffic data at the 60-day mark (early May 2026) before deciding whether to continue. | Agent |
| 2026-03-09 | "The site does not accept 'Lunar New Year'" (editorial policy) | "Lunar New Year" appears in SEO keywords and meta descriptions | Not a contradiction — the editorial policy explicitly permits "Lunar New Year" in SEO keyword meta tags for search visibility. The restriction applies only to editorial voice (article body text, FAQ answers, page copy). SEO metadata targets what people search for, not what the site endorses. | Agent |
| 2026-03-08 | "Historical content prioritises pre-Qing Dynasty classical scholarship" (content strategy) | Some pages reference Qing and modern-era developments | Not a contradiction — "prioritises" means pre-Qing sources are preferred and cited first, but post-Qing developments are included where historically relevant (e.g., Republic-era calendar reform, CCTV Gala, digital red envelopes). The instruction establishes a hierarchy, not a prohibition. | Agent |

---

<!-- Add new entries above this line -->
