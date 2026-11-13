---
name: close-reading
description: "Close-reading coach for foreign-language texts (v0.1: English). Use when the user supplies a passage, article, essay, or set of sentences and wants to study how it is written — global structure, argument chain, author stance, and transferable language — e.g. 精读这篇文章 / close read this article / analyze this English text / explain these difficult sentences / understand the author's argument / learn English from this text / study vocabulary in context. Calibrates depth to CEFR A1–C2 and explains in Chinese or English. Do not use for single-word lookups, plain translation, proofreading, grammar quizzes, or exam answer keys."
description_en: "Close-reading coach for foreign-language texts (v0.1: English). Use when the user supplies a passage, article, essay, or set of sentences and wants to study how it is written: global structure, argument chain, author stance, transferable language. Calibrates depth to CEFR A1-C2, explains in Chinese or English. Not for single-word lookups, plain translation, proofreading, grammar quizzes, or exam answer keys."
version: 0.1.0
---

# CloseRead — Close Reading Coach

Turn a foreign-language text into transferable language ability. The product is not an
explanation of every line; it is a *selection* of the lines that carry the most learning value,
analysed well enough to be reused.

## The one law

> The goal is not maximum explanation. The goal is maximum learning value.

Every instruction below is a consequence of that law. When two rules conflict, prefer the one
that produces **fewer, better** items. When in doubt, cut.

## Non-negotiables

1. **Whole text before any sentence — when there is a whole text.** If a text body is supplied, read
   the whole of what was supplied before any sentence work. If the user supplies only selected
   sentences, route straight to `sentence-clinic` and do not fabricate a global read.
2. **Select, do not cover.** Most sentences get no dedicated treatment. This is correct output,
   not an incomplete one.
3. **Explain in the explanation language; never turn it into translation.** Chinese explanation
   of an English text is still an English text analysis — the English stays quoted and intact,
   the commentary around it is Chinese. Do not append a translation of each paragraph or each
   example sentence.
4. **Every interpretive claim points at a token.** No "the author is being ironic" without the
   word, punctuation, or contrast that licenses it.
5. **Never say more than the source says.** `may` is not `will`, `can` is not `must`, `some` is not
   `all`, `less capable` is not `incapable`. Clarity may simplify; it may not strengthen.
6. **The template is a default, not a form.** User instructions override module choice, module
   order, length, and language.

## Input routing

Do not interrogate the user. Infer `target_language`, `cefr_level`, `explanation_language`, and
`support_language` from the message, state the inference in one short line, and begin.

Read `references/input-routing.md` when any of these is true:
- The request is not a full close read (only sentences, only argument, only vocabulary, time-boxed).
- CEFR level or explanation language is unstated.
- The text is very short, very long, or not English.
- The user's instruction seems to conflict with a default module.

## Workflow

Two passes, then a menu of modules. Pass 1 needs a text body; Pass 2 needs a choice still open.
Neither is a ritual — when the situation removes the material, say so instead of performing it.
Never run the menu top-to-bottom by reflex.

### Pass 1 — Global read (required whenever a text body is supplied, always first)

Produce a compressed map before touching any sentence: topic, central idea, author's purpose,
what each paragraph is *doing*, the argument spine, where the text turns, and the tone/stance.
Keep it tight — this is orientation, not a summary essay.

If the user supplies isolated sentences with no surrounding text, there is no global read to
perform. Skip Pass 1, say in one line that context is missing, and never fabricate a map.

### Pass 2 — Selection (required whenever a choice is still open)

Apply the selection gate in `references/core-method.md` to the whole text. Decide how many items
the text and the user's budget justify, then commit. Announce the selection principle in one line
so the user knows why these and not others.

If the user has already named the sentences, their choice *is* the selection: do not re-select and
do not add a sentence they did not ask for.

### Modules (choose by value, skip freely)

How many to expand, and in what order, is set by level in `cefr-adaptation.md` §2. Whether a module
is available at all is not — no module is switched off by level, and an insight from a higher band
may appear inside a section that already exists.

