# Input Routing

Decides which of the four parameters apply, which request type is being made, and how much output
the situation justifies. Run this before the workflow, in seconds, not as a questionnaire.

---

## 1. The four parameters

| Parameter | Values | Decides |
|---|---|---|
| `target_language` | the language being studied | which language module is loaded; which phenomena are worth attention |
| `cefr_level` | A1–C2 | depth only (see `cefr-adaptation.md`) |
| `explanation_language` | Chinese / English | the language of commentary, headings, and metalanguage |
| `support_language` | none / a fallback language | narrow rescue glosses only — never a parallel translation |

The four are orthogonal. Changing one must not silently change another. In particular:

- Choosing a Chinese `explanation_language` does **not** raise the amount of translation.
- Raising `cefr_level` changes the module budget and the order of attention, never the availability
  of a module. No module is switched off by level; some are simply not expanded.
- Adding a `support_language` does **not** duplicate the explanation in a second language.

---

## 2. Inference table

Extract, do not ask. First match wins.

| Signal in the message | Inference |
|---|---|
| "我英语…" / "my English" / text is English / "English article" | `target_language = English` |
| "B2" / "B1" / "intermediate" / "advanced" / "C1 水平" | `cefr_level` accordingly |
| "用中文讲" / "中文解释" / "explain in Chinese" / message written in Chinese with no other cue | `explanation_language = Chinese` |
| "in English" / "全程英文" / "用英语解释" / message written in English | `explanation_language = English` |
| "德语" / "German" / "法语" / "French" / "Italian" / "Spanish" as the study object | `target_language` = that; see §5 |

`cefr_level` inference is **not** handled here: the priority order and the learner-writing signals
live in `cefr-adaptation.md` §6, because level is a depth decision. This table decides *which
language is being studied* and *which language explains it*.

**Default when the message is in Chinese and the text is English:** Chinese explanation, B2 depth.
**Default when the message is in English:** English explanation, B2 depth.
**Default when nothing is inferable:** English target, English explanation, B2 depth.

State the inference in one short line and proceed. Acceptable:

> 按 英语 / B2 / 中文讲解 处理。

Not acceptable: a parameter-confirmation block, a menu, or a question about CEFR before doing
anything. If the user later corrects the level, adjust in place — do not redo the whole output.

---

## 3. Request types

Classify the request, then load only the modules that type needs. Default is `full`.

| Type | Typical phrasing | Modules | Notes |
|---|---|---|---|
| `full` | "精读这篇文章", "close read this", "帮我学这篇文章" | all, selected by value | the only type that may use the full skeleton |
| `sentence-clinic` | "分析这三个长难句", "explain these sentences", pastes sentences only | sentence work (+ minimal local context) | Pass 1 does not apply — there is no text body. Say context is missing; never fabricate a map |
| `argument-only` | "我只想看论证逻辑", "how does the argument work" | global read (compressed) + architecture + stance | suppress vocabulary and sentence work entirely |
| `vocabulary-in-context` | "分析这篇里的词汇", "useful expressions here" | vocabulary + minimal architecture | still no glossary; still two buckets |
| `transfer-only` | "我只想要能用来写作的句型" | transfer + the sentence analysis needed to justify each pattern | do not deliver a vocabulary list |
| `quick-scan` | "我只有10分钟", "give me the gist", "快速过一下" | compressed global read + 2 focus sentences + 1 practice | see §4 |
| `passage-question` | "这一段为什么这么说", "what does ¶3 mean" | targeted answer | answer the question directly; do not upgrade it into a close read |

`passage-question` is the escape hatch that keeps the skill from hijacking ordinary Q&A. If the user
asks one specific question, answer it.

---

## 4. Time and effort budgets

| Stated budget | Deliver |
|---|---|
| "5 分钟" / "quickly" | 3–5 line map + 1 focus sentence + 1 transfer pattern. No practice unless asked. |
| "10 分钟" | compressed map + 2–3 focus sentences + 1–2 production items + 1 practice. |
| "20–30 分钟" | standard output at the level's lower length bound. |
| no budget stated | standard output per `cefr-adaptation.md`. |
| "我很闲，详细讲" | standard + one extra module of the user's apparent interest; still ≤6 focus sentences. |

When you compress, name what was dropped in one line — it teaches the user what else exists:

> 只做了论证链和两个支点句；词汇和练习略过。

Never fill a compressed budget with a longer version of the same module. Compress by **dropping
modules**, not by thinning all of them.

---

## 5. Non-English target languages (v0.1 behaviour)

v0.1 ships only `languages/english.md`. If the user asks for German, French, Italian, Spanish, or
any other language:

1. Say plainly that this version has a full English module only.
2. Still help — run the same workflow using general linguistic competence, being explicit that the
   language-specific calibration is provisional.
3. Do not invent a module's worth of confident claims about that language's grammar.
4. Do not refuse the task.

Do not pretend `languages/german.md` exists. Do not create it inline. The correct next step is a
new module against `languages/_TEMPLATE.md`.

---

## 6. Supporting language rules (reserved; inactive in v0.1)

v0.1 sets `support_language = none`. The contract is defined now so the multi-language version does
not have to break the architecture later.

When active, `support_language` is a **rescue channel**, not a second explanation. Use it only when:

- an abstract concept has no clean equivalent in the explanation language, or
- a distinction is routinely misconceived by speakers of that language, or
- a single word in the support language collapses three sentences of explanation, or
- the user explicitly asks for it.

Form: one short clause, in brackets, at the point of difficulty. Then return to the explanation
language.

> Hedging here is not politeness but epistemic caution — it marks the claim as one the author will
> not fully defend.（中文：这是"留退路"，不是"客气"。）

Never:

- Render every explanation a second time in the support language.
- Give a paragraph in the support language after a paragraph in the explanation language.
- Use the support language for the analysis itself, only for the rescue.

---

## 7. Overrides

Explicit user instructions win over everything here, including defaults, module choice, and the
skeletons in `assets/output-template.md`. See SKILL.md §Overrides for precedence.

Two parsing rules:

- **Negation is scoped to its module.** "不要讲语法" removes grammar commentary inside sentence work
  too, not only a hypothetical grammar section. Re-read the draft against the negation.
- **Quantity limits are literal.** "只分析这三个句子" means exactly those three. Do not add a fourth
  because it looked important; mention it in one clause at most, or not at all.

If an override and a core principle collide — e.g. "把这篇文章逐句翻译一遍" — the user wins, but say
in one line that this is translation rather than close reading, and offer the alternative. Do not
silently deliver a translation under a CloseRead heading.

---

## 8. Edge cases

| Situation | Handling |
|---|---|
| No text supplied at all | Ask for the text. This is the one legitimate blocking question. |
| Text is an image or PDF attachment | Read it, quote from it; if OCR is uncertain, flag the uncertain span rather than guessing. |
| Text is only a title or one line | Do not run the full workflow. Do sentence/expression work and say a longer passage is needed for architecture. |
| Text is the user's own writing | Route to feedback, not close reading. CloseRead analyses published/produced text, not drafts. |
| Two texts to compare | Out of scope for v0.1. Analyse the first, use the second only for contrast on one dimension. |
| Text contains a factual claim the user asks about | Separate language analysis from fact-checking, and say which one you are doing. |
| User asks for a translation "and also close read it" | Do the close read first (it depends on reading the original), then the translation as a clearly separate block. |
