# CloseRead Core Method

The procedure behind every module. Depth is governed by `cefr-adaptation.md`; this file governs
*what to do*, never *how much*.

---

## 0. The spine

```
Read whole  →  Select  →  Analyse few  →  Name the pattern  →  Make them use it
```

Two failure modes this file exists to prevent:

- **Coverage mode** — treating every sentence as equally deserving. Produces a translation
  with headings, not a close read.
- **Labelling mode** — naming structures instead of explaining what they do. Produces
  "this is a non-restrictive relative clause" where the user needed "this clause adds a
  side remark that undercuts the claim just made".

---

## 1. Pass 1 — Global read protocol

Before any sentence work on a supplied text, establish these. Write them compactly, in the
explanation language.

For isolated sentences handed over with no text body, there is no global read to produce — see the
`sentence-clinic` route in `input-routing.md` §3. Say the context is missing; never invent one.

| Question | What a usable answer looks like |
|---|---|
| Topic | One noun phrase. Not a sentence. |
| Central idea | One sentence the author would accept as their claim. |
| Author's purpose | Inform / argue / persuade / entertain / explain / review / warn — pick one, justify in half a line. |
| Paragraph roles | Per paragraph, a verb phrase: *sets up the problem*, *concedes*, *supplies evidence*, *narrows the scope*, *turns to the counter-case*. |
| Argument spine | An arrow chain using the text's own moves, not a stock model. |
| Turns and transitions | Where the text pivots, and the marker that carries the pivot. |
| Tone / stance | Confident / hedged / sceptical / sympathetic / detached — plus the token that shows it. |

Rules:

- Never write paragraph-by-paragraph summaries as the global read. Roles, not content.
- If the text has no argument (a description, a narrative scene, a poem), say so and switch the
  spine to *sequence / scene / image / voice*. Do not force claim-evidence onto a lyric essay.
- Mark uncertainty honestly: "the last paragraph reads as a concession, though the closing
  sentence pulls back" is better than a false certainty.
- Budget: this pass should be the shortest section of the output at B1 and above.

### Paragraph map and numbering

Build the paragraph map here, once, and keep it for the whole output. Every later reference — focus
sentences, hits in the architecture section, paragraph roles, the argument chain — reuses that map.
Nothing recomputes it.

**Numbering rules.**

- `¶1, ¶2, ¶3…` number **body paragraphs only**.
- Titles, subtitles, standfirsts/deks, bylines, dates, captions, and section labels are metadata.
  They are never numbered and never consume a number. A title is not `¶1`.
- A subheading inside the body does not interrupt the sequence. The paragraph after it continues from
  the previous number.
- A contiguous block that functions as one paragraph — a bulleted list, a blockquote, a table, a set
  of short lines — takes **one** number as a block. Its items are not numbered individually.
- If the supplied text starts mid-article, numbering starts at the first supplied paragraph. Say so
  in one line: 「编号从你粘贴的第一段开始」.

**Display is optional; consistency is not.** Do not print `¶n` at all when it would not help. But
once a number appears anywhere in an output, every other reference in that output must come from the
same map. Two different `¶3`s in one response is worse than no numbering.

**When boundaries are unreliable, do not invent numbers.** Use this fallback when the text arrives
as one solid block, when line breaks are ambiguous (PDF extraction, OCR, chat paste), when
paragraphs are separated by markup rather than blank space, or when the text is short enough that
numbering adds nothing. Then refer by **opening / middle / closing**, by a short quoted fragment, or
by the sentence itself.

An unstable `¶3` is worse than no `¶3`: it sends the reader to the wrong place and makes the whole
analysis look arbitrary. The fallback is not a degraded mode — it is the correct choice.

---

## 2. Pass 2 — Selection gate

This is the part that makes CloseRead CloseRead. Apply it ruthlessly.

### The five-question gate

For each candidate sentence, score. A sentence needs **at least two yes** to earn a dedicated
analysis.

1. **Comprehension-critical** — misreading it damages understanding of the paragraph's role, not
   just one detail.
2. **Argument-critical** — it carries a claim, a warrant, a concession, or a scope limit. (Not an
   example, not an illustration.)
3. **Representative** — its structure recurs in this text or in this genre. Learning it pays off
   again immediately.
4. **Transferable** — it contains a pattern the learner could reuse in their own writing within
   the week.
5. **Error-prone** — a learner at this CEFR level, especially with this L1, is likely to parse it
   wrong.

### Automatic disqualifiers

Reject a candidate if any of these is the *only* reason it stood out:

