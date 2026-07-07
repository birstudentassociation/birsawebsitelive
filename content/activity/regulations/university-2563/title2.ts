import type { Section } from "../types";

/**
 * Title 2 (ลักษณะ ๒): The Student Council (ข้อ 7–34), of the Regulation of
 * Thammasat University on Student Activities, B.E. 2563 (2020).
 */
export const title2: Section = {
  kind: { en: "Title", th: "ลักษณะ" },
  number: "2",
  title: { en: "The Student Council", th: "สภานักศึกษา" },
  children: [
    {
      kind: { en: "Chapter", th: "หมวด" },
      number: "1",
      title: {
        en: "Composition of the Student Council",
        th: "องค์ประกอบของสภานักศึกษา",
      },
      provisions: [
        {
          num: 7,
          title: { en: "Composition of the councils", th: "องค์ประกอบของสภานักศึกษา" },
          body: [
            {
              kind: "para",
              text: {
                en: "There shall be a Student Council composed of the members of each Campus Student Council, as follows:",
                th: "ให้มีสภานักศึกษาประกอบด้วยสมาชิกสภานักศึกษาระดับศูนย์ของแต่ละศูนย์ ดังนี้",
              },
            },
            {
              kind: "list",
              items: [
                {
                  marker: "(1)",
                  text: {
                    en: "the Student Council of Tha Prachan Campus, composed of thirty members of the Student Council who are undergraduate students studying at Tha Prachan Campus, elected by the undergraduate students studying at Tha Prachan Campus;",
                    th: "สภานักศึกษา ศูนย์ท่าพระจันทร์ ประกอบด้วยสมาชิกสภานักศึกษาที่เป็นนักศึกษาระดับปริญญาตรีและศึกษาอยู่ในศูนย์ท่าพระจันทร์ ที่ได้รับการเลือกตั้งโดยนักศึกษาระดับปริญญาตรีที่ศึกษาอยู่ในศูนย์ท่าพระจันทร์ จำนวนสามสิบคน",
                  },
                },
                {
                  marker: "(2)",
                  text: {
                    en: "the Student Council of Rangsit Campus, composed of fifty members of the Student Council who are undergraduate students studying at Rangsit Campus, elected by the undergraduate students studying at Rangsit Campus;",
                    th: "สภานักศึกษา ศูนย์รังสิต ประกอบด้วยสมาชิกสภานักศึกษาซึ่งเป็นนักศึกษาระดับปริญญาตรีและศึกษาอยู่ในศูนย์รังสิต ที่ได้รับการเลือกตั้งโดยนักศึกษาระดับปริญญาตรีที่ศึกษาอยู่ในศูนย์รังสิต จำนวนห้าสิบคน",
                  },
                },
                {
                  marker: "(3)",
                  text: {
                    en: "the Student Council of Lampang Campus, composed of twenty members of the Student Council who are undergraduate students studying at Lampang Campus, elected by the undergraduate students studying at Lampang Campus.",
                    th: "สภานักศึกษา ศูนย์ลำปาง ประกอบด้วยสมาชิกสภานักศึกษาซึ่งเป็นนักศึกษาระดับปริญญาตรีและศึกษาอยู่ในศูนย์ลำปางที่ได้รับการเลือกตั้งโดยนักศึกษาระดับปริญญาตรีที่ศึกษาอยู่ในศูนย์ลำปาง จำนวนยี่สิบคน",
                  },
                },
              ],
            },
            {
              kind: "para",
              text: {
                en: "Where any other campus is established by the University, the Student Council of that campus shall be composed of twenty members of the Student Council who are undergraduate students studying at that campus, elected by the undergraduate students studying at that campus.",
                th: "ในกรณีที่มีศูนย์การศึกษาอื่นที่มหาวิทยาลัยจัดตั้งขึ้นให้สภานักศึกษาศูนย์การศึกษานั้นประกอบด้วยสมาชิกสภานักศึกษาซึ่งเป็นนักศึกษาระดับปริญญาตรีและศึกษาอยู่ในศูนย์การศึกษานั้นที่ได้รับการเลือกตั้งโดยนักศึกษาระดับปริญญาตรีที่ศึกษาอยู่ในศูนย์การศึกษานั้น จำนวนยี่สิบคน",
              },
            },
          ],
        },
        {
          num: 8,
          title: { en: "Council Executive Board", th: "คณะกรรมการบริหารสภานักศึกษา" },
          body: [
            {
              kind: "para",
              text: {
                en: "There shall be a Student Council Executive Board in the Student Council, appointed by the Rector, composed of:",
                th: "ในสภานักศึกษาให้มีคณะกรรมการบริหารสภานักศึกษาที่อธิการบดีแต่งตั้ง ประกอบด้วย",
              },
            },
            {
              kind: "list",
              items: [
                { marker: "(1)", text: { en: "the President of the Student Council;", th: "ประธานสภานักศึกษา" } },
                { marker: "(2)", text: { en: "the First Vice-President of the Student Council;", th: "รองประธานสภานักศึกษา คนที่ ๑" } },
                { marker: "(3)", text: { en: "the Second Vice-President of the Student Council;", th: "รองประธานสภานักศึกษา คนที่ ๒" } },
                { marker: "(4)", text: { en: "the Secretary-General of the Student Council;", th: "เลขาธิการสภานักศึกษา" } },
                { marker: "(5)", text: { en: "the First Deputy Secretary-General of the Student Council;", th: "รองเลขาธิการสภานักศึกษา คนที่ ๑" } },
                { marker: "(6)", text: { en: "the Second Deputy Secretary-General of the Student Council;", th: "รองเลขาธิการสภานักศึกษา คนที่ ๒" } },
                { marker: "(7)", text: { en: "the Chair of the Student Council's Standing Committee.", th: "ประธานคณะกรรมาธิการสามัญประจำสภานักศึกษา" } },
              ],
            },
            {
              kind: "para",
              text: {
                en: "A member of the Student Council may hold only one position under paragraph one.",
                th: "สมาชิกสภานักศึกษาสามารถดำรงตำแหน่งตามวรรคหนึ่ง ได้เพียงตำแหน่งเดียว",
              },
            },
            {
              kind: "para",
              text: {
                en: "The Student Council Executive Board shall have the powers and duties, including the responsibility, to administer all affairs concerning the Student Council, provided this is not contrary to any regulation, rule, or order of the University.",
                th: "ให้คณะกรรมการบริหารสภานักศึกษา มีอำนาจและหน้าที่รวมถึงความรับผิดชอบในการบริหารกิจการทั้งปวงที่เกี่ยวข้องกับสภานักศึกษาโดยไม่ขัดต่อข้อบังคับ ระเบียบ หรือคำสั่งของมหาวิทยาลัย",
              },
            },
          ],
        },
        {
          num: 9,
          title: { en: "Campus Council Executive Board", th: "คณะกรรมการบริหารสภานักศึกษาระดับศูนย์" },
          body: [
            {
              kind: "para",
              text: {
                en: "There shall be a Campus Student Council Executive Board in each Campus Student Council, composed of:",
                th: "ในสภานักศึกษาระดับศูนย์ให้มีคณะกรรมการบริหารสภานักศึกษาระดับศูนย์ประกอบด้วย",
              },
            },
            {
              kind: "list",
              items: [
                { marker: "(1)", text: { en: "the President of the Campus Student Council;", th: "ประธานสภานักศึกษาระดับศูนย์" } },
                { marker: "(2)", text: { en: "the First Vice-President of the Campus Student Council;", th: "รองประธานสภานักศึกษาระดับศูนย์ คนที่ ๑" } },
                { marker: "(3)", text: { en: "the Second Vice-President of the Campus Student Council;", th: "รองประธานสภานักศึกษาระดับศูนย์ คนที่ ๒" } },
                { marker: "(4)", text: { en: "the Secretary-General of the Campus Student Council;", th: "เลขาธิการสภานักศึกษาระดับศูนย์" } },
                { marker: "(5)", text: { en: "the First Deputy Secretary-General of the Campus Student Council;", th: "รองเลขาธิการสภานักศึกษาระดับศูนย์ คนที่ ๑" } },
                { marker: "(6)", text: { en: "the Second Deputy Secretary-General of the Campus Student Council;", th: "รองเลขาธิการสภานักศึกษาระดับศูนย์ คนที่ ๒" } },
                { marker: "(7)", text: { en: "the Chair of the Campus Student Council's Standing Committee.", th: "ประธานคณะกรรมาธิการสามัญประจำสภานักศึกษาระดับศูนย์" } },
              ],
            },
            {
              kind: "para",
              text: {
                en: "A member of a Campus Student Council may hold only one position under paragraph one.",
                th: "สมาชิกสภานักศึกษาระดับศูนย์สามารถดำรงตำแหน่งตามวรรคหนึ่ง ได้เพียงตำแหน่งเดียว",
              },
            },
            {
              kind: "para",
              text: {
                en: "The Campus Student Council Executive Board shall have the powers and duties, including the responsibility, to administer all affairs concerning the Campus Student Council, provided this is not contrary to any regulation, rule, or order of the University.",
                th: "ให้คณะกรรมการบริหารสภานักศึกษาระดับศูนย์ มีอำนาจและหน้าที่รวมถึงความรับผิดชอบในการบริหารกิจการทั้งปวงที่เกี่ยวข้องกับสภานักศึกษาระดับศูนย์ โดยไม่ขัดต่อข้อบังคับ ระเบียบ หรือคำสั่งของมหาวิทยาลัย",
              },
            },
          ],
        },
      ],
    },
    {
      kind: { en: "Chapter", th: "หมวด" },
      number: "2",
      title: {
        en: "Powers and duties of the Student Council and Campus Student Councils",
        th: "อำนาจหน้าที่ของสภานักศึกษาและสภานักศึกษาระดับศูนย์",
      },
      provisions: [
        {
          num: 10,
          title: { en: "Powers of the Student Council", th: "อำนาจหน้าที่ของสภานักศึกษา" },
          body: [
            {
              kind: "para",
              text: {
                en: "The Student Council shall have the following powers and duties, including responsibility:",
                th: "สภานักศึกษามีอำนาจและหน้าที่รวมถึงความรับผิดชอบดังต่อไปนี้",
              },
            },
            {
              kind: "list",
              items: [
                {
                  marker: "(1)",
                  text: {
                    en: "to propose opinions to the Rector or the University Council on matters affecting students;",
                    th: "เสนอความคิดเห็นต่ออธิการบดีหรือสภามหาวิทยาลัยในเรื่องที่มีผลกระทบต่อนักศึกษา",
                  },
                },
                {
                  marker: "(2)",
                  text: {
                    en: "to make recommendations and give advice to the Student Organisation on the administration of student activities or matters affecting students;",
                    th: "เสนอแนะและให้คำปรึกษาแก่องค์การนักศึกษาในการบริหารกิจกรรมนักศึกษาหรือเรื่องที่มีผลกระทบต่อนักศึกษา",
                  },
                },
                {
                  marker: "(3)",
                  text: {
                    en: "to consider and approve or disapprove the plans, projects, budget, and student-activity rules proposed by the Student Organisation Executive Committee;",
                    th: "พิจารณาและให้ความเห็นชอบหรือไม่เห็นชอบต่อ แผนงาน โครงการ งบประมาณและระเบียบกิจกรรมนักศึกษาตามที่คณะกรรมการบริหารองค์การนักศึกษาเสนอ",
                  },
                },
                {
                  marker: "(4)",
                  text: {
                    en: "to monitor, examine, and evaluate the administration, operations, and budget expenditure of the Student Organisation Executive Committee, the Election Commission, and clubs, whether funded from amounts approved by the Student Council or otherwise obtained support, and to have the power to prescribe rules, or to request documents, or to invite the President of the Student Organisation or persons concerned to attend meetings or give clarification on relevant matters;",
                    th: "ติดตาม ตรวจสอบและประเมินผลการบริหารงาน การดำเนินงาน และการใช้จ่ายงบประมาณของคณะกรรมการบริหารองค์การนักศึกษา คณะกรรมการการเลือกตั้งและชุมนุม ทั้งจากที่สภานักศึกษาอนุมัติหรือการได้รับการสนับสนุนมา และให้มีอำนาจกำหนดระเบียบหรือขอเอกสารหรือเชิญนายกองค์การนักศึกษาหรือผู้เกี่ยวข้องเข้าร่วมประชุมหรือชี้แจงในประเด็นที่เกี่ยวข้องได้",
                  },
                  note: {
                    en: "Once the Student Council has considered the report under paragraph one, the Student Council shall summarise that report and submit it to the University for further consideration.",
                    th: "เมื่อสภานักศึกษาพิจารณารายงานตามวรรคหนึ่งแล้ว ให้สภานักศึกษาดำเนินการสรุปรายงานดังกล่าวเสนอมหาวิทยาลัยพิจารณาต่อไป",
                  },
                },
                {
                  marker: "(5)",
                  text: {
                    en: "to prescribe or approve student-activity rules relating to the establishment and operation of clubs under this Regulation;",
                    th: "กำหนดหรืออนุมัติระเบียบกิจกรรมนักศึกษาที่เกี่ยวกับการจัดตั้งและดำเนินงานชุมนุมตามข้อบังคับนี้",
                  },
                },
                {
                  marker: "(6)",
                  text: {
                    en: "to consider and endorse the results of the selection of the Election Commission;",
                    th: "พิจารณารับรองผลการสรรหาคณะกรรมการการเลือกตั้ง",
                  },
                },
                {
                  marker: "(7)",
                  text: {
                    en: "to propose that the Rector or the Vice-Rector for Student Affairs issue rules or a University notice under section 88, or to propose amendments to this Regulation, by a resolution of not less than two-thirds of all members of the Student Council.",
                    th: "เสนอให้อธิการบดีหรือรองอธิการบดีฝ่ายการนักศึกษา ออกระเบียบหรือประกาศมหาวิทยาลัยตามข้อ ๘๘ หรือเสนอแก้ไขปรับปรุงข้อบังคับนี้ด้วยมติไม่น้อยกว่าสองในสามของสมาชิกสภานักศึกษาทั้งหมด",
                  },
                },
              ],
            },
          ],
        },
        {
          num: 11,
          title: { en: "Powers of a Campus Student Council", th: "อำนาจหน้าที่ของสภานักศึกษาระดับศูนย์" },
          body: [
            {
              kind: "para",
              text: {
                en: "A Campus Student Council shall have the following powers and duties, including responsibility:",
                th: "สภานักศึกษาระดับศูนย์มีอำนาจและหน้าที่รวมถึงความรับผิดชอบดังต่อไปนี้",
              },
            },
            {
              kind: "list",
              items: [
                {
                  marker: "(1)",
                  text: {
                    en: "to propose opinions to the Student Council on matters affecting students studying at that campus;",
                    th: "เสนอความคิดเห็นต่อสภานักศึกษาในเรื่องที่มีผลกระทบต่อนักศึกษาที่ศึกษาในศูนย์",
                  },
                },
                {
                  marker: "(2)",
                  text: {
                    en: "to make recommendations and give advice to the Student Organisation on matters affecting students at that campus;",
                    th: "เสนอแนะและให้คำปรึกษาแก่องค์การนักศึกษาในเรื่องที่มีผลกระทบต่อนักศึกษาในศูนย์",
                  },
                },
                {
                  marker: "(3)",
                  text: {
                    en: "to monitor, examine, and evaluate the administration, operations, and budget expenditure, whether funded from amounts approved by the Student Council or any other support obtained, of the Campus Student Organisation Executive Committee and student activity clubs within that campus, and to have the power to request documents or to summon the Vice-President of the Student Organisation or persons concerned to attend meetings or give clarification on relevant matters;",
                    th: "ติดตาม ตรวจสอบและประเมินผลการบริหารงาน การดำเนินงาน การใช้จ่ายงบประมาณทั้งจากที่สภานักศึกษาอนุมัติหรือการได้รับการสนับสนุนอื่นใดของคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์และชุมนุมกิจกรรมของนักศึกษาภายในศูนย์ และให้มีอำนาจขอเอกสารหรือเรียกอุปนายกองค์การนักศึกษาหรือผู้เกี่ยวข้องเข้าร่วมประชุมหรือชี้แจงในประเด็นที่เกี่ยวข้องได้",
                  },
                },
                {
                  marker: "(4)",
                  text: {
                    en: "such other powers as the Student Council may assign.",
                    th: "อำนาจอื่นตามที่สภานักศึกษามอบหมาย",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      kind: { en: "Chapter", th: "หมวด" },
      number: "3",
      title: {
        en: "Election of the Student Council and Campus Student Councils",
        th: "การเลือกตั้งสภานักศึกษาและสภานักศึกษาระดับศูนย์",
      },
      provisions: [
        {
          num: 12,
          title: { en: "Election method and vacancies", th: "วิธีการเลือกตั้งและตำแหน่งว่าง" },
          body: [
            {
              kind: "para",
              text: {
                en: "The election of the Student Council and Campus Student Councils shall be by a party-list system, divided into lists by campus, and a candidate on any list must be a student studying at that campus.",
                th: "การเลือกตั้งสภานักศึกษาและสภานักศึกษาระดับศูนย์ให้เป็นแบบระบบบัญชีรายชื่อ โดยแบ่งเป็นบัญชีรายชื่อตามศูนย์การศึกษา โดยผู้สมัครในบัญชีรายชื่อใด ต้องเป็นนักศึกษาที่ศึกษาอยู่ในศูนย์การศึกษานั้น",
              },
            },
            {
              kind: "para",
              text: {
                en: "Where a position of a member of the Student Council or a Campus Student Council becomes vacant for a reason other than the expiry of the Student Council's term, the President of the Student Council shall nominate the next-ranked person on the list of the student party concerned to fill the vacant position, submitting the nomination to the Rector within seven days from the date the vacancy became known.",
                th: "กรณีที่ตำแหน่งสมาชิกสภานักศึกษาและสภานักศึกษาระดับศูนย์ว่างลง เพราะเหตุอื่นนอกจากกรณีถึงคราวออกตามอายุของสภานักศึกษา ให้ประธานสภานักศึกษาเสนอชื่อผู้ที่อยู่ในลำดับถัดไปในบัญชีรายชื่อของพรรคนักศึกษาแทนตำแหน่งที่ว่างลงต่ออธิการบดีภายในเจ็ดวันนับแต่วันที่ทราบว่าตำแหน่งนั้นว่างลง",
              },
            },
            {
              kind: "para",
              text: {
                en: "The membership of a member of the Student Council who fills a vacant position shall last only for the remaining term of the Student Council.",
                th: "สมาชิกภาพของสมาชิกสภานักศึกษาผู้เข้าแทนที่ตำแหน่งที่ว่างลง ให้อยู่ในตำแหน่งได้เพียงเท่าอายุของสภานักศึกษาที่เหลืออยู่",
              },
            },
          ],
        },
        {
          num: 13,
          title: { en: "Election rules and procedure", th: "หลักเกณฑ์และวิธีการเลือกตั้ง" },
          body: [
            {
              kind: "para",
              text: {
                en: "The criteria and procedure for conducting the election of members of the Student Council prescribed in this Regulation shall be as determined by the Rector on the proposal of the Election Commission, by issuing a University notice.",
                th: "หลักเกณฑ์และวิธีการดำเนินการเลือกตั้งสมาชิกสภานักศึกษาที่กำหนดไว้ในข้อบังคับนี้ให้เป็นไปตามที่อธิการบดีกำหนด ตามข้อเสนอของคณะกรรมการการเลือกตั้งโดยออกเป็นประกาศมหาวิทยาลัย",
              },
            },
          ],
        },
        {
          num: 14,
          title: { en: "Right to vote", th: "สิทธิลงคะแนนเสียง" },
          body: [
            {
              kind: "para",
              text: {
                en: "A person entitled to vote in the election of members of the Student Council must have the status of a student on the day of voting.",
                th: "ผู้มีสิทธิลงคะแนนเลือกตั้งสมาชิกสภานักศึกษาต้องมีสภาพเป็นนักศึกษาอยู่ในวันที่ลงคะแนนเสียงเลือกตั้ง",
              },
            },
          ],
        },
        {
          num: 15,
          title: { en: "Eligibility to stand", th: "คุณสมบัติผู้สมัคร" },
          body: [
            {
              kind: "para",
              text: {
                en: "A person entitled to stand for election as a member of the Student Council must have the following qualifications and must not have any of the following prohibited characteristics:",
                th: "ผู้มีสิทธิสมัครรับการเลือกตั้งสมาชิกสภานักศึกษา ต้องมีคุณสมบัติและไม่มีลักษณะต้องห้ามดังต่อไปนี้",
              },
            },
            {
              kind: "list",
              items: [
                {
                  marker: "A.",
                  text: { en: "Qualifications", th: "คุณสมบัติ" },
                  children: [
                    { marker: "(1)", text: { en: "being a student;", th: "เป็นนักศึกษา" } },
                    { marker: "(2)", text: { en: "having a cumulative grade point average of not less than 2.00;", th: "มีผลการศึกษาเฉลี่ยไม่ต่ำกว่า ๒.๐๐" } },
                    {
                      marker: "(3)",
                      text: {
                        en: "having studied at the University for not more than four academic years for a programme with a four-year duration of study, not more than five academic years for a programme with a five-year duration of study, or not more than six academic years for a programme with a six-year duration of study.",
                        th: "ศึกษาอยู่ในมหาวิทยาลัยไม่เกินกว่าสี่ปีการศึกษาสำหรับหลักสูตรที่มีระยะเวลาศึกษาสี่ปีการศึกษา หรือไม่เกินห้าปีการศึกษาสำหรับหลักสูตรที่มีระยะเวลาศึกษาห้าปีการศึกษา หรือไม่เกินหกปีการศึกษาสำหรับหลักสูตรที่มีระยะเวลาศึกษาหกปีการศึกษา",
                      },
                    },
                  ],
                },
                {
                  marker: "B.",
                  text: { en: "Prohibited characteristics", th: "ลักษณะต้องห้าม" },
                  children: [
                    {
                      marker: "(1)",
                      text: {
                        en: "having been subject to student disciplinary punishment within the one-year period before the date of applying for election;",
                        th: "เคยเป็นผู้ถูกลงโทษวินัยนักศึกษาในระยะหนึ่งปีก่อนวันสมัครรับเลือกตั้ง",
                      },
                    },
                    {
                      marker: "(2)",
                      text: {
                        en: "being a member of the Student Organisation Executive Committee or the Campus Student Organisation Executive Committee;",
                        th: "เป็นกรรมการในคณะกรรมการบริหารองค์การนักศึกษาหรือคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์",
                      },
                    },
                    {
                      marker: "(3)",
                      text: {
                        en: "being a member of the Faculty Student Committee, or a member of the Student Dormitory Committee, or a member of a club executive committee;",
                        th: "เป็นกรรมการในคณะกรรมการนักศึกษาประจำคณะ หรือเป็นกรรมการในคณะกรรมการหอพักนักศึกษา หรือเป็นกรรมการในคณะกรรมการบริหารชุมนุม",
                      },
                    },
                    {
                      marker: "(4)",
                      text: {
                        en: "being, or having been within the one-year period before the date of applying for election, a member of the Election Commission.",
                        th: "เป็นกรรมการหรือเคยเป็นกรรมการการเลือกตั้งในระยะหนึ่งปีก่อนวันสมัครรับเลือกตั้ง",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          num: 16,
          title: { en: "Timing of the election", th: "กำหนดเวลาการเลือกตั้ง" },
          body: [
            {
              kind: "para",
              text: {
                en: "When the remaining term of the Student Council and the Campus Student Councils is less than sixty days, the Rector shall issue a University notice calling a general election of members of the Student Council.",
                th: "เมื่ออายุสภานักศึกษาและสภานักศึกษาระดับศูนย์เหลืออยู่ไม่ถึงหกสิบวัน ให้อธิการบดีออกประกาศมหาวิทยาลัยกำหนดให้มีการเลือกตั้งสมาชิกสภานักศึกษาเป็นการทั่วไป",
              },
            },
          ],
        },
      ],
    },
    {
      kind: { en: "Chapter", th: "หมวด" },
      number: "4",
      title: {
        en: "Operation and meetings of the Student Council and Campus Student Councils",
        th: "การดำเนินงานและการประชุมสภานักศึกษาและสภานักศึกษาระดับศูนย์",
      },
      provisions: [
        {
          num: 17,
          title: { en: "Selection of the President", th: "ที่มาของประธานสภานักศึกษา" },
          body: [
            {
              kind: "para",
              text: {
                en: "The President of the Student Council shall come from an election by the Student Council, and if the President of the Student Council comes from any Campus Student Council, that person shall be the President of that Campus Student Council by virtue of office, and the members of the Student Council of the remaining campus shall elect one member of the Student Council to be President of that Campus Student Council.",
                th: "ให้ประธานสภานักศึกษามาจากการเลือกตั้งของสภานักศึกษา และหากประธานสภานักศึกษามาจากสภานักศึกษาระดับศูนย์จากศูนย์ใดก็ให้เป็นประธานสภานักศึกษาระดับศูนย์นั้นโดยตำแหน่ง และให้สมาชิกสภานักศึกษาของศูนย์การศึกษาที่เหลือ เลือกสมาชิกสภานักศึกษาคนหนึ่งเป็นประธานสภานักศึกษาระดับศูนย์",
              },
            },
            {
              kind: "para",
              text: {
                en: "A President of a Campus Student Council who is not the President of the Student Council shall be a Vice-President of the Student Council by virtue of office.",
                th: "ประธานสภานักศึกษาระดับศูนย์ ที่มิได้เป็นประธานสภานักศึกษา ให้เป็นรองประธานสภานักศึกษาโดยตำแหน่ง",
              },
            },
            {
              kind: "para",
              text: {
                en: "The Secretary-General and Deputy Secretary-General of the Campus Student Council to which the President of the Student Council belongs shall be the Secretary-General and Deputy Secretary-General of the Student Council by virtue of office.",
                th: "เลขาธิการและรองเลขาธิการสภานักศึกษาระดับศูนย์ที่ประธานสภานักศึกษาสังกัดอยู่ ให้เป็นเลขาธิการและรองเลขาธิการสภานักศึกษาโดยตำแหน่ง",
              },
            },
          ],
        },
        {
          num: 18,
          title: { en: "Duties of the President", th: "หน้าที่ของประธานสภานักศึกษา" },
          body: [
            {
              kind: "para",
              text: {
                en: "The President of the Student Council shall have the duty to control and oversee the operations of the Student Council and shall chair meetings of the Student Council.",
                th: "ให้ประธานสภานักศึกษามีหน้าที่ควบคุมและดูแลการดำเนินงานของสภานักศึกษาและเป็นประธานที่ประชุมสภานักศึกษา",
              },
            },
            {
              kind: "para",
              text: {
                en: "The President of the Student Council shall have the power to issue orders or notices to carry out paragraph one.",
                th: "ทั้งนี้ให้ประธานสภานักศึกษามีอำนาจออกคำสั่งหรือประกาศเพื่อดำเนินการตามวรรคหนึ่ง",
              },
            },
          ],
        },
        {
          num: 19,
          title: { en: "Frequency of meetings", th: "ความถี่ของการประชุม" },
          body: [
            {
              kind: "para",
              text: {
                en: "The President of the Student Council shall arrange for meetings of the Student Council to consider matters within its powers and duties at least once a month, except where there is a necessary cause preventing a meeting from being held.",
                th: "ให้ประธานสภานักศึกษาจัดให้มีการประชุมสภานักศึกษาเพื่อพิจารณาดำเนินการตามอำนาจหน้าที่ของสภานักศึกษาอย่างน้อยเดือนละหนึ่งครั้ง เว้นแต่มีกรณีที่เหตุอันจำเป็นที่ไม่สามารถจัดการประชุมได้",
              },
            },
          ],
        },
        {
          num: 20,
          title: { en: "First meeting of the Council", th: "การประชุมสภานักศึกษาครั้งแรก" },
          body: [
            {
              kind: "para",
              text: {
                en: "Within seven days from the date of the notice announcing the persons elected as members of the Student Council, and once the number of members of the Student Council is not less than three-quarters of the total number of members, the Rector or the Vice-Rector for Student Affairs so assigned shall call a meeting of the Student Council so that members may hold their first meeting.",
                th: "ภายในเจ็ดวันนับแต่วันที่มีประกาศผู้ที่ได้รับการเลือกตั้งเป็นสมาชิกสภานักศึกษาและมีจำนวนสมาชิกสภานักศึกษาไม่น้อยกว่าสามในสี่ของจำนวนสมาชิกทั้งหมด ให้อธิการบดีหรือรองอธิการบดีฝ่ายการนักศึกษามอบหมายเรียกประชุมสภานักศึกษาเพื่อให้สมาชิกได้มาประชุมเป็นครั้งแรก",
              },
            },
            {
              kind: "para",
              text: {
                en: "For the meeting of the Student Council under paragraph one, the Student Council shall be composed of the members of the Student Council as they then exist, and the Rector or the Vice-Rector for Student Affairs shall chair the meeting, with the power and duty to control and arrange for the election of the President of the Student Council to be conducted.",
                th: "การประชุมสภานักศึกษาตามวรรคหนึ่ง ให้สภานักศึกษาประกอบด้วยสมาชิกสภานักศึกษาเท่าที่มีอยู่ และให้อธิการบดีหรือรองอธิการบดีฝ่ายการนักศึกษาเป็นประธานในที่ประชุม โดยให้มีอำนาจหน้าที่ควบคุมและจัดให้มีการดำเนินการเลือกประธานสภานักศึกษา",
              },
            },
          ],
        },
        {
          num: 21,
          title: { en: "Electing the President", th: "การเลือกประธานสภานักศึกษา" },
          body: [
            {
              kind: "para",
              text: {
                en: "The nomination of any member of the Student Council to be President of the Student Council must be seconded by not less than one-fifth of the number of members of the Student Council, and if only one name is nominated, that person shall be deemed elected once the meeting passes a resolution of endorsement by a vote of more than one-half of the members of the Student Council as they then exist.",
                th: "การเสนอชื่อสมาชิกสภานักศึกษาคนใดเป็นประธานสภานักศึกษา ต้องมีเสียงรับรองไม่น้อยกว่าหนึ่งในห้าของจำนวนสมาชิกสภานักศึกษา และหากมีการเสนอชื่อเพียงชื่อเดียว ให้ถือว่าผู้นั้นเป็นผู้ได้รับเลือก เมื่อที่ประชุมมีมติรับรองด้วยคะแนนเสียงเกินกว่ากึ่งหนึ่งของสมาชิกสภานักศึกษาเท่าที่มีอยู่",
              },
            },
          ],
        },
        {
          num: 22,
          title: { en: "First meeting of Campus Councils", th: "การประชุมสภานักศึกษาระดับศูนย์ครั้งแรก" },
          body: [
            {
              kind: "para",
              text: {
                en: "Within three days from the date of the first meeting of the members of the Student Council, and once the number of members of the Campus Student Councils is not less than three-quarters of the total number of members of the Campus Councils, the Rector or the Vice-Rector for Student Affairs shall call a meeting of the Campus Student Councils so that members may hold their first meeting.",
                th: "ภายในสามวันนับแต่วันที่มีการประชุมสมาชิกสภานักศึกษาครั้งแรก และมีจำนวนสมาชิกสภานักศึกษาระดับศูนย์ไม่น้อยกว่าสามในสี่ของจำนวนสมาชิกสภาระดับศูนย์ทั้งหมด ให้อธิการบดีหรือรองอธิการบดีฝ่ายการนักศึกษาเรียกประชุมสภานักศึกษาระดับศูนย์ เพื่อให้สมาชิกได้มาประชุมเป็นครั้งแรก",
              },
            },
            {
              kind: "para",
              text: {
                en: "For the meeting of a Campus Student Council under paragraph one, the Campus Student Council shall be composed of the members of the Campus Student Council as they then exist, and arrangements shall be made for the election of members of the Campus Student Council to hold the positions under section 9.",
                th: "การประชุมสภานักศึกษาระดับศูนย์ตามวรรคหนึ่ง ให้สภานักศึกษาระดับศูนย์ประกอบด้วยสมาชิกสภานักศึกษาเท่าที่มีอยู่ และให้จัดให้มีการดำเนินการเลือกสมาชิกสภานักศึกษาระดับศูนย์เพื่อให้ดำรงตำแหน่งตามข้อ ๙",
              },
            },
          ],
        },
        {
          num: 23,
          title: { en: "Powers of Council Presidents", th: "อำนาจหน้าที่ของประธานสภานักศึกษา" },
          body: [
            {
              kind: "para",
              text: {
                en: "The President of the Student Council and the President of a Campus Student Council shall have the following powers and duties, including responsibility:",
                th: "ประธานสภานักศึกษาและประธานสภานักศึกษาระดับศูนย์ มีอำนาจและหน้าที่รวมถึงความรับผิดชอบ ดังต่อไปนี้",
              },
            },
            {
              kind: "list",
              items: [
                {
                  marker: "(1)",
                  text: {
                    en: "to chair meetings of the Student Council or the Campus Student Council, as the case may be;",
                    th: "เป็นประธานของที่ประชุมสภานักศึกษาหรือสภานักศึกษาระดับศูนย์ แล้วแต่กรณี",
                  },
                },
                {
                  marker: "(2)",
                  text: {
                    en: "to control the meetings and the conduct of business of the Student Council or the Campus Student Council, as the case may be;",
                    th: "ควบคุมการประชุมและการดำเนินกิจการของสภานักศึกษาหรือสภานักศึกษาระดับศูนย์ แล้วแต่กรณี",
                  },
                },
                {
                  marker: "(3)",
                  text: {
                    en: "to act as representative in the external affairs of the Student Council or the Campus Student Council, as the case may be;",
                    th: "เป็นผู้แทนในกิจการภายนอกของสภานักศึกษาหรือสภานักศึกษาระดับศูนย์ แล้วแต่กรณี",
                  },
                },
                {
                  marker: "(4)",
                  text: {
                    en: "to appoint a person or group of persons to carry out any business beneficial to the affairs of the Student Council or the Campus Student Council, as the case may be;",
                    th: "แต่งตั้งบุคคลหรือคณะบุคคลเพื่อดำเนินกิจการใด ๆ อันเป็นประโยชน์ต่อกิจการสภานักศึกษาหรือสภานักศึกษาระดับศูนย์ แล้วแต่กรณี",
                  },
                },
                {
                  marker: "(5)",
                  text: {
                    en: "such other powers and duties as the Rector or the Vice-Rector for Student Affairs may assign.",
                    th: "อำนาจหน้าที่อื่นตามที่อธิการบดีหรือรองอธิการบดีฝ่ายการนักศึกษามอบหมาย",
                  },
                },
              ],
            },
          ],
        },
        {
          num: 24,
          title: { en: "Acting President of the Council", th: "ผู้ทำหน้าที่แทนประธานสภานักศึกษา" },
          body: [
            {
              kind: "para",
              text: {
                en: "Where there is no person holding the position of President of the Student Council, or there is such a person but that person is unable to perform the duty, the First Vice-President of the Student Council shall act in that person's place; if the President of the Student Council and the First Vice-President of the Student Council are unable to perform the duty, the Second Vice-President of the Student Council shall act in that person's place.",
                th: "ในกรณีที่ไม่มีผู้ดำรงตำแหน่งประธานสภานักศึกษาหรือมีแต่ไม่สามารถปฏิบัติหน้าที่ได้ให้รองประธานสภานักศึกษาคนที่ ๑ ทำหน้าที่แทน หากประธานสภานักศึกษาและรองประธานสภานักศึกษาคนที่ ๑ ไม่อาจทำหน้าที่ได้ ให้รองประธานสภานักศึกษาคนที่ ๒ ทำหน้าที่แทน",
              },
            },
            {
              kind: "para",
              text: {
                en: "Where the President of the Student Council is unable to perform the duty and there is no one to act in that person's place under paragraph one, the Student Council Executive Board under section 8 shall select one of its members to act as President of the Student Council.",
                th: "ในกรณีที่ประธานสภานักศึกษาไม่อาจทำหน้าที่ได้ และไม่มีผู้ปฏิบัติหน้าที่แทนตามวรรคหนึ่ง ให้คณะกรรมการบริหารสภานักศึกษาตามข้อ ๘ เลือกกรรมการบริหารคนใดคนหนึ่งทำหน้าที่ประธานสภานักศึกษา",
              },
            },
          ],
        },
        {
          num: 25,
          title: { en: "Acting President of a Campus Council", th: "ผู้ทำหน้าที่แทนประธานสภานักศึกษาระดับศูนย์" },
          body: [
            {
              kind: "para",
              text: {
                en: "Where there is no person holding the position of President of a Campus Student Council, or there is such a person but that person is unable to perform the duty, the First Vice-President of that Campus Student Council shall act in that person's place; if the President of the Campus Student Council and the First Vice-President of the Campus Student Council are unable to perform the duty, the Second Vice-President of the Campus Student Council shall act in that person's place.",
                th: "ในกรณีที่ไม่มีผู้ดำรงตำแหน่งประธานสภานักศึกษาระดับศูนย์ หรือมีแต่ไม่สามารถปฏิบัติหน้าที่ได้ ให้รองประธานสภานักศึกษาระดับศูนย์คนที่ ๑ ทำหน้าที่แทน หากประธานสภานักศึกษาระดับศูนย์และรองประธานสภานักศึกษาระดับศูนย์คนที่ ๑ ไม่อาจทำหน้าที่ได้ ให้รองประธานสภานักศึกษาระดับศูนย์ คนที่ ๒ ทำหน้าที่แทน",
              },
            },
            {
              kind: "para",
              text: {
                en: "Where the President of a Campus Student Council is unable to perform the duty and there is no one to act in that person's place under paragraph one, the Campus Student Council Executive Board under section 9 shall select one of its members to act as President of the Campus Student Council.",
                th: "ในกรณีที่ประธานสภานักศึกษาระดับศูนย์ไม่อาจทำหน้าที่ได้ และไม่มีผู้ปฏิบัติหน้าที่แทนตามวรรคหนึ่งให้คณะกรรมการบริหารสภานักศึกษาระดับศูนย์ตามข้อ ๙ เลือกกรรมการบริหารคนใดคนหนึ่งทำหน้าที่ประธานสภานักศึกษาระดับศูนย์",
              },
            },
          ],
        },
        {
          num: 26,
          title: { en: "Powers of Vice-Presidents", th: "อำนาจหน้าที่ของรองประธาน" },
          body: [
            {
              kind: "para",
              text: {
                en: "The powers and duties, including the responsibility, of the Vice-President of the Student Council and the Vice-President of a Campus Student Council shall be as determined by the President of the Student Council or the President of the Campus Student Council, as the case may be.",
                th: "อำนาจและหน้าที่รวมถึงความรับผิดชอบของรองประธานสภานักศึกษาและรองประธานสภานักศึกษาระดับศูนย์ ให้เป็นไปตามที่ประธานสภานักศึกษาหรือประธานสภานักศึกษาระดับศูนย์ แล้วแต่กรณีกำหนด",
              },
            },
          ],
        },
        {
          num: 27,
          title: { en: "Duties of the Secretary-General", th: "อำนาจหน้าที่ของเลขาธิการ" },
          body: [
            {
              kind: "para",
              text: {
                en: "The Secretary-General of the Student Council and the Secretary-General of a Campus Student Council shall have the following powers and duties, including responsibility:",
                th: "เลขาธิการสภานักศึกษาและเลขาธิการสภานักศึกษาระดับศูนย์ มีอำนาจและหน้าที่รวมถึงความรับผิดชอบ ดังต่อไปนี้",
              },
            },
            {
              kind: "list",
              items: [
                {
                  marker: "(1)",
                  text: {
                    en: "responsibility for the general administrative work of the Student Council;",
                    th: "รับผิดชอบงานธุรการทั่วไปของสภานักศึกษา",
                  },
                },
                {
                  marker: "(2)",
                  text: {
                    en: "to perform such other duties as the President of the Student Council or the President of the Campus Student Council, as the case may be, may assign.",
                    th: "ปฏิบัติหน้าที่อื่นตามที่ประธานสภานักศึกษาหรือประธานสภานักศึกษาระดับศูนย์ แล้วแต่กรณีมอบหมาย",
                  },
                },
              ],
            },
            {
              kind: "para",
              text: {
                en: "The Deputy Secretary-General of the Student Council and the Deputy Secretary-General of a Campus Student Council shall assist with such various work as the Secretary-General of the Student Council or the Secretary-General of the Campus Student Council, as the case may be, may assign.",
                th: "ให้รองเลขาธิการสภานักศึกษาและรองเลขาธิการสภานักศึกษาระดับศูนย์ ช่วยเหลืองานด้านต่าง ๆ ตามที่เลขาธิการสภานักศึกษาหรือเลขาธิการสภานักศึกษาระดับศูนย์ แล้วแต่กรณีมอบหมาย",
              },
            },
          ],
        },
        {
          num: 28,
          title: { en: "Appointing assistants", th: "การแต่งตั้งผู้ช่วย" },
          body: [
            {
              kind: "para",
              text: {
                en: "The Secretary-General of the Student Council and the Secretary-General of a Campus Student Council may propose the appointment of students as assistants in their own division.",
                th: "ให้เลขาธิการสภานักศึกษาและเลขาธิการสภานักศึกษาระดับศูนย์ เสนอแต่งตั้งนักศึกษาเป็นผู้ช่วยในฝ่ายตนได้",
              },
            },
            {
              kind: "para",
              text: {
                en: "The appointment under paragraph one shall be signed by the President of the Student Council or the President of the Campus Student Council, as the case may be.",
                th: "การแต่งตั้งตามวรรคหนึ่งให้ประธานสภานักศึกษาหรือประธานสภานักศึกษาระดับศูนย์ แล้วแต่กรณี เป็นผู้ลงนามแต่งตั้ง",
              },
            },
          ],
        },
        {
          num: 29,
          title: { en: "Operating rules of the Council", th: "ระเบียบการดำเนินงานของสภา" },
          body: [
            {
              kind: "para",
              text: {
                en: "The operation and meetings of the Student Council, apart from what is provided in this Chapter, shall be governed by the student-activity rules concerning the operation and meetings of the Student Council as determined by the Student Council.",
                th: "การดำเนินงานและการประชุมของสภานักศึกษา นอกจากที่กำหนดไว้ในหมวดนี้ ให้เป็นไปตามระเบียบกิจกรรมนักศึกษาเกี่ยวกับการดำเนินงานและการประชุมสภานักศึกษาที่สภานักศึกษากำหนด",
              },
            },
            {
              kind: "para",
              text: {
                en: "The operation and meetings of a Campus Student Council shall apply the rules under paragraph one, mutatis mutandis.",
                th: "การดำเนินงานและการประชุมของสภานักศึกษาระดับศูนย์ให้ใช้ระเบียบตามวรรคหนึ่งโดยอนุโลม",
              },
            },
          ],
        },
        {
          num: 30,
          title: { en: "Standing and select committees", th: "คณะกรรมาธิการประจำสภานักศึกษา" },
          body: [
            {
              kind: "para",
              text: {
                en: "There shall be standing committees or select committees of the Student Council to carry out matters within the powers and duties of the Student Council, with terms as determined by the Student Council but not exceeding the term of the Student Council.",
                th: "ให้สภานักศึกษามีคณะกรรมาธิการสามัญหรือคณะกรรมาธิการวิสามัญประจำสภานักศึกษา เพื่อดำเนินการตามอำนาจหน้าที่ของสภานักศึกษา โดยมีวาระตามที่สภานักศึกษากำหนดแต่ไม่เกินวาระของสภานักศึกษา",
              },
            },
            {
              kind: "para",
              text: {
                en: "A committee under paragraph one may propose the appointment of sub-committees to assist with work within the powers and duties of the committee.",
                th: "ให้คณะกรรมาธิการตามวรรคหนึ่งสามารถเสนอแต่งตั้งอนุกรรมาธิการ เพื่อช่วยเหลืองานตามอำนาจและหน้าที่ของคณะกรรมาธิการ",
              },
            },
            {
              kind: "para",
              text: {
                en: "The appointment under paragraphs one and two shall be signed by the President of the Student Council.",
                th: "การแต่งตั้งตามวรรคหนึ่งและวรรคสองให้ประธานสภานักศึกษาเป็นผู้ลงนามแต่งตั้ง",
              },
            },
          ],
        },
        {
          num: 31,
          title: { en: "Campus committees", th: "คณะกรรมาธิการประจำสภานักศึกษาระดับศูนย์" },
          body: [
            {
              kind: "para",
              text: {
                en: "There shall be at least three standing committees or select committees of each Campus Student Council to carry out matters within the powers and duties of the Campus Student Council, with terms as determined by the Campus Student Council but not exceeding the term of the Campus Student Council.",
                th: "ให้สภานักศึกษาระดับศูนย์มีคณะกรรมาธิการสามัญหรือคณะกรรมาธิการวิสามัญประจำสภานักศึกษาระดับศูนย์ อย่างน้อยสามคณะ เพื่อดำเนินการตามอำนาจหน้าที่ของสภานักศึกษาระดับศูนย์ โดยมีวาระตามที่สภานักศึกษาระดับศูนย์กำหนด แต่ไม่เกินวาระของสภานักศึกษาระดับศูนย์",
              },
            },
            {
              kind: "para",
              text: {
                en: "A committee under paragraph one may propose the appointment of sub-committees to assist with work within the powers and duties of the committee.",
                th: "ให้คณะกรรมาธิการตามวรรคหนึ่งสามารถเสนอแต่งตั้งอนุกรรมาธิการ เพื่อช่วยเหลืองานตามอำนาจและหน้าที่ของคณะกรรมาธิการได้",
              },
            },
            {
              kind: "para",
              text: {
                en: "The appointment under paragraphs one and two shall be signed by the President of the Campus Student Council.",
                th: "การแต่งตั้งตามวรรคหนึ่งและวรรคสองให้ประธานสภานักศึกษาระดับศูนย์เป็นผู้ลงนามแต่งตั้ง",
              },
            },
          ],
        },
        {
          num: 32,
          title: { en: "Inviting outside participants", th: "การเชิญผู้ทรงคุณวุฒิเข้าร่วมประชุม" },
          body: [
            {
              kind: "para",
              text: {
                en: "The Student Council may invite University personnel, full-time faculty members, or persons of relevant expertise to attend its meetings to give opinions or advice on matters within the powers and duties of the Student Council.",
                th: "สภานักศึกษาอาจเชิญผู้ปฏิบัติงานในมหาวิทยาลัย คณาจารย์ประจำ หรือผู้ทรงคุณวุฒิ ให้เข้าร่วมการประชุม เพื่อให้ข้อคิดเห็นหรือคำแนะนำในกิจการตามอำนาจหน้าที่ของสภานักศึกษาด้วยก็ได้",
              },
            },
          ],
        },
        {
          num: 33,
          title: { en: "Attendance and loss of membership", th: "การเข้าประชุมและการพ้นสมาชิกภาพ" },
          body: [
            {
              kind: "para",
              text: {
                en: "A member of the Student Council must attend meetings of the Student Council and of the Campus Student Councils regularly; where a member is unable to attend a meeting, that member shall submit a letter to the President of the Student Council or the President of the Campus Student Council, as the case may be, to request leave of absence from the meeting.",
                th: "สมาชิกสภานักศึกษาต้องเข้าร่วมการประชุมสภานักศึกษาและสภานักศึกษาระดับศูนย์อย่างสม่ำเสมอ ในกรณีที่ไม่อาจเข้าร่วมการประชุมได้ให้มีหนังสือถึงประธานสภานักศึกษาหรือประธานสภานักศึกษาระดับศูนย์แล้วแต่กรณี เพื่อขอลาการประชุม",
              },
            },
            {
              kind: "para",
              text: {
                en: "A member of the Student Council who is absent from meetings of the Student Council and the Campus Student Councils, combined, for more than three consecutive occasions shall vacate membership, and the President of the Student Council shall nominate the next-ranked person on the list of the student party concerned to fill the vacant position, submitting the nomination to the Rector within seven days from the date the vacancy became known.",
                th: "ให้สมาชิกสภานักศึกษาที่ขาดประชุมสภานักศึกษาและสภานักศึกษาระดับศูนย์รวมกันเกินกว่าสามครั้งติดต่อกัน ให้พ้นจากสมาชิกภาพ และให้ประธานสภานักศึกษาเสนอชื่อผู้ที่อยู่ในลำดับถัดไปในบัญชีรายชื่อของพรรคนักศึกษาแทนตำแหน่งที่ว่างลงต่ออธิการบดีภายในเจ็ดวันนับแต่วันที่ทราบว่าตำแหน่งนั้นว่างลง",
              },
            },
          ],
        },
      ],
    },
    {
      kind: { en: "Chapter", th: "หมวด" },
      number: "5",
      title: {
        en: "Term and vacation of office of members",
        th: "วาระและการพ้นตำแหน่งของสมาชิกสภานักศึกษา",
      },
      provisions: [
        {
          num: 34,
          title: { en: "Term and vacation of office", th: "วาระและการพ้นตำแหน่ง" },
          body: [
            {
              kind: "para",
              text: {
                en: "A member of the Student Council shall hold office for a term of one year at a time, from the date of appointment as a member of the Student Council.",
                th: "ให้สมาชิกสภานักศึกษา มีวาระการดำรงตำแหน่งคราวละหนึ่งปี นับแต่วันที่ได้มีการแต่งตั้งเป็นสมาชิกสภานักศึกษา",
              },
            },
            {
              kind: "para",
              text: {
                en: "In addition to vacating office upon expiry of the term under paragraph one, a member of the Student Council vacates office upon:",
                th: "นอกจากการพ้นตำแหน่งตามวาระในวรรคหนึ่ง สมาชิกสภานักศึกษาพ้นจากตำแหน่งเมื่อ",
              },
            },
            {
              kind: "list",
              items: [
                { marker: "(1)", text: { en: "death;", th: "ตาย" } },
                { marker: "(2)", text: { en: "resignation;", th: "ลาออก" } },
                { marker: "(3)", text: { en: "being subject to severe student disciplinary punishment;", th: "ถูกลงโทษวินัยนักศึกษาอย่างร้ายแรง" } },
                { marker: "(4)", text: { en: "lacking the qualifications or having a prohibited characteristic;", th: "ขาดคุณสมบัติหรือมีลักษณะต้องห้าม" } },
                { marker: "(5)", text: { en: "ceasing to have the status of a student of the University;", th: "พ้นจากสภาพการเป็นนักศึกษาของมหาวิทยาลัย" } },
                { marker: "(6)", text: { en: "being absent from meetings for more than three consecutive occasions, under section 33.", th: "ขาดประชุมติดต่อกันเกินกว่าสามครั้ง ตามข้อ ๓๓" } },
              ],
            },
          ],
        },
      ],
    },
  ],
};
