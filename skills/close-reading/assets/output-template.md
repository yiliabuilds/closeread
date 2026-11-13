# Output Template

Skeletons to adapt, not forms to fill. Choose by request type (`references/input-routing.md` §3),
then delete every section the situation does not justify.

---

## A. Full close read (default)

```markdown
## 全文脉络
- 主题 / 核心主张 / 作者意图 —— 三行内说完
- 段落角色：¶1 …… ¶2 …… ¶3 ……（用动词短语，不写内容摘要）
- 论证骨架：A → B → C（用本文自己的动作命名）
- 转折点：¶n，「引文片段」
- 语气立场：一个词 + 一个依据 token

## 精读句 n
> 原句（¶n）

- **在这段里做什么**：一两句，不翻译
- **主干**：主语 + 核心谓语 + 宾语/补语
- **挂在主干上的部分**：每一块说明它干什么（限定范围 / 给原因 / 让步 / 举例 / 定义）
- **这几块之间的逻辑**：因果 / 对比 / 条件 / 递进
- **在段落或论证里的作用**：
- **可复用**：Frame with [slots]（只在通过迁移检验时写）

## 词汇与表达
**认识即可**
- *word* — 语境义（半行）

**值得产出**
- *collocation* — 什么时候用 + 一句示范

## 文章是怎么搭起来的
- 骨架箭头图
- 2–3 条 move 层面的观察（顺序、延迟、让步位置、定义时机）
- 这个结构买到了什么

## 语气与立场
每条写成 `触发词 → 读法 → 标签`。B2 以下可整节省略。

## 可以迁移的
每个：功能 / 使用条件 / 换料公式 / 一句示范。最多 3–4 个。

## 练习
2–4 题，每题标注在测什么。

---
### 参考答案
```

---

## B. Quick scan (time-boxed)

```markdown
## 30 秒版
- 这篇在干什么：一句
- 骨架：A → B → C
- 最值得学的一处：引文 + 一句为什么

## 只精读这一句
（完整句分析，压缩到 4 行）

## 带走一个
可复用的框架 + 一句示范
```

Drop practice unless asked. Name what was skipped in one line at the end.

---

## C. Sentence clinic (user supplied the sentences)

```markdown
## 第 1 句
> 原句

- 主干
- 各修饰成分在干什么
- 逻辑关系
- 容易读错的地方（如果有）
- 可复用框架（如果有）
```

No global read, no vocabulary section, no practice. If the sentences came without context, add one
line: 没有上下文，只能按句子本身分析；补上前后段落会更准.

---

## D. Argument only

```markdown
## 论证骨架
A → B → C → D（箭头图，用本文的动作词）

## 支点
> 引文
在论证里承担什么（1–3 行）

## 让步与限定
哪些地方作者给自己留了退路，用什么词留的

## 这个论证的强度
它依赖哪个未言明的前提
```

No vocabulary, no sentence grammar, no practice unless asked.

---

## E. Vocabulary in context

```markdown
## 认识即可
| 词/搭配 | 语境义 | 为什么在这里是这个意思 |

## 值得产出
- *搭配* — 使用条件 / 一句示范 / 一个误用示范

## 语境改变了意思的
- *word* — 常见义 → 此处义
```

Still no alphabetised glossary, still no synonym chains, still no more than 8 rows.

---

## F. Transfer only

```markdown
## 框架 1：功能名
- 原句：> 引文
- 功能：
- 使用条件：
- 什么时候别用：
- 换料公式：`[X] …, [Y] …`
- 示范：一句新句子
```

Two to four frames. No vocabulary, no global read beyond one line of context.

---

## Formatting rules

- **Headings in the explanation language.** `## 精读句 1` for Chinese, `## Focus sentence 1` for
  English. Never mix heading languages inside one output.
- **Quote the source verbatim**, in a blockquote, with a locator. Use `¶n` from the Pass 1
  paragraph map, or a quoted fragment when numbering is unreliable — see `core-method.md` §1.
  Titles, bylines, standfirsts, and subheadings are metadata and never take a number. Never
  paraphrase the original in place of quoting it.
- **Bold the reusable frame**, not the surrounding prose.
- **At most two tables per output**, and no vocabulary table longer than eight rows. Tables are for
  comparison, not for bulk.
- **No emoji. No closing pleasantries.** No "希望对你有帮助", no "let me know if you'd like me to
  expand". If an expansion is genuinely the obvious next step, name it in one clause.
- **Separate answers from tasks** with `---` and a heading, so the learner can attempt first.
- **Length budget** per `references/cefr-adaptation.md`. Under budget is better than padded.

---

## Worked micro-example (B2, Chinese explanation)

The sentence, from an article on remote work:

> While it is true that remote work has widened the pool of applicants, it has also made the
> informal networks that once carried institutional knowledge far harder to sustain.

**Correct shape of the analysis:**

> **在这段里做什么**：这是段落的转折点。作者先承认远程办公的一个实际好处，然后立刻用同一个句子把代价压回来——所以这一段接下来的内容是在讲代价，不是在讲好处。
>
> **主干**：真正的主干只有 `it has also made the networks harder to sustain`。"While it is true
> that…" 整块是让步从句，`that once carried institutional knowledge` 只是限定 networks 是哪种网络。
>
> **挂在主干上的部分**：让步从句给的是"对方有道理的地方"；`also` 是关键信号，说明作者不是在反驳，
> 而是在加码——好处成立，代价同样成立。
>
> **逻辑**：不是"虽然…但是…"的取消关系，是"两边都算数，但重心在后"。
>
> **可复用**：`While it is true that [对方有理之处], it has also [被忽略的代价].` 适合在你不想
> 显得偏激时，先把对方的理由摆足，再提出自己的重点。

**Wrong shape (same sentence):**

> 这句话的意思是：虽然远程工作确实扩大了申请者的范围，但也让曾经传递机构知识的非正式网络更难维持了。
> 其中 while 引导让步状语从句，that 引导定语从句修饰 networks，it 指代远程工作。

Why it fails: the first half is a translation, and the second half labels structures without saying
what they do. The learner closes the page knowing the sentence's meaning but not its move — and will
not recognise the same frame next week.

---

## Self-check before sending

1. Does the first section establish the whole before any sentence? (Pass 1)
2. Can the user see *why* these sentences and not others? (Pass 2 announcement)
3. Is every quote followed by function, not by a rendering?
4. Are there at most six focus sentences and at most eight vocabulary rows?
5. Does every stance claim cite a token?
6. Does every reusable frame have a "when not to use it"?
7. Is the output inside the level's length budget?
8. Did every explicit user override get obeyed literally?
9. Is the number of expanded sections within the level's module budget, and can the reader tell
   which one mattered most? If every section is the same size, cut one.
10. Is any insight explained twice — once in a focus sentence and again in a later section? Reference
    it instead.
11. Does every `¶n` come from the same paragraph map, with titles, bylines, and subheadings
    unnumbered — or, if boundaries were unreliable, is there no `¶n` at all?
