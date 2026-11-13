# Language Module Template

Contract for every `languages/<lang>.md`. Copy this file to the new language's name and fill the
sections. A module that cannot fill a section should say so explicitly rather than invent content.

**The invariant:** a language module supplies *phenomena*. It never supplies *depth*. Depth comes
from `references/cefr-adaptation.md` and is shared across all languages. A module that says
"B1 learners need X explained slowly" has broken the contract — that sentence belongs nowhere.

---

## Required sections

### 1. Language profile (5–10 lines)

What makes this language analytically different from English, in ways that change what a close read
attends to. Not a typology lecture — only the differences that matter for reading.

Examples of the right register:

- German: case marking lets word order be freer, so the main verb's position (second position in
  main clauses, final in subordinate clauses) is the primary parsing signal; separable prefixes can
  strand meaning at the end of a long clause.
- French: the passé simple / imparfait contrast carries narrative viewpoint; pronominal verbs shift
  agency; negation wraps the auxiliary.
- Italian / Spanish: null subjects make the verb ending the reference tracker; clitic pronouns
  attach and stack; the subjunctive marks stance rather than tense.

### 2. Phenomena worth noticing

A table in the same shape as `english.md` §1 — by **function**, not by grammar label.

| # | Phenomenon | Why it carries value | Typical surface forms |
|---|---|---|---|

Six to ten rows. If the language has a phenomenon with no English analogue (German case, French
clitic doubling, Spanish *ser/estar*), it belongs here and should be ranked high — it is precisely
what a learner cannot transfer from English.

### 3. Phenomena by level band

`A1–A2 / B1 / B2 / C1 / C2` — what is *available* to notice at each level, in this language's own
terms. Do not translate the English list; build it from this language's syllabus reality.

### 4. Discourse machinery

Language-specific cohesive and rhetorical devices that are invisible to learners: how this language
marks given vs new information, how it signals concession, how it manages formality (T/V, honorific
systems, register levels), how it opens an argument. Five to eight items, each with the reading
consequence.

### 5. Traps for the relevant L1 groups

The highest-yield section, and the one that must be written per learner population. If the module
serves multiple L1s, split by L1:

```markdown
### Traps for Chinese speakers
| Trap | What the learner does | What is actually happening |
|---|---|---|

### Traps for English speakers
...
```

Only write rows you are confident about. A wrong trap is worse than a missing one — it teaches a
false contrast.

### 6. Genre expectations

Same table shape as `english.md` §5, adapted to this language's genre system. If the language has
genres English lacks (the German *Feuilleton*, the French *dissertation*), include them.

### 7. What not to spend time on in this language

The equivalent of `english.md` §6: the local version of "irregular verbs", "spelling", "case tables
for their own sake".

### 8. Extension contract note

One line stating which files must be edited to activate the module (this file, plus
`references/input-routing.md` §5), and confirming that no depth rules were added here.

---

## Acceptance test before shipping a module

- [ ] Every phenomenon row names a **function**, not only a label.
- [ ] No sentence anywhere in the file states how deep to go, how many items to include, or what a
      level "needs".
- [ ] At least three traps are language-pair specific, not generic grammar errors.
- [ ] The module contains at least one phenomenon with **no English equivalent**, ranked high.
- [ ] No stock template is imposed in §6 — genres are described from the target culture's reality.
- [ ] Cross-references point to `cefr-adaptation.md` for depth and to `core-method.md` for protocol,
      with no duplication of either.

---

## Stub: the four planned modules

Do not create these until there is a real user need. A half-written language module produces
confident wrong answers, which is worse than the graceful degradation described in
`references/input-routing.md` §5.

| Module | Highest-value phenomenon to research first | Highest-value trap class |
|---|---|---|
| `german.md` | verb-final subordinate clauses and separable prefixes (meaning stranded far from the verb) | Chinese speakers reading the second-position verb as the main verb and stopping; case marking ignored in favour of word order |
| `french.md` | passé simple / imparfait and the narrative viewpoint they carry | pronoun `on`, clitic order, and negation wrapping the auxiliary |
| `italian.md` | null subjects and clitic pronoun chains | reading verb endings as agreement only, not as reference tracking |
| `spanish.md` | *ser/estar* and aspectual choice | subjunctive read as a tense rather than as stance |
