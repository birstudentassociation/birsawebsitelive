# Generative-AI / LLM Tutors: Measured Effects on Learning (2023 to 2026) and Design Features

Evidence status labels used throughout: **[PEER]** peer-reviewed journal; **[PREPRINT]** working paper, arXiv or NBER/SSRN/World Bank WP, not peer reviewed; **[VENDOR]** company claims or product posts; **[SECONDARY]** press, blogs and commentary.

## Q1. Bastani et al., "Generative AI without guardrails can harm learning" (PNAS 2025)

### Takeaway

Unrestricted GPT-4 boosted practice scores but **lowered later unassisted exam scores by 17%**. A guardrailed "GPT Tutor" boosted practice scores more, and its exam scores came out about the same as the control's. The tutor removed the harm, but it produced no measurable learning gain.

### Cited Findings

- [PEER] Bastani, Bastani, Sungu, Ge, Kabakcı, Mariman, _PNAS_ 122(26), 2025, doi 10.1073/pnas.2422633122. Field experiment with "nearly a thousand" high school math students in Turkey. Arms were GPT Base (a ChatGPT-like GPT-4 interface), GPT Tutor (GPT-4 with prompts designed to safeguard learning), and students without access — [IDEAS/RePEc abstract](https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html)
- Practice sessions with AI access: grades rose **48% (GPT Base)** and **127% (GPT Tutor)** — [IDEAS/RePEc](https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html)
- Exam after access was removed: GPT Base students scored **17% lower** than students who never had access. GPT Tutor's negative effects were "largely mitigated", and its exam scores were about the same as the control's — [IDEAS/RePEc](https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html); [Wharton Knowledge](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)
- Mechanism given by the authors: students used GPT-4 "as a crutch" in practice and then did worse on their own — [IDEAS/RePEc](https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html). The working-paper version is on [SSRN 4895486](https://papers.ssrn.com/abstract=4895486).
- Caveat: 17%, 48% and 127% are relative changes in grades, not SD effect sizes. The practice gains measure performance while the AI was available, not learning — [search summary of Wharton/SSRN](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education)

### Inferences

- This is the clearest causal evidence that **answer-giving AI can reduce learning** even while it raises in-session performance. In-session performance cannot stand in for learning.
- Guardrails (hints, no full solutions) were necessary to avoid harm. In this study they were not sufficient to produce gains.

### Gaps

- I did not verify the exact N, grade levels, number of sessions, or exactly what GPT Tutor was allowed to do (from memory: teacher-written hints and solutions in the prompt, told not to give the full answer), nor the reported GPT-4 error rate on these problems. Check against the PNAS full text.

## Q2. Kestin et al., Harvard physics AI tutor RCT (Scientific Reports 2025)

### Takeaway

A carefully engineered, scaffolded GPT-4 tutor produced **larger learning gains in less time** than an in-class active-learning lesson (effect 0.63 SD by regression, 0.73 to 1.3 SD by quantile regression). The scale of the "more than double" headline is disputed.

### Cited Findings

- [PEER] Kestin, Miller, Klales, Milbourne, Ponti, _Scientific Reports_ 15:17458 (June 2025), doi 10.1038/s41598-025-97652-6. 233 students in Harvard intro physics for life sciences (Fall 2023), 194 analysed. **Crossover RCT**: each student had one lesson with the AI tutor and one in class, in consecutive weeks, on surface tension and fluid flow — [PMC full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- Median post-test was 4.5 for AI vs 3.5 for in class (p < 10^-8). The authors say median gains were more than double. Effect size was **0.63 SD** by regression (an underestimate given ceiling effects) and **0.73 to 1.3 SD** by quantile regression — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- Median time with the AI was 49 minutes vs an assumed 60 minutes in class. Time on task did not correlate with post-test score. The AI group reported higher engagement (4.1 vs 3.6) and motivation (3.4 vs 3.1) — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- **What the AI was allowed to do**: the system prompt targeted active engagement, managing cognitive load and growth mindset. The platform walked students through each problem part in sequence. **Pre-written expert step-by-step solutions were included** so the tutor did not rely on GPT-4 alone for accuracy. The authors list "give answers vs prompt reflection" as an open question — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- Limitations the authors state: ceiling effects; content limited to the understand, apply and analyse levels; one course, short intervention; months of platform development; delivery medium confounded with pedagogy; several authors developed the comparison active-learning method — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- [SECONDARY] An independent re-analysis (Jan 2026) argues that the within-person median improvement is nearer 30%, with a 95% CI of about 12 to 26%, smaller than "more than double" implies — [Clay Ford re-analysis](https://www.clayford.net/posts/ai_tutoring_nature/)

### Inferences

- The positive result came from a tutor with **expert-authored content, solutions grounded in the prompt, and enforced step-by-step structure**. It does not show that a general chatbot works.

### Gaps

- No delayed retention test. I found no replication outside Harvard.

## Q3. World Bank Nigeria (Edo State) GPT-4 after-school English pilot (De Simone et al. 2025)

### Takeaway

A six-week, teacher-supervised after-school program using Microsoft Copilot (GPT-4) raised scores by **0.31 SD overall and 0.23 SD in English**. That is among the larger effects in the development-RCT literature, but it is still a working paper.

### Cited Findings

- [PREPRINT] De Simone, Tiberti, Barron Rodriguez, Manolio, Mosuro, Dikoru, "From Chalkboards to Chatbots: Evaluating the Impact of Generative AI on Learning Outcomes in Nigeria", World Bank Policy Research Working Paper 11125 (May 2025). RCT with first-year senior secondary students in public schools in Edo State, six weeks, Microsoft Copilot (GPT-4) — [World Bank OKR](https://openknowledge.worldbank.org/entities/publication/15e1ff08-15ae-4f7a-b2a8-d146e6c113ee/full)
- Effect was **0.31 SD** on a combined assessment of English, AI knowledge and digital skills, and **0.23 SD on English**, the main outcome. Benefits were seen across the baseline distribution, with larger effects for **female students and higher-baseline students**. The authors equate the gain to 1.5 to 2 years of business-as-usual schooling — [World Bank OKR](https://openknowledge.worldbank.org/entities/publication/15e1ff08-15ae-4f7a-b2a8-d146e6c113ee/full)
- [SECONDARY/World Bank blog] The blog framed the gain as about 0.3 SD, "nearly two years of typical learning in six weeks", and said it outperformed about 80% of RCTs in a database of developing-country education interventions. The blog came out before the paper — [World Bank blog](https://blogs.worldbank.org/en/education/From-chalkboards-to-chatbots-Transforming-learning-in-Nigeria)

### Inferences

- The design was **human-supervised**: teachers acted as facilitators in after-school sessions, with guided prompts. Results should not be generalised to unsupervised student chatbot use.
- Higher effects for higher-baseline students suggest that AI tutoring may widen gaps unless it is designed for weaker learners.

### Gaps

- I did not retrieve sub-scores for English writing specifically (vs grammar and vocabulary), the exact N, attendance or dose, or details of the prompt guides. I did not verify the teacher-facilitator role against the paper text; it comes from my knowledge of the program. Peer-review status as of Oct 2026 is unknown.

## Q4. Tutor CoPilot (Wang et al., Stanford 2024/2025)

### Takeaway

Real-time AI suggestions to **human** tutors raised student topic mastery by 4 percentage points, and by up to 9 pp for students of weaker tutors, at about $20 per tutor per year. Tutors gave fewer answers away and asked more guiding questions.

### Cited Findings

- [PREPRINT] Wang, Ribeiro, Robinson, Loeb, Demszky, "Tutor CoPilot: A Human-AI Approach for Scaling Real-Time Expertise", arXiv 2410.03017 (also EdWorkingPaper ai24-1054). Described as the first RCT of a human-AI system in live tutoring: **900 tutors and 1,800 K-12 students** from under-served communities, with tutors randomised about half and half — [arXiv](https://arxiv.org/abs/2410.03017); [EdWorkingPapers](https://edworkingpapers.com/ai24-1054)
- ITT effect: students were **+4 pp** more likely to master topics (p < 0.01). Students of lower-rated tutors gained up to **+9 pp**. Cost was about **$20 per tutor per year**. Analysis of more than 550,000 messages showed more guiding questions and fewer answers given away — [arXiv](https://arxiv.org/abs/2410.03017)
- Reported sample sizes differ: a Stanford summary says "more than 700 tutors and 1,000 students", and The 74 says about 900 tutors and about 1,000 students — [Stanford NSSA](https://nssa.stanford.edu/studies/tutor-copilot-human-ai-approach-scaling-real-time-expertise); [The 74](https://www.the74million.org/?p=733842)

### Inferences

- This is the strongest RCT evidence for the **human-in-the-loop** model. The AI improves the tutor's pedagogy and never faces the student directly. Benefits concentrate where human expertise is weakest.

### Gaps

- I did not confirm whether a peer-reviewed version had been published by Oct 2026. Effects on end-of-year standardised tests were reported as not significant in my recollection, and I did not verify this.

## Q5. Khanmigo, Google LearnLM, Anthropic learning mode, OpenAI study mode, meta-analyses and critiques

### Takeaway

Vendor "Socratic" modes are widespread but have **no published independent learning-outcome RCTs**. The first large RCT of Khanmigo (NBER, Aug 2026) found only **small gains, no larger than Khan Academy without AI**, mostly because students declined to use a tutor that would not give answers. The most-cited meta-analysis of positive ChatGPT effects (Wang & Fan 2025) has been **retracted**.

### Cited Findings

**Khanmigo**

- [PREPRINT] Oreopoulos & Low (University of Toronto), NBER working paper, Aug 2026. RCT across **18 Tennessee middle schools**, 2024 to 2026, with low-achieving students at least one grade behind in a remedial math period. Students were assigned to Khan Academy with Khanmigo or to usual remediation tools (IXL, Zearn, DeltaMath and others) — [FutureEd](https://www.future-ed.org/students-tried-khanmigos-ai-tutor-most-didnt-want-its-help/)
- Gains were modest, about **1.26 national percentile ranks per term**, "resembling those from Khan Academy practice without AI assistance". Almost all students tried Khanmigo and many tried to extract answers. When it asked questions or gave hints instead, most stopped using it: "most students declined it most of the time" — [FutureEd](https://www.future-ed.org/students-tried-khanmigos-ai-tutor-most-didnt-want-its-help/); [WINS summary](https://www.winssolutions.org/khanmigo-ai-tutoring-two-year-trial/). The 1.26 figure comes from a secondary summary and should be checked against the NBER paper.
- [VENDOR/SECONDARY] Sal Khan acknowledged that the early Khanmigo fell short of learning expectations. Khan Academy is rebuilding it into the main practice flow, and the released material gave no N or effect size — [EdTech Innovation Hub](https://www.edtechinnovationhub.com/news/r5qzna95z9ubi8dbj8tikeayb1ej31)

**Google LearnLM**

- [PREPRINT/VENDOR] Jurenka et al. (Google DeepMind), "Towards Responsible Development of Generative AI for Education: An Evaluation-Driven Approach", arXiv 2407.12687. The paper turns learning-science principles into **seven pedagogical benchmarks** (quantitative, qualitative, automatic and human). LearnLM-Tutor, a Gemini fine-tune, was preferred by educators and learners over a prompt-tuned Gemini on pedagogical dimensions. A revision (2025-11-28) responds to peer feedback from Roschelle, McLaughlin and Koedinger — [arXiv](https://arxiv.org/html/2407.12687v4)
- These are preference and rubric evaluations in simulated scenarios, not learning-outcome RCTs — [Google Cloud LearnLM](https://cloud.google.com/solutions/learnlm?hl=bn)

**Anthropic Claude learning mode and OpenAI study mode**

- [VENDOR] OpenAI launched ChatGPT Study Mode on 29 July 2025. It uses Socratic questioning and step-by-step prompts built from custom system instructions written with pedagogy experts, and **users can switch it off at any time**. OpenAI said it was working with Stanford SCALE to study outcomes — [VentureBeat](https://venturebeat.com/ai/chatgpt-just-got-smarter-openais-study-mode-helps-students-learn-step-by-step); [Maginative](https://www.maginative.com/article/openai-launches-study-mode-for-chatgpt/)
- [SECONDARY] Critics describe Study Mode as a system prompt layered on existing models, with sycophancy ("flattery") risks — [Res Obscura](https://resobscura.substack.com/p/openais-new-study-mode-and-the-risks)
- [VENDOR] Anthropic introduced Claude Learning Mode (April 2025, Claude for Education), which uses guided questions rather than direct answers — [Glasp comparison](https://glasp.ai/articles/ai-study-modes-compared). [SECONDARY] One blog comparison judged Claude "holds the Socratic line hardest". This is not an independent study — [Glasp](https://glasp.ai/articles/ai-study-modes-compared)

**Meta-analyses and critiques**

- [PEER, RETRACTED] Wang & Fan (2025), _Humanities and Social Sciences Communications_: 51 studies (Nov 2022 to Feb 2025), learning performance **g = 0.867**, learning perception g = 0.456, higher-order thinking g = 0.457 — [Towards Data Science](https://towardsdatascience.com/what-the-most-detailed-peer-reviewed-study-on-ai-in-the-classroom-taught-us/)
- It was retracted over "discrepancies in the meta-analysis" that undermine the editor's confidence in its validity. Before retraction it had about 270 citations and 492,000 accesses. Ilkka Tuomi had flagged that there was no quality assessment and that 33 of the 51 studies had fewer than 35 students in the ChatGPT group. Ben Williamson called it "methodologically flawed, overhyped and misleading" — [GovTech](https://www.govtech.com/education/nature-retracts-oft-cited-paper-on-positive-impact-of-chatgpt); [Plagiarism Today](https://www.plagiarismtoday.com/2026/07/15/study-claiming-ai-helps-students-learn-retracted/)
- **Date conflict**: GovTech gives the retraction date as 22 April 2026, while other coverage dates it to July 2026 — [GovTech](https://www.govtech.com/education/nature-retracts-oft-cited-paper-on-positive-impact-of-chatgpt); [Startup Fortune](https://startupfortune.com/nature-just-retracted-the-most-cited-study-on-chatgpt-in-education-and-262-papers-built-on-its-conclusions-are-now-citing-discredited-evidence/)
- A general critique applies to the wider literature: instructional method is often not held constant between the ChatGPT and control conditions, so effects cannot be attributed to the medium — [search summary of critical review, Computers & Education 2026](https://learninglab.uni-due.de/sites/default/files/1-s2.0-S0360131526001405-main.pdf)

### Inferences

- **The engagement paradox**: Bastani shows that answer-giving harms learning. Khanmigo shows that when the tutor refuses to give answers, students often just stop using it. An opt-out Socratic mode (OpenAI's can be switched off) likely gets bypassed. Effective designs need either **human structure** (a teacher-facilitated setting as in Nigeria, a required sequence as in Kestin) or must sit inside required practice.
- Large pooled effect sizes from small, uncontrolled ChatGPT studies should not be used as evidence.

### Gaps

- No independent RCT of Claude Learning Mode, ChatGPT Study Mode or the LearnLM tutor on learning outcomes was found. I did not find the outcome of the OpenAI and Stanford SCALE study. I found no trustworthy post-retraction meta-analysis.

## Q6. AI feedback on writing: AWE meta-analyses, LLM scoring reliability, EFL feedback, "Your Brain on ChatGPT"

### Takeaway

Pre-LLM automated writing feedback has a **medium positive effect (g of about 0.55)**. LLM essay scoring agrees with humans inconsistently, and agreement is usually **lower than human-to-human for EFL essays**. The MIT EEG study is a small, non-peer-reviewed preprint that should be cited cautiously.

### Cited Findings

- [PEER] Fleckenstein, Liebenow & Meyer (2023), _Frontiers in AI_, multilevel meta-analysis: **g = 0.55** on writing performance (20 studies, k = 84, N = 2,828). Heterogeneity was significant, and no moderator comparison reached significance — [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10351274/). [SECONDARY] ASCD reports larger effects for multilingual learners, which I did not verify in the paper — [ASCD](https://ascd.org/el/articles/how-effective-is-ai-in-giving-writing-feedback)
- [PEER] A separate meta-analysis of computer-mediated corrective feedback found a medium effect of AWE on writing; I could not confirm its authors — [SAGE, J. Educ. Computing Research](https://journals.sagepub.com/doi/abs/10.1177/07356331211064066)
- [PEER] Tate, Steiss et al. (Computers & Education: AI, Dec 2024): newer ChatGPT holistic scores for secondary essays were not statistically different from human scores. "Substantial agreement" may be sufficient for **low-stakes formative** use — [DOAJ](https://doaj.org/article/b9740b2f8a7544f88e4e523afe5e7e0b)
- [PREPRINT] Shermis (2024): ChatGPT's QWK was close to human raters on some ASAP sets but inconsistent and often lower — [arXiv 2408.09540](https://arxiv.org/abs/2408.09540v1)
- [PEER] For EFL, ChatGPT-4o showed only **fair agreement** with human raters on 240 argumentative essays, with lower and inconsistent scores — [IUC record](https://avesis.iuc.edu.tr/yayin/a433340f-6e81-4eb6-ba9f-f334fca4e436/chatgpt-4o-as-an-automated-scoring-tool-for-writing-assessment-strengths-and-weaknesses). For IELTS Task 2 (50 B2 essays), humans scored significantly higher than ChatGPT (Uyar & Büyükahiska 2025) — [OMU record](https://acikerisim.omu.edu.tr/entities/publication/964e4a72-e632-4c21-bcdb-54ed186ae03b/full)
- [PREPRINT] Off-the-shelf GPT-3.5 and GPT-4 had lower QWK than fine-tuned BERT models on EFL datasets (ELLIPSE, EFL11), while fine-tuned GPT-3.5 did much better — [arXiv 2405.19433](https://arxiv.org/pdf/2405.19433)
- [PREPRINT] Kosmyna et al. (MIT Media Lab), "Your Brain on ChatGPT: Accumulation of Cognitive Debt…", arXiv June 2025. **54 participants** in sessions 1 to 3, about 18 per group (LLM, search engine, brain-only), and **only 18 completed session 4**. Participants came from a few nearby academic institutions, and only ChatGPT was tested — [MIT Media Lab](https://www.media.mit.edu/publications/your-brain-on-chatgpt/); [The Decoder](https://the-decoder.com/mit-study-shows-cognitive-debt-through-chatgpt-heres-what-it-means-in-real-world-practice/)
- Critiques of the MIT study: the sample is below typical EEG group sizes. A commentary by Stanković et al. raises concerns about reproducibility, EEG analysis methods and inconsistencies in reporting. Long-run "cognitive debt" claims are interpretive and not directly measured — [arXiv 2601.00856 commentary](https://arxiv.org/pdf/2601.00856v1); [C2ST breakdown](https://www.c2st.org/?p=20545)

### Inferences

- LLM feedback is reasonable for **formative** writing feedback. It should not be used for high-stakes scoring of EFL writers without human moderation and calibration.
- "Homogenised writing" and cognitive offloading concerns are plausible, but the evidence for them is weak (the MIT preprint, small N).

### Gaps

- **Zhai & Ma (2023) AWE meta-analysis** was not found in my searches, so I cannot report its effect size. I found no RCT directly comparing ChatGPT feedback with teacher feedback on EFL writing gains. I found no quantitative study of homogenisation of student writing.

## Q7. AI for speaking and mock interview practice (EFL anxiety and fluency)

### Takeaway

Evidence that AI conversation partners reduce EFL speaking anxiety is **consistently positive but weak**: small, mostly non-randomised, often self-reported. I found no strong RCT or true meta-analysis.

### Cited Findings

- [PEER] Susoy (2026, _Frontiers in Psychology_), mixed methods, **48 Turkish ELT students**. Speaking anxiety correlated with scores in human-facilitated speaking exams but **not** in AI-facilitated ones. **Achievement did not differ** between conditions (a null result on performance) — [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12832806/)
- [PEER] Ding & Yusof (2025, _Humanities & Social Sciences Communications_), mixed methods: AI conversation bots linked to reduced anxiety and a more positive experience — [IDEAS/RePEc](https://ideas.repec.org/a/pal/palcom/v12y2025i1d10.1057_s41599-025-05550-z.html)
- [PEER] Systematic review (24 articles, 2020 to 2025) reports reduced speaking anxiety with chatbot practice and notes little evidence on disadvantages. It is labelled a meta-analysis but is actually a SALSA systematic review — [DOAJ/JL3T](https://doaj.org/article/795a8beda7374b28a05752a4a3f74774); [ETERNAL review listing](https://diajeng.lldikti6.id/articles/18784)
- [PEER] Wang et al. (2024, _System_) compared conversational GenAI chatbots on willingness to communicate, speaking anxiety and self-perceived competence; I retrieved only the metadata, not the findings — [XJTLU record](https://scholar.xjtlu.edu.cn:443/en/publications/the-impact-of-different-conversational-generative-ai-chatbots-on-)

### Inferences

- AI speaking practice is low-risk as a **low-stakes rehearsal space** (anxiety reduction). Claims of fluency gains or interview outcomes are not well supported.

### Gaps

- I found no RCTs on AI mock interviews (job or admissions) and no measured fluency gains (e.g., speech rate) from rigorous designs.

## Q8. Bias against non-native writers (detectors and scoring)

### Takeaway

GPT detectors falsely flag non-native English writing as AI-generated at very high rates. Using detectors for academic integrity enforcement on EFL students is unsafe.

### Cited Findings

- [PEER] Liang, Yuksekgonul, Mao, Wu, Zou (2023), _Patterns_ (preprint arXiv 2304.02819). **7 detectors** on **91 TOEFL essays**: average false-positive rate **61.22%**. 18 of 91 (19.8%) were flagged by all seven and 89 of 91 (97.8%) by at least one. Essays by US 8th graders were classified almost perfectly. The likely cause is the lower perplexity of non-native text — [arXiv](https://arxiv.org/pdf/2304.02819); [THE](https://www.timeshighereducation.com/node/727071)
- [PREPRINT] A 2026 follow-up with Czech-language essays found results "differ significantly" from the original, so the bias may vary by language and detector generation — [arXiv 2602.05769](https://arxiv.org/pdf/2602.05769)

### Inferences

- Integrity policies should focus on process (drafts, oral defence, in-class writing) rather than detectors.

### Gaps

- I found no systematic study of LLM essay-scoring bias specifically by L1 or native status beyond lower agreement in EFL corpora (see Q6).

## Synthesis notes for the report writer (design principles, costs and risks; all drawn from the sources above)

- **Answer-giving harms, scaffolding protects**: Bastani (GPT Base −17% on the exam) vs GPT Tutor (no harm). Tutor CoPilot's benefit came with fewer answers given away ([arXiv](https://arxiv.org/abs/2410.03017)).
- **Ground the tutor in expert content**: Kestin's tutor used pre-written solutions and a structured problem sequence ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)). This reduces hallucination and was part of the only large positive student-facing effect.
- **Human oversight and structure**: positive results came from teacher-facilitated (Nigeria), tutor-mediated (CoPilot) or tightly structured course (Kestin) settings. Unstructured optional use (Khanmigo) gave small effects and low uptake ([FutureEd](https://www.future-ed.org/students-tried-khanmigos-ai-tutor-most-didnt-want-its-help/)).
- **The engagement problem**: Socratic refusal drives disengagement and workarounds. Opt-out study modes are vendor features without outcome evidence.
- **Equity**: Nigeria gains were larger for higher-baseline students. CoPilot helped most where tutors were weaker. Detectors penalise non-native writers.
- **Measurement**: practice performance is not learning. Use delayed, unassisted assessments. Be sceptical of small-N pooled meta-analyses (Wang & Fan was retracted).
