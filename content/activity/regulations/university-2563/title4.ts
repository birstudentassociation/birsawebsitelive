import type { Section } from "../types";

/**
 * Title 4 (ลักษณะ ๔): The Election Commission (ข้อ 80 to 87), of the
 * Regulation of Thammasat University on Student Activities, B.E. 2563 (2020).
 */
export const title4: Section = {
  kind: { en: "Title", th: "ลักษณะ" },
  number: "4",
  title: { en: "The Election Commission", th: "คณะกรรมการการเลือกตั้ง" },
  provisions: [
    {
      num: 80,
      title: { en: "Composition", th: "องค์ประกอบ" },
      body: [
        {
          kind: "para",
          text: {
            en: "The Election Commission comprises 9 undergraduate students who have been sought out and nominated as members in accordance with this Regulation.",
            th: "คณะกรรมการการเลือกตั้งประกอบด้วย นักศึกษาระดับปริญญาตรีซึ่งได้รับการสรรหาและเสนอชื่อตามข้อบังคับนี้ จำนวนเก้าคน เป็นกรรมการ",
          },
        },
      ],
    },
    {
      num: 81,
      title: { en: "Term of office", th: "วาระการดำรงตำแหน่ง" },
      body: [
        {
          kind: "para",
          text: {
            en: "A member of the Election Commission shall hold office for a term of 1 year from the date of appointment, and may hold office for no more than 2 consecutive terms.",
            th: "คณะกรรมการการเลือกตั้ง มีวาระการดำรงตำแหน่งคราวละหนึ่งปี นับแต่วันที่ได้รับการแต่งตั้ง และดำรงตำแหน่งติดต่อกันได้ไม่เกินสองวาระ",
          },
        },
        {
          kind: "para",
          text: {
            en: "In addition to vacating office at the end of the term, a member of the Election Commission vacates office when:",
            th: "นอกจากการพ้นจากตำแหน่งตามวาระกรรมการการเลือกตั้ง พ้นจากตำแหน่งเมื่อ",
          },
        },
        {
          kind: "list",
          items: [
            { marker: "(1)", text: { en: "death;", th: "ตาย" } },
            { marker: "(2)", text: { en: "resignation;", th: "ลาออก" } },
            {
              marker: "(3)",
              text: {
                en: "being subject to severe student disciplinary punishment;",
                th: "ถูกลงโทษวินัยนักศึกษาอย่างร้ายแรง",
              },
            },
            {
              marker: "(4)",
              text: {
                en: "losing the qualifications or having a prohibited characteristic;",
                th: "ขาดคุณสมบัติหรือมีลักษณะต้องห้าม",
              },
            },
            {
              marker: "(5)",
              text: {
                en: "ceasing to have the status of a student of the University.",
                th: "พ้นสภาพการเป็นนักศึกษาของมหาวิทยาลัย",
              },
            },
          ],
        },
        {
          kind: "para",
          text: {
            en: "A member of the Election Commission appointed to replace a member who has vacated office shall hold office only for the remainder of the term of the member he or she replaces.",
            th: "กรรมการการเลือกตั้งที่ได้รับการแต่งตั้งแทนกรรมการที่ต้องพ้นจากตำแหน่งให้มีวาระการดำรงตำแหน่งเท่าที่เหลืออยู่ของผู้ที่ตนแทน",
          },
        },
      ],
    },
    {
      num: 82,
      title: { en: "Qualifications", th: "คุณสมบัติ" },
      body: [
        {
          kind: "para",
          text: {
            en: "A member of the Election Commission must have the following qualifications and must not have the following prohibited characteristics:",
            th: "กรรมการการเลือกตั้งต้องมีคุณสมบัติและไม่มีลักษณะต้องห้าม ดังต่อไปนี้",
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
                {
                  marker: "(2)",
                  text: {
                    en: "having an academic record of not lower than 2.00.",
                    th: "มีผลการศึกษาเฉลี่ยไม่ต่ำกว่า ๒.๐๐",
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
                    en: "having studied at the University for more than 4 academic years in the case of a curriculum with a duration of study of 4 academic years, more than 5 academic years in the case of a curriculum with a duration of study of 5 academic years, or more than 6 academic years in the case of a curriculum with a duration of study of 6 academic years;",
                    th: "ศึกษาอยู่ในมหาวิทยาลัยไม่เกินกว่าสี่ปีการศึกษาสำหรับหลักสูตรที่มีระยะเวลาศึกษาสี่ปีการศึกษา หรือไม่เกินห้าปีการศึกษาสำหรับหลักสูตรที่มีระยะเวลาศึกษาห้าปีการศึกษา หรือไม่เกินหกปีการศึกษาสำหรับหลักสูตรที่มีระยะเวลาศึกษาหกปีการศึกษา",
                  },
                },
                {
                  marker: "(2)",
                  text: {
                    en: "having been subject to student disciplinary punishment within the one-year period before the date of applying for election;",
                    th: "เคยเป็นผู้ถูกลงโทษวินัยนักศึกษาในระยะหนึ่งปีก่อนวันสมัครรับเลือกตั้ง",
                  },
                },
                {
                  marker: "(3)",
                  text: {
                    en: "being under student disciplinary proceedings;",
                    th: "อยู่ระหว่างถูกดำเนินการทางวินัยนักศึกษา",
                  },
                },
                {
                  marker: "(4)",
                  text: {
                    en: "being a member of the TUSC, the TUSU Executive Committee, the TUSU Executive Committee at centre level, the chairperson or a member of the Faculty Student Committee, the chairperson or a member of the Student Dormitory Committee, or the chairperson or a member of a student activity club;",
                    th: "เป็นสมาชิกสภานักศึกษา คณะกรรมการบริหารองค์การนักศึกษา คณะกรรมการบริหารองค์การนักศึกษาระดับศูนย์ ประธานหรือกรรมการในคณะกรรมการนักศึกษาประจำคณะ ประธานหรือกรรมการในคณะกรรมการหอพักนักศึกษา หรือประธานหรือกรรมการในชุมนุมกิจกรรมนักศึกษา",
                  },
                },
                {
                  marker: "(5)",
                  text: {
                    en: "having such other prohibited characteristics as the Rector determines by issuing a University notice.",
                    th: "มีลักษณะต้องห้ามตามที่อธิการบดีกำหนดโดยออกเป็นประกาศมหาวิทยาลัย",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      num: 83,
      title: { en: "Selection process", th: "การสรรหา" },
      body: [
        {
          kind: "para",
          text: {
            en: "The seeking-out of members of the Election Commission shall be in accordance with the criteria and procedure determined by the Vice-Rector for Student Affairs, under consultation with the President of the TUSU and the President of the TUSC.",
            th: "การสรรหากรรมการการเลือกตั้ง ให้เป็นไปตามหลักเกณฑ์และวิธีการที่รองอธิการบดีฝ่ายการนักศึกษากำหนด ทั้งนี้ภายใต้การหารือกับนายกองค์การนักศึกษาและประธานสภานักศึกษา",
          },
        },
      ],
    },
    {
      num: 84,
      title: { en: "Approval by the TUSC", th: "ความเห็นชอบของสภานักศึกษา" },
      body: [
        {
          kind: "para",
          text: {
            en: "A person sought out and selected as a member of the Election Commission must receive the approval of the TUSC by a vote of more than one-half before being submitted to the Rector for consideration of appointment.",
            th: "ผู้ได้รับการสรรหาและคัดเลือกเป็นกรรมการการเลือกตั้ง ต้องได้รับความเห็นชอบจากสภานักศึกษาด้วยคะแนนเสียงเกินกว่ากึ่งหนึ่งก่อนที่จะนำเสนออธิการบดีเพื่อพิจารณาแต่งตั้ง",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where approval is not obtained under paragraph one, if the Student Affairs Committee approves, by a vote of two-thirds of the Student Affairs Committee, that the same person hold the position of member of the Election Commission, the matter shall be submitted to the Rector for appointment without the need to seek the approval of the TUSC again.",
            th: "ในกรณีที่ไม่ได้รับความเห็นชอบตามวรรคหนึ่ง หากคณะกรรมการกิจการนักศึกษาเห็นชอบให้บุคคลเดิมดำรงตำแหน่งกรรมการการเลือกตั้งด้วยคะแนนเสียงสองในสามของคณะกรรมการกิจการนักศึกษา และให้เสนออธิการบดีแต่งตั้งโดยไม่ต้องขอความเห็นชอบจากสภานักศึกษาอีก",
          },
        },
      ],
    },
    {
      num: 85,
      title: { en: "Chairperson and secretary", th: "ประธานและเลขานุการ" },
      body: [
        {
          kind: "para",
          text: {
            en: "Once appointed as members of the Election Commission, the Election Commission shall select one member to be the chairperson and another member to be the secretary of the Commission.",
            th: "เมื่อได้รับการแต่งตั้งเป็นกรรมการการเลือกตั้งแล้ว ให้คณะกรรมการการเลือกตั้งเลือกกรรมการคนหนึ่งเป็นประธานกรรมการ และเลือกกรรมการอีกคนหนึ่งเป็นเลขานุการคณะกรรมการ",
          },
        },
        {
          kind: "para",
          text: {
            en: "The chairperson of the Commission under paragraph one acts as the representative of the Election Commission and is the chairperson of its meetings.",
            th: "ประธานคณะกรรมการตามวรรคหนึ่งทำหน้าที่เป็นผู้แทนของคณะกรรมการการเลือกตั้งและเป็นประธานที่ประชุมด้วย",
          },
        },
        {
          kind: "para",
          text: {
            en: "The secretary of the Election Commission has the duty of responsibility for the general administrative work of the Election Commission, as well as such other work as is assigned by the chairperson of the Election Commission.",
            th: "เลขานุการคณะกรรมการการเลือกตั้ง มีหน้าที่รับผิดชอบงานธุรการของคณะกรรมการการเลือกตั้ง ตลอดจนงานอื่น ๆ ตามที่ประธานคณะกรรมการการเลือกตั้งมอบหมาย",
          },
        },
      ],
    },
    {
      num: 86,
      title: { en: "Powers and duties", th: "อำนาจหน้าที่" },
      body: [
        {
          kind: "para",
          text: {
            en: "The Election Commission has the following duties and powers, including responsibilities:",
            th: "คณะกรรมการการเลือกตั้ง มีหน้าที่และอำนาจรวมถึงความรับผิดชอบดังต่อไปนี้",
          },
        },
        {
          kind: "list",
          items: [
            {
              marker: "(1)",
              text: {
                en: "to propose rules concerning the operation and meetings of the Election Commission to the TUSC for approval;",
                th: "เสนอระเบียบเกี่ยวกับการดำเนินงานและการประชุมของคณะกรรมการการเลือกตั้งต่อสภานักศึกษาเพื่อพิจารณาอนุมัติ",
              },
            },
            {
              marker: "(2)",
              text: {
                en: "to propose the criteria and procedure for the election of members of the TUSC, the President of the TUSU, and a Vice-President of the TUSU, to the Rector or the Vice-Rector for Student Affairs, for issuance as a University notice, under consultation with the President of the TUSC and the President of the TUSU;",
                th: "เสนอหลักเกณฑ์และวิธีการเลือกตั้งสมาชิกสภานักศึกษา นายกองค์การนักศึกษา และอุปนายกองค์การนักศึกษาต่ออธิการบดีหรือรองอธิการบดีฝ่ายการนักศึกษา เพื่อออกเป็นประกาศมหาวิทยาลัย ทั้งนี้ภายใต้การหารือกับประธานสภานักศึกษาและนายกองค์การนักศึกษา",
              },
            },
            {
              marker: "(3)",
              text: {
                en: "to arrange or conduct the election of members of the TUSC, the President of the TUSU, and a Vice-President of the TUSU, under this Regulation;",
                th: "จัดหรือดำเนินการให้มีการเลือกตั้งสมาชิกสภานักศึกษา นายกองค์การนักศึกษา และอุปนายกองค์การนักศึกษา ตามข้อบังคับนี้",
              },
            },
            {
              marker: "(4)",
              text: {
                en: "to control the election of members of the TUSC, the President of the TUSU, and a Vice-President of the TUSU, and any referendum under this Regulation, to ensure that they are conducted honestly and fairly; a referendum shall be proposed by the TUSU Executive Committee, with the approval of the TUSC;",
                th: "ควบคุมการเลือกตั้งสมาชิกสภานักศึกษา นายกองค์การนักศึกษา และอุปนายกองค์การนักศึกษา และการออกเสียงประชามติตามข้อบังคับให้เป็นไปโดยสุจริตและเที่ยงธรรม การออกเสียงประชามติให้คณะกรรมการบริหารองค์การนักศึกษา โดยความเห็นชอบของสภานักศึกษาเป็นผู้เสนอ",
              },
            },
            {
              marker: "(5)",
              text: {
                en: "to control, examine, and compile the membership registers of student parties standing for election to the TUSC, the President of the TUSU, or a Vice-President of the TUSU, under this Regulation;",
                th: "ควบคุม ตรวจสอบและจัดทำข้อมูลทะเบียนสมาชิกพรรคนักศึกษาที่ลงสมัครรับเลือกสภานักศึกษา นายกองค์การนักศึกษา อุปนายกองค์การนักศึกษา ตามข้อบังคับนี้",
              },
            },
            {
              marker: "(6)",
              text: {
                en: "to supervise, control, and oversee the operation, and the approval and authorisation, within its powers and duties, of matters concerning the budget, materials and equipment, documents of all kinds, working spaces, and public-relations media and other electronic media, of the TUSC or the TUSU, during the period of an election until the appointment of a new TUSC or TUSU, as the case may be, taking up office;",
                th: "กำกับ ควบคุม ดูแลการทำงาน การอนุมัติ อนุญาตตามอำนาจหน้าที่ ทั้งในส่วนของงบประมาณ วัสดุอุปกรณ์ สรรพเอกสาร ห้องปฏิบัติงาน สื่อประชาสัมพันธ์และสื่ออิเล็กทรอนิกส์อื่นใดของสภานักศึกษาหรือองค์การนักศึกษา ในช่วงระหว่างที่มีการเลือกตั้งไปจนกว่าจะมีการแต่งตั้งสภานักศึกษาหรือองค์การนักศึกษาชุดใหม่แล้วแต่กรณี เข้ารับหน้าที่",
              },
            },
            {
              marker: "(7)",
              text: {
                en: "such other duties as are assigned by the Rector or the Vice-Rector for Student Affairs.",
                th: "หน้าที่อื่นตามที่อธิการบดีหรือรองอธิการบดีฝ่ายการนักศึกษามอบหมาย",
              },
            },
          ],
        },
        {
          kind: "para",
          text: {
            en: "The Election Commission shall determine rules for carrying out the matters under (4), (5), and (6), by submitting them to the TUSC for approval.",
            th: "ทั้งนี้ให้คณะกรรมการการเลือกตั้งกำหนดระเบียบ เพื่อดำเนินการตามความใน (๔) (๕) (๖) โดยเสนอต่อสภานักศึกษาเพื่อพิจารณาอนุมัติ",
          },
        },
      ],
    },
    {
      num: 87,
      title: { en: "Student parties", th: "พรรคนักศึกษา" },
      body: [
        {
          kind: "para",
          text: {
            en: "A student who stands for election to the TUSC, the President of the TUSU, or a Vice-President of the TUSU under this Regulation must belong to a student party, and a student party must have no fewer than 50 students as members and must have duly completed the registration of the party's establishment with the Election Commission.",
            th: "นักศึกษาที่ลงสมัครรับเลือกตั้งสภานักศึกษา นายกองค์การนักศึกษา อุปนายกองค์การนักศึกษา ตามข้อบังคับนี้ ต้องสังกัดพรรค โดยพรรคนักศึกษาต้องมีสมาชิกพรรคเป็นนักศึกษาจำนวนไม่น้อยกว่าห้าสิบคน และดำเนินการจดจัดตั้งพรรคต่อคณะกรรมการการเลือกตั้งเรียบร้อยแล้ว",
          },
        },
        {
          kind: "para",
          text: {
            en: "The criteria, procedure, and requirements relating to the establishment of a student party under this Regulation shall be as determined by the Rector, on the proposal of the Election Commission, issued as a University notice.",
            th: "หลักเกณฑ์ วิธีการและข้อกำหนดที่เกี่ยวข้องกับการจัดตั้งพรรคนักศึกษาตามข้อบังคับนี้ให้เป็นไปตามที่อธิการบดีกำหนดตามข้อเสนอของคณะกรรมการการเลือกตั้ง โดยออกเป็นประกาศมหาวิทยาลัย",
          },
        },
      ],
    },
  ],
};
