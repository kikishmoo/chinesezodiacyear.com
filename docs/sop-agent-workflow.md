# SOP: Agent Workflow & Meta-Learning Protocol

> **Purpose:** Standard Operating Procedures for how AI agents work on this project. Based on the "9 Meta-Learning Tips" framework.
> **Last updated:** 2026-03-09
> **Applies to:** All AI agents (Claude, Cursor, Copilot, etc.) working on chinesezodiacyear.com

---

## 1. Session Start Protocol

Every agent session MUST begin with:

1. **Read `CLAUDE.md`** — Contains rules, regressions, key file paths, and temporary attention points.
2. **Read `TODO.md`** — Understand current priorities and what's been completed.
3. **Read `CHANGELOG.md`** (top 2 entries) — Understand the most recent changes.
4. **Check `docs/contradiction-log.md`** — Any unresolved conflicts to be aware of.

**Why:** An agent without context is a blank slate. Loading these files is not optional — it's the difference between a competent session and a session that repeats past mistakes.

---

## 2. The "Never Again" Protocol (Tip 1)

When an agent makes a clear mistake:

1. **Immediately** add it to `CLAUDE.md` Section 4 (Regressions).
2. Format: `| # | Date | What Happened | Rule |`
3. The rule must be **specific and actionable** — not "be more careful" but "always verify file paths with glob before editing."
4. This list is loaded every session. It turns one-time errors into permanent prevention.

**Example of a bad rule:** "Don't make mistakes with paths."
**Example of a good rule:** "The main JS file is `src/site.js`, not `src/js/site.js`. Always verify with glob."

---

## 3. Memory Tiering (Tip 2)

Not all information has the same shelf life. We use three tiers:

### Tier 1 — Canonical (Never Expire)
- Security rules, editorial identity, hard technical constraints
- Location: `CLAUDE.md` Section 2
- Example: "Never use 'Lunar New Year' in editorial voice"

### Tier 2 — Strategic (Review Quarterly)
- Current project direction, content calendar priorities, revenue model
- Location: `CLAUDE.md` Section 3
- Example: "Translation priority: Yi Jing, Tea Culture, Qi Men Dun Jia"

### Tier 3 — Temporary (Auto-Expire)
- Time-boxed focus items, bug workarounds, seasonal priorities
- Location: `CLAUDE.md` Section 5
- Example: "Facebook Pixel not yet installed — expires 2026-04-06"
- **30 days with no activity = auto-archive.** Move to a "Resolved" section in the log.

### Memory Confidence Tags

When recording information, tag it with confidence:

```
[Confidence: 0.9 | Source: direct instruction | Last used: 2026-03-09 | Hit count: 12]
```

- **Confidence 1.0** = Direct instruction from owner ("use British English")
- **Confidence 0.7** = Inferred from observation ("user seems to prefer X")
- **Confidence 0.5** = Unverified external information
- If new info conflicts with old info, don't silently overwrite — log the contradiction.

---

## 4. Prediction-First Decision Making (Tip 3)

Before making any significant decision, **write your prediction first.**

### Template:
```
Date: YYYY-MM-DD
Decision: [what you're about to do]
Prediction: [what you expect will happen]
Confidence: [low/medium/high]
Actual result: (fill in after)
Delta: (fill in after — what was different from prediction)
Adjustment: (fill in after — what to do differently next time)
```

### Why:
- Forces you to think before acting
- Creates a feedback loop — "I predicted X but Y happened"
- Over time, reveals systematic biases (e.g., always underestimating build times)
- Logged in `docs/prediction-log.md`

**The "Delta" column is the most important.** It's not "did I guess right" — it's "what systematic pattern am I missing?"

---

## 5. Contradiction Resolution (Tip 5)

Agents naturally tend to follow the most recent instruction, which creates silent inconsistencies.

### When you encounter conflicting instructions:

