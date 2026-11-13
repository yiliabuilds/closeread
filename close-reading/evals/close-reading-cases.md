# CloseRead Eval Cases

17 behavioural cases, 4 negative-trigger cases, one scoring rubric. Run against a fresh session with
the skill installed, no conversation history.

Mark each case `PASS` / `PARTIAL` / `FAIL` and record the single most diagnostic line of the output.

---

## Fixtures

Use these short texts where a case needs one, so runs are comparable.

**Fixture A — B1–B2 article paragraph (5 sentences, 78 words)**

> City trees are often described as decoration. That framing is expensive. A mature plane tree can
> lower the air temperature within twenty metres by as much as three degrees, and it does so at no
> running cost. Yet most municipal budgets treat planting as a one-off expense rather than as
> infrastructure, which is why the trees that cool a street for fifty years are the first line item
> cut when money is tight.

**Fixture B — very short text (2 sentences)**

> Rain fell all morning. By noon the streets had emptied, and the market that usually filled the
> square stood silent under its tarpaulins.

**Fixture C — C1 op-ed (6 sentences, 104 words)**

> The case for banning cars from city centres is usually made in the language of air quality. That
> is a mistake. Air quality is measurable, and measurable claims invite measurable rebuttals;
> opponents need only produce a model showing that the pollution simply moves to the ring road. The
> stronger argument is quieter and harder to contest: a street without cars is a street where people
> stop, and a street where people stop is a street where money is spent. Admittedly, that argument
> flatters the shopkeeper and says nothing about the child with asthma.

**Fixture D — long text** — any 2500-word magazine feature, supplied as an attachment.

**Fixture E — article with metadata and a subheading (for numbering)**

> **The Quiet Cost of Cheap Flights**
> *By Marta Reiner · 14 March 2026*
>
> For thirty years, the price of a short-haul ticket has fallen almost every year. The fall is
> usually credited to competition. It is better understood as an accounting choice: the costs that
> disappeared from the ticket did not disappear from the world.
>
> Airports expanded to accommodate the traffic, and the land they took was rarely priced. Local
> governments absorbed the difference and called it investment.
>
> **Who pays**
>
> The arithmetic is not hidden. It is simply spread across budgets that no passenger ever reads.

Body paragraphs: three. Title, byline, and the subheading "Who pays" are not paragraphs.

---

## The 17 cases

### 1. Ordinary close read

**Input:** `帮我精读一下这篇。` + Fixture A
**Expected:**
- Global read before any sentence analysis; paragraph role given as a verb phrase.
- 3–4 focus sentences (B2 default), not all five.
- One line stating the selection principle.
- No paragraph translation anywhere.
**Failure signals:** opens with 逐句分析; analyses all five; a section per paragraph of summary;
sentence analysis is a translation plus grammar labels.

---

### 2. A2 user

**Input:** `我英语 A2，帮我看看这段。` + Fixture A
**Expected:**
- 2 focus sentences maximum, chosen for comprehension-critical + error-prone.
- Barely any metalanguage; backbone stated in plain words.
- Recognition vocabulary 4–5 items; production 2–3.
- Stance collapses to at most one word of tone; no hedging, modality, or rhetoric analysis.
- Output roughly 300–500 characters.
**Failure signals:** participle/nominalisation terminology; six vocabulary items with synonyms;
analysis of "framing is expensive" as rhetoric; output longer than a B2 output.

---

### 3. B2 user

**Input:** `我 B2，想认真读一下。` + Fixture A
**Expected:**
- 4–5 focus sentences.
- Concession machinery noticed (`Yet`), whole-clause `which is why` explained.
- Production items ≥3, all collocation-based.
- One discourse-level transfer frame.
**Failure signals:** explains the passive or relative clauses as if new; vocabulary list of 12 items;
no stance treatment at all.

---

### 4. C1 user

**Input:** `C1，重点讲作者的立场和用词分寸。` + Fixture C
**Expected:**
- Vocabulary ≤6 items, precision-focused (why *framing*, why *quieter*).
- Stance analysis uses trigger → reading → label for at least three items (`That is a mistake`,
  semicolon, `Admittedly`, `flatters`).
- Architecture: identifies the hinge at sentence 2 and the concession at the end as a deliberate
  weakening.
- Practice is high-level (rewrite in a different register / reconstruct the suppressed counter).
**Failure signals:** explains basic grammar; treats `Admittedly` as agreement; claims irony without
two signals; 10-item word list.

---

### 5. Chinese explanation

**Input:** `用中文讲这篇。` + Fixture A
**Expected:**
- Headings in Chinese; source quotes in English and unaltered.
- Commentary explains function in Chinese; **no rendering of each sentence into Chinese**.
- English pattern frames kept in English (`While it is true that…`).
**Failure signals:** any blockquote followed by a fluent Chinese translation; the whole output
becomes a Chinese paraphrase with English quotes pasted in.

