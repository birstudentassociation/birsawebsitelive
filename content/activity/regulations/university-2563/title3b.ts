import type { Section } from "../types";

/**
 * Title 3 (ลักษณะ ๓), Chapters 4–5: Student activity clubs (ข้อ 61–71) and
 * the Student Dormitory Committee (ข้อ 72–79), of the Regulation of
 * Thammasat University on Student Activities, B.E. 2563 (2020).
 */
export const title3Chapters4to5: Section[] = [
  {
    kind: { en: "Chapter", th: "หมวด" },
    number: "4",
    title: { en: "Student activity clubs", th: "ชุมนุมกิจกรรมนักศึกษา" },
    provisions: [
      {
        num: 61,
        title: { en: "Types of clubs", th: "ประเภทของชุมนุม" },
        body: [
          {
            kind: "para",
            text: {
              en: "A student activity club is an association of undergraduate students of the University formed to carry out student activities in a particular field under this Regulation, divided into the following types of club:",
              th: "ชุมนุมกิจกรรมนักศึกษา เป็นการรวมตัวของนักศึกษาระดับปริญญาตรีของมหาวิทยาลัยเพื่อทำกิจกรรมนักศึกษาด้านใดด้านหนึ่งตามข้อบังคับนี้ โดยแบ่งประเภทชุมนุมออกเป็น",
            },
          },
          {
            kind: "list",
            items: [
              { marker: "(1)", text: { en: "sports and health-promotion activity clubs;", th: "ชุมนุมกิจกรรมกีฬาและสร้างเสริมสุขภาพ" } },
              { marker: "(2)", text: { en: "public-service activity clubs;", th: "ชุมนุมกิจกรรมบำเพ็ญประโยชน์" } },
              { marker: "(3)", text: { en: "academic activity clubs;", th: "ชุมนุมกิจกรรมวิชาการ" } },
              { marker: "(4)", text: { en: "religious and ethics activity clubs;", th: "ชุมนุมกิจกรรมศาสนาและจริยธรรม" } },
              { marker: "(5)", text: { en: "arts and culture activity clubs.", th: "ชุมนุมกิจกรรมศิลปวัฒนธรรม" } },
            ],
          },
        ],
      },
      {
        num: 62,
        title: { en: "Forming a club", th: "การก่อตั้งชุมนุม" },
        body: [
          {
            kind: "para",
            text: {
              en: "To form a club, no fewer than 50 undergraduate students of the University, drawn from various Faculties, must submit a petition to the TUSU Executive Committee, together with the following documents for the club's establishment:",
              th: "การก่อตั้งชุมนุมต้องมีนักศึกษาระดับปริญญาตรีของมหาวิทยาลัย จำนวนไม่น้อยกว่าห้าสิบคน ที่มาจากคณะต่าง ๆ ยื่นคำร้องต่อคณะกรรมการบริหารองค์การนักศึกษาพร้อมเอกสารการก่อตั้งชุมนุมกิจกรรม ดังต่อไปนี้",
            },
          },
          {
            kind: "list",
            items: [
              { marker: "(1)", text: { en: "the club rules;", th: "ระเบียบชุมนุม" } },
              { marker: "(2)", text: { en: "the list of names of the students who have signed to form the club;", th: "รายชื่อของนักศึกษาที่เข้าชื่อกันก่อตั้งชุมนุม" } },
              { marker: "(3)", text: { en: "the list of names of the first club executive committee;", th: "รายชื่อของคณะกรรมการบริหารชุมนุมชุดแรก" } },
              { marker: "(4)", text: { en: "the minutes of the club's founding meeting.", th: "รายงานการประชุมก่อตั้งชุมนุม" } },
            ],
          },
        ],
      },
      {
        num: 63,
        title: { en: "Club rules", th: "ระเบียบชุมนุม" },
        body: [
          {
            kind: "para",
            text: {
              en: "The club rules must at least comprise:",
              th: "ระเบียบชุมนุมอย่างน้อยต้องประกอบด้วย",
            },
          },
          {
            kind: "list",
            items: [
              { marker: "(1)", text: { en: "the name of the student activity club, which must include the word \"club\" as part of its name;", th: "ชื่อชุมนุมกิจกรรมนักศึกษา ซึ่งจะต้องมีคำว่าชุมนุมประกอบชื่อด้วย" } },
              { marker: "(2)", text: { en: "the type of the club and its objectives;", th: "ประเภทของชุมนุมและวัตถุประสงค์" } },
              { marker: "(3)", text: { en: "membership and cessation of membership;", th: "สมาชิกและการขาดจากสมาชิก" } },
              { marker: "(4)", text: { en: "the club's income;", th: "รายได้ของชุมนุม" } },
              { marker: "(5)", text: { en: "the club executive committee.", th: "คณะกรรมการบริหารชุมนุม" } },
            ],
          },
        ],
      },
      {
        num: 64,
        title: { en: "Approval of a new club", th: "การพิจารณาอนุมัติจัดตั้งชุมนุม" },
        body: [
          {
            kind: "para",
            text: {
              en: "When the TUSU Executive Committee receives a petition to form a student activity club, the TUSU Executive Committee shall consider it; if it approves the formation of the club, it shall submit the matter to the TUSC for approval.",
              th: "เมื่อคณะกรรมการบริหารองค์การนักศึกษา ได้รับคำร้องของก่อตั้งชุมนุมกิจกรรมนักศึกษา ให้คณะกรรมการบริหารองค์การนักศึกษาพิจารณา หากเห็นชอบให้ก่อตั้งเป็นชุมนุม ให้เสนอสภานักศึกษาเพื่อพิจารณาอนุมัติ",
            },
          },
          {
            kind: "para",
            text: {
              en: "Once the TUSC has approved the matter, the TUSC shall report the result to the Rector for the club to be established.",
              th: "เมื่อสภานักศึกษาพิจารณาอนุมัติแล้ว ให้สภานักศึกษาดำเนินรายงานผล เสนออธิการบดีเพื่อจัดตั้งชุมนุมต่อไป",
            },
          },
          {
            kind: "para",
            text: {
              en: "The TUSU Executive Committee and the TUSC may request documents from, or summon, the club chairperson or persons concerned to attend and give explanations for the purpose of their consideration under paragraph one.",
              th: "ให้คณะกรรมการบริหารองค์การนักศึกษาและสภานักศึกษาขอเอกสารหรือเรียกประธานชุมนุมหรือผู้ที่เกี่ยวข้องเข้าร่วมชี้แจง เพื่อประกอบการพิจารณาตามวรรคหนึ่งได้",
            },
          },
        ],
      },
      {
        num: 65,
        title: { en: "Club membership limit", th: "การเป็นสมาชิกชุมนุม" },
        body: [
          {
            kind: "para",
            text: {
              en: "A student is entitled to be a member of no more than 5 student activity clubs.",
              th: "นักศึกษามีสิทธิเป็นสมาชิกชุมนุมกิจกรรมนักศึกษาได้ไม่เกินห้าชุมนุม",
            },
          },
          {
            kind: "para",
            text: {
              en: "Upon ceasing to be a student of the University, resigning, or ceasing to be a member under the club's regulation, this shall constitute the termination of that person's membership of the student activity club.",
              th: "เมื่อพ้นสภาพการเป็นนักศึกษาของมหาวิทยาลัย ลาออก หรือขาดจากสมาชิกภาพตามข้อบังคับชุมนุม ให้ถือเป็นการสิ้นสุดการเป็นสมาชิกชุมนุมกิจกรรมนักศึกษา",
            },
          },
        ],
      },
      {
        num: 66,
        title: { en: "Club annual general meeting", th: "การประชุมใหญ่ของชุมนุม" },
        body: [
          {
            kind: "para",
            text: {
              en: "The club executive committee must arrange for the club's annual general meeting to be held within 60 days before the end of the second semester of the academic year, to consider the results of the club's operations and to elect the club executive committee.",
              th: "คณะกรรมการบริหารชุมนุมต้องจัดให้มีการประชุมใหญ่ของชุมนุมภายในหกสิบวันก่อนปิดภาคการศึกษาที่สองของปีการศึกษาเพื่อพิจารณาผลการดำเนินงานของชุมนุม และเลือกตั้งคณะกรรมการบริหารชุมนุม",
            },
          },
          {
            kind: "para",
            text: {
              en: "At the club's annual general meeting, no fewer than one-half of the total number of members must attend for a quorum to be constituted.",
              th: "การประชุมใหญ่ของชุมนุมต้องมีสมาชิกชุมนุมมาประชุมไม่น้อยกว่ากึ่งหนึ่งของจำนวนสมาชิกทั้งหมดจึงจะเป็นองค์ประชุม",
            },
          },
          {
            kind: "para",
            text: {
              en: "Within 30 days from the date of the club's annual general meeting, the club executive committee shall report the club's annual operating results and the results of the club's annual general meeting to the President of the TUSU, and shall submit the names of the persons elected as the club chairperson and club executive committee members to the President of the TUSU for appointment as the club executive committee.",
              th: "ภายในสามสิบวัน นับแต่วันประชุมใหญ่ของชุมนุม ให้คณะกรรมการบริหารชุมนุมรายงานผลดำเนินงานประจำปีของชุมนุม และผลการประชุมใหญ่ของชุมนุมให้นายกองค์การนักศึกษา พร้อมทั้งเสนอชื่อผู้ได้รับเลือกตั้งเป็นประธานชุมนุม และกรรมการบริหารชุมนุมต่อนายกองค์การนักศึกษาเพื่อแต่งตั้งเป็นคณะกรรมการบริหารชุมนุม",
            },
          },
        ],
      },
      {
        num: 67,
        title: { en: "Club committee qualifications", th: "คุณสมบัติของกรรมการบริหารชุมนุม" },
        body: [
          {
            kind: "para",
            text: {
              en: "A member of the club executive committee must be a member of that club, and must have the following qualifications and must not have the following prohibited characteristics:",
              th: "กรรมการในคณะกรรมการบริหารชุมนุมต้องเป็นสมาชิกของชุมนุมนั้น โดยมีคุณสมบัติและไม่มีลักษณะต้องห้ามดังต่อไปนี้",
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
                  {
                    marker: "(2)",
                    text: {
                      en: "being a member of the TUSC, a member of the TUSU Executive Committee, a member of the TUSU Executive Committee at centre level, a member of the Faculty Student Committee, or a member of the Student Dormitory Committee.",
                      th: "เป็นสมาชิกสภานักศึกษา หรือกรรมการในคณะกรรมการบริหารองค์การนักศึกษา หรือกรรมการในคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์ หรือกรรมการในคณะกรรมการหอพักนักศึกษา หรือกรรมการในคณะกรรมการนักศึกษาประจำคณะ",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        num: 68,
        title: { en: "Club committee", th: "คณะกรรมการบริหารชุมนุม" },
        body: [
          {
            kind: "para",
            text: {
              en: "The club executive committee shall hold office for a term of 1 year, and shall comprise:",
              th: "ให้คณะกรรมการบริหารชุมนุม มีวาระการดำรงตำแหน่งหนึ่งปี ซึ่งประกอบด้วย",
            },
          },
          {
            kind: "list",
            items: [
              { marker: "(1)", text: { en: "the club chairperson;", th: "ประธานชุมนุม" } },
              { marker: "(2)", text: { en: "the club vice-chairperson;", th: "รองประธานชุมนุม" } },
              { marker: "(3)", text: { en: "the club secretary;", th: "เลขานุการชุมนุม" } },
              { marker: "(4)", text: { en: "no more than 4 further committee members.", th: "กรรมการอื่นอีกไม่เกินสี่คน" } },
            ],
          },
          {
            kind: "para",
            text: {
              en: "Where the club executive committee's term expires, the club chairperson and the members of the club executive committee shall continue to perform their duties until a new club executive committee is appointed.",
              th: "ในกรณีที่คณะกรรมการบริหารชุมนุมหมดวาระ ให้ประธานชุมนุมและกรรมการในคณะกรรมการบริหารชุมนุมปฏิบัติหน้าที่ต่อไปจนกว่าจะมีการแต่งตั้งคณะกรรมการบริหารชุมนุมชุดใหม่",
            },
          },
        ],
      },
      {
        num: 69,
        title: { en: "Club annual report", th: "รายงานประจำปีของชุมนุม" },
        body: [
          {
            kind: "para",
            text: {
              en: "The club executive committee must prepare and report on the results of project implementation, its annual operations, its income-and-expenditure accounts, and the club's assets to the TUSC, and must complete this within 30 days before the end of the fiscal year.",
              th: "คณะกรรมการบริหารชุมนุมจะต้องจัดทำและรายงานผลการดำเนินโครงการ การดำเนินงานประจำปี บัญชีรายรับ รายจ่าย ตลอดจนทรัพย์สินของชุมนุมต่อสภานักศึกษา ให้แล้วเสร็จภายในสามสิบวันก่อนสิ้นปีงบประมาณ",
            },
          },
          {
            kind: "para",
            text: {
              en: "Once the TUSC has considered the report under paragraph one, the TUSC shall summarise that report and submit it to the University for further consideration.",
              th: "เมื่อสภานักศึกษาพิจารณารายงานตามวรรคหนึ่งแล้ว ให้สภานักศึกษาดำเนินการสรุปรายงานดังกล่าวเสนอมหาวิทยาลัยพิจารณาต่อไป",
            },
          },
        ],
      },
      {
        num: 70,
        title: { en: "Club advisory committee", th: "คณะกรรมการที่ปรึกษาชุมนุม" },
        body: [
          {
            kind: "para",
            text: {
              en: "The Rector or the Vice-Rector for Student Affairs shall appoint a club advisory committee according to the type of activity club, as proposed by the Student Affairs division.",
              th: "ให้อธิการบดีหรือรองอธิการบดีฝ่ายการนักศึกษาแต่งตั้งคณะกรรมการที่ปรึกษาชุมนุมตามประเภทชุมนุมกิจกรรม ตามที่ฝ่ายการนักศึกษาเสนอ",
            },
          },
          {
            kind: "para",
            text: {
              en: "The club advisory committee under paragraph one has the duty to give advice, guidance, and assistance to the club executive committee, so that the club's operations accord with the objectives of the club's founding.",
              th: "คณะกรรมการที่ปรึกษาชุมนุมตามวรรคหนึ่งมีหน้าที่ให้คำปรึกษา แนะนำ และช่วยเหลือแก่คณะกรรมการบริหารชุมนุม เพื่อให้การดำเนินงานของชุมนุมเป็นไปตามวัตถุประสงค์ของการก่อตั้งชุมนุม",
            },
          },
        ],
      },
      {
        num: 71,
        title: { en: "Dissolution of a club", th: "การยุบเลิกชุมนุม" },
        body: [
          {
            kind: "para",
            text: {
              en: "A student activity club shall be dissolved for any of the following reasons:",
              th: "ชุมนุมกิจกรรมนักศึกษาให้ยุบเลิกด้วยเหตุอย่างหนึ่งอย่างใด ดังนี้",
            },
          },
          {
            kind: "list",
            items: [
              { marker: "(1)", text: { en: "its membership falls below 50 persons;", th: "มีจำนวนสมาชิกไม่ถึงห้าสิบคน" } },
              { marker: "(2)", text: { en: "the club's members resolve, by a vote of no fewer than two-thirds, to dissolve the club;", th: "สมาชิกชุมนุมลงมติด้วยคะแนนเสียงไม่น้อยกว่าสองในสาม ให้ยุบเลิกชุมนุม" } },
              { marker: "(3)", text: { en: "the TUSU Executive Committee proposes to the TUSC that it consider dissolving the club;", th: "คณะกรรมการบริหารองค์การนักศึกษาเสนอความเห็นต่อสภานักศึกษาพิจารณายุบเลิกชุมนุม" } },
              {
                marker: "(4)",
                text: {
                  en: "the TUSC resolves to dissolve the club on the ground that the club has not carried out activities in accordance with its objectives, or has not operated in accordance with the club's regulation, for a period of 1 year.",
                  th: "สภานักศึกษามีมติให้ยกเลิกชุมนุม ด้วยเหตุเพราะชุมนุมไม่ได้จัดทำกิจกรรมตามวัตถุประสงค์หรือไม่มีการดำเนินการตามข้อบังคับชุมนุมมาเป็นเวลาหนึ่งปี",
                },
              },
            ],
          },
          {
            kind: "para",
            text: {
              en: "Once dissolution has been considered under paragraph one, the TUSC shall propose to the Rector that the Rector consider ordering the dissolution of that club.",
              th: "เมื่อมีการพิจารณายุบเลิกตามวรรคหนึ่งแล้ว ให้สภานักศึกษาเสนออธิการบดีพิจารณาสั่งยุบเลิกชุมนุมนั้น",
            },
          },
        ],
      },
    ],
  },
  {
    kind: { en: "Chapter", th: "หมวด" },
    number: "5",
    title: { en: "The Student Dormitory Committee", th: "คณะกรรมการหอพักนักศึกษา" },
    children: [
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "1",
        title: { en: "Composition", th: "องค์ประกอบของคณะกรรมการหอพักนักศึกษา" },
        provisions: [
          {
            num: 72,
            title: { en: "Composition", th: "องค์ประกอบ" },
            body: [
              {
                kind: "para",
                text: {
                  en: "There shall be a Student Dormitory Committee, comprising a chairperson who is an undergraduate student elected by the students of the dormitory, and other committee members, who are undergraduate students, numbering no more than 14 further persons.",
                  th: "ให้มีคณะกรรมการหอพักนักศึกษา ประกอบด้วยประธานกรรมการที่เป็นนักศึกษาระดับปริญญาตรีและได้รับการเลือกจากนักศึกษาหอพัก และกรรมการอื่นที่เป็นนักศึกษาระดับปริญญาตรีอีกไม่เกินสิบสี่คน",
                },
              },
            ],
          },
        ],
      },
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "2",
        title: { en: "Qualifications", th: "คุณสมบัติของคณะกรรมการหอพักนักศึกษา" },
        provisions: [
          {
            num: 73,
            title: { en: "Qualifications", th: "คุณสมบัติ" },
            body: [
              {
                kind: "para",
                text: {
                  en: "A member of the Student Dormitory Committee must have the following qualifications and must not have the following prohibited characteristics:",
                  th: "กรรมการในคณะกรรมการหอพักนักศึกษา จะต้องมีคุณสมบัติและไม่มีลักษณะต้องห้ามดังต่อไปนี้",
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
                      { marker: "(3)", text: { en: "being a student who resides in a student dormitory of the University;", th: "เป็นนักศึกษาซึ่งอาศัยอยู่ในหอพักนักศึกษาของมหาวิทยาลัย" } },
                      {
                        marker: "(4)",
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
                      {
                        marker: "(2)",
                        text: {
                          en: "being a member of the TUSC, a member of the TUSU Executive Committee, a member of the TUSU Executive Committee at centre level, a member of the Faculty Student Committee, or a member of a club executive committee;",
                          th: "เป็นสมาชิกสภานักศึกษา หรือกรรมการในคณะกรรมการบริหารองค์การนักศึกษา หรือกรรมการในคณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์ หรือกรรมการในคณะกรรมการนักศึกษาประจำคณะ หรือกรรมการในคณะกรรมการบริหารชุมนุม",
                        },
                      },
                      { marker: "(3)", text: { en: "being, or having been, a member of a Faculty-level election committee within the one-year period before the date of applying for election;", th: "เป็นกรรมการหรือเคยเป็นกรรมการการเลือกตั้งระดับคณะ ในระยะหนึ่งปีก่อนวันสมัครรับเลือกตั้ง" } },
                      {
                        marker: "(4)",
                        text: {
                          en: "having such other prohibited characteristics as the Vice-Rector for Student Affairs determines by issuing a Student Affairs division notice.",
                          th: "มีลักษณะต้องห้ามตามที่รองอธิการบดีฝ่ายการนักศึกษากำหนดโดยออกเป็นประกาศฝ่ายการนักศึกษา",
                        },
                      },
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
        title: { en: "Election of the chair", th: "การเลือกตั้งประธานคณะกรรมการหอพักนักศึกษา" },
        provisions: [
          {
            num: 74,
            title: { en: "Electorate", th: "ผู้มีสิทธิเลือกตั้ง" },
            body: [
              {
                kind: "para",
                text: {
                  en: "A person entitled to vote in the election of the chairperson of the Student Dormitory Committee must have the status of a student residing in a student dormitory of the University.",
                  th: "ผู้มีสิทธิลงคะแนนเสียงเลือกประธานคณะกรรมการหอพักนักศึกษาต้องมีสภาพเป็นนักศึกษาที่อาศัยอยู่ในหอพักนักศึกษาของมหาวิทยาลัย",
                },
              },
            ],
          },
          {
            num: 75,
            title: { en: "Election procedure", th: "หลักเกณฑ์และวิธีการเลือกตั้ง" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The criteria and procedure for conducting the election of the chairperson of the Student Dormitory Committee shall be as determined by the Vice-Rector for Student Affairs, issued as a Student Affairs division notice.",
                  th: "หลักเกณฑ์และวิธีการดำเนินการเลือกตั้งประธานคณะกรรมการหอพักนักศึกษาให้เป็นไปตามที่รองอธิการบดีฝ่ายการนักศึกษากำหนดโดยออกเป็นประกาศฝ่ายการนักศึกษา",
                },
              },
            ],
          },
          {
            num: 76,
            title: { en: "By-election before term ends", th: "การเลือกตั้งใหม่ก่อนครบวาระ" },
            body: [
              {
                kind: "para",
                text: {
                  en: "When fewer than 60 days remain in the term of office of the chairperson of the Student Dormitory Committee, the Vice-Rector for Student Affairs shall arrange for a new election of the chairperson of the Student Dormitory Committee to be held.",
                  th: "เมื่อวาระการดำรงตำแหน่งของประธานคณะกรรมการหอพักนักศึกษาเหลืออยู่ไม่ถึงหกสิบวัน ให้รองอธิการบดีฝ่ายการนักศึกษากำหนดให้มีการเลือกตั้งประธานคณะกรรมการหอพักนักศึกษาขึ้นใหม่",
                },
              },
            ],
          },
        ],
      },
      {
        kind: { en: "Division", th: "ส่วนที่" },
        number: "4",
        title: { en: "Powers and duties", th: "อำนาจหน้าที่ของคณะกรรมการหอพักนักศึกษา" },
        provisions: [
          {
            num: 77,
            title: { en: "Powers and duties", th: "อำนาจหน้าที่" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The Student Dormitory Committee has the following duties and powers, including responsibilities:",
                  th: "คณะกรรมการหอพักนักศึกษา มีหน้าที่และอำนาจรวมถึงความรับผิดชอบดังนี้",
                },
              },
              {
                kind: "list",
                items: [
                  {
                    marker: "(1)",
                    text: {
                      en: "to propose opinions to the TUSU, the TUSC, the Rector, or the University Council on matters affecting dormitory students;",
                      th: "เสนอความคิดเห็นต่อองค์การนักศึกษา สภานักศึกษา อธิการบดี หรือสภามหาวิทยาลัยในเรื่องที่มีผลกระทบต่อนักศึกษาหอพัก",
                    },
                  },
                  {
                    marker: "(2)",
                    text: {
                      en: "to administer all affairs relating to the activities of dormitory students;",
                      th: "บริหารกิจกรรมทั้งปวงเกี่ยวกับกิจกรรมของนักศึกษาหอพัก",
                    },
                  },
                  {
                    marker: "(3)",
                    text: {
                      en: "to supervise, monitor, and examine the operation of dormitory student activity clubs;",
                      th: "กำกับดูแล ติดตาม และตรวจสอบการทำงานของชมรมกิจกรรมนักศึกษาหอพัก",
                    },
                  },
                  {
                    marker: "(4)",
                    text: {
                      en: "to perform such other duties as are assigned by the advisory committee to the Student Dormitory Committee or the Dormitory Executive Committee.",
                      th: "ปฏิบัติหน้าที่อื่นตามที่คณะกรรมการที่ปรึกษาคณะกรรมการหอพักนักศึกษาหรือคณะกรรมการบริหารหอพักนักศึกษามอบหมาย",
                    },
                  },
                ],
              },
              {
                kind: "para",
                text: {
                  en: "The chairperson of the Student Dormitory Committee has the duty to act as the representative of dormitory students and to be responsible for the operation of the Student Dormitory Committee.",
                  th: "ประธานคณะกรรมการหอพักนักศึกษามีหน้าที่เป็นผู้แทนของนักศึกษาหอพัก และรับผิดชอบดำเนินงานคณะกรรมการหอพักนักศึกษา",
                },
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
            num: 78,
            title: { en: "Term and vacation of office", th: "วาระการดำรงตำแหน่งและการพ้นจากตำแหน่ง" },
            body: [
              {
                kind: "para",
                text: {
                  en: "The chairperson of the Student Dormitory Committee shall hold office for a term of 1 year.",
                  th: "ประธานกรรมการหอพักนักศึกษามีวาระการดำรงตำแหน่งคราวละ ๑ ปี",
                },
              },
              {
                kind: "para",
                text: {
                  en: "In addition to vacating office at the end of the term, the chairperson of the Student Dormitory Committee vacates office when:",
                  th: "นอกจากการพ้นจากตำแหน่งตามวาระ ให้ประธานกรรมการหอพักนักศึกษาพ้นจากตำแหน่งเมื่อ",
                },
              },
              {
                kind: "list",
                items: [
                  { marker: "(1)", text: { en: "death;", th: "ตาย" } },
                  { marker: "(2)", text: { en: "resignation;", th: "ลาออก" } },
                  { marker: "(3)", text: { en: "being subject to severe student disciplinary punishment;", th: "ถูกลงโทษวินัยนักศึกษาอย่างร้ายแรง" } },
                  { marker: "(4)", text: { en: "losing the qualifications or having a prohibited characteristic;", th: "ขาดคุณสมบัติหรือมีลักษณะต้องห้าม" } },
                  { marker: "(5)", text: { en: "ceasing to have the status of a dormitory student.", th: "พ้นสภาพการเป็นนักศึกษาหอพัก" } },
                ],
              },
              {
                kind: "para",
                text: {
                  en: "When the term of the chairperson of the Student Dormitory Committee expires or the chairperson vacates office, the members of the Student Dormitory Committee shall also vacate office.",
                  th: "เมื่อประธานกรรมการนักศึกษาหมดวาระหรือพ้นจากตำแหน่ง ให้กรรมการหอพักนักศึกษาพ้นจากตำแหน่งด้วย",
                },
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
            num: 79,
            title: { en: "Oversight", th: "การกำกับและดูแล" },
            body: [
              {
                kind: "para",
                text: {
                  en: "There shall be an advisory committee to the Student Dormitory Committee, appointed by the Rector or the Vice-Rector for Student Affairs.",
                  th: "ให้มีคณะกรรมการที่ปรึกษาคณะกรรมการหอพักนักศึกษา ซึ่งอธิการบดีหรือรองอธิการบดีฝ่ายการนักศึกษาแต่งตั้ง",
                },
              },
              {
                kind: "para",
                text: {
                  en: "The committee under paragraph one has the duty to supervise and oversee the operation of the Student Dormitory Committee to ensure that it accords with this Regulation, and with the regulations or notices of the University. In the case of a dispute in the course of operations that may cause damage to the common interest, the committee shall consider the matter, and once it has reached a decision, the Student Dormitory Committee and persons concerned shall comply with that decision.",
                  th: "ให้คณะกรรมการตามวรรคหนึ่งมีหน้าที่กำกับและดูแลการดำเนินงานของคณะกรรมการหอพักนักศึกษาให้เป็นไปโดยถูกต้องตามข้อบังคับ ระเบียบ หรือประกาศของมหาวิทยาลัย ในกรณีที่มีปัญหาขัดแย้งในการดำเนินงานซึ่งอาจส่งผลเสียหายต่อส่วนรวมให้คณะกรรมการเป็นผู้พิจารณา และเมื่อวินิจฉัยเป็นประการใดแล้ว ให้คณะกรรมการหอพักนักศึกษาและผู้เกี่ยวข้องปฏิบัติตามคำวินิจฉัยนั้น",
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