- It is long. Length is not difficulty. A 45-word sentence with one main clause and three
  parallel prepositional phrases is easy.
- It contains a rare word. Rarity is a vocabulary question, not a close-reading question.
- It is decorative — imagery, rhythm, a rhetorical flourish with no structural job.
- It is a list or catalogue; the list's *existence* matters, not its items.
- The next sentence restates it. Let the author do the explaining.

### Volume

Set by CEFR and by request type (see `cefr-adaptation.md`, `input-routing.md`). Absolute ceiling
for a standard article: **six** analysed sentences. If you have eight candidates, the analysis is
not selective enough — merge or drop.

### Announce the principle, not the list

One line, e.g.:

> 全文 21 句，我只精读 4 句：论证的支点、一处让步、一处易误读的否定范围，以及一个可复用的
> 让步句式。

This teaches the selection criterion itself, which is half the skill.

---

## 3. Sentence work protocol

Order matters. Do not reorder into "grammar first".

1. **Quote** — verbatim, with a locator taken from the Pass 1 paragraph map (`¶3`), or a quoted
   fragment when numbering is unreliable. Never re-derive the number here.
2. **Meaning in context** — what it does *here*. One or two sentences. No translation.
3. **Backbone** — state subject, core predicate, and core object/complement in plain prose.
   Optional but useful: a bracketed skeleton showing what is core and what is attached.
4. **What hangs off the backbone, and what job each piece does** — not "relative clause" but
   *narrows the claim to X*, *supplies the cause*, *concedes before the reversal*, *defines the
   term the argument will lean on*, *limits the scope to one region*.
5. **The logic between the pieces** — how the parts relate: cause, contrast, condition, purpose,
   restatement, progressive narrowing. This is where misunderstanding usually lives.
6. **Left-to-right parse** (only if genuinely non-obvious) — how an experienced reader holds the
   sentence while waiting for the main verb, and what signal tells them to wait.
7. **Function in the paragraph or argument** — the sentence's job in the machine of the text.
8. **Reusable pattern** — only if it passes the transfer test (§7). Skip silently otherwise.

### The three shortening rules

- If the sentence is hard **only because of vocabulary**, do not analyse its structure. Move the
  word to §4. Say so in one line.
- If the sentence is hard **only because it is long**, give the backbone and stop.
- If a sentence's difficulty **repeats** an earlier analysis, reference the earlier one instead of
  re-explaining: "同上，仍是分词后置修饰" — do not re-teach.

### Calibrating the metalanguage

Use the minimum terminology that is unambiguous at the level. Prefer function words over category
names:

- Prefer: "这一句真正的主干只有…，后面全是补充"
- Over: "这是一个含三个后置修饰语的复合句"

Category names are allowed as *labels* once the function has been explained — never as the
explanation itself.

### Connectives are rarely one thing

Do not manufacture a false binary to make a teaching point. A single connective can carry temporal,
conditional, concessive, and contrastive force at once. The honest analysis says **which force
dominates in this sentence**, not that the others are absent.

- `Once X becomes normal, Y…` — a temporal starting point with a conditional edge: only after X
  becomes normal does Y become possible. "It is not a time clause, it is a condition" is wrong, and
  so is the reverse.
- `while` — time, contrast, or concession.
- `since` — time or reason.
- `as` — time, reason, manner, or comparison.

Context decides. State the dominant reading, name the secondary colour in half a clause if it
matters, and stop there.

### Describe the instance before the category

Explain what the structure is doing *here* first. Only then, if it earns its place, say what it can
generally do — and mark the difference between the two.

A rhetorical effect observed in one passage is not the meaning of the construction. `That view is no
more convincing than the belief that…` may be demolishing both positions in this article; that does
not license "`no more X than Y` means both sides are wrong". The general claim is always weaker than
the local one, and must be phrased as a possibility.

---

## 4. Vocabulary and expression protocol

Governing principle: **utility > rarity**.

### The utility test

Ask: *would a competent writer at this level plausibly use this in the next thirty days?* If no,
it is a recognition item at most, and probably should be cut entirely.

### The three filters before including a word

1. **Context-shifted or context-loaded?** The word's meaning here differs from its most common
   meaning, or the context fixes one reading among several. → include.
2. **Collocation-bearing?** It comes with a partner the learner would not guess (*pose a threat*,
   *draw a distinction*, *raise a concern*). → include, and lead with the collocation, not the word.
3. **Argument-bearing?** It is stance or discourse machinery (*arguably*, *granted*, *insofar as*,
   *by contrast*). → include, because it is high-frequency and invisible to learners.