1. **Don't silently choose one.** Log it.
2. Add to `docs/contradiction-log.md`
3. Format: Date | Instruction A | Instruction B | Resolution | Resolved by
4. If you can't resolve it, **ask the owner** rather than guessing.

### Example:
```
| 2026-03-09 | "All pages should have TC/SC" | "Deprioritise translation if no traffic after 60 days" | These don't conflict — the first is a goal, the second is a review trigger. Continue translating; review at Day 60. | Agent |
```

---

## 6. Temporary Attention Points (Tip 6)

Some things need focus only during a specific period.

### Rules:
- Every attention point has a **set date**, **expiry date**, and **removal condition**.
- During the active period, the attention point filters all related decisions.
- After expiry, it's removed to avoid cluttering agent context.
- Stored in `CLAUDE.md` Section 5.

### Example:
```
Focus: Launch stability
Content: Don't enable new major features; focus on fixing stability issues
Set: 2026-02-18
Expiry: 2026-03-15
Remove when: Launch complete and no critical bugs for 1 week
```

---

## 7. Self-Labelling Outputs (Tip 7)

When the agent produces information, it should label the nature of the claim:

- **Established fact:** "The Taichu calendar reform was in 104 BCE" (sourced, verified)
- **My observation:** "The build takes ~7 seconds" (observed directly)
- **My inference:** "This selector probably targets the FAQ section" (reasoning from context)
- **My speculation:** "Users might prefer a darker background" (no evidence)
- **Intentional editorial choice:** "We reject the term 'Lunar New Year'" (owner's decision, not fact)

This prevents the agent from presenting guesses as certainties, and helps the owner distinguish between different confidence levels.

---

## 8. Creative vs. Operational Modes (Tip 8)

Different types of work require different agent behaviour.

### Operational Mode (default)
- Follow established patterns exactly
- Don't innovate on structure
- Match existing code style
- Ask before changing architecture
- Used for: bug fixes, translations, routine content, documentation

### Creative Mode
- May propose new approaches
- Encourage a slightly contrarian perspective — "what if the opposite were true?"
- Used for: new features, content strategy, marketing copy, UX improvements
- **Must be explicitly activated** by the owner or by the nature of the task

### How to tell:
- "Fix the newsletter popup" → Operational
- "Design a new engagement feature" → Creative
- "Write an article about dragon boat festival" → Creative content, Operational formatting
- "Translate the TCM page to TC/SC" → Operational

---

## 9. Structured Iteration (Tip 9)

When refining output, follow a structured process — don't just "keep polishing."

### The Three-Round Rule:
1. **Generate** → Produce the output
2. **Evaluate against standards** → Check against CLAUDE.md rules, content strategy, SEO requirements
3. **Fix only what failed evaluation** → Don't change things that passed

### Exit Criteria:
- Three rounds of evaluation with less than 5% improvement = stop
- If something is "good enough but not perfect," ship it
- Perfectionism without exit criteria wastes resources

---

## 10. End-of-Session Protocol

Before ending any work session:

1. **Update CHANGELOG.md** with all changes made
2. **Update TODO.md** if items were completed or new items discovered
3. **Update CLAUDE.md** if new regressions, rule changes, or attention points arose
4. **Fill in prediction log** actuals if any predictions were made this session
5. **Verify build passes** (`npx @11ty/eleventy`) before final commit
6. **Push to remote** only when explicitly asked

---

## 11. Nightly Review Automation (Tip 4)

> This is a conceptual process to run periodically (weekly or at each session start).

### Review checklist:
- [ ] Are there expired Temporary Attention Points in CLAUDE.md? → Archive them
- [ ] Are there prediction log entries missing "Actual result"? → Fill them in
- [ ] Are there unresolved contradictions in the contradiction log? → Escalate to owner
- [ ] Has TODO.md been updated to reflect completed work? → Update if stale
- [ ] Has contentCalendar.json been checked for upcoming deadlines? → Flag items due within 2 weeks
