<img width="2284" height="1258" alt="image" src="https://github.com/user-attachments/assets/63c5957d-9e20-44ac-bcdd-47f6df04ab8a" /># 精读钥匙 · CloseRead

**把自己的文章，变成可以逐句学习的精读材料。**

读懂翻译，不等于理解一句话如何成立。CloseRead 保留原句，把词语、表达和语法放回句子里解释，再用练习和笔记留下自己的理解。

你可以先用固定示例体验，也可以导入自己的文章在本地生成精读；如果习惯在 Agent 中学习，还可以使用从 CloseRead 精读方法中独立封装出的 Agent Skill。

---

## 选择使用方式

| 我想…… | 使用方式 | 入口 |
|---|---|---|
| 先看看精读页面是什么样 | **在线展示版** | [直接在线体验](https://yiliabuilds.github.io/closeread/) |
| 用自己的文章生成、保存精读 | **本地完整版** | [查看本地运行步骤](#本地完整版) |
| 在 Agent 对话中分析英语文章 | **Agent Skill** | [查看安装与提问示例](#agent-skill) |

这三种方式属于同一个项目。**Agent Skill 是新增的使用形态，不取代原有网页或本地应用。**

## 一次精读是怎样完成的？

**导入 Word 或粘贴文本 → 选择段落 → 分批生成 → 按句阅读 → 练习与笔记 → 下次继续。**

CloseRead 不是固定课程。你带来材料，决定这次学哪一部分；本地版使用你自己的 DeepSeek API，将它整理成可保存、可继续阅读的精读页面。学习计划可以使用，也可以跳过。

## 目前能做什么？

| 环节 | 功能 |
|---|---|
| **准备材料** | 粘贴文本或导入 `.docx`；生成前编辑原文、选择本次要学的段落 |
| **逐句阅读** | 原句下方提供英语讲解；需要时再展开中文辅助 |
| **练习与笔记** | 查看练习和参考答案，记录理解；下次从保存的阅读位置继续 |
| **找回文章** | 在本机文章库搜索标题和原文；不同文章可在独立页面同时打开 |
| **安排学习** | 自动安排一周、手动调整任务，并打开关联的外部学习网站 |
| **管理模型** | 本地版使用自己的 DeepSeek API；可在设置页更换或清除密钥 |

> 生成内容可能有误，请结合原文核对。CloseRead 是学习工具，不是语言能力评分或认证工具。

---

## 三种使用方式

| | 在线展示版 `docs/` | 本地完整版 `local/` | Agent Skill `skills/close-reading/` |
|---|---|---|---|
| **主要用途** | 体验固定示例的阅读方式 | 导入、生成、保存自己的精读 | 在支持 Skill 的 Agent 中精读所提供的文本 |
| **自己的材料** | 不提供导入生成 | 粘贴文本或导入 `.docx` | 向宿主 Agent 提供文本；能否直接读文件取决于宿主 |
| **AI 分析** | 固定内容，不实时调用模型 | 使用自己的 DeepSeek API | 由宿主 Agent 执行，不使用本地版的 API 设置 |
| **笔记与进度** | 保存在当前浏览器 | 保存在当前浏览器 | Skill 不自带文章库或阅读位置保存 |
| **学习计划** | 有 | 有 | 不属于 Skill 功能 |
| **语言范围** | 现有固定示例 | 主要在德语初学场景验证 | v0.1 的完整语言模块为 English |

### 在线展示版

**[打开在线体验网站 →](https://yiliabuilds.github.io/closeread/)**

展示版提供固定的 Lina 示例、练习笔记与学习计划，**不是实时 AI 输出**，也不需要付费模型密钥。

<details>
<summary>从下载的代码在本机预览展示版</summary>

在项目根目录运行：

```sh
python3 -m http.server 4190 --directory docs --bind 127.0.0.1
```

然后打开 <http://127.0.0.1:4190>。

</details>

### 本地完整版

当前主要支持 macOS。需要 Node.js（项目以 Node 22+ 为目标）和 Python 3；无需额外安装 npm 依赖。

1. 从[项目仓库](https://github.com/yiliabuilds/closeread)选择 **Code → Download ZIP**，解压并打开 `local/`。
2. 双击 `启动精读.command`。如无法双击，在终端进入 `local/` 后运行 `python3 start-local.py`。
3. 打开 <http://127.0.0.1:4180>。
4. 在“我的”页面配置自己的 DeepSeek API 密钥。
5. 新建精读，粘贴原文或导入 `.docx`，选择段落后生成。

密钥保存在 macOS 钥匙串，不写入 GitHub 或网页。关闭启动程序会停止本地服务；请勿将这个单用户服务直接暴露到公网。

<details>
<summary>输入长度与生成失败时会怎样？</summary>

`.docx` 文件最大 5 MB；单次选择 10–3000 字符。较长选段按批生成。失败时停止，不自动重试；已保存的成功批次可在继续同一请求时复用，但继续仍可能计费。端口被占用时，请先关闭旧的本地实例。

</details>

### Agent Skill

CloseRead Agent Skill 是从原有精读产品中抽离、整理出的一套**可复用精读方法**。网页和本地版提供“导入文章 → 生成内容 → 阅读 → 练习 → 笔记”的学习流程；Skill 专注于这条流程中最核心的判断：**文章该怎样读，哪些内容值得解释，以及针对不同水平应该讲多深。**

> The goal is not maximum explanation. The goal is maximum learning value.

它不追求逐句翻译或平均覆盖全文。面对完整文章，它先理解整体，再选择真正影响理解、容易误读或具有迁移价值的地方；如果你只给出几句话，它就直接分析这些句子，不编造文章脉络。

#### 它能做什么？

- **CEFR A1–C2 深度适配**：按学习者水平调整分析重点、信息密度和解释深度，而不是把同一答案简单拉长或缩短。
- **选择性精读**：从全文筛选高学习价值的句子，而不是机械地逐句讲解。
- **先看整体，再看局部**：有完整文章时，先识别主题、段落作用、论证、转折和作者立场，再进入重点句。
- **Sentence Clinic**：只分析用户指定的句子，不强制运行完整文章流程。
- **按请求切换重点**：可以做快速阅读、论证分析、语境词汇，或聚焦值得用于自己写作的表达。
- **语境与迁移**：解释词句在这里为什么这样写，并判断哪些表达真的值得迁移；没有价值的内容不硬提取。
- **忠于原文**：保留程度、范围和不确定性，不把 `may` 解释成 `will`，也不把 `some` 扩大成 `all`。

这些是**按需选择的分析能力**，不是每次必须填满的栏目。v0.1 完整调试的原文语言模块为 **English**，支持中文或英文讲解；A1 和 A2 目前共用一组深度配置。德语、法语、意大利语和西班牙语等语言只预留扩展接口，尚未完成相应模块的教学质量验证。

核心方法、CEFR 深度控制、请求路由与英语语言规则分别维护。你可以把 Skill 理解为 CloseRead 的 **reasoning layer**：网页与本地应用负责学习界面和使用流程，Skill 负责定义“什么值得讲、讲多深、怎样讲”。它不自带网页、文章库、学习计划或本地 API 密钥管理。

#### 怎样安装？

把 [CloseRead 仓库链接](https://github.com/yiliabuilds/closeread)发给你的 AI，并告诉它：

> 请安装这个仓库中的 CloseRead Agent Skill。安装的是 `skills/close-reading/` 整个文件夹；完成后请确认 Skill 已被识别、可以调用，不要只阅读 `SKILL.md` 就说安装好了。

这一步是**安装**。安装后，再把自己想学的文章或句子发给 AI；无需在 CloseRead 网页里填写本地版的 DeepSeek API 密钥。

#### 安装后，怎样提出精读要求？

**不需要套固定表格。**从你这次想解决的问题说起，再附上文章或句子即可。例如：“我想看懂作者如何论证”“这三个长句卡住了我”“我只有十分钟，帮我抓重点”。你也可以告诉它自己的英语水平、希望用中文还是英文讲解，以及**不想要什么**，比如“不逐句翻译”“不要生词表”。

`target_language`、`cefr_level`、`explanation_language` 和 `support_language` 是可以明确填写的参数，**不是每次必填的表单**。当前完整语言模块是 English；`support_language: none` 是 v0.1 的默认设定。水平不确定时可以先不写，读完再说“太基础了，请讲深一点”或“请讲浅一点”。

下面给出两种不同的请求。它们展示的是**如何说明学习目标**，不是要求你每次照抄全部参数和栏目。

**示例 A：读一篇完整文章，关注论证与写作迁移**

```text
请使用 CloseRead Skill 精读下面这篇文章。

target_language: English
cefr_level: B2
explanation_language: Chinese
support_language: none

我的目标是：

- 理解文章的整体论证；
- 看懂真正影响理解的复杂句；
- 注意作者如何通过让步、转折和措辞表达立场；
- 学习少量真正值得迁移到英语写作中的表达。

不要逐句翻译，不要做大量生词表。请由 CloseRead 自己判断什么最值得精读。

【在这里粘贴 The Problem with Being Easy to Reach 全文，或替换成自己的英语文章】
```

**示例 B：只精读指定句子，不要全文分析**

```text
请使用 CloseRead Skill，只精读下面三个句子。

target_language: English
cefr_level: B2
explanation_language: Chinese
support_language: none

我不需要全文脉络、文章结构、生词表或完整练习。

只分析这三个句子：

1. 它们在表达什么；
2. 真正影响理解的结构是什么；
3. 最容易读错在哪里；
4. 有真正迁移价值的表达再告诉我，没有就不要硬提取。

句子：

1. Once rapid response becomes normal, delay can acquire a social meaning that it did not previously carry.
2. Ten interruptions that each require thirty seconds do not merely consume five minutes; they divide the attention surrounding those five minutes as well.
3. A worker may be able to turn off a messaging app after 6 p.m. while still knowing that colleagues expect an answer.
```

只有句子、没有文章时，Skill 会直接处理这些句子，不会凭空生成全文脉络。想看更少内容，可以说“我只有十分钟”；想聚焦一个方面，可以说“只看论证”或“只看能用于写作的表达”。

Skill 的模型调用、费用及对话数据保存由宿主 Agent 决定；它不会读取本地完整版钥匙串中的 DeepSeek 密钥。

---

## 数据、隐私与当前边界

这些限制比功能介绍更重要，使用前请留意：

- **材料限制**：本地版支持文本和 `.docx`；`.docx` 最大 5 MB，单次选段 10–3000 字符。目前没有 PDF/OCR、网址抓取或听写功能。
- **教学验证范围**：网页与本地版主要在德语初学场景验证；界面中的其他原文语言选项不代表教学质量均已验证。Agent Skill v0.1 则只有 English 完整语言模块。
- **本地数据**：文章、批次缓存和失败诊断位于 `local/.local-data/`，不应提交到仓库。
- **浏览器数据**：笔记、阅读位置和计划保存在当前浏览器；清除浏览器数据或换浏览器，可能失去这些记录。阅读页与计划工作区需分别导出备份。
- **模型请求**：本地版只有在主动生成时，才将所选文本发送给模型服务；请求可能计费。默认模型配置见 `local/server.mjs`，模型可用性和价格以自己的账户为准。
- **私人材料**：不要提交密钥、敏感文章或无权使用的材料。展示版只有固定示例与浏览器本地数据，不发送付费模型请求。
- **设备与同步**：网页包含移动端适配，但尚未完成全面真机测试。目前没有账号或多端云同步。

## 仓库结构

```text
closeread/
├── docs/                  # 在线展示版
├── local/                 # 本地完整版
├── skills/
│   └── close-reading/     # Agent Skill
├── README.md
├── RELEASE_NOTES.md
└── LICENSE
```

三种形态共享“从自己的材料中学会阅读”的目标，但面向不同的使用方式。

## 后续方向

长文章分段推进、可恢复的学习流程、听写与更多材料导入，以及 Agent Skill 的其他语言模块，都需要继续开发和验证。这里记录的是方向，不是已上线功能或上线时间承诺。

## 版本与许可

网页与本地版的 v0.1 功能、限制见 [`RELEASE_NOTES.md`](RELEASE_NOTES.md)。Agent Skill 的版本和使用规则见 [`skills/close-reading/SKILL.md`](skills/close-reading/SKILL.md)。

项目采用 MIT 许可证，署名 yiliabuilds，见 [`LICENSE`](LICENSE)。示例及第三方材料的权利需要独立核实；项目许可证不授权第三方内容。