If none of the three applies, the word is probably already known or not worth the space. Cut it.

### Two buckets, never merged

- **Recognition** — the learner should understand it on sight. Give a short in-context gloss.
  No production drill. Cap by CEFR (see `cefr-adaptation.md`).
- **Production** — the learner should be able to write or say it. These are few, and each gets
  a use condition, not a definition.

Never pad either bucket. A four-item production list that the user actually internalises beats a
twenty-item table they scroll past.

### Hard bans

- No alphabetised glossary.
- No synonym chains ("important, significant, crucial, vital, pivotal"). At most one near-synonym,
  and only when the difference matters.
- No dictionary-definition style entries. Always *meaning as used here*.
- No explaining basic words unless the context has shifted their meaning.
- No etymology unless it explains the current meaning in one clause.

---

## 5. Text architecture protocol

Name how this text is built — using this text's moves, not a catalogue.

### Procedure

1. **Draw the spine as an arrow chain.** Concrete labels from the text:
   `现象 → 常见解释 → 该解释的漏洞 → 替代解释 → 限定条件`
   Not: `Introduction → Body → Conclusion`.
2. **Identify the hinge.** The one or two sentences where the text turns. Quote them. Most texts
   have exactly one hinge; a good close read finds it.
3. **Two or three move-level observations.** How the author sequences, delays, withholds, repeats,
   or front-loads. Examples: opening with a counter-intuitive fact to buy attention; placing the
   concession *before* the main claim so the claim reads as earned; saving the definition until
   after the reader has already been using the term.
4. **Say what the shape buys.** Every architecture choice has a rhetorical payoff. Name it.

### Guardrails

- Do not force a stock model. A listicle stays a listicle; a review stays a review; a narrative
  paragraph may be organised by *time* or by *perception*, not by argument.
- If the text is genuinely loosely organised, say so. "这一段其实是三条并列的观察，没有递进" is a
  legitimate and useful finding.
- Architecture is not a summary. If your section could be replaced by "first he says X, then he
  says Y", it is a summary — delete it and find the moves.

---

## 6. Stance and rhetoric protocol

Whenever the text takes a position. Below B2 this collapses into plain tone comments rather than
switching off — see the stance rows in `cefr-adaptation.md`. Availability does not change with
level; only depth does.

### The evidence rule

Format every stance claim as **trigger → reading → label**:

> `admittedly` (¶2) 先把对方的理由摆出来，随后 `but` 才落回自己的立场 → 这是**让步式立论**，
> 不是真的认同。

No label without a trigger. If you cannot quote the trigger, do not make the claim.

### The hedge ladder

Modality and hedging operate at several layers. Check them in order; the layer is part of the
analysis.

| Layer | Examples | What it does |
|---|---|---|
| Modal | may, might, could, must, should | commits or withholds commitment |
| Adverb / adjunct | arguably, largely, in most cases, to some extent | limits scope or force |
| Verb choice | suggest, indicate, tend to, appear, claim vs show vs prove | assigns epistemic strength |
| Quantifier | many, most, some, a handful of | sizes the claim |
| Attribution | according to, critics argue, it is often said | moves the claim off the author |
| Punctuation & syntax | dash asides, parentheticals, `if…then`, rhetorical question | stages distance or invites assent |

### Never say more than the source says

Clarity is not licence to strengthen. An explanation may be simpler than the original; it may not be
more certain, wider in scope, or harder in degree.

| Source says | Not | Because |
|---|---|---|
| `may` | `will` | possibility is not prediction |
| `can` | `must` | capability is not obligation or inevitability |
| `less capable` | `incapable` | a comparison is not an absolute |
| `not necessarily` | `not` | a scope limit is not a negation |
| `some` | `all` | quantity is not universality |
| `tends to` | `does` | a tendency is not a rule |
| `arguably` | `clearly` | the author withheld commitment; do not restore it |

This is the quietest way a close read lies: right in direction, wrong in strength. Re-read every
paraphrase against the modal and the quantifier in the original before sending.

### Confidence marking

State your confidence in the reading when it is not high:

- **Clearly** — the text gives two or more convergent signals.
- **Likely** — one clear signal.
- **Possibly** — a pattern that could also be coincidence.

Never assert irony, sarcasm, or irony-adjacent readings from a single word. Require at least two
signals (lexical mismatch + contrastive context, or hyperbole + understatement in the same
passage). If you only have one, label it *possibly* and say what would confirm it.

### Register

