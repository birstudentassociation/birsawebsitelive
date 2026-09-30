# Thai review: student-life handbook, international summaries, tracks, onboarding, page copy

Commentary in British English, examples in Thai. Paths relative to /home/user/birsawebsitelive. Line numbers refer to the current files. Nothing in the repo was edited.

## 0. Headline findings

1. The handbook is a fairly literal rendering of the English (same paragraph order, same clause order). It is correct and readable but often reads as "translated official English", not as a Thai university handbook. Worst: about-bir.mdx (history and faculty), academic-life.mdx (rules), academic-activities.mdx. Best: internship.mdx and the admission tables.
2. Colons break the house rule in dozens of places (titles, labels such as "เวลาทำการ:", "อีเมล:", "ระยะเวลา:", list intros "เลือกเรียน 1 วิชาจาก:", onboarding titles). Full list in section 4. No em or en dashes and no spaced hyphens anywhere.
3. One office, three names. "สำนักงานวิเทศสัมพันธ์ ธรรมศาสตร์" (about-bir.mdx:68), "สำนักงานวิเทศสัมพันธ์ (Office of International Affairs)" (academic-activities.mdx:18, actually the faculty's OIA) and "กองกิจการต่างประเทศ" (all international pages, e.g. visa-and-immigration.mdx:12, 27). "กองกิจการต่างประเทศ" sounds like a ministry unit and is probably not what TU staff call it. Verify the official Thai name on oia.tu.ac.th and use one form throughout (I write "กองวิเทศสัมพันธ์" below as a placeholder), with the faculty unit named separately.
4. Immigration vocabulary is thin and partly wrong (section 3). Worst: "วีซ่าประเภทไม่ใช่ผู้อพยพ" (visa page :19) means, to a Thai reader, a visa for "not refugees/migrants". Thai pages never mention ตม.30 or ใบอนุญาตทำงาน; if the English twin does not either, that is a content gap because both are top buddy questions.
5. "มหาลัย" (missing ย, informal) at banking-and-money.mdx:21, healthcare-and-insurance.mdx:3 and :15, phones-and-internet.mdx:18 (and 8 more files under th/home, outside scope).
6. Contradictions visible when reading the Thai (they exist in the English too; flag to the content owner):
   - admission-and-fees.mdx:40 says the summer session is optional, curriculum-and-study-plan.mdx:294 says year 3 summer is "บังคับ" (internship). Suggest "ภาคฤดูร้อนเป็นภาคเสริม ยกเว้นภาคฤดูร้อนหลังชั้นปีที่ 3 ซึ่งเป็นการฝึกงานที่บังคับ".
   - about-bir.mdx:53, 57 give 02-613-2304 and bir@staff.tu.ac.th; internship.mdx:123, 125 give 02-221-6111 ต่อ 3409 and bir@tu.ac.th. Also "สำนักงานโครงการ BIR" (about-bir:43) versus "สำนักงานหลักสูตร BIR" (internship:120, 122).
   - academic-life.mdx:68-70 uses "ภาค 1/2021" (CE) on a Thai page; write "ภาค 1/2564".
   - academic-life.mdx:46 promises "ผลอย่างใดอย่างหนึ่งดังนี้" but lists only one outcome.
   - onboarding/international.ts:108 says SIM registration needs a Thai address or ID, phones-and-internet.mdx:13 says passport only.
   - curriculum-and-study-plan.mdx:46-53 labels gen-ed groups "กลุ่มสังคมวิทยา" and "กลุ่มมานุษยวิทยา", probably mistranslations of Social Sciences and Humanities (กลุ่มสังคมศาสตร์, กลุ่มมนุษยศาสตร์). Check the English twin.
7. Prettier line-break check: no mid-date or mid-phrase break found. All Thai paragraphs are single long lines; the only wrapped text is inside `<Notice>` blocks (academic-life.mdx:79-82; curriculum-and-study-plan.mdx:10-14, 18-19, 240-241, 270-271, 310-311; visa-and-immigration.mdx:10-12; banking-and-money.mdx:14). Every wrap falls on an existing space. Harmless, though the wrap at curriculum :18-19 ("ตามรุ่น / วิชาโทที่เลือก") is awkward to read in source.
8. Numerals are all Arabic (good). Years are พ.ศ. everywhere except academic-life.mdx:68-70 and document names in English parentheses ("Curriculum 2021", "Revision 2023", acceptable). Possible code issue, not checked: the "อัปเดตล่าสุด" date on Thai pages may render a CE year from frontmatter `updated: 2026-...`; confirm the formatter uses the Buddhist calendar for `th`.

## 1. Scores (naturalness 1 to 5)

| File                                       | Score | One-line reason                                                                  |
| ------------------------------------------ | ----- | -------------------------------------------------------------------------------- |
| handbook/about-bir.mdx                     | 2     | Literal, ซึ่ง chains, garbled 2554 sentence, colon labels                        |
| handbook/academic-activities.mdx           | 3     | Understandable, several calques (ในขณะที่, เป็นระยะเวลา, มีความร่วมมือ)          |
| handbook/academic-life.mdx                 | 3     | Right terms; passive ถูก, ได้รับการ, English clause order; missing leave outcome |
| handbook/admission-and-fees.mdx            | 3     | Correct, terse; "ต้องมี" x4; objectives read as translated                       |
| handbook/assessment-and-degree.mdx         | 4     | Lists natural; a few "จะถูกนำไปคำนวณ" and English glosses                        |
| handbook/curriculum-and-study-plan.mdx     | 3     | Data fine; prose ("กลุ่มวิชาในสาขา", คุณ, colour-and-underline Notices) clumsy   |
| handbook/internship.mdx                    | 4     | Best file; proper bureaucratic terms; small calques and colons                   |
| international/arrival-and-first-week.mdx   | 4     | Friendly, practical; one calque ("ไม่ว่าจะโดยใครก็ตาม")                          |
| international/banking-and-money.mdx        | 3     | Placeholder notice, มหาลัย, clipped "ธนาคารขอ"                                   |
| international/culture-and-language.mdx     | 4     | Natural; "ชี้แจง" too official                                                   |
| international/healthcare-and-insurance.mdx | 3     | กระตุ้น, เซฟ, เช็ก, มหาลัย mix registers                                         |
| international/phones-and-internet.mdx      | 3     | wifi, มหาลัย, run-on second sentence                                             |
| international/visa-and-immigration.mdx     | 2     | Wrong or unusual immigration terms; rewrite                                      |
| onboarding/international.ts (Th)           | 3     | Mostly good; "เริ่มตั้งตัว", "บันไดองค์กร", "ก่อนเป็นอันดับแรก"                  |
| onboarding/index.ts (Th)                   | 3     | คุณ, ถูกบันทึก, ถูกส่งมาหาเรา, colon title                                       |
| student-life/tracks.ts (Th)                | 3     | Handbook lede is translation-shaped and slightly wrong                           |
| app/[lang]/student-life/**/page.tsx (Th)   | 4     | Short and natural; nits only                                                     |

## 2. File by file

### 2.1 handbook/about-bir.mdx (2)

Rewrite from scratch: "เกี่ยวกับมหาวิทยาลัยธรรมศาสตร์" and "คณะรัฐศาสตร์" (:19-39). Thai readers know this history and official Thai texts exist (tu.ac.th, polsci.tu.ac.th). Per NEWS-STYLE 3.1 and 3.5, lift or closely paraphrase the Thai source rather than back-translating.

- :13 "การจัดสรรเวลาระหว่างการเรียน ชีวิตทางสังคม กีฬา และกิจกรรมอื่น ๆ เป็นความรับผิดชอบของนักศึกษาเอง กุญแจสู่ความสำเร็จคือ..." Nominal subject; "กุญแจสู่ความสำเร็จ" is a calque of "key to success". Rewrite: "นักศึกษาต้องแบ่งเวลาเองระหว่างเรียน เข้าสังคม เล่นกีฬา และทำกิจกรรมอื่น ๆ ถ้าแบ่งเวลาให้สมดุลระหว่างงานวิชาการกับกิจกรรมนอกหลักสูตรได้ ก็จะเรียนได้ราบรื่น"
- :15 "ได้เรียนกับอาจารย์ผู้ทรงคุณวุฒิ" stiff. "จะเรียนกับอาจารย์ที่มีประสบการณ์สูง และได้ฟังวิทยากรรับเชิญจากหลายวงการ". "การฝึกงานในต่างประเทศ" contradicts the internship chapter (students find their own placement); check the fact.
- :17 "ให้การสนับสนุน" is ทำการ-type padding. "เจ้าหน้าที่ของคณะคอยช่วยเหลือตลอดหลักสูตร แต่ผลการเรียนขึ้นอยู่กับความตั้งใจและความรับผิดชอบของนักศึกษาเอง"
- :21 "ชื่อเดิมของมหาวิทยาลัยซึ่งตั้งโดยศาสตราจารย์ ดร.ปรีดี พนมยงค์ คือ ..." passive plus two ซึ่ง; "มีความประสงค์จะ" is ราชาศัพท์-flavoured. Rewrite: "ศาสตราจารย์ ดร.ปรีดี พนมยงค์ ก่อตั้งมหาวิทยาลัยเมื่อวันที่ 27 มิถุนายน พ.ศ. 2477 โดยใช้ชื่อว่า "มหาวิทยาลัยวิชาธรรมศาสตร์และการเมือง" ท่านต้องการให้ประชาชนได้เรียนรู้แนวคิดประชาธิปไตย ซึ่งเพิ่งเข้ามาในประเทศไทยเมื่อสองปีก่อนหน้านั้น" (check against the university's own text).
- :25 the quotation reads like a retranslation ("ผู้สมัครแสวงหาความรู้" is odd). Use the original wording of the 1934 speech.
- :27 "ส่งผลกระทบอย่างมากต่อมหาวิทยาลัย ไม่นานหลังจากนั้น ชื่อ...ได้เปลี่ยน... ระบบมหาวิทยาลัยเปิดถูกยกเลิก และมีการเปิดหลักสูตร..." passive ถูก for a neutral event, "มีการเปิด", "ได้ ... ได้แก่". Rewrite: "หลังการรัฐประหารเมื่อวันที่ 8 พฤศจิกายน พ.ศ. 2490 มหาวิทยาลัยเปลี่ยนชื่อเป็นมหาวิทยาลัยธรรมศาสตร์ (Thammasat University หรือ TU) ยกเลิกระบบตลาดวิชา และเปิดสอนปริญญา 4 สาขา คือ นิติศาสตร์ รัฐศาสตร์ เศรษฐศาสตร์ และพาณิชยศาสตร์และการบัญชี ต่อมา พระราชบัญญัติมหาวิทยาลัยธรรมศาสตร์ พ.ศ. 2495 กำหนดให้แต่ละคณะมอบปริญญาของตนเอง" ("ตลาดวิชา" is the standard Thai term; "ระบบมหาวิทยาลัยเปิด" is literal. "แต่ละหลักสูตร" should probably be คณะ.)
- :29 worst sentence: "ในปี พ.ศ. 2554 เป้าหมายของธรรมศาสตร์ในการนำพานักศึกษาสู่มาตรฐานจริยธรรมและการบำเพ็ญประโยชน์ต่อชุมชนสูงสุดยังคงเป็นจริงเสมอมา เมื่อชาวธรรมศาสตร์ร่วมแรงร่วมใจ..." nearly unparseable, and the 2011 flood is never named. Rewrite: "ธรรมศาสตร์ยังคงมีบทบาทสำคัญต่อประชาธิปไตยและการเมืองไทยเรื่อยมา เมื่อเกิดอุทกภัยใหญ่ในปี พ.ศ. 2554 ชาวธรรมศาสตร์ร่วมแรงร่วมใจช่วยเหลือสังคม สมกับคำขวัญที่ว่า "ฉันรักธรรมศาสตร์ เพราะธรรมศาสตร์สอนให้ฉันรักประชาชน"" (confirm the English says flood).
- :33 "มีธรรมเนียมอันเข้มแข็งด้านการรับใช้สาธารณะ" calque. "มีประเพณีการรับใช้สังคมที่เข้มแข็ง". "เปิดสอน...ครบทุกสาขา ใน 3 สาขาวิชาเอก" the "ใน" is stranded; "เปิดสอนทั้งระดับปริญญาตรีและบัณฑิตศึกษา ใน 3 สาขา ได้แก่ ...".
- :35, :37 "นอกจากนี้" in consecutive paragraphs; delete one. :35 "นักศึกษาปกติแบบเต็มเวลา และสำหรับผู้บริหารแบบไม่เต็มเวลา ... ซึ่งก่อตั้งขึ้น" rewrite: "ระดับบัณฑิตศึกษามีทั้งภาคปกติ (เต็มเวลา) และหลักสูตรสำหรับผู้บริหาร (นอกเวลา) และเปิดหลักสูตรปริญญาเอกตั้งแต่ปี พ.ศ. 2544".
- :39 "ตระหนักรู้ กระตือรือร้น" are calques of "informed, active". "พลเมืองที่รู้เท่าทัน มีส่วนร่วม และรับผิดชอบ"; better, use the faculty's official Thai mission text.
- :43 two ซึ่ง and "โดยแยกต่างหากจาก". Rewrite: "สำนักงานโครงการ BIR เป็นหน่วยงานของคณะ ดูแลการรับสมัคร งานทะเบียนวิชาการ และเอกสารทางการ ไม่ใช่ BIRSA ซึ่งเป็นสโมสรนักศึกษาผู้จัดทำเว็บไซต์นี้"
- :47-59 colons and bold labels. "เวลาทำการ: วันจันทร์ถึงวันศุกร์ เวลา 09:00 ถึง 16:00 น." Rewrite: "สำนักงานเปิดทำการวันจันทร์ถึงวันศุกร์ เวลา 09.00 ถึง 16.00 น." (NEWS-STYLE 3.6 uses a full stop, "12.30 น."; the file mixes both). "โทรศัพท์: (66) 02-613-2304" wrong for a domestic reader; "โทรศัพท์ 02-613-2304". "โทรสาร" is correct.
- :51 the address is entirely English on a Thai page. Add the Thai form: "โครงการ BIR คณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ 2 ถนนพระจันทร์ แขวงพระบรมมหาราชวัง เขตพระนคร กรุงเทพมหานคร 10200".
- :61-68 table: "หอสมุดแห่งมหาวิทยาลัยธรรมศาสตร์" is the real name (good); "สำนักงานวิเทศสัมพันธ์ ธรรมศาสตร์" verify (0.3).

### 2.2 handbook/academic-activities.mdx (3)

- :11 "มีความร่วมมือกับ... ซึ่งนักศึกษา BIR สามารถเดินทางไปแลกเปลี่ยนได้เป็นระยะเวลาหนึ่งภาคการศึกษาหรือหนึ่งปีการศึกษาเต็ม" มีความ+noun, ซึ่ง, "เป็นระยะเวลา". Rewrite: "ธรรมศาสตร์ร่วมมือกับมหาวิทยาลัยชั้นนำหลายแห่งในสหรัฐอเมริกา ยุโรป เอเชีย และออสเตรเลีย นักศึกษา BIR ไปแลกเปลี่ยนได้ 1 ภาคการศึกษาหรือ 1 ปีการศึกษา"
- :13 "(ในขณะที่โครงการข้างต้นเปิดให้นักศึกษาธรรมศาสตร์ทุกคณะสมัครได้)" "ในขณะที่" is a calque of "while". "ส่วนโครงการข้างต้นเปิดให้นักศึกษาทุกคณะของธรรมศาสตร์สมัคร". "ทางหลักสูตรกำลังเพิ่มมหาวิทยาลัยคู่สัญญาใหม่ ๆ ... ตรวจสอบรายชื่อ...กับเว็บไซต์ BIR และเจ้าหน้าที่ BIR" (you check a list on a website, not "with" it; BIR twice). "หลักสูตรเพิ่มมหาวิทยาลัยคู่สัญญาอยู่เสมอ จึงควรดูรายชื่อล่าสุดจากเว็บไซต์ BIR หรือสอบถามเจ้าหน้าที่เป็นระยะ" Country phrases: "LMU Munich (เยอรมนี) Halmstad University (สวีเดน) และ Nottingham Trent University (อังกฤษ)".
- :18-22 colons "เว็บไซต์:", "อีเมล:". "(Ms Suphorn Mukphimphan)" Romanised name in Thai text; give the Thai name if known.
- :28 "ซึ่งจัดขึ้นเป็นครั้งคราวไม่แน่นอน" -> "ที่จัดไม่ประจำ"; "ผู้มีประสบการณ์" is padding. "...ที่นักศึกษาจะได้พูดคุยกับนักการทูตโดยตรง".
- :32 "เพื่อให้ได้สัมผัสโลกแห่งความเป็นจริง ... สร้างเครือข่ายความสัมพันธ์กับผู้คนใหม่ ๆ" tautological calque. "BIR พานักศึกษาชั้นปีที่ 3 ไปทัศนศึกษาทุกปี เพื่อเรียนรู้จากสถานที่จริงและสร้างเครือข่าย โดยเยี่ยมชมหน่วยงาน พบปะผู้คน และศึกษาความสัมพันธ์ระหว่างประเทศและการพัฒนา โดยเฉพาะในเอเชียตะวันออกเฉียงใต้"
- :34 "จุดหมายปลายทางที่ผ่านมา" -> "ปลายทางในปีที่ผ่านมา". :38 "ได้ร่วมสำรวจแนวคิดและมุมมองทางวิชาการต่าง ๆ ในระดับโลก" -> "ได้แลกเปลี่ยนแนวคิดและมุมมองทางวิชาการระดับนานาชาติ". :40 colon "เฟซบุ๊ก:".

### 2.3 handbook/academic-life.mdx (3)

Terms are largely right (ลงทะเบียนเรียน, หน่วยกิต, ลาพักการศึกษา, พ้นสภาพนักศึกษา, รอพินิจ, ค่าธรรมเนียมรักษาสถานภาพนักศึกษา). Problems are structure and passive voice.

- :2 title "ชีวิตการเรียน: ระเบียบและขั้นตอน" colon. "ระเบียบและขั้นตอนด้านการเรียน".
- :9 "อยู่ภายใต้ระเบียบและข้อบังคับหลายฉบับ สำหรับข้อกำหนดที่เป็นทางการ นักศึกษาควรอ้างอิง..." ("อยู่ภายใต้" is a calque). "การศึกษาระดับปริญญาตรีเป็นไปตามระเบียบและข้อบังคับหลายฉบับ หากต้องการข้อความฉบับทางการ ให้ดูข้อบังคับมหาวิทยาลัยธรรมศาสตร์ว่าด้วยการศึกษาระดับปริญญาตรี ซึ่งเผยแพร่ที่เว็บไซต์สำนักงานทะเบียนนักศึกษา"
- :13 "นักศึกษาจะทราบรายวิชา...ผ่านประกาศ" -> "BIR ประกาศรายวิชาที่เปิดสอนในแต่ละปีที่เว็บไซต์และเฟซบุ๊กของโครงการ เมื่อเลือกวิชาได้แล้ว ต้องลงทะเบียนภายในช่วงที่ประกาศ". "facebook/birprogram" is a raw handle; link it. :15 repeats :13 and :17; merge.
- :17 overlong paragraph mixing procedure and limits; "เรื่องทั้งหมดที่เกี่ยวกับการลงทะเบียนเรียน รวมถึงการเพิ่มและถอนรายวิชา ดำเนินการผ่าน..." Rewrite: "นักศึกษาลงทะเบียนเรียน เพิ่มรายวิชา และถอนรายวิชาผ่านระบบของสำนักงานทะเบียนนักศึกษา (www.reg.tu.ac.th) โดยเข้าสู่ระบบแล้วเลือกเมนู "Enroll"" then a separate sentence: "นักศึกษาภาคปกติต้องลงทะเบียนไม่น้อยกว่า 9 และไม่เกิน 21 หน่วยกิตในแต่ละภาคการศึกษาปกติ และไม่เกิน 6 หน่วยกิตในภาคฤดูร้อน ตามข้อ 10.4 ของข้อบังคับ ... ฉบับที่ 3 (พ.ศ. 2555)" Drop "(full-time)". Note admission-and-fees:26 cites the same regulation as "พ.ศ. 2540"; say "พ.ศ. 2540 และที่แก้ไขเพิ่มเติม" once.
- :21 "ด้วยความเห็นชอบของ... นักศึกษาสามารถลงทะเบียนเพิ่มรายวิชาได้ไม่เกินช่วงเวลาเพิ่ม-ถอนรายวิชา" calque. "นักศึกษาเพิ่มรายวิชาได้ภายใน 14 วันแรกของภาคการศึกษาปกติ หรือ 7 วันแรกของภาคฤดูร้อน โดยต้องได้รับความเห็นชอบจากอาจารย์ที่ปรึกษาหรืออาจารย์ผู้สอน หลังพ้นกำหนดนี้จะเพิ่มได้เฉพาะบางกรณีและต้องได้รับความเห็นชอบจากคณบดี" ("เพิ่ม-ถอน" is a compound with a hyphen and is on the NEWS-STYLE 3.5 keep list; fine.)
- :25 "ตราบใดที่...ไม่ต่ำกว่า" calque of "as long as". "ถอนได้ แต่หน่วยกิตที่ลงทะเบียนรวมต้องไม่ต่ำกว่า 9 หน่วยกิต เว้นแต่คณบดีเห็นชอบ".
- :29 "จะถูกบันทึกด้วยตัวอักษร "W"" -> "ระบบจะบันทึกอักษร W (Withdrawn) ไว้ในระเบียนผลการเรียน" ("บันทึกอักษร W" is a keep-term).
- :37 three "ได้รับการ" in one paragraph. "ถ้าอนุมัติ นักศึกษาอาจถอนวิชานั้นและได้อักษร W หรืออาจารย์ผู้สอนจะประเมินผลตามดุลยพินิจ ถ้าไม่อนุมัติ อาจารย์จะประเมินจากผลงานที่ส่งแล้ว"
- :39-54 leave section muddled. :46 "การลาพักการศึกษาจะมีผลอย่างใดอย่างหนึ่งดังนี้ หากยื่นภายใน 14 วันแรก..." promises alternatives and gives one; the after-14-days outcome is missing (content fix needed). Rewrite the visible part: "ถ้ายื่นลาพักภายใน 14 วันแรกของภาคการศึกษาปกติ ระเบียนผลการเรียนจะบันทึกภาคการศึกษานั้นว่า LEAVE และนักศึกษาต้องชำระค่าธรรมเนียมรักษาสถานภาพนักศึกษา"
  :50 "ถูกให้พักการศึกษา" is English passive. Use "ถูกสั่งพักการศึกษา" or "ได้รับโทษพักการศึกษา"; heading :39 "การลาพักและการพักการศึกษา" (disciplinary suspension is "พักการศึกษา", voluntary is "ลาพักการศึกษา").
  :53 the 7-year maximum rule is misplaced inside a bullet list about suspension fees; move it out.
  :54 "จะถูกลบออกจากระเบียน" -> "ระบบจะลบรายวิชาที่ลงทะเบียนไว้ทั้งหมดออกจากระเบียนผลการเรียน".
- :58-62 "เกรดเฉลี่ยสะสม" is the everyday form; TU regulations say "แต้มระดับคะแนนเฉลี่ยสะสม" (GPAX). For students and parents use "เกรดเฉลี่ยสะสม (GPAX)" at first mention and keep to it; explain once that "เกรดเฉลี่ย" is the semester figure. Capital English statuses inside Thai sentences (WARNING, PROBATION, DISMISSED): keep in parentheses once and use "การเตือน", "รอพินิจ", "พ้นสภาพนักศึกษา" thereafter.
  :62 "เกรดของภาคฤดูร้อนจะนับรวม...จึงไม่ส่งผล..." the "จึง" makes the logic read backwards. "เกรดภาคฤดูร้อนนับรวมกับภาคการศึกษาที่ 2 จึงไม่ทำให้สถานภาพของภาคก่อนหน้าเปลี่ยน" (verify against the English).
  :68-70 use พ.ศ.: "ภาค 1/2564", "ภาค 2/2564", "ภาคฤดูร้อน 2564". Last row "WARNING 1 ไม่ใช่ WARNING 2" -> "ยังเป็นการเตือนครั้งที่ 1 ไม่ใช่ครั้งที่ 2".
  :74 "จะได้รับการเตือน (WARNING) ซึ่งเทียบเท่ากับ WARNING 1" -> "ถือเป็นการเตือนครั้งที่ 1".
- :78-82 Notice title "การเตือนสองครั้งติดต่อกันอาจนำไปสู่การพ้นสภาพนักศึกษา" nominal. "ถูกเตือนสองภาคการศึกษาติดกัน อาจพ้นสภาพนักศึกษา". Body: "ถ้าถูกเตือนสองภาคการศึกษาติดต่อกัน นักศึกษาจะอยู่ในสถานะรอพินิจ และถ้ารอพินิจครบ 1 ภาคการศึกษาแล้วเกรดเฉลี่ยสะสมยังต่ำกว่า 2.00 จะพ้นสภาพนักศึกษา ควรปรึกษาอาจารย์ที่ปรึกษาทันทีที่ได้รับคำเตือน เพื่อให้มีเวลาทั้งภาคการศึกษาในการทำเกรดให้ดีขึ้น"
- :87 "การคัดลอกผลงานผู้อื่น" repeated seven times, heavy. Standard Thai is "การลอกเลียนวรรณกรรม"/"การลอกเลียนผลงาน"; define once, then "การลอกเลียน". "ไม่ให้เครดิต" is slangy in a handbook: "ไม่อ้างอิงเจ้าของผลงาน". "จะได้รับบทลงโทษตามดุลยพินิจของ..." -> "อาจารย์ผู้สอนจะพิจารณาลงโทษตามดุลยพินิจ กรณีร้ายแรงอาจได้เกรด F ในวิชานั้น" ("สอบตก" is colloquial).
- :89 "ตัวอย่างการกระทำที่ถือเป็น... (ไม่จำกัดเพียงรายการต่อไปนี้) ได้แก่" -> "การกระทำต่อไปนี้ถือเป็นการลอกเลียนผลงาน (และอาจมีมากกว่านี้)". :92 "ลอกงานเพื่อนร่วมชั้น แม้เจ้าของงานยินยอม".
- :97 "รวมถึงแต่ไม่จำกัดเพียงระบบดั้งเดิมและระบบ Harvard" literal "including but not limited to". "ใช้ระบบอ้างอิงที่เป็นที่ยอมรับระบบใดก็ได้ เช่น ระบบเชิงอรรถหรือระบบ Harvard แต่ต้องใช้ให้ถูกต้องและสม่ำเสมอทั้งชิ้นงาน" (check what "traditional" means in the English).

### 2.4 handbook/admission-and-fees.mdx (3)

- :2 "การรับเข้า" is the office's view; students look for "การสมัคร". "การสมัคร โครงสร้างหลักสูตร และค่าเล่าเรียน".
- :11 "ที่มีคุณภาพสูงในระดับมาตรฐานสากล" -> "หลักสูตรเปิดสอนตั้งแต่ปี พ.ศ. 2551 เพื่อจัดการศึกษาคุณภาพสูงตามมาตรฐานสากล"
- :13 "เล็งเห็นความสำคัญ ... ให้ความสำคัญ" twice, three "เชิง". "คณะรัฐศาสตร์เห็นว่าควรมีหลักสูตรภาษาอังกฤษด้านการเมืองและความสัมพันธ์ระหว่างประเทศ จึงจัดการเรียนที่ผสมทฤษฎีกับกรณีศึกษา ประเด็นร่วมสมัย และทักษะปฏิบัติ พร้อมครอบคลุมประเด็นทางวิชาการที่หลากหลายซึ่งสาขานี้ต้องใช้"
- :17-20 objectives acceptable as official-objective register. "ที่ตอบสนองต่อตลาดแรงงาน" calque of "responsive to"; "ที่ตรงกับความต้องการของตลาดแรงงาน".
- :24-26 "ต้องมี" repeated four times. Lead "ผู้สมัครต้อง" then bullets "มีคุณสมบัติตามข้อ 7 ของ...", "มีเกรดเฉลี่ยรวมอย่างน้อย 2.80 จากผลการเรียน 4 ภาคการศึกษาล่าสุดก่อนยื่นใบสมัคร", "มีผลสอบภาษาอังกฤษอย่างใดอย่างหนึ่งตามตาราง ไม่ต่ำกว่าเกณฑ์". "ผลสอบวัดระดับความสามารถทางภาษาอังกฤษ" -> "ผลสอบวัดระดับภาษาอังกฤษ".
- :40 "ภาคเรียน" and "ภาคการศึกษา" for one concept; use ภาคการศึกษา. "หลักสูตรเรียนเต็มเวลา ปีละ 2 ภาคการศึกษา ส่วนภาคฤดูร้อนเป็นภาคเสริม ใช้เวลา 6 ถึง 8 สัปดาห์ โดยมีชั่วโมงเรียนเท่ากับภาคปกติ" (see contradiction 0.6).
- :48-50 colons "ชื่อเต็มของปริญญา:", "ชื่อย่อ:". The Thai abbreviation is missing; TU abbreviation is "ร.บ." Verify. "ปริญญาที่ได้รับคือรัฐศาสตรบัณฑิต (การเมืองและความสัมพันธ์ระหว่างประเทศ) ชื่อย่อ ร.บ. (การเมืองและความสัมพันธ์ระหว่างประเทศ) ภาษาอังกฤษ Bachelor of Political Science (Politics and International Relations) ย่อว่า B.Pol.Sc."
- :52 "ดำเนินการเป็นภาษาอังกฤษทั้งหมด" -> "ทุกรายวิชาใช้ภาษาอังกฤษทั้งหมด ทั้งการบรรยาย งานอ่าน การสอบ และการร่วมอภิปรายในชั้นเรียน" (check whether gen-ed courses are in Thai).
- :56-59 lead-in has no verb plus colons. "ค่าเล่าเรียนและค่าธรรมเนียมโดยประมาณต่อปีการศึกษา นักศึกษาไทย 125,000 บาท นักศึกษาต่างชาติ 144,000 บาท"
- :63-71 "ค่าขึ้นทะเบียนนักศึกษา" is TU's wording, good. "ค่าธรรมเนียมหลักสูตร" may be TU's "ค่าบำรุงการศึกษา"; check the fee announcement. Column "เงื่อนไขการเก็บ" is a calque; "วิธีเรียกเก็บ".

### 2.5 handbook/assessment-and-degree.mdx (4)

- :11 "นักศึกษาจะได้รับการวัดผลตามระบบแต้มเกรด (Grade Point)" -> "ธรรมศาสตร์วัดผลการเรียนด้วยระบบแต้มระดับคะแนน ดังนี้"
- :24 "โดยเป็นการผสมผสานระหว่าง..." calque. "แต่ละวิชาตัดเกรดต่างกัน โดยรวมคะแนนสอบกลางภาค สอบปลายภาค รายงาน การนำเสนอ และการมีส่วนร่วมในชั้นเรียน" "อย่างน้อย 80% ของเวลาเรียนทั้งหมดจึงจะผ่านวิชานั้นได้" -> "อย่างน้อยร้อยละ 80 ของเวลาเรียน จึงจะผ่านวิชานั้น". "course syllabus" is usually "แนวการสอน" or "มคอ.3" at TU; verify.
- :26 "จะถูกนำไปคำนวณ ... จะไม่ถูกนำไปคำนวณ" passive twice. "ทุกเกรดนับรวมในเกรดเฉลี่ยสะสม (GPAX) ยกเว้นวิชาที่ให้ผล S (ผ่าน) หรือ U (ไม่ผ่าน) ซึ่งไม่นำมาคำนวณ"
- :35 "ยื่นคำร้องขอเสนอชื่อรับปริญญา" vs NEWS-STYLE 3.5 keep-term "แจ้งขอสำเร็จการศึกษา"; use the latter if that is TU's actual step. :34 "ลงทะเบียนเรียนในหลักสูตรมาแล้ว" -> "มีสถานภาพเป็นนักศึกษามาแล้ว".
- :39-65 "จะมอบให้แก่นักศึกษาที่" lists; "เกียรตินิยม" correct. The two second-class criteria repeat six lines verbatim; consider a table. :44 (and :55, :64) "ไม่เคยลงทะเบียนเรียนซ้ำวิชาใดหรือได้เกรด F" is ambiguous; "ไม่เคยลงทะเบียนเรียนซ้ำ และไม่เคยได้เกรด F". :53 "เคยได้เกรดต่ำกว่า C ในหนึ่งวิชา" reads as "has had", the rule is "at most one"; "ได้เกรดต่ำกว่า C ไม่เกิน 1 วิชา".

### 2.6 handbook/curriculum-and-study-plan.mdx (3)

Data lists are fine; course names correctly stay in English.

- :3 summary repeats "ปรับปรุง" twice; drop one: "โครงสร้างรายวิชาของหลักสูตร BIR (หลักสูตรปรับปรุง พ.ศ. 2564 ฉบับปรับปรุง พ.ศ. 2566) และแผนการศึกษาแนะนำ 4 ปี".
- :10-14 "แตกต่างกันไปขึ้นอยู่กับ" stacked. "วิชาศึกษาทั่วไปและลำดับการเรียนของแต่ละคนอาจต่างกัน ขึ้นอยู่กับผลสอบยกเว้นภาษาอังกฤษ (English exemption) และรายวิชาที่เปิดในแต่ละภาคการศึกษา"
- :17-18 Notice title "วางแผนการเรียนของคุณเอง" and "สำหรับคุณโดยเฉพาะ": two คุณ and calque "your own". "วางแผนการเรียนเฉพาะรุ่นของตัวเอง"; "หากต้องการแผนการเรียนที่ตรงกับรุ่น วิชาโทที่เลือก และวิชาที่เรียนผ่านแล้ว ให้ใช้[บริการวางแผนการเรียน](/services/study-plan)"
- :46-53 group labels probably wrong (0.6).
- :71, :235 colon: "เลือกเรียน 1 วิชา ระหว่าง AH208 Exercise for Good Health and Well-Being กับ EL295 Academic English and Study Skill 1".
- :75 "วิชาบังคับ 1 วิชาของคณะเศรษฐศาสตร์ และวิชาโทตามที่กล่าวถึงในหัวข้อถัดไป" -> "ซึ่งอธิบายในหัวข้อถัดไป".
- "กลุ่มวิชาในสาขา" (:75, 90, 104, 262, 282, 290, 291, 305, 306) is a literal "in-major course group" and clumsy. Use "วิชาเอก": headings "วิชาเอกบังคับ (19 หน่วยกิต)", "วิชาเอกเลือก (18 หน่วยกิต)"; rows "วิชาเอกเลือก กลุ่มแนวทางและประเด็นศึกษา วิชาที่ 1". Also headings :77, 90, 100, 104 carry "2.1 ... 2.4" numbering that no other heading has; number all or none.
- :106, :121 "**กลุ่มพื้นที่ศึกษา (Area Studies Group)**: เลือกเรียน 3 วิชา" colon after bold label -> "กลุ่มพื้นที่ศึกษา (Area Studies) เลือกเรียน 3 วิชา (9 หน่วยกิต) จาก".
- :139 dense; a small table (กลุ่มโท / บังคับ 9 / เลือกภายในกลุ่ม 6 / เลือกจากกลุ่มอื่น 6) would read better. Add one sentence that "วิชาโท" here means a track inside the programme, not a minor from another faculty.
- :141, :165, :187 English-only headings; add Thai names only if the faculty publishes them.
- :217 "รายวิชาที่ในเอกสารต้นฉบับระบุว่าเป็น "วิชาที่มีสีและขีดเส้นใต้" (coloured and underlined courses) สามารถเปลี่ยนแปลง...ขึ้นอยู่กับการตัดสินใจและการวางแผนของ..." a web reader cannot see the colours, and the same Notice is repeated at :269-272 and :309-312. Say it once: "บางรายวิชาในแผนสลับภาคการศึกษาได้ตามที่นักศึกษาวางแผน (ต้นฉบับใช้สีและขีดเส้นใต้ทำเครื่องหมายไว้)" or mark them in the lists.
- :264 "ภาคฤดูร้อน (ไม่บังคับ)" vs :294 "(บังคับ)" is fine internally, but contradicts admission :40.
- :298 "เปิดยื่น" -> "เริ่มรับแบบฟอร์มขอฝึกงานภาคฤดูร้อนตั้งแต่เดือนพฤศจิกายนของปีก่อนหน้า".
- :314 "การจัดแผนภาคการศึกษาสุดท้าย" nominal. "เอกสารฉบับนี้ไม่ได้ระบุรายวิชาของภาคการศึกษาที่ 2 ปีที่ 4 ควรสอบถามสำนักงานทะเบียนนักศึกษาหรืออาจารย์ที่ปรึกษาว่าต้องเรียนอะไรในภาคสุดท้าย"
- Structure: bold pseudo-headings ("**ภาคการศึกษาที่ 1**") should be h4 for the TOC.

### 2.7 handbook/internship.mdx (4)

- :11 "เปิดโอกาสให้นักศึกษาได้รับประสบการณ์... อีกทั้งยังช่วยให้นักศึกษาได้นำ..." chain. "การฝึกงานภาคฤดูร้อนให้นักศึกษาได้ทำงานจริงกับองค์กรที่เกี่ยวข้องกับสาขาที่เรียน และนำความรู้เชิงทฤษฎีไปใช้ในทางปฏิบัติ"
- :13 "ภายใต้รายวิชา" calque. "นับเป็น 1 หน่วยกิตของรายวิชา PI574 Internship in Politics and International Relations".
- :17-18 "ระยะเวลา: 8 สัปดาห์" colon -> "ฝึกงานในภาคฤดูร้อนของชั้นปีที่ 3 นาน 8 สัปดาห์ (มิถุนายน ถึง กรกฎาคม)".
- :24-30 procedure is natural; "หนังสือขอความอนุเคราะห์" and "หนังสือตอบรับ" are correct bureaucratic terms.
- :33-37 Notice good ("เว้นแต่มีเหตุผลอันสมควร"). :35 "และการฝึกงานครั้งนั้นจะไม่ได้รับหน่วยกิต" -> "การฝึกงานครั้งนั้นจะไม่นับหน่วยกิตและไม่มีการประเมินผล".
- :41 header "ช่วงเวลายื่น" -> "กำหนดยื่น". :46 "ยื่นออนไลน์:" colon.
- :57 "Happy Hour: Internship" colon in an event name; "Happy Hour ฝึกงาน" avoids it.
- :60 "ส่งแบบประเมินครั้งที่ 1 (focus group หรือ Zoom โดยผู้ควบคุมการฝึกงาน)" ambiguous on who does what. Clarify (BIR runs the focus group or Zoom; the supervisor submits the form?).
- :65 "อาจมีการเปลี่ยนแปลง" -> "อาจเปลี่ยนแปลง".
- :95-96 "ขนาด 12" -> "ขนาด 12 พอยต์". :114-116 three colons, restructure as "แบบประเมินครั้งที่ 1 ([PDF](...) หรือ [แบบฟอร์มออนไลน์](...))" or a table.
- :120 "สำนักงานหลักสูตร BIR" vs "สำนักงานโครงการ BIR" (about-bir:43). :127 "เว็บไซต์:" colon while :125 has none.

### 2.8 international/arrival-and-first-week.mdx (4)

- :3 and :9 duplicate each other; keep one. "เพื่อนบัดดี้" is redundant (บัดดี้ already means friend); pick "บัดดี้" or "เพื่อนไทยที่เป็นบัดดี้" site-wide.
- :13 five การ-nouns in a row. "สัปดาห์แรกมีเรื่องต้องทำหลายอย่าง เช่น เดินทางจากสนามบินมาท่าพระจันทร์ หาที่พัก ซื้อซิมการ์ด รายงานตัวกับกองวิเทศสัมพันธ์ของธรรมศาสตร์ และเปิดบัญชีธนาคาร"
- :23 "การรายงานตัวทุก 90 วัน ซึ่งกองกิจการต่างประเทศดูแลโดยตรง" unclear who does what: the 90-day report is made to immigration by the student (or via a university group service). Rewrite: "นักศึกษาต่างชาติต้องคอยดูกำหนดสำคัญเกี่ยวกับวีซ่า เช่น การรายงานตัว 90 วัน หากมีคำถามเรื่องวีซ่า ให้ถามกองวิเทศสัมพันธ์" (verify the fact).
- :25 "ถ้าเพื่อนต่างชาติเจอ... ไม่ว่าจะโดยใครก็ตาม ช่วยแนะนำช่องทางแจ้งเรื่องได้ที่..." "โดยใครก็ตาม" is a calque, "เจอ" clashes with "ถูกล่วงละเมิด", and the ending dangles. "หากเพื่อนต่างชาติรู้สึกไม่ปลอดภัย ไม่สบายใจ หรือถูกล่วงละเมิด ไม่ว่าจากใคร ให้แนะนำเขาแจ้งเรื่องตามช่องทางในหน้า [ความปลอดภัยและเหตุฉุกเฉิน](...)"

### 2.9 international/banking-and-money.mdx (3)

- :13-15 placeholder Notice "เนื้อหานี้เป็นเพียงตัวอย่าง โดย BIRSA จะตรวจสอบข้อมูลอีกครั้งก่อนเผยแพร่จริง" contradicts the page being live. "ข้อมูลในหน้านี้ยังไม่ผ่านการตรวจสอบ ควรยืนยันกับธนาคารก่อนไปติดต่อ"
- :17 "โดยทั่วไปธนาคารขอ" clipped. "คำถามที่พบบ่อยคือธนาคารไหนเปิดบัญชีให้นักศึกษาต่างชาติได้ และต้องใช้เอกสารอะไรบ้าง โดยทั่วไปธนาคารจะขอดูเอกสารต่อไปนี้"
- :20 "หน้าวีซ่าประเภท Non-Immigrant ED" -> "หน้าวีซ่านักเรียน (Non-Immigrant ED)". :21 "มหาลัย" typo; "หนังสือรับรองการเป็นนักศึกษาจากมหาวิทยาลัยหรือคณะ". :22 "หลักฐานที่อยู่ในไทย" -> "หลักฐานที่พักอาศัยในไทย" (mention ตม.30 or a lease if banks ask).
- :26-28 natural and useful.

### 2.10 international/culture-and-language.mdx (4)

- :9 hard-to-parse clause "รวมทั้งตารางคำศัพท์พื้นฐานพร้อมคำอ่าน อยู่ใน..." -> "เนื้อหาเต็มสำหรับนักศึกษาต่างชาติ ซึ่งมีตารางคำศัพท์พื้นฐานพร้อมคำอ่านด้วย อยู่ในเวอร์ชันภาษาอังกฤษ".
- :13 natural. :15 "วันมาฆบูชา วิสาขบูชา อาสาฬหบูชา" needs "และ": "วันมาฆบูชา วิสาขบูชา และอาสาฬหบูชา". "เวลาเปิด-ปิด" hyphen is a compound, allowed.
- :21 "ชี้แจง" is announcement register; buddy tone "บอกอย่างเป็นมิตรเมื่อเพื่อนพลาดเรื่องมารยาทโดยไม่ตั้งใจ".

### 2.11 international/healthcare-and-insurance.mdx (3)

- :3 and :15 "มหาลัย" typo.
- :13 "อยู่ตรงข้ามแม่น้ำจากท่าพระจันทร์" English word order. "โรงพยาบาลศิริราชอยู่อีกฝั่งของแม่น้ำเจ้าพระยา นั่งเรือข้ามฟากจากท่าพระจันทร์ไม่กี่นาทีก็ถึง จึงเป็นที่แรกที่มักแนะนำให้เพื่อนต่างชาติไปเมื่อไม่สบาย" (Verify the pier before naming one.)
- :15 "เพื่อนไทยควรกระตุ้นให้เพื่อนต่างชาติเช็กเงื่อนไขนี้" "กระตุ้น" is a calque of "encourage"; "เช็ก" is chat register. "มหาวิทยาลัยหลายแห่ง รวมถึงธรรมศาสตร์ กำหนดให้นักศึกษาต่างชาติมีประกันสุขภาพตลอดที่พำนักในไทย ควรชวนเพื่อนต่างชาติสอบถามเงื่อนไขนี้กับกองวิเทศสัมพันธ์ตั้งแต่เนิ่น ๆ"
- :20 "สื่อสารภาษาอังกฤษได้" -> "พูดภาษาอังกฤษได้". :21 "เซฟไว้" -> "บันทึกไว้ในโทรศัพท์"; "เบอร์ฉุกเฉิน" -> "หมายเลขฉุกเฉิน 1669 (แจ้งเหตุเจ็บป่วยและการแพทย์ฉุกเฉิน)".

### 2.12 international/phones-and-internet.mdx (3)

- :13 three sentences joined only by spaces. "ซิมการ์ดในไทยต้องลงทะเบียนตามกฎหมายโดยใช้หนังสือเดินทาง จึงควรพกหนังสือเดินทางไปด้วยทุกครั้งที่ไปซื้อซิม ค่ายมือถือหลักมีทั้งแพ็กเกจสำหรับนักท่องเที่ยวและแพ็กเกจระยะยาวให้เลือก" Use "ซิม" or "ซิมการ์ด" consistently.
- :18 "wifi ของมหาลัย" -> "Wi-Fi ของ มธ." (also international.ts:136).
- :19 "กลุ่มเรียนหรือกิจกรรม" -> "กลุ่มเรียนหรือกลุ่มกิจกรรม"; name LINE if that is meant.

### 2.13 international/visa-and-immigration.mdx (2)

Rewrite the body from scratch.

- :10-12 Notice "เปลี่ยนแปลงได้เสมอ" calque of "can always change"; "ตรวจสอบกับ...โดยตรง". "หน้านี้ให้ข้อมูลทั่วไปเพื่อความเข้าใจเบื้องต้น ไม่ใช่คำแนะนำทางกฎหมาย กฎเกณฑ์ด้านการตรวจคนเข้าเมืองเปลี่ยนบ่อย จึงควรยืนยันกับกองวิเทศสัมพันธ์ของธรรมศาสตร์หรือสำนักงานตรวจคนเข้าเมือง (ตม.) ก่อนดำเนินการ"
- :19 "ถือวีซ่าประเภทไม่ใช่ผู้อพยพ "ED" (เพื่อการศึกษา) ซึ่งผูกกับสถานะการลงทะเบียนเรียน มีกำหนดสำคัญที่ต้องติดตาม ได้แก่" wrong term (see 0.4), ซึ่ง+ได้แก่ chain, and "สถานะการลงทะเบียนเรียน" confuses course registration with student status. "นักศึกษาต่างชาติส่วนใหญ่ถือวีซ่านักเรียน (Non-Immigrant ED) ซึ่งผูกกับสถานภาพนักศึกษา มีกำหนดสำคัญที่ต้องจำดังนี้"
- :21 "การรายงานตัวทุก 90 วัน หากพักอยู่ในไทยต่อเนื่อง" -> "รายงานตัว 90 วัน คือการแจ้งที่พักอาศัยทุก 90 วันหากอยู่ในไทยต่อเนื่อง".
- :22 "ใบอนุญาตกลับเข้าประเทศ (re-entry permit) ก่อนเดินทางออกนอกประเทศ มิฉะนั้นวีซ่าอาจถูกยกเลิกโดยอัตโนมัติ" incomplete bullet and passive. "ใบอนุญาตให้กลับเข้ามาในราชอาณาจักร (Re-entry Permit) ต้องขอก่อนเดินทางออกนอกประเทศ ถ้าไม่ขอ วีซ่าอาจสิ้นสุดทันทีที่ออกจากไทย"
- :23 "การต่ออายุวีซ่า ให้ครอบคลุมระยะเวลาการเรียน มักดำเนินการที่สำนักงานตรวจคนเข้าเมือง" -> "ต่อวีซ่า (จริง ๆ คือขออยู่ต่อ) ให้ครอบคลุมตลอดช่วงที่เรียน โดยมักยื่นที่ ตม." The English names Chaeng Watthana; add if kept.
- :27 "สามารถชี้ทางว่า...แต่ไม่ให้คำแนะนำเชิงกฎหมาย" -> "BIRSA และเพื่อนไทยบอกได้ว่าควรไปถามหน่วยงานไหน แต่ให้คำแนะนำเรื่องวีซ่าไม่ได้ ช่องทางหลักคือกองวิเทศสัมพันธ์ของธรรมศาสตร์"
- Missing: ตม.30, ใบอนุญาตทำงาน, ประกันสุขภาพ (link to the health page). Add one line each if the English does.
- The onboarding hint (international.ts:49) already says "วีซ่านักเรียนประเภท ED", the better form; align the page to it.

### 2.14 content/onboarding/international.ts (Thai strings, 3)

- :29 title colon: "เริ่มต้นที่ BIR สำหรับนักศึกษาต่างชาติ".
- :33 lede: last sentence (tick-box instruction) is stuck after the pointer to the English page. "สิ่งที่นักศึกษาต่างชาติควรจัดการก่อนและหลังมาถึงกรุงเทพฯ เรียงตามลำดับคร่าว ๆ หน้านี้เป็นฉบับสรุปย่อสำหรับบัดดี้และเจ้าหน้าที่ที่ดูแลนักศึกษาต่างชาติ ส่วนฉบับเต็มอยู่ในเวอร์ชันภาษาอังกฤษ ติ๊กช่องเมื่อทำเสร็จได้ ข้อมูลเก็บไว้ในเครื่องนี้เท่านั้น"
- :41 "ก่อนเป็นอันดับแรก" redundant -> "เอกสารที่ควรเริ่มก่อน เพราะมักใช้เวลานานที่สุด". Same at :72 "สิ่งที่ควรจัดการก่อนเป็นอันดับแรก".
- :46 "วีซ่าและการเข้าเมือง" vs page title "วีซ่าและกฎหมายคนเข้าเมือง"; align. :49 add ใบอนุญาตกลับเข้าประเทศ for parity with the English.
- :57, :253 "เริ่มตั้งตัว" means to get financially established; use "ปรับตัว" ("เดินทางมาถึงและปรับตัว", "เมื่อปรับตัวได้แล้ว").
- :61 "เรื่องการจัดการเบื้องต้น" nominal -> "สัปดาห์แรกส่วนใหญ่หมดไปกับการจัดการเรื่องพื้นฐาน".
- :96 double และ -> "ที่พักแนะนำ และร้านอาหารรอบท่าพระจันทร์กับปิ่นเกล้า".
- :108 content mismatch with phones page (see 0.6).
- :124 "เชื่อมต่อการสื่อสาร" unnatural for "Get connected"; "ตั้งค่าโทรศัพท์และอินเทอร์เน็ต". :128 "การมีมือถือใช้งานได้ ... ช่วยให้" nominal subject; "แคมปัส" here and :146 vs "มหาวิทยาลัย" elsewhere. "มีมือถือที่ใช้ได้ อินเทอร์เน็ตที่เสถียร และแอปที่ต้องใช้ในมหาวิทยาลัย จะทำให้เรื่องอื่นง่ายขึ้น"
- :143-146 "สิทธิบนแคมปัส" calque of "rights on campus"; "สิทธิและสวัสดิการนักศึกษา" (slug rights-and-welfare).
- :162 label "การรักษาพยาบาลและประกันสุขภาพ" vs page "สุขภาพและประกัน"; align. :171 checklist item "รู้ว่าจะหาข้อมูลฉุกเฉินได้จากที่ไหน" is a state not an action; "ดูหน้าข้อมูลฉุกเฉิน".
- :218 "องค์กรนักศึกษาที่ลงสมัครได้" ambiguous; "ที่นักศึกษาต่างชาติลงสมัครได้". :223 "บันไดองค์กร" calque of "ladder"; "ลำดับชั้นขององค์กรนักศึกษาที่มาจากการเลือกตั้ง ตั้งแต่ BIRSA ถึงระดับมหาวิทยาลัย". :245 "ข้อกังวล" -> "ข้อสงสัยหรือเรื่องที่ไม่สบายใจ".
- :253 "กติกา" playful next to "ระเบียบ": "เมื่อปรับตัวได้แล้ว ให้วางแผนการเลือกวิชาและดูระเบียบเกี่ยวกับการสำเร็จการศึกษา".
- :315 "โควตาพรินต์" -> "โควตาการพิมพ์เอกสาร".
- Good as is: :38, :113, :153, :261, :270, :281, :302, :326.

### 2.15 content/onboarding/index.ts (Thai strings, 3)

- :103 `คุณทำเครื่องหมายว่าเสร็จแล้ว ...` -> `ทำเครื่องหมายว่าเสร็จแล้ว ${done} จาก ${total} รายการ` (no subject).
- :107 title colon -> "เริ่มต้นที่ BIR ทีละขั้นตอน".
- :108 "จะถูกบันทึกไว้...ของคุณเท่านั้น ไม่ถูกส่งมาหาเรา" two passives and คุณ. "รายการสิ่งที่ต้องทำในช่วงแรกที่ BIR แยกตามกลุ่มนักศึกษา ติ๊กเมื่อทำเสร็จ ความคืบหน้าบันทึกอยู่ในเบราว์เซอร์ของผู้ใช้เท่านั้น เราไม่ได้รับข้อมูลนี้"
- :109 English is "Thai or home student"; Thai drops the "home" sense. "ฉันเป็นนักศึกษาไทยหรืออาศัยในไทยอยู่แล้ว".
- :110 "อาศัยอยู่...อยู่แล้ว" double อยู่ and คุณ. "เหมาะสำหรับผู้ที่เข้า BIR จากโรงเรียนในไทย หรืออาศัยในไทยอยู่แล้ว"
- :113 "หน้านี้สรุปขั้นตอน... เขียนแบบสรุปย่อ..." ambiguous "หน้านี้" on a card. "ขั้นตอนสำหรับนักศึกษาที่ย้ายมาเรียนที่กรุงเทพฯ จากต่างประเทศ เป็นฉบับสรุปย่อสำหรับบัดดี้และเจ้าหน้าที่"
- :116 "ด้วยตัวเอง" -> "เลือกอ่านเอง". :119 "ความคืบหน้าของคุณอยู่ในอุปกรณ์นี้เท่านั้น" -> "ความคืบหน้าอยู่ในอุปกรณ์เครื่องนี้เท่านั้น".
- :121 shifting subject ("เราไม่เห็นข้อมูลนี้ และไม่ถูกส่งไปให้...ทั้งสิ้น") and circular last sentence ("ล้างได้จากการล้างข้อมูล..."). "ระบบเก็บรายการที่ติ๊กไว้ใน local storage ของเบราว์เซอร์นี้เท่านั้น ไม่ส่งไปให้ BIRSA หรือผู้อื่น และเราไม่เห็นข้อมูลนี้ กดปุ่มล้างความคืบหน้าด้านบน หรือล้างข้อมูลเว็บไซต์ในเบราว์เซอร์ เพื่อลบออก"
- :122 check that "ประกาศความเป็นส่วนตัว" matches the title of the site's Thai privacy page (common Thai legal term is "นโยบายคุ้มครองข้อมูลส่วนบุคคล").
- Good as is: :98-102, :104-105, :123.

### 2.16 content/student-life/tracks.ts (Thai strings, 3)

- :31 "ที่ไม่มีบันทึกไว้ที่อื่น" literal "not written down elsewhere". "ที่หาอ่านจากที่อื่นได้ยาก"
- :35 fine; "สรุปย่อคู่มือสำหรับ... เขียนสำหรับ..." two สำหรับ: "สรุปย่อคู่มือของนักศึกษาต่างชาติ เขียนไว้ให้บัดดี้ไทยและเจ้าหน้าที่ที่ดูแลนักศึกษาต่างชาติ ส่วนฉบับเต็มอยู่ในเวอร์ชันภาษาอังกฤษ"
- :39 handbook lede is translation-shaped and "ระเบียบด้านการเรียนที่เกี่ยวกับการสำเร็จการศึกษา" wrongly narrows the rules to graduation. "คู่มือนักศึกษา BIR รวมเรื่องการสมัครและค่าเล่าเรียน โครงสร้างหลักสูตรและแผนการศึกษา (ฉบับปรับปรุง พ.ศ. 2566) ระเบียบการเรียน การฝึกงาน และกิจกรรมทางวิชาการ เรียบเรียงจากคู่มือฉบับ พ.ศ. 2564 และปรับแผนการศึกษาตามหลักสูตรฉบับปรับปรุง พ.ศ. 2566"

### 2.17 app/[lang]/student-life/**/page.tsx (Thai copy, 4)

- page.tsx:30 "รีวิวรายวิชาจากรุ่นพี่นักศึกษา" -> "รีวิวรายวิชาจากรุ่นพี่"; "เส้นทางเฉพาะสำหรับนักศึกษาต่างชาติ" -> "แนวทางสำหรับนักศึกษาต่างชาติโดยเฉพาะ".
- [audience]/[slug]/page.tsx:93 "แจ้ง BIRSA ได้ คู่มือนี้เขียนและดูแลโดยนักศึกษาด้วยกัน" terse and passive-ish. "แจ้ง BIRSA ได้เลย คู่มือนี้นักศึกษาช่วยกันเขียนและดูแล" (no ครับ/ค่ะ).
- Labels at :83-98 and :87-91 are good.
- course-reviews/[code]/opengraph-image.tsx:13 "รีวิววิชาเรียน" vs "รีวิวรายวิชา" in onboarding; unify on "รีวิวรายวิชา".

## 3. Immigration and admin glossary (recommended Thai)

| English                       | Use in Thai                                                              | Avoid or note                                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Non-Immigrant ED visa         | วีซ่านักเรียน (Non-Immigrant ED)                                         | "วีซ่าประเภทไม่ใช่ผู้อพยพ" (visa page :19) is wrong; "วีซ่านักศึกษา" is understood but "นักเรียน" is the immigration term |
| 90-day reporting              | รายงานตัว 90 วัน (แจ้งที่พักอาศัยเมื่ออยู่ต่อเนื่องครบ 90 วัน)           | "การรายงานตัวทุก 90 วัน" is fine as the everyday term                                                                     |
| Re-entry permit               | ใบอนุญาตให้กลับเข้ามาในราชอาณาจักร (Re-entry Permit)                     | "ใบอนุญาตกลับเข้าประเทศ" understandable but not the official wording                                                      |
| Visa extension                | ต่อวีซ่า, formally ขออยู่ต่อในราชอาณาจักร                                | note it is the stay that is extended                                                                                      |
| Immigration Bureau            | สำนักงานตรวจคนเข้าเมือง (ตม.)                                            | abbreviate after first mention                                                                                            |
| TM.30                         | ตม.30 (แจ้งที่พักอาศัยของคนต่างด้าวโดยเจ้าบ้านหรือผู้ให้เช่า)            | absent from Thai pages                                                                                                    |
| Work permit                   | ใบอนุญาตทำงาน                                                            | absent; ED holders cannot work without one                                                                                |
| Health insurance              | ประกันสุขภาพ                                                             | correct                                                                                                                   |
| Certificate of enrolment      | หนังสือรับรองการเป็นนักศึกษา                                             | correct                                                                                                                   |
| TU International Affairs      | one name only, to be verified: กองวิเทศสัมพันธ์ or สำนักงานวิเทศสัมพันธ์ | "กองกิจการต่างประเทศ" sounds like a ministry                                                                              |
| Tuition and fees              | ค่าเล่าเรียนและค่าธรรมเนียม                                              | "ค่าบำรุงการศึกษา" is a TU fee line; check the fee table wording, do not mix                                              |
| Credit                        | หน่วยกิต                                                                 | correct                                                                                                                   |
| Cumulative GPA                | เกรดเฉลี่ยสะสม (GPAX); formal แต้มระดับคะแนนเฉลี่ยสะสม                   | pick one; term GPA "เกรดเฉลี่ยประจำภาค"                                                                                   |
| Register                      | ลงทะเบียนเรียน                                                           | correct                                                                                                                   |
| Add and drop                  | เพิ่ม-ถอนรายวิชา                                                         | hyphen is a compound joiner, allowed by NEWS-STYLE 3.5                                                                    |
| Leave of absence / suspension | ลาพักการศึกษา / พักการศึกษา                                              | not "ให้พักการศึกษา"                                                                                                      |
| Dismissal                     | พ้นสภาพนักศึกษา                                                          | correct                                                                                                                   |
| Graduate                      | สำเร็จการศึกษา                                                           | TU step "แจ้งขอสำเร็จการศึกษา"                                                                                            |
| Honours                       | เกียรตินิยมอันดับหนึ่ง, อันดับสอง                                        | correct                                                                                                                   |
| Plagiarism                    | การลอกเลียนวรรณกรรม, ลอกเลียนผลงาน                                       | "การคัดลอกผลงานผู้อื่น" is descriptive but heavy when repeated                                                            |
| Open admission                | ตลาดวิชา                                                                 | "ระบบมหาวิทยาลัยเปิด" is literal                                                                                          |

## 4. Colons to remove (clock times and URLs excluded)

- Titles: academic-life.mdx:2; onboarding/international.ts:29; onboarding/index.ts:107.
- about-bir.mdx:47, 53, 55, 57.
- academic-activities.mdx:20, 22, 40.
- admission-and-fees.mdx:48, 50, 58, 59.
- curriculum-and-study-plan.mdx:71, 106, 121, 235.
- internship.mdx:18, 46, 57 (event name), 114, 115, 116, 127.
- Clock format: about-bir.mdx:47 "09:00 ถึง 16:00 น." should be "09.00 ถึง 16.00 น." (NEWS-STYLE 3.6).
- Dashes: none found.

## 5. Rewrite from scratch, not patch

1. about-bir.mdx history and faculty sections (:19-39), from the Thai originals.
2. visa-and-immigration.mdx, whole body.
3. academic-life.mdx leave and suspension section (:39-54) and the probation logic at :62.
4. curriculum-and-study-plan.mdx: the repeated "coloured and underlined" Notices, the "กลุ่มวิชาในสาขา" terminology and the gen-ed group labels.
5. onboarding/international.ts lede (:33) and index.ts privacy body (:121).

## 6. Short Thai style guide

### Part A. Formal handbook Thai (Thai and international students, parents)

1. Lead with the actor, not the noun. Bad "การลงทะเบียนต้องทำผ่านระบบออนไลน์" Good "นักศึกษาลงทะเบียนผ่านระบบออนไลน์"
2. Cut ทำการ, มีการ, ให้การ, เป็นการ. Bad "มีการเปิดหลักสูตรใหม่ 4 สาขา" Good "เปิดสอนปริญญาใหม่ 4 สาขา"; Bad "ให้การสนับสนุน" Good "ช่วยเหลือ"
3. Avoid ถูก for neutral events; name the actor. Bad "ระบบมหาวิทยาลัยเปิดถูกยกเลิก" Good "มหาวิทยาลัยยกเลิกระบบตลาดวิชา". Keep ถูก for adverse events with no named actor ("ถูกสั่งพักการศึกษา").
4. Reserve ได้รับการ for genuine official acts; do not stack it. Bad "จะได้รับการเตือน ... ได้รับการยินยอม ... ได้รับการประเมิน" Good "จะถูกเตือน", "ถ้าเจ้าของงานยินยอม", "อาจารย์จะประเมิน"
5. One ซึ่ง per sentence, never a chain. Bad "คณะ ซึ่งดูแล... โดยแยกจาก BIRSA ซึ่งเป็น..." Good: two sentences.
6. Keep exact bureaucratic terms (ลงทะเบียนเรียน, หน่วยกิต, ลาพักการศึกษา, พ้นสภาพนักศึกษา, สำเร็จการศึกษา, เกียรตินิยม, รอพินิจ, ตลาดวิชา) but do not wrap them in abstract nouns. Bad "ดำเนินการลงทะเบียนเรียนให้แล้วเสร็จ" Good "ลงทะเบียนเรียนให้เสร็จ"
7. Use นักศึกษา as the subject, not คุณ, and drop possessives that come from "your". Bad "แผนการเรียนของคุณเอง", "ความคืบหน้าของคุณ" Good "แผนการเรียนเฉพาะรุ่น", "ความคืบหน้า"
8. Do not put "สามารถ...ได้" in every sentence. Bad "นักศึกษาสามารถลงทะเบียนเพิ่มรายวิชาได้" Good "นักศึกษาเพิ่มรายวิชาได้"
9. Official number forms: "ร้อยละ 80" not "80%"; "09.00 ถึง 16.00 น." not "09:00"; พ.ศ. for every year; Arabic numerals; "10 ถึง 14 สิงหาคม 2569". Bad "ภาค 1/2021" Good "ภาค 1/2564"
10. Replace label colons with a sentence or table. Bad "เวลาทำการ: วันจันทร์ถึงวันศุกร์" Good "สำนักงานเปิดทำการวันจันทร์ถึงวันศุกร์ เวลา 09.00 ถึง 16.00 น."
11. English only where students must search for it (course codes, form names, regulation titles); otherwise Thai first, English in parentheses once. Bad "ข้อบังคับ...(Regulations for Undergraduate Degrees)" repeated Good Thai title once.
12. Front-load the rule, then the condition. Bad "หากนักศึกษาไม่สามารถเข้าสอบได้เนื่องจากเหตุสุดวิสัย นักศึกษา...ยื่นคำร้อง...ได้" Good "ขาดสอบเพราะเหตุสุดวิสัย ให้ยื่นคำร้องต่ออาจารย์ผู้สอน"
13. Keep sentences short; use the space as the comma but do not cut a clause in two. Bad a 300-character paragraph such as academic-life.mdx:17. Good two or three sentences.
14. Avoid "ทั้งนี้", "อนึ่ง", "ดังกล่าว", "แต่อย่างใด", "รวมถึงแต่ไม่จำกัดเพียง". Bad "รวมถึงแต่ไม่จำกัดเพียงระบบ Harvard" Good "เช่น ระบบ Harvard"
15. One word per concept: ภาคการศึกษา (not ภาคเรียน), สำนักงานโครงการ BIR (not สำนักงานหลักสูตร), เกรดเฉลี่ยสะสม, one name for the international office.

### Part B. Buddy-guide Thai (international summaries, onboarding hints)

1. Speak to the buddy with imperatives and no subject. Bad "เพื่อนไทยควรกระตุ้นให้เพื่อนต่างชาติเช็กเงื่อนไขนี้" Good "ชวนเพื่อนต่างชาติไปถามเงื่อนไขนี้ตั้งแต่เนิ่น ๆ"
2. Friendly, not chat slang, in published pages: no เซฟ, เช็ก, เจอ. Bad "เซฟเบอร์ไว้" Good "บันทึกหมายเลขไว้ในโทรศัพท์"
3. Never "มหาลัย": write มหาวิทยาลัย or มธ. Write Wi-Fi, not wifi. Choose "บัดดี้" or "เพื่อนบัดดี้" and stay with it.
4. Say the concrete action, not the concept noun. Bad "ช่วยแนะนำการเชื่อมต่อ wifi" Good "ช่วยตั้งค่า Wi-Fi ของ มธ. ให้"
5. Immigration words follow the glossary in section 3, everyday term first, official name once. Bad "วีซ่าประเภทไม่ใช่ผู้อพยพ" Good "วีซ่านักเรียน (Non-Immigrant ED)"
6. Keep the "no legal advice" line short and direct. Good "ไม่ควรให้คำแนะนำเรื่องวีซ่าเอง ให้ชวนถามกองวิเทศสัมพันธ์หรือ ตม."
7. No English idioms carried over. Bad "ไม่ว่าจะโดยใครก็ตาม", "บันไดองค์กร", "เริ่มตั้งตัว", "ที่ไม่มีบันทึกไว้ที่อื่น" Good "ไม่ว่าจากใคร", "ลำดับชั้นขององค์กร", "ปรับตัว", "หาอ่านที่อื่นได้ยาก"
8. Do not publish a placeholder without telling readers what to do. Bad "เนื้อหานี้เป็นเพียงตัวอย่าง" Good "ข้อมูลยังไม่ผ่านการตรวจสอบ ควรยืนยันกับธนาคารก่อน"
9. UI microcopy: no subject, active verbs. Bad "ความคืบหน้าจะถูกบันทึกไว้ในเบราว์เซอร์ของคุณ" Good "บันทึกความคืบหน้าไว้ในเบราว์เซอร์นี้เท่านั้น"
10. Checklist items are actions, not states. Bad "รู้ว่าจะหาข้อมูลฉุกเฉินได้จากที่ไหน" Good "ดูหน้าข้อมูลฉุกเฉิน"
