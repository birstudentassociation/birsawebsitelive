import type { Section } from "../types";

/**
 * Title 3 (ลักษณะ ๓), Chapters 1–3: General provisions (ข้อ 35), the Student
 * Organisation Executive Committee (ข้อ 36–52), and Faculty Student
 * Committees (ข้อ 53–60), of the Regulation of Thammasat University on
 * Student Activities, B.E. 2563 (2020).
 */
export const title3Chapters1to3: Section[] = [
  {
    kind: { en: "Chapter", th: "หมวด" },
    number: "1",
    title: { en: "General", th: "บททั่วไป" },
    provisions: [
      {
        num: 35,
        title: { en: "Composition of the Student Organisation", th: "องค์ประกอบขององค์การนักศึกษา" },
        body: [
          {
            kind: "para",
            text: {
              en: "The Student Organisation comprises:",
              th: "องค์การนักศึกษา ประกอบด้วย",
            },
          },
          {
            kind: "list",
            items: [
              { marker: "(1)", text: { en: "the Student Organisation Executive Committee;", th: "คณะกรรมการบริหารองค์การนักศึกษา" } },
              { marker: "(2)", text: { en: "the Faculty Student Committees;", th: "คณะกรรมการนักศึกษาประจำคณะ" } },
              { marker: "(3)", text: { en: "the student activity clubs;", th: "ชุมนุมกิจกรรมนักศึกษา" } },
              { marker: "(4)", text: { en: "the Student Dormitory Committee.", th: "คณะกรรมการหอพักนักศึกษา" } },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: { en: "Chapter", th: "หมวด" },
    number: "2",
    title: { en: "The Student Organisation Executive Committee", th: "คณะกรรมการบริหารองค์การนักศึกษา" },
    children: [
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "1",
        title: { en: "Composition", th: "องค์ประกอบ" },
        provisions: [
          {
            num: 36,
            title: { en: "Campus executive committees", th: "คณะกรรมการบริหารระดับศูนย์" },
            body: [
              {
                kind: "para",
                text: {
                  en: "There shall be the following Campus Student Organisation Executive Committees:",
                  th: "ให้มีคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์ ดังต่อไปนี้",
                },
              },
              {
                kind: "list",
                items: [
                  { marker: "(1)", text: { en: "the Student Organisation Executive Committee, Tha Prachan Campus;", th: "คณะกรรมการบริหารองค์การนักศึกษา ศูนย์ท่าพระจันทร์" } },
                  { marker: "(2)", text: { en: "the Student Organisation Executive Committee, Rangsit Campus;", th: "คณะกรรมการบริหารองค์การนักศึกษา ศูนย์รังสิต" } },
                  { marker: "(3)", text: { en: "the Student Organisation Executive Committee, Lampang Campus.", th: "คณะกรรมการบริหารองค์การนักศึกษา ศูนย์ลำปาง" } },
                ],
              },
              {
                kind: "para",
                text: {
                  en: "Where there is any other campus established by the University, there shall also be a Student Organisation Executive Committee for that campus.",
                  th: "ในกรณีที่มีศูนย์การศึกษาอื่นที่มหาวิทยาลัยจัดตั้งขึ้นให้มีคณะกรรมการบริหารองค์การนักศึกษาศูนย์การศึกษานั้นขึ้นด้วย",
                },
              },
            ],
          },
          {
            num: 37,
            title: { en: "Composition", th: "องค์ประกอบ" },
            body: [
              {
                kind: "para",
                text: {
                  en: "In the Student Organisation, there shall be a Student Organisation Executive Committee, comprising:",
                  th: "ในองค์การนักศึกษาให้มีคณะกรรมการบริหารองค์การนักศึกษา ประกอบด้วย",
                },
              },
              {
                kind: "list",
                items: [
                  { marker: "(1)", text: { en: "the President of the Student Organisation;", th: "นายกองค์การนักศึกษา" } },
                  { marker: "(2)", text: { en: "the Vice-President of the Student Organisation, Tha Prachan Campus;", th: "อุปนายกองค์การนักศึกษา ศูนย์ท่าพระจันทร์" } },
                  { marker: "(3)", text: { en: "the Vice-President of the Student Organisation, Rangsit Campus;", th: "อุปนายกองค์การนักศึกษา ศูนย์รังสิต" } },
                  { marker: "(4)", text: { en: "the Vice-President of the Student Organisation, Lampang Campus;", th: "อุปนายกองค์การนักศึกษา ศูนย์ลำปาง" } },
                  { marker: "(5)", text: { en: "the Secretary-General of the Student Organisation;", th: "เลขาธิการองค์การนักศึกษา" } },
                  { marker: "(6)", text: { en: "the Student Organisation committee member for external affairs;", th: "กรรมการองค์การนักศึกษาฝ่ายกิจการภายนอก" } },
                  { marker: "(7)", text: { en: "the Student Organisation committee member for planning and budget;", th: "กรรมการองค์การนักศึกษาฝ่ายแผนงานและงบประมาณ" } },
                  { marker: "(8)", text: { en: "the Student Organisation committee member for the protection of rights and promotion of student welfare;", th: "กรรมการองค์การนักศึกษาฝ่ายพิทักษ์สิทธิและส่งเสริมสวัสดิการนักศึกษา" } },
                  { marker: "(9)", text: { en: "the Student Organisation committee member for student activities;", th: "กรรมการองค์การนักศึกษาฝ่ายกิจกรรมนักศึกษา" } },
                  { marker: "(10)", text: { en: "the Student Organisation committee member for rules and regulations;", th: "กรรมการองค์การนักศึกษาฝ่ายกฎระเบียบ" } },
                  { marker: "(11)", text: { en: "the Student Organisation committee member for public relations.", th: "กรรมการองค์การนักศึกษาฝ่ายประชาสัมพันธ์" } },
                ],
              },
              {
                kind: "para",
                text: {
                  en: "The President of the Student Organisation under (1) must be an undergraduate student elected by the students.",
                  th: "นายกองค์การนักศึกษาตาม (1) ต้องเป็นนักศึกษาระดับปริญญาตรีซึ่งมาจากการเลือกตั้งโดยนักศึกษา",
                },
              },
              {
                kind: "para",
                text: {
                  en: "Where there is an additional Student Organisation Executive Committee under section 36, paragraph two, the Vice-President of the Student Organisation of that campus shall also be a committee member under paragraph one.",
                  th: "ในกรณีที่มีคณะกรรมการบริหารองค์การนักศึกษาเพิ่มขึ้นตามข้อ ๓๖ วรรคสอง ให้มีอุปนายกองค์การนักศึกษาศูนย์การศึกษานั้น เป็นกรรมการตามวรรคหนึ่งด้วย",
                },
              },
              {
                kind: "para",
                text: {
                  en: "A Vice-President of the Student Organisation under paragraph one must be an undergraduate student studying in the campus for which that person was elected.",
                  th: "อุปนายกองค์การนักศึกษา ตามวรรคหนึ่งต้องเป็นนักศึกษาระดับปริญญาตรีที่ศึกษาอยู่ในศูนย์การศึกษาซึ่งได้รับการเลือกตั้งนั้น",
                },
              },
              {
                kind: "para",
                text: {
                  en: "The Secretary-General and the other committee members under (5) to (11) must be undergraduate students, appointed by the Rector on the proposal of the President of the Student Organisation.",
                  th: "เลขาธิการและกรรมการอื่น ตาม (5) ถึง (11) ต้องเป็นนักศึกษาระดับปริญญาตรี โดยอธิการบดีเป็นผู้แต่งตั้งตามข้อเสนอของนายกองค์การนักศึกษา",
                },
              },
            ],
          },
          {
            num: 38,
            title: { en: "Campus committee composition", th: "องค์ประกอบระดับศูนย์" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The Campus Student Organisation Executive Committee comprises:",
                  th: "ในคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์ ประกอบด้วย",
                },
              },
              {
                kind: "list",
                items: [
                  { marker: "(1)", text: { en: "the Vice-President of the Student Organisation of that campus;", th: "อุปนายกองค์การนักศึกษา ระดับศูนย์" } },
                  { marker: "(2)", text: { en: "the Secretary-General of the Student Organisation of that campus;", th: "เลขาธิการองค์การนักศึกษา ระดับศูนย์" } },
                  { marker: "(3)", text: { en: "the Student Organisation committee member for planning and budget;", th: "กรรมการองค์การนักศึกษาฝ่ายแผนงานและงบประมาณ" } },
                  { marker: "(4)", text: { en: "the Student Organisation committee member for sports and health promotion;", th: "กรรมการองค์การนักศึกษาฝ่ายกีฬาและสร้างเสริมสุขภาพ" } },
                  { marker: "(5)", text: { en: "the Student Organisation committee member for arts and culture;", th: "กรรมการองค์การนักศึกษาฝ่ายศิลปะและวัฒนธรรม" } },
                  { marker: "(6)", text: { en: "the Student Organisation committee member for public service;", th: "กรรมการองค์การนักศึกษาฝ่ายบำเพ็ญประโยชน์" } },
                  { marker: "(7)", text: { en: "the Student Organisation committee member for religion and ethics;", th: "กรรมการองค์การนักศึกษาฝ่ายศาสนาและจริยธรรม" } },
                  { marker: "(8)", text: { en: "such other Student Organisation committee members, numbering no more than 4 further persons.", th: "กรรมการองค์การนักศึกษาอื่น อีกจำนวนไม่เกินสี่คน" } },
                ],
              },
            ],
          },
        ],
      },
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "2",
        title: { en: "Powers and duties of the Student Organisation Executive Committee", th: "อำนาจหน้าที่ของคณะกรรมการบริหารองค์การนักศึกษา" },
        provisions: [
          {
            num: 39,
            title: { en: "Powers and duties", th: "อำนาจหน้าที่" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The Student Organisation Executive Committee has the following powers and duties, including responsibilities:",
                  th: "คณะกรรมการบริหารองค์การนักศึกษา มีอำนาจและหน้าที่รวมถึงความรับผิดชอบดังต่อไปนี้",
                },
              },
              {
                kind: "list",
                items: [
                  {
                    marker: "(1)",
                    text: {
                      en: "to administer all affairs relating to the Student Organisation without contravening the law, this Regulation, the rules, or the orders of the University;",
                      th: "บริหารกิจการทั้งปวงที่เกี่ยวข้องกับองค์การนักศึกษาโดยไม่ขัดต่อกฎหมาย ข้อบังคับ ระเบียบ หรือคำสั่งของมหาวิทยาลัย",
                    },
                  },
                  {
                    marker: "(2)",
                    text: {
                      en: "to determine the annual student-activity plans, projects, and budget of the Student Organisation Executive Committee, the Student Council, the Election Commission, and the clubs, and to submit them to the Student Council for approval;",
                      th: "กำหนด แผนงาน โครงการ และงบประมาณกิจกรรมนักศึกษาประจำปีของคณะกรรมการบริหารองค์การนักศึกษา สภานักศึกษา คณะกรรมการการเลือกตั้งและชุมนุม โดยเสนอต่อสภานักศึกษาเพื่อพิจารณาอนุมัติ",
                    },
                  },
                  {
                    marker: "(3)",
                    text: {
                      en: "to propose student-activity rules for the administration of student activities under this Regulation to the Student Council for approval;",
                      th: "เสนอระเบียบกิจกรรมนักศึกษา เพื่อบริหารกิจกรรมนักศึกษาตามข้อบังคับนี้ต่อสภานักศึกษาเพื่อพิจารณาอนุมัติ",
                    },
                  },
                  {
                    marker: "(4)",
                    text: {
                      en: "to cooperate with, coordinate with, and promote the operation of the Faculty Student Committees and the Student Dormitory Committee;",
                      th: "ร่วมมือ ประสานงาน และส่งเสริมการดำเนินงานของคณะกรรมการนักศึกษาประจำคณะและคณะกรรมการหอพักนักศึกษา",
                    },
                  },
                  {
                    marker: "(5)",
                    text: {
                      en: "to supervise and oversee the operation of the Campus Student Organisation Executive Committees and the clubs;",
                      th: "กำกับดูแลการดำเนินงานของคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์และชุมนุม",
                    },
                  },
                  {
                    marker: "(6)",
                    text: {
                      en: "to prepare and report on project implementation, annual operations, and income-and-expenditure accounts, as well as the assets, of the Student Organisation Executive Committee and the Campus Student Organisation Executive Committees, to the Student Council, and to complete this within 30 days before the end of the fiscal year;",
                      th: "จัดทำและรายงานผลการดำเนินโครงการ การดำเนินงานประจำปี บัญชีรายรับ รายจ่าย ตลอดจนทรัพย์สินของคณะกรรมการบริหารองค์การนักศึกษาและคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์ต่อสภานักศึกษา ให้แล้วเสร็จภายในสามสิบวันก่อนสิ้นปีงบประมาณ",
                    },
                  },
                  {
                    marker: "(7)",
                    text: {
                      en: "to propose opinions to the Student Council, the Rector, or the University Council on matters affecting students.",
                      th: "เสนอความคิดเห็นต่อสภานักศึกษา อธิการบดีหรือสภามหาวิทยาลัยในเรื่องที่มีผลกระทบต่อนักศึกษา",
                    },
                  },
                ],
              },
            ],
          },
          {
            num: 40,
            title: { en: "Powers and duties at campus level", th: "อำนาจหน้าที่ระดับศูนย์" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The Campus Student Organisation Executive Committee has the following powers and duties, including responsibilities:",
                  th: "คณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์ มีอำนาจและหน้าที่รวมถึงความรับผิดชอบดังต่อไปนี้",
                },
              },
              {
                kind: "list",
                items: [
                  {
                    marker: "(1)",
                    text: {
                      en: "to administer all affairs relating to the Student Organisation at campus level without contravening the law, this Regulation, the rules, or the orders of the University;",
                      th: "บริหารกิจการทั้งปวงที่เกี่ยวข้องกับองค์การนักศึกษาระดับศูนย์โดยไม่ขัดต่อกฎหมาย ข้อบังคับ ระเบียบ หรือคำสั่งของมหาวิทยาลัย",
                    },
                  },
                  {
                    marker: "(2)",
                    text: {
                      en: "to determine the policy, plans, and budget for carrying out student activities of the Campus Student Organisation Executive Committee, and to submit them to the Student Organisation Executive Committee for consideration;",
                      th: "กำหนดนโยบาย แผนงาน และงบประมาณการทำกิจกรรมนักศึกษาของคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์เสนอต่อคณะกรรมการบริหารองค์การนักศึกษาพิจารณา",
                    },
                  },
                  {
                    marker: "(3)",
                    text: {
                      en: "to cooperate with, coordinate with, and promote the operation of the Faculty Student Committees and the clubs within that campus;",
                      th: "ร่วมมือ ประสานงาน และส่งเสริมการดำเนินงานของคณะกรรมการนักศึกษาประจำคณะและชุมนุมในศูนย์การศึกษานั้น",
                    },
                  },
                  {
                    marker: "(4)",
                    text: {
                      en: "to propose opinions to the Student Organisation Executive Committee on matters affecting students studying in that campus;",
                      th: "เสนอความคิดเห็นต่อคณะกรรมการบริหารองค์การนักศึกษาในเรื่องที่มีผลกระทบต่อนักศึกษาที่ศึกษาในศูนย์",
                    },
                  },
                  {
                    marker: "(5)",
                    text: {
                      en: "such other powers as are assigned by the Student Organisation Executive Committee.",
                      th: "อำนาจอื่นตามที่คณะกรรมการบริหารองค์การนักศึกษามอบหมาย",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "3",
        title: { en: "Term and vacation of office", th: "วาระการดำรงตำแหน่งและการพ้นจากตำแหน่ง" },
        provisions: [
          {
            num: 41,
            title: { en: "Term and vacation of office", th: "วาระการดำรงตำแหน่งและการพ้นจากตำแหน่ง" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The Student Organisation Executive Committee and the Campus Student Organisation Executive Committees shall hold office for a term of 1 year.",
                  th: "คณะกรรมการบริหารองค์การนักศึกษาและคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์ มีวาระการดำรงตำแหน่งคราวละหนึ่งปี",
                },
              },
              {
                kind: "para",
                text: {
                  en: "In addition to vacating office at the end of the term under paragraph one, a member of the Student Organisation Executive Committee and a member of a Campus Student Organisation Executive Committee vacate office when:",
                  th: "นอกจากการพ้นจากตำแหน่งตามวาระในวรรคหนึ่ง กรรมการบริหารองค์การนักศึกษาและกรรมการบริหารองค์การนักศึกษาระดับศูนย์ พ้นจากตำแหน่งเมื่อ",
                },
              },
              {
                kind: "list",
                items: [
                  { marker: "(1)", text: { en: "death;", th: "ตาย" } },
                  { marker: "(2)", text: { en: "resignation;", th: "ลาออก" } },
                  { marker: "(3)", text: { en: "being subject to severe student disciplinary punishment;", th: "ถูกลงโทษวินัยนักศึกษาอย่างร้ายแรง" } },
                  { marker: "(4)", text: { en: "losing the qualifications or having a prohibited characteristic;", th: "ขาดคุณสมบัติหรือมีลักษณะต้องห้าม" } },
                  { marker: "(5)", text: { en: "ceasing to have the status of a student of the University;", th: "พ้นสภาพการเป็นนักศึกษาของมหาวิทยาลัย" } },
                  {
                    marker: "(6)",
                    text: {
                      en: "in the case of a member of a Campus Student Organisation Executive Committee, ceasing to have the status of a student studying in the campus for which that person is a member of the Campus Student Organisation Executive Committee.",
                      th: "กรรมการบริหารองค์การนักศึกษาระดับศูนย์พ้นสภาพการเป็นนักศึกษาที่ศึกษาในศูนย์การศึกษาที่เป็นกรรมการบริหารองค์การนักศึกษาระดับศูนย์นั้น",
                    },
                  },
                ],
              },
              {
                kind: "para",
                text: {
                  en: "Where the term of the President of the Student Organisation expires or the President vacates office, the committee members of the Student Organisation Executive Committee under section 37 (5) to (11) shall also vacate office.",
                  th: "ในกรณีที่นายกองค์การนักศึกษาหมดวาระหรือพ้นจากตำแหน่ง ให้คณะกรรมการบริหารองค์การนักศึกษาตามข้อ ๓๗ (5) ถึง (11) พ้นจากตำแหน่งด้วย",
                },
              },
              {
                kind: "para",
                text: {
                  en: "Where the term of a Vice-President of the Student Organisation of a campus expires or that Vice-President vacates office, the Campus Student Organisation Executive Committee of that campus shall also vacate office.",
                  th: "ในกรณีที่อุปนายกองค์การนักศึกษาระดับศูนย์หมดวาระหรือพ้นจากตำแหน่ง ให้คณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์ พ้นจากตำแหน่งด้วย",
                },
              },
            ],
          },
        ],
      },
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "4",
        title: { en: "Election of the President and Vice-Presidents", th: "การเลือกตั้งนายกองค์การนักศึกษาและอุปนายกองค์การนักศึกษา" },
        provisions: [
          {
            num: 42,
            title: { en: "Election procedure", th: "หลักเกณฑ์และวิธีการเลือกตั้ง" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The criteria and procedure for conducting the election of the President of the Student Organisation and the Vice-Presidents of the Student Organisation of each campus shall be as provided in this Regulation, or as determined by the Rector, on the proposal of the Election Commission, issued as a notice of the University.",
                  th: "หลักเกณฑ์และวิธีการดำเนินการเลือกตั้งนายกองค์การนักศึกษา และอุปนายกองค์การนักศึกษาระดับศูนย์ ให้เป็นไปตามที่กำหนดไว้ในข้อบังคับนี้ หรือตามหลักเกณฑ์และวิธีการดำเนินการที่อธิการบดีกำหนด ตามข้อเสนอของคณะกรรมการการเลือกตั้งโดยออกเป็นประกาศมหาวิทยาลัย",
                },
              },
            ],
          },
          {
            num: 43,
            title: { en: "Electorate", th: "ผู้มีสิทธิเลือกตั้ง" },
            body: [
              {
                kind: "para",
                text: {
                  en: "A person entitled to vote in the election of the President of the Student Organisation must have the status of a student and be studying at undergraduate level at the University.",
                  th: "ผู้มีสิทธิลงคะแนนเลือกตั้งนายกองค์การนักศึกษาต้องมีสภาพเป็นนักศึกษาและศึกษาอยู่ในระดับปริญญาตรีของมหาวิทยาลัย",
                },
              },
              {
                kind: "para",
                text: {
                  en: "An undergraduate student studying in any campus is entitled to vote in the election of the Vice-President of the Student Organisation of the campus in which that student is studying.",
                  th: "นักศึกษาระดับปริญญาตรีที่ศึกษาอยู่ในศูนย์การศึกษาใด ก็ให้เป็นผู้มีสิทธิเลือกตั้งอุปนายกองค์การนักศึกษาของศูนย์ที่ศึกษาอยู่นั้น",
                },
              },
            ],
          },
          {
            num: 44,
            title: { en: "Eligibility to stand", th: "คุณสมบัติผู้สมัคร" },
            body: [
              {
                kind: "para",
                text: {
                  en: "A person entitled to apply for election as the President of the Student Organisation or a Vice-President of the Student Organisation must have the following qualifications and must not have the following prohibited characteristics:",
                  th: "ผู้มีสิทธิสมัครเข้ารับการเลือกตั้งเป็นนายกองค์การนักศึกษาหรืออุปนายกองค์การนักศึกษาต้องมีคุณสมบัติและไม่มีลักษณะต้องห้ามดังต่อไปนี้",
                },
              },
              {
                kind: "list",
                items: [
                  {
                    marker: "A.",
                    text: { en: "Qualifications", th: "คุณสมบัติ" },
                    children: [
                      { marker: "(1)", text: { en: "being an undergraduate student;", th: "เป็นนักศึกษาระดับปริญญาตรี" } },
                      { marker: "(2)", text: { en: "having an academic record of not lower than 2.00;", th: "มีผลการศึกษาเฉลี่ยไม่ต่ำกว่า ๒.๐๐" } },
                      {
                        marker: "(3)",
                        text: {
                          en: "having studied at the University for no more than 4 academic years in the case of a curriculum with a duration of study of 4 academic years, no more than 5 academic years in the case of a curriculum with a duration of study of 5 academic years, or no more than 6 academic years in the case of a curriculum with a duration of study of 6 academic years.",
                          th: "ศึกษาอยู่ในมหาวิทยาลัยมาแล้วไม่เกินสี่ปีการศึกษาสำหรับหลักสูตรที่มีระยะเวลาศึกษาสี่ปีการศึกษา หรือไม่เกินห้าปีการศึกษาสำหรับหลักสูตรที่มีระยะเวลาศึกษาห้าปีการศึกษา หรือไม่เกินหกปีการศึกษาสำหรับหลักสูตรที่มีระยะเวลาศึกษาหกปีการศึกษา",
                        },
                      },
                    ],
                  },
                  {
                    marker: "B.",
                    text: { en: "Prohibited characteristics", th: "ลักษณะต้องห้าม" },
                    children: [
                      { marker: "(1)", text: { en: "having been subject to student disciplinary punishment within the one-year period before the date of applying for election;", th: "เคยเป็นผู้ถูกลงโทษวินัยนักศึกษาในระยะหนึ่งปีก่อนวันสมัครรับเลือกตั้ง" } },
                      { marker: "(2)", text: { en: "being a member of the Student Council;", th: "เป็นสมาชิกสภานักศึกษา" } },
                      {
                        marker: "(3)",
                        text: {
                          en: "being a member of a Faculty Student Committee, a member of the Student Dormitory Committee, or a member of a club executive committee;",
                          th: "เป็นกรรมการในคณะกรรมการนักศึกษาประจำคณะ หรือเป็นกรรมการในคณะกรรมการหอพักนักศึกษา หรือเป็นกรรมการในคณะกรรมการบริหารชุมนุม",
                        },
                      },
                      { marker: "(4)", text: { en: "being, or having been, a member of the Election Commission within the one-year period before the date of applying for election;", th: "เป็นกรรมการหรือเคยเป็นกรรมการการเลือกตั้งในระยะหนึ่งปีก่อนวันสมัครรับเลือกตั้ง" } },
                      { marker: "(5)", text: { en: "having such other prohibited characteristics as the Rector determines by issuing a notice of the University.", th: "มีลักษณะต้องห้ามตามที่อธิการบดีกำหนดโดยออกเป็นประกาศมหาวิทยาลัย" } },
                    ],
                  },
                ],
              },
            ],
          },
          {
            num: 45,
            title: { en: "By-election before term ends", th: "การเลือกตั้งใหม่ก่อนครบวาระ" },
            body: [
              {
                kind: "para",
                text: {
                  en: "When fewer than 60 days remain in the term of office of the President of the Student Organisation or a Vice-President of the Student Organisation of a campus, the Rector shall issue a notice of the University providing for a new general election of the President of the Student Organisation or the Vice-President of the Student Organisation of that campus to be held.",
                  th: "เมื่อวาระการดำรงตำแหน่งของนายกองค์การนักศึกษาหรืออุปนายกองค์การนักศึกษาระดับศูนย์เหลืออยู่ไม่ถึงหกสิบวัน ให้อธิการบดีออกประกาศมหาวิทยาลัยกำหนดให้มีการเลือกตั้งนายกองค์การนักศึกษาหรืออุปนายกองค์การนักศึกษาระดับศูนย์ขึ้นใหม่เป็นการเลือกตั้งทั่วไป",
                },
              },
            ],
          },
        ],
      },
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "5",
        title: { en: "Operation", th: "การดำเนินงานของคณะกรรมการบริหารองค์การนักศึกษา" },
        provisions: [
          {
            num: 46,
            title: { en: "Powers of the President", th: "อำนาจหน้าที่ของนายกองค์การนักศึกษา" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The President of the Student Organisation is the representative of the Student Organisation, and has the following powers and duties, including responsibilities:",
                  th: "ให้นายกองค์การนักศึกษาเป็นผู้แทนขององค์การนักศึกษา และให้มีอำนาจและหน้าที่รวมถึงความรับผิดชอบต่อไปนี้",
                },
              },
              {
                kind: "list",
                items: [
                  { marker: "(1)", text: { en: "to be responsible for the administration of, and to supervise and oversee the operation of, the Student Organisation;", th: "รับผิดชอบการบริหารงานและกำกับดูแลการดำเนินงานขององค์การนักศึกษา" } },
                  { marker: "(2)", text: { en: "to act as chairperson of the meetings of the Student Organisation Executive Committee;", th: "เป็นประธานของที่ประชุมคณะกรรมการบริหารองค์การนักศึกษา" } },
                  {
                    marker: "(3)",
                    text: {
                      en: "to determine the powers and duties of the members of the Student Organisation Executive Committee under section 37 (5) to (11), by issuing a notice of the Student Organisation;",
                      th: "กำหนดอำนาจหน้าที่ของคณะกรรมการบริหารองค์การนักศึกษา ตามข้อ ๓๗ (5) ถึง (11) โดยออกเป็นประกาศองค์การนักศึกษา",
                    },
                  },
                  { marker: "(4)", text: { en: "such other powers and duties as are assigned by the Rector or the Vice-Rector for Student Affairs.", th: "อำนาจและหน้าที่อื่นตามที่อธิการบดีหรือรองอธิการบดีฝ่ายการนักศึกษามอบหมาย" } },
                ],
              },
            ],
          },
          {
            num: 47,
            title: { en: "Powers of a Vice-President", th: "อำนาจหน้าที่ของอุปนายกระดับศูนย์" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The Vice-President of the Student Organisation of a campus is the representative of the Campus Student Organisation Executive Committee, and has the following duties:",
                  th: "ให้อุปนายกองค์การนักศึกษาระดับศูนย์เป็นผู้แทนของคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์ และให้มีหน้าที่ดังต่อไปนี้",
                },
              },
              {
                kind: "list",
                items: [
                  { marker: "(1)", text: { en: "to be responsible for the administration of, and to supervise and oversee the operation of, the Campus Student Organisation Executive Committee;", th: "รับผิดชอบการบริหารงานและกำกับดูแลการดำเนินงานของคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์" } },
                  { marker: "(2)", text: { en: "to act as chairperson of the meetings of the Student Organisation at that campus;", th: "เป็นประธานของที่ประชุมองค์การนักศึกษาระดับศูนย์" } },
                  { marker: "(3)", text: { en: "to assist the President of the Student Organisation in the administration of the Student Organisation;", th: "ช่วยเหลืองานนายกองค์การนักศึกษาในการบริหารงานองค์การนักศึกษา" } },
                  {
                    marker: "(4)",
                    text: {
                      en: "to determine the powers and duties of the Campus Student Organisation Executive Committee under section 38 (2) to (8), by issuing a notice of the Student Organisation of that campus;",
                      th: "กำหนดอำนาจหน้าที่ของคณะกรรมการบริหารองค์การนักศึกษา ระดับศูนย์ ตามข้อ ๓๘ (2) ถึง (8) โดยออกเป็นประกาศองค์การนักศึกษา ระดับศูนย์",
                    },
                  },
                  { marker: "(5)", text: { en: "such other powers and duties as are assigned by the Rector or the Vice-Rector for Student Affairs.", th: "อำนาจและหน้าที่อื่นตามที่อธิการบดีหรือรองอธิการบดีฝ่ายการนักศึกษามอบหมาย" } },
                ],
              },
            ],
          },
          {
            num: 48,
            title: { en: "Acting President", th: "ผู้ทำหน้าที่แทนนายก" },
            body: [
              {
                kind: "para",
                text: {
                  en: "Where there is no person holding the position of President of the Student Organisation, or there is such a person but that person is unable to perform the duties, the Vice-President of the Student Organisation, Rangsit Campus, shall act in that person's place. If there is no person holding the position of President of the Student Organisation and no person holding the position of Vice-President of the Student Organisation, Rangsit Campus, or neither is able to perform the duties, the Vice-President of the Student Organisation, Tha Prachan Campus, shall act as the President of the Student Organisation in that person's place. If there is no person holding the position of President of the Student Organisation, Vice-President of the Student Organisation, Rangsit Campus, and Vice-President of the Student Organisation, Tha Prachan Campus, or none is able to perform the duties, the Vice-President of the Student Organisation, Lampang Campus, shall act as the President of the Student Organisation in that person's place.",
                  th: "ในกรณีที่ไม่มีผู้ดำรงตำแหน่งนายกองค์การนักศึกษาหรือมีแต่ไม่สามารถทำหน้าที่ได้ ให้อุปนายกองค์การนักศึกษา ศูนย์รังสิต ทำหน้าที่แทน หากนายกองค์การนักศึกษาและอุปนายกองค์การนักศึกษา ศูนย์รังสิต ไม่มีผู้ดำรงตำแหน่งหรือไม่อาจทำหน้าที่ได้ ให้อุปนายกองค์การนักศึกษา ศูนย์ท่าพระจันทร์ทำหน้าที่นายกองค์การนักศึกษาแทน หากนายกองค์การนักศึกษา อุปนายกองค์การนักศึกษา ศูนย์รังสิตและอุปนายกองค์การนักศึกษา ศูนย์ท่าพระจันทร์ ไม่มีผู้ดำรงตำแหน่งหรือไม่อาจทำหน้าที่ได้ ให้อุปนายกองค์การนักศึกษา ศูนย์ลำปางทำหน้าที่นายกองค์การนักศึกษาแทน",
                },
              },
            ],
          },
          {
            num: 49,
            title: { en: "Assistants and sub-committees", th: "ผู้ช่วยและอนุกรรมการ" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The Student Organisation Executive Committee and the Campus Student Organisation Executive Committees have the power to propose the appointment of assistants or sub-committee members to assist with work falling within their powers and duties, including responsibilities.",
                  th: "ให้คณะกรรมการบริหารองค์การนักศึกษาและคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์มีอำนาจเสนอแต่งตั้งผู้ช่วยหรืออนุกรรมการเพื่อช่วยเหลืองานอันอยู่ในอำนาจและหน้าที่รวมถึงความรับผิดชอบได้",
                },
              },
              {
                kind: "para",
                text: {
                  en: "The appointment under paragraph one shall be signed by the President of the Student Organisation or the Vice-President of the Student Organisation of the campus, as the case may be, and issued as a notice of the Student Organisation or a notice of the Student Organisation of that campus, as the case may be.",
                  th: "การแต่งตั้งตามวรรคหนึ่งให้นายกองค์การนักศึกษาหรืออุปนายกองค์การนักศึกษาระดับศูนย์เป็นผู้ลงนามแต่งตั้ง โดยออกเป็นประกาศองค์การนักศึกษาหรือประกาศองค์การนักศึกษาระดับศูนย์แล้วแต่กรณี",
                },
              },
            ],
          },
        ],
      },
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "6",
        title: { en: "Meetings", th: "การประชุมของคณะกรรมการบริหารองค์การนักศึกษา" },
        provisions: [
          {
            num: 50,
            title: { en: "Setting the agenda", th: "การกำหนดระเบียบวาระ" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The President of the Student Organisation or a Vice-President of the Student Organisation, as the case may be, shall determine the agenda for the meetings of the Student Organisation Executive Committee or the Campus Student Organisation Executive Committee, as the case may be.",
                  th: "ให้นายกองค์การนักศึกษาหรืออุปนายกองค์การนักศึกษาเป็นผู้กำหนดระเบียบวาระการประชุมคณะกรรมการบริหารองค์การนักศึกษาหรือคณะกรรมการบริหารองค์การนักศึกษา ระดับศูนย์ แล้วแต่กรณี",
                },
              },
              {
                kind: "para",
                text: {
                  en: "A member of the Student Organisation Executive Committee or a member of a Campus Student Organisation Executive Committee may propose a matter for inclusion in the meeting agenda, by making a written submission to the President of the Student Organisation or the Vice-President of the Student Organisation, as the case may be.",
                  th: "กรรมการบริหารองค์การนักศึกษาหรือกรรมการบริหารองค์การนักศึกษา ระดับศูนย์ อาจเสนอเรื่องเข้าสู่ระเบียบวาระการประชุมเพื่อพิจารณาบรรจุเข้าระเบียบวาระการประชุมก็ได้ โดยให้ทำเป็นหนังสือถึงนายกองค์การนักศึกษาหรืออุปนายกองค์การนักศึกษา แล้วแต่กรณี",
                },
              },
            ],
          },
          {
            num: 51,
            title: { en: "Quorum", th: "องค์ประชุม" },
            body: [
              {
                kind: "para",
                text: {
                  en: "At a meeting of the Student Organisation Executive Committee or a Campus Student Organisation Executive Committee, no fewer than one-half of the total number of committee members of the Student Organisation Executive Committee then in office must attend for a quorum to be constituted.",
                  th: "ในการประชุมคณะกรรมการบริหารองค์การนักศึกษาหรือคณะกรรมการบริหารองค์การนักศึกษา ระดับศูนย์ ต้องมี กรรมการมาประชุมไม่น้อยกว่ากึ่งหนึ่งของจำนวนกรรมการในคณะกรรมการบริหารองค์การนักศึกษาทั้งหมดเท่าที่มีอยู่จึงจะถือว่าเป็นองค์ประชุม",
                },
              },
              {
                kind: "para",
                text: {
                  en: "The operation and meetings of the Student Organisation Executive Committee, save as otherwise provided in this Chapter, shall be conducted in accordance with the student-activity rules on the operation and meetings of the Student Organisation Executive Committee, with the approval of the Student Council.",
                  th: "การดำเนินงานและการประชุมของคณะกรรมการบริหารองค์การนักศึกษา นอกจากที่กำหนดไว้ในหมวดนี้ ให้เป็นไปตามระเบียบกิจกรรมนักศึกษาเกี่ยวกับการดำเนินงานและการประชุมคณะกรรมการบริหารองค์การนักศึกษา โดยความเห็นชอบของสภานักศึกษา",
                },
              },
              {
                kind: "para",
                text: {
                  en: "The operation and meetings of a Campus Student Organisation Executive Committee shall apply the rules under paragraph two, mutatis mutandis.",
                  th: "การดำเนินงานและการประชุมของคณะกรรมการบริหารองค์การนักศึกษา ระดับศูนย์ ให้ใช้ระเบียบตามวรรคสองโดยอนุโลม",
                },
              },
            ],
          },
          {
            num: 52,
            title: { en: "Chair and voting", th: "ประธานและการลงมติ" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The President of the Student Organisation or a Vice-President of the Student Organisation, as the case may be, shall act as chairperson of the meetings of the Student Organisation Executive Committee or the Campus Student Organisation Executive Committee, as the case may be, and shall have the duty to conduct the meeting in an orderly manner.",
                  th: "ให้นายกองค์การนักศึกษาหรืออุปนายกองค์การนักศึกษาเป็นประธานที่ประชุมคณะกรรมการบริหารองค์การนักศึกษาหรือคณะกรรมการบริหารองค์การนักศึกษา ระดับศูนย์ แล้วแต่กรณี และให้มีหน้าที่ดำเนินการประชุมให้เป็นไปด้วยความเรียบร้อย",
                },
              },
              {
                kind: "para",
                text: {
                  en: "A resolution of the Student Organisation Executive Committee or a Campus Student Organisation Executive Committee shall be decided by a majority vote of the committee members attending the meeting. In the case of a tied vote, the chairperson of the meeting shall have the deciding vote.",
                  th: "การลงมติของคณะกรรมการบริหารองค์การนักศึกษาหรือคณะกรรมการบริหารองค์การนักศึกษา ระดับศูนย์ ให้ถือเสียงข้างมากของกรรมการที่เข้าร่วมการประชุม ในกรณีการลงมติได้คะแนนเสียงเท่ากัน ให้ประธานในที่ประชุมเป็นผู้มีอำนาจชี้ขาด",
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
    title: { en: "Faculty Student Committees", th: "คณะกรรมการนักศึกษาประจำคณะ" },
    children: [
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "1",
        title: { en: "Composition", th: "องค์ประกอบของคณะกรรมการนักศึกษาประจำคณะ" },
        provisions: [
          {
            num: 53,
            title: { en: "Composition", th: "องค์ประกอบ" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The Dean shall arrange for there to be at least one Faculty Student Committee, with the composition of the Faculty Student Committee as determined by the Dean, by issuing a faculty-unit notice.",
                  th: "ให้คณบดีจัดให้มีคณะกรรมการนักศึกษาอย่างน้อยหนึ่งคณะ โดยมีองค์ประกอบของคณะกรรมการนักศึกษาตามที่คณบดีกำหนดโดยออกเป็นประกาศส่วนงาน",
                },
              },
              {
                kind: "para",
                text: {
                  en: "Where a Faculty has more than one Faculty Student Committee, the Dean shall arrange for the election of one student committee member to represent the Faculty Student Committees at Faculty level, for the purpose of attending meetings with the Student Organisation, the Student Council, or the University, by issuing a faculty-unit notice.",
                  th: "ในกรณีคณะใดที่มีคณะกรรมการนักศึกษามากกว่าหนึ่งคณะ ให้คณบดีกำหนดให้มีการเลือกกรรมการนักศึกษาหนึ่งคน เป็นตัวแทนคณะกรรมการนักศึกษาในระดับคณะ เพื่อเข้าร่วมประชุมกับองค์การนักศึกษา สภานักศึกษาหรือมหาวิทยาลัย โดยออกเป็นประกาศส่วนงาน",
                },
              },
            ],
          },
        ],
      },
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "2",
        title: { en: "Qualifications of the chair and members", th: "คุณสมบัติของประธานและกรรมการประจำคณะ" },
        provisions: [
          {
            num: 54,
            title: { en: "Qualifications", th: "คุณสมบัติ" },
            body: [
              {
                kind: "para",
                text: {
                  en: "A member of a Faculty Student Committee must have the following qualifications and must not have the following prohibited characteristics:",
                  th: "กรรมการในคณะกรรมการนักศึกษาประจำคณะ จะต้องมีคุณสมบัติและไม่มีลักษณะต้องห้ามดังต่อไปนี้",
                },
              },
              {
                kind: "list",
                items: [
                  {
                    marker: "A.",
                    text: { en: "Qualifications", th: "คุณสมบัติ" },
                    children: [
                      { marker: "(1)", text: { en: "being an undergraduate student;", th: "เป็นนักศึกษาระดับปริญญาตรี" } },
                      {
                        marker: "(2)",
                        text: {
                          en: "having an academic record of not lower than 2.00, unless the Faculty has determined otherwise, in which case not lower than 2.00;",
                          th: "มีผลการศึกษาเฉลี่ยไม่ต่ำกว่า ๒.๐๐ เว้นแต่คณะกำหนดไว้เป็นอย่างอื่นที่ไม่ต่ำกว่า ๒.๐๐",
                        },
                      },
                      {
                        marker: "(3)",
                        text: {
                          en: "having studied at the University for no more than 4 academic years in the case of a curriculum with a duration of study of 4 academic years, no more than 5 academic years in the case of a curriculum with a duration of study of 5 academic years, or no more than 6 academic years in the case of a curriculum with a duration of study of 6 academic years.",
                          th: "ศึกษาอยู่ในมหาวิทยาลัยมาแล้วไม่เกินสี่ปีการศึกษาสำหรับหลักสูตรที่มีระยะเวลาศึกษา สี่ปีการศึกษา หรือไม่เกินห้าปีการศึกษาสำหรับหลักสูตรที่มีระยะเวลาศึกษาห้าปีการศึกษา หรือไม่เกินหกปีการศึกษาสำหรับหลักสูตรที่มีระยะเวลาศึกษาหกปีการศึกษา",
                        },
                      },
                    ],
                  },
                  {
                    marker: "B.",
                    text: { en: "Prohibited characteristics", th: "ลักษณะต้องห้าม" },
                    children: [
                      { marker: "(1)", text: { en: "having been subject to student disciplinary punishment within the one-year period before the date of applying for election;", th: "เคยเป็นผู้ถูกลงโทษวินัยนักศึกษาในระยะหนึ่งปีก่อนวันสมัครรับเลือกตั้ง" } },
                      {
                        marker: "(2)",
                        text: {
                          en: "being a member of the Student Council, a member of the Student Organisation Executive Committee, a member of the Student Organisation Executive Committee at campus level, a member of the Student Dormitory Committee, or a member of a club executive committee;",
                          th: "เป็นสมาชิกสภานักศึกษา หรือกรรมการบริหารองค์การนักศึกษา หรือกรรมการบริหารองค์การนักศึกษาระดับศูนย์ หรือกรรมการในคณะกรรมการหอพักนักศึกษา หรือกรรมการในคณะกรรมการบริหารชุมนุม",
                        },
                      },
                      { marker: "(3)", text: { en: "being, or having been, a member of a Faculty-level election committee within the one-year period before the date of applying for election;", th: "เป็นกรรมการหรือเคยเป็นกรรมการการเลือกตั้งระดับคณะ ในระยะหนึ่งปีก่อนวันสมัครรับเลือกตั้ง" } },
                      { marker: "(4)", text: { en: "having such other prohibited characteristics as the Dean determines by issuing a faculty-unit notice.", th: "มีลักษณะต้องห้ามตามที่คณบดีกำหนดโดยออกเป็นประกาศส่วนงาน" } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "3",
        title: { en: "Election of the chair", th: "การเลือกตั้งประธานกรรมการนักศึกษาประจำคณะ" },
        provisions: [
          {
            num: 55,
            title: { en: "Electorate", th: "ผู้มีสิทธิเลือกตั้ง" },
            body: [
              {
                kind: "para",
                text: {
                  en: "A person entitled to vote in the election of the chairperson of a Faculty Student Committee must have the status of an undergraduate student currently studying in that Faculty.",
                  th: "ผู้มีสิทธิลงคะแนนเลือกประธานกรรมการนักศึกษาประจำคณะต้องมีสภาพเป็นนักศึกษาระดับปริญญาตรีซึ่งกำลังศึกษาอยู่ในคณะนั้น ๆ",
                },
              },
            ],
          },
          {
            num: 56,
            title: { en: "Election procedure", th: "หลักเกณฑ์และวิธีการเลือกตั้ง" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The criteria and procedure for conducting the election of the chairperson of a Faculty Student Committee shall be as determined by the Dean, by issuing a faculty-unit notice.",
                  th: "หลักเกณฑ์และวิธีการดำเนินการเลือกประธานกรรมการประจำคณะให้เป็นไปตามที่คณบดีกำหนดโดยออกเป็นประกาศส่วนงาน",
                },
              },
            ],
          },
        ],
      },
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "4",
        title: { en: "Powers and duties", th: "อำนาจหน้าที่ของคณะกรรมการนักศึกษาประจำคณะ" },
        provisions: [
          {
            num: 57,
            title: { en: "Powers and duties", th: "อำนาจหน้าที่" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The Faculty Student Committee has the following duties and responsibilities:",
                  th: "คณะกรรมการนักศึกษาประจำคณะ มีหน้าที่รับผิดชอบดังนี้",
                },
              },
              {
                kind: "list",
                items: [
                  {
                    marker: "(1)",
                    text: {
                      en: "to propose opinions to the Student Organisation, the Student Council, or the Dean, on matters affecting the students of the Faculty;",
                      th: "เสนอความคิดเห็นต่อองค์การนักศึกษา สภานักศึกษา คณบดี ในเรื่องที่มีผลกระทบต่อนักศึกษาของคณะ",
                    },
                  },
                  { marker: "(2)", text: { en: "to administer all activities relating to the activities of the students in the Faculty;", th: "บริหารกิจกรรมทั้งปวงเกี่ยวกับกิจกรรมของนักศึกษาในคณะ" } },
                  { marker: "(3)", text: { en: "to supervise, monitor, and examine the operation of Faculty-level student activity clubs;", th: "กำกับดูแล ติดตาม และตรวจสอบการทำงานของชมรมกิจกรรมนักศึกษาระดับคณะ" } },
                  { marker: "(4)", text: { en: "to perform such other duties as are assigned by the Dean.", th: "ปฏิบัติหน้าที่อื่นตามที่คณบดีมอบหมาย" } },
                ],
              },
            ],
          },
        ],
      },
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "5",
        title: { en: "Term and vacation of office", th: "วาระการดำรงตำแหน่งและการพ้นจากตำแหน่ง" },
        provisions: [
          {
            num: 58,
            title: { en: "Term of office", th: "วาระการดำรงตำแหน่ง" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The chairperson of a Faculty Student Committee shall hold office for a term of 1 year.",
                  th: "ประธานกรรมการนักศึกษาประจำคณะมีวาระการดำรงตำแหน่งคราวละหนึ่งปี",
                },
              },
              {
                kind: "para",
                text: {
                  en: "When the term of the chairperson of the Faculty Student Committee expires or the chairperson vacates office, the members of the Faculty Student Committee shall also vacate office.",
                  th: "เมื่อประธานกรรมการนักศึกษาหมดวาระหรือพ้นจากตำแหน่ง ให้กรรมการนักศึกษาประจำคณะพ้นจากตำแหน่งด้วย",
                },
              },
            ],
          },
          {
            num: 59,
            title: { en: "Vacation of office", th: "การพ้นจากตำแหน่ง" },
            body: [
              {
                kind: "para",
                text: {
                  en: "A member of a Faculty Student Committee vacates office when:",
                  th: "กรรมการในคณะกรรมการนักศึกษาประจำคณะพ้นจากตำแหน่งเมื่อ",
                },
              },
              {
                kind: "list",
                items: [
                  { marker: "(1)", text: { en: "death;", th: "ตาย" } },
                  { marker: "(2)", text: { en: "resignation;", th: "ลาออก" } },
                  { marker: "(3)", text: { en: "being subject to severe student disciplinary punishment;", th: "ถูกลงโทษวินัยนักศึกษาอย่างร้ายแรง" } },
                  { marker: "(4)", text: { en: "losing the qualifications or having a prohibited characteristic;", th: "ขาดคุณสมบัติหรือมีลักษณะต้องห้าม" } },
                  { marker: "(5)", text: { en: "ceasing to have the status of a student of the Faculty.", th: "พ้นสภาพการเป็นนักศึกษาของคณะ" } },
                ],
              },
            ],
          },
        ],
      },
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "6",
        title: { en: "Oversight", th: "การกำกับและดูแล" },
        provisions: [
          {
            num: 60,
            title: { en: "Oversight by the Dean", th: "การกำกับดูแลของคณบดี" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The Dean shall supervise and oversee the operation of the Faculty Student Committee to ensure that it accords with this Regulation, and with the regulations or notices of the Faculty or the University. In the case of a dispute in the course of operations that may cause damage to the common interest, the Dean shall consider the matter, and once the Dean has reached a decision, the Faculty Student Committee and persons concerned shall comply with that decision.",
                  th: "ให้คณบดีกำกับและดูแลการดำเนินงานของคณะกรรมการนักศึกษาประจำคณะให้เป็นไปโดยถูกต้องตามข้อบังคับ ระเบียบ ประกาศของคณะหรือมหาวิทยาลัย ในกรณีที่มีปัญหาขัดแย้งในการดำเนินงานซึ่งอาจส่งผลเสียหายต่อส่วนรวมให้คณบดีเป็นผู้พิจารณา และเมื่อวินิจฉัยเป็นประการใดแล้ว ให้คณะกรรมการนักศึกษาประจำคณะและผู้เกี่ยวข้องปฏิบัติตามคำวินิจฉัยนั้น",
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