---

### 6. English explanation

**Input:** `Explain this in English.` + Fixture A
**Expected:**
- Entire output in English, including headings and metalanguage.
- No Chinese characters anywhere, even in vocabulary glosses.
**Failure signals:** stray Chinese in a gloss, a heading, or an aside; bilingual headings.

---

### 7. Ten minutes only

**Input:** `我只有 10 分钟，帮我过一下这篇。` + Fixture A
**Expected:**
- Compressed: map in 3–5 lines, 2–3 focus sentences, 1–2 production items, 1 practice.
- One line naming what was dropped.
- Modules dropped, not thinned — e.g. no vocabulary section at all rather than a two-word one.
**Failure signals:** full eight-module output; or a thin version of every module; no statement of
what was skipped.

---

### 8. Three difficult sentences only

**Input:** `只分析这三句。` + three sentences from Fixture C, no surrounding text
**Expected:**
- Exactly three, in order.
- No global read; no architecture section; no vocabulary section; no practice.
- One line noting that context is missing and would sharpen the analysis.
**Failure signals:** a fourth sentence added "for completeness"; a fabricated global read; ends with
a practice task the user did not ask for.

---

### 9. Argument chain only

**Input:** `我只想看这篇文章的论证是怎么走的。` + Fixture C
**Expected:**
- Arrow chain drawn from the text's own moves (e.g. 常见论证 → 指出其可被反驳 → 提出更强的替代 →
  自我削弱).
- Hinge quoted.
- Concession analysed as strategy.
- No vocabulary section, no sentence grammar, minimal practice or none.
**Failure signals:** falls back to Introduction–Body–Conclusion; still delivers vocabulary; treats
the piece as a summary task.

---

### 10. No translation

**Input:** `不要翻译，只要分析和讲解。` + Fixture A
**Expected:**
- Zero sentence-level renderings. Meaning conveyed through function commentary.
- If meaning must be clarified, it is paraphrased as *function*, not as a translation.
**Failure signals:** even one "这句话的意思是……" followed by a fluent Chinese sentence; a "参考译文"
appendix.

---

### 11. Transfer only

**Input:** `我只想知道有什么能用到我自己写作里的。` + Fixture A
**Expected:**
- 2–4 frames, each with: function, use condition, when **not** to use, slot formula, model sentence.
- Prefers discourse-level frames (`That framing is expensive` as a one-line rebuttal move).
- No vocabulary list, no practice.
**Failure signals:** a list of "useful expressions" with meanings only; no negative condition; more
than five frames; frames that are just idioms.

---

### 12. Anti word-dump

**Input:** `把这篇里的重点词汇都给我整理出来。` + Fixture D (long text)
**Expected:**
- Refuses the framing politely in one line ("重点是选，不是全") and delivers ≤8 items in two
  buckets, production ≤5.
- Every entry is collocation-bearing or context-shifted; no word is included merely for being rare.
- No alphabetisation, no synonym chains.
**Failure signals:** 20+ items; alphabetical ordering; synonym lists; entries with dictionary
definitions instead of contextual meanings; words the learner obviously knows at the stated level.

---

### 13. Very short text

**Input:** `精读一下。` + Fixture B
**Expected:**
- Recognises the text is too short for architecture; says so in one line.
- Focus on 1–2 sentences; global read compressed to 1–2 lines.
- Legitimate observations available: tense shift (`fell` → `had emptied`), the delayed subject of the
  second sentence, `under its tarpaulins` as a closing image.
**Failure signals:** invents a three-paragraph structure; manufactures an argument where there is
none; produces a full eight-module output for two sentences.

---

### 14. Very long text

**Input:** `精读这篇。` + Fixture D (2500 words)
**Expected:**
- States explicitly that the whole text was not covered sentence by sentence.
- Reads opening, hinge, close; offers to continue section by section.
- Focus sentences still ≤6.
- Architecture gets proportionally more space.
**Failure signals:** claims full coverage; 12 focus sentences; a section for every subheading; no
acknowledgement of the skim.

---

### 15. Bare "精读一下"

**Input:** `精读一下` + Fixture A, nothing else
**Expected:**
- Infers English / B2 / Chinese (message is Chinese, text is English), states it in one short line.
- Proceeds immediately. No parameter question, no menu, no "为了更好帮你，请告诉我你的水平".
**Failure signals:** asks for CEFR before doing anything; asks three questions; produces English
output despite a Chinese request.

---

### 16. B1 full close read — density and non-repetition

The calibration case. Written after the first B1/C1 comparison, where the finding was not "B2
content leaked in" but "six modules expanded, none of them dominant".

**Input:** `我 B1，帮我完整精读这篇。` + Fixture A
**Expected:**
- Three expanded modules beyond the map, the focus sentences, and practice — typically vocabulary,
  one short paragraph-level section, transfer.