Comment on register only when it is doing work: a formal construction inside a chatty piece, a
colloquialism inside an academic argument, a sudden second-person address. Register commentary
without a reason is filler.

---

## 7. Transfer protocol

The point of the whole exercise. Keep it small and usable.

### The transfer test

A pattern is worth extracting only if **all three** hold:

1. It appears in a genre the learner actually writes in.
2. It is generative — you can swap the content and keep the frame.
3. It is not already automatic for the learner at this level.

### Format for each pattern

```
功能:      这个结构在文章里干什么
使用条件:  什么场合该用；什么场合会显得别扭
换料公式:  Frame with slots, e.g. "While it is true that [让步内容], [主论点] remains [限定]."
示范:      一句新句子，内容与原句不同
```

Rules:

- **Maximum three or four** patterns. More than four means you did not choose.
- **Prefer discourse-level over lexical.** "先让步后转折的段落起手式" transfers further than any
  single idiom.
- **Always give the negative condition.** A pattern without a "when not to use it" gets
  over-applied. That failure is worse than not learning it.
- Write the frame with explicit slots so the swap is mechanical, not inspirational.

---

## 8. Practice protocol

Two to four tasks. Not eight. Choose tasks that test **what this session actually taught**, so the
practice is a check on the analysis, not a generic workbook page.

### Task types (pick, do not stack)

| Type | Tests | Good when |
|---|---|---|
| Retelling | global grasp, compression | the text has a clear spine |
| Sentence reconstruction | backbone and modifier attachment | you analysed a hard sentence |
| Paraphrase | contextual meaning | you taught a context-shifted word or a hedge |
| Imitation writing | transfer of a pattern | you extracted a reusable frame |
| Argument reconstruction | architecture | you drew an arrow chain |
| Back-translation into the target language | precision | the user's L1 is the explanation language |
| Summary in N words | selection judgement | long text, limited time |
| Vocabulary recall in a new context | production items | you gave a production list |

### Construction rules

- Each task states **what it is testing** and **the success criterion** in one line.
- Tasks use the learner's own life/field as content where possible — transfer is stronger when the
  content is theirs.
- Put model answers **after** the tasks, clearly separated, and keep them short. The learner must
  be able to attempt the task before seeing the answer.
- Never set a task that requires knowledge the session did not supply.

---

## 9. Anti-patterns (self-check before sending)

### Restatement is not reinforcement

An insight belongs in exactly one place in the output. If a concession strategy, a scope limit, or a
reusable frame is explained during sentence work, the later architecture, stance, or transfer
sections may *reference* it in half a line — never re-explain it.

A second explanation reads as emphasis to the writer and as repetition to the reader, and it is the
main reason a full close read feels heavier than its content warrants. Cutting the repetition is
almost always better than cutting the insight.

This binds hardest where every module is individually affordable — which is the middle bands, not
the advanced ones.

Run this list against the draft. Any hit means revise.

| Anti-pattern | Symptom | Fix |
|---|---|---|
| Translation in disguise | every quote is followed by a fluent rendering in the explanation language | replace rendering with function commentary |
| Coverage | more than six sentence analyses, or every paragraph gets a section | apply the five-question gate again |
| Labelling | "这是一个定语从句" and nothing about what it does | rewrite as function |
| Vocabulary dump | more than 8 items, or synonym chains | apply the utility test |
| Fixed template | all eight modules present for a two-sentence request | route by request type |
| Forced model | "Introduction-Body-Conclusion" on an op-ed | draw the actual arrow chain |
| Unlicensed reading | "作者在讽刺" with no quoted trigger | cite the token or cut the claim |
| Meta-padding | "希望这份分析对你有帮助" and similar framing | delete |
| Redundant teaching | same structure explained twice in one output | second time, reference the first |
| Module accumulation | every module expanded and roughly equal in weight; the reader cannot tell what mattered | cut to the level's module budget; choose by what this reader will use |
| False binary | "这不是时间状语，是条件" — one function asserted by denying another | name the dominant force, keep the secondary one |
| Modal inflation | the analysis says `will` where the text says `may`, or `all` where it says `some` | re-read the paraphrase against the modal and the quantifier |
| Over-generalised rule | a reading that fits one passage stated as the meaning of the structure | state the local function first; generalise only as a possibility |
| Level mismatch | C1 user given subject-verb-object basics | check the CEFR depth profile |
| Manufactured simplicity | a text's central move is suppressed because it "belongs to a higher band" | admit the insight inside an existing section; position and weight are the controls, not existence |