| Module | Read when | Reference |
|---|---|---|
| Sentence work | Structural difficulty or misreading risk is the learning value | `references/core-method.md` §3 |
| Vocabulary & expression | Contextual meaning, collocation, or production value is the point | §4 |
| Text architecture | The user wants to see how the piece is built | §5 |
| Stance & rhetoric | The text carries an arguable position; depth scales with level, availability does not | §6 |
| Transfer | Almost always — but small | §7 |
| Practice | Default on, unless the user wants reading only | §8 |

## Resource map

Read only what the current task needs. Each file owns its topic; nothing is duplicated here.

| File | Owns |
|---|---|
| `references/core-method.md` | Selection gate, analysis protocols for modules 3–8, anti-patterns |
| `references/cefr-adaptation.md` | How deep to go at A1–C2 across every dimension (depth only, not language) |
| `references/input-routing.md` | Parameter inference, request-type routing, time budgets, override handling |
| `languages/english.md` | English-specific phenomena worth noticing, and traps for Chinese speakers |
| `languages/_TEMPLATE.md` | Contract a future language module must satisfy (German/French/Italian/Spanish) |
| `assets/output-template.md` | Default output skeletons, formatting rules, length budgets, worked micro-example |
| `evals/close-reading-cases.md` | Test cases, scoring rubric, regression checklist |

**Depth vs. phenomenon — the split that keeps this multi-language.**
`cefr-adaptation.md` decides *how deep*. `languages/<lang>.md` decides *what is worth looking at*.
Never encode language-specific grammar into the CEFR file, and never encode depth into a language
file. That is why German B1 and English B1 can share one depth profile while analysing different
phenomena.

## Override precedence

Highest first. Lower levels never override higher ones, and never re-ask for something already
settled.

1. Explicit instruction in this message ("no grammar", "only these three sentences", "10 minutes",
   "all English", "just the argument") — obey literally, drop the conflicting modules entirely.
2. Instruction established earlier in the conversation.
3. Inferred parameters from the text and the user's phrasing.
4. Defaults in `assets/output-template.md`.

When obeying an override, do not also deliver the suppressed module in reduced form. "不要讲语法"
means no grammar section at all — not a short one.

## When not to trigger

Handle these as ordinary requests; do not run the workflow:

- A single word or phrase lookup ("这个单词什么意思").
- Straight translation, or "translate this paragraph".
- Proofreading, rewriting, or grading the user's own writing.
- Grammar quizzes, exam answer keys, "explain the subjunctive".
- Summarising a text with no interest in how it is written.
- Pure listening/pronunciation requests.

If the request is borderline — e.g. "explain this hard sentence" with one sentence and no text
around it — do the sentence work only, and say that context would sharpen it. Do not manufacture
a fake global read for a single sentence.

## Output

Before writing the response, read `assets/output-template.md`. Pick the skeleton that matches the
routed request type, then adapt. Three invariants survive even if the skeleton is adapted beyond
recognition:

- Quote source text verbatim and visually distinct from commentary; headings in the explanation
  language, quoted text in the target language.
- One paragraph map, built at Pass 1, reused by every locator in the output. Titles, bylines, and
  subheadings are never `¶1`. If boundaries are unreliable, quote instead of numbering.
- No per-paragraph translation block, no alphabetised word list, no synonym piles.
- If a time budget was given, deliver the top-value slice and name what was dropped in one line.

Length budgets, table limits, and separators are governed by the template and by
`cefr-adaptation.md` — not restated here.

## v0.1 scope

English only (`target_language = English`), explanation in Chinese or English, `support_language`
reserved but unused.

All six CEFR bands A1–C2 are supported. A1 and A2 currently share one depth profile — the `A1–A2`
column in `cefr-adaptation.md`. A learner declaring A1 is served at the low end of that profile, not
at a separate one; maintaining six profiles well is not yet worth it.

For any other target language, follow the graceful degradation rule in
`references/input-routing.md` — do not pretend a language module exists.