- 3–4 focus sentences. The `Yet` turn and the `which is why` reference are explained **there**; the
  later sections reference them in half a line rather than re-explaining.
- Stance appears as one or two sentences inside an existing section, not as a fifth section with its
  own heading. `Yet` as a concession frame is legitimate B1 material here — it is the text's turn.
- At most one discourse-level frame in transfer, with a use condition and a "when not to use".
- Total around 500–700 characters.
**Failure signals:** five or six expanded sections of roughly equal weight; a `## 语气与立场` section
with equal standing — even when its content is correct; the same insight appearing in both a focus
sentence and the architecture section; every module shortened instead of three chosen; or the
opposite failure, the concession suppressed because "concession is B2".

---

### 17. Paragraph numbering across modules

**Input:** `帮我精读这篇，说明每段在做什么。` + Fixture E
**Expected:**
- Title and byline are not numbered; `¶1` is the "For thirty years…" paragraph.
- The subheading "Who pays" takes no number; the paragraph after it is `¶3`, never `¶4`.
- The same three numbers are reused everywhere they appear — paragraph roles, focus-sentence
  locators, the architecture chain. No module re-counts.
- Omitting `¶n` altogether is allowed when it adds nothing. What is not allowed is a second,
  different count.

**Failure signals:** title taken as `¶1` so everything shifts by one; the subheading consuming a
number; a focus sentence citing `¶2` while the architecture section calls the same paragraph `¶3`;
numbering restarting inside the vocabulary or transfer section.

**Part B — unreliable boundaries.** Paste the same text as one unbroken block, no blank lines.
**Expected:** no `¶n` anywhere; refers to 开头 / 中段 / 结尾 or quotes a fragment, and says in one
line why numbering is not used.
**Failure signals:** confident `¶1 ¶2 ¶3` on a single block; guessing where the paragraphs break.

---

## Negative triggers (must NOT run the workflow)

| Input | Expected |
|---|---|
| `"ubiquitous" 是什么意思？` | A dictionary-style answer with one contextual example. No workflow, no modules. |
| `帮我把这段翻译成中文。` | A translation. Optionally one line offering close reading. No analysis sections. |
| `帮我改一下我这篇英文作文。` | Writing feedback, not close reading. Point out that CloseRead analyses produced text, not drafts. |
| `虚拟语气怎么用？` | A grammar explanation. No text analysis, no practice suite. |

Failure for all four: any output containing 全文脉络 / 精读句 / 可复用框架 sections.

---

## Scoring rubric

Score each dimension 0–2. Total 14.

| # | Dimension | 0 | 1 | 2 |
|---|---|---|---|---|
| 1 | Global before sentence | Jumps into sentences | A map exists but is a summary | Roles + spine + hinge, compact |
| 2 | Selection discipline | Covers everything, or count off-target | Right count, no rationale | Right count + selection principle stated |
| 3 | Function over label | Labels only | Mix of label and function | Every element explained by what it does |
| 4 | No covert translation | Per-sentence rendering | Occasional rendering | Zero renderings; meaning via function |
| 5 | Calibration | Wrong level or wrong language throughout | Partly calibrated | Depth and language match the inferred parameters |
| 6 | Override obedience | Ignores an explicit instruction | Obeys but leaks the suppressed module | Obeys literally, including negation scope and quantity |
| 7 | Transfer quality | Absent, or bare word list | Frames without conditions | Frames with use condition, negative condition, slots, model |

**Pass:** ≥11/14 **and** no 0 on dimensions 2 or 6.
**Hard fail regardless of score:** any per-paragraph translation presented as analysis; more than 6
focus sentences on a standard article; a fabricated global read for a single supplied sentence;
inventing content not in the text.

---

## Regression checklist (run after any edit to the skill)

- [ ] Editing `core-method.md` did not change any depth number — those live only in
      `cefr-adaptation.md`.
- [ ] Editing `cefr-adaptation.md` did not introduce language-specific phenomena — those live only
      in `languages/*.md`.
- [ ] `SKILL.md` still contains no analysis protocol detail beyond pointers.
- [ ] The description still excludes single-word lookup, translation, proofreading, and quizzes.
- [ ] No file states the same rule twice; cross-references are used instead.
- [ ] `assets/output-template.md` skeletons still match the request types in
      `references/input-routing.md` §3.
- [ ] Cases 7, 8, 10, 15 still pass — they are the ones that break when instructions are added.
- [ ] Case 16 still passes — B1 section count is within budget and no insight is restated across
      sections. This is the case that decays silently, because a denser output still looks correct.
- [ ] Case 17 still passes — the paragraph map is built once in Pass 1 and no module re-counts it.
- [ ] No rule anywhere forbids a higher-band insight outright. Bands govern priority and weight; the
      only legitimate prohibitions are on restating and on displacing basics.
