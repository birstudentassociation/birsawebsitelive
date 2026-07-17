import type { Section } from "../types";

/**
 * Chapter 1 (หมวด ๑ วินัยนักศึกษา: Student discipline), ข้อ 6 to 9, of the
 * Regulation of Thammasat University on Student Discipline, B.E. 2568 (2025).
 */
export const chapter1: Section = {
  kind: { en: "Chapter", th: "หมวด" },
  number: "1",
  title: { en: "Student discipline", th: "วินัยนักศึกษา" },
  provisions: [
    {
      num: 6,
      title: { en: "Duty to maintain discipline", th: "หน้าที่รักษาวินัย" },
      body: [
        {
          kind: "para",
          text: {
            en: "A student shall maintain and comply with the discipline and code of ethics prescribed in the regulations and notices of the University and of a faculty unit, strictly and at all times.",
            th: "นักศึกษาต้องรักษาและปฏิบัติตามวินัยและจรรยาบรรณที่บัญญัติไว้ในข้อบังคับและประกาศของมหาวิทยาลัยและส่วนงานโดยเคร่งครัดอยู่เสมอ",
          },
        },
        {
          kind: "para",
          text: {
            en: "A breach of the code of ethics that constitutes a disciplinary offence shall be proceeded with in accordance with this Regulation.",
            th: "การประพฤติผิดจรรยาบรรณที่เป็นความผิดวินัย ให้ดำเนินการตามข้อบังคับนี้",
          },
        },
      ],
    },
    {
      num: 7,
      title: { en: "Disciplinary duties", th: "วินัยที่นักศึกษาพึงรักษา" },
      body: [
        {
          kind: "para",
          text: {
            en: "A student shall maintain discipline as follows:",
            th: "นักศึกษาพึงรักษาวินัย ดังต่อไปนี้",
          },
        },
        {
          kind: "list",
          items: [
            {
              marker: "(1)",
              text: {
                en: "A student shall not cause a disturbance, engage in a brawl or affray, consume alcohol or any other intoxicant, or gamble, within the premises of the University; and shall not destroy the property of the University or of any other person within the premises of the University.",
                th: "นักศึกษาต้องไม่ก่อเหตุวุ่นวาย ทะเลาะวิวาท เสพสุราหรือสิ่งมึนเมาอย่างอื่น หรือเล่นการพนัน ในบริเวณมหาวิทยาลัย รวมทั้งต้องไม่ทำลายทรัพย์สินของมหาวิทยาลัยหรือของบุคคลอื่นในบริเวณมหาวิทยาลัย",
              },
            },
            {
              marker: "(2)",
              text: {
                en: "A student shall maintain harmony among students, and between students and personnel, by not causing physical or mental injury, intimidating, bullying, harassing, threatening, or acting in a way that causes another person shame or distress, such as smoking or vaping outside a smoking area within the University, sexual harassment, or sending threatening messages to a student or personnel through a computer system.",
                th: "นักศึกษาต้องรักษาไว้ซึ่งความสามัคคีระหว่างนักศึกษา หรือระหว่างนักศึกษากับบุคลากร โดยห้ามไม่ให้ทำร้ายร่างกายหรือจิตใจ ข่มขู่ รังแก กลั่นแกล้ง ข่มเหง คุกคาม หรือกระทำให้บุคคลอื่นได้รับความอับอายหรือเดือดร้อนรำคาญ เช่น การสูบบุหรี่หรือบุหรี่ไฟฟ้าในเขตปลอดบุหรี่ในมหาวิทยาลัย การคุกคามทางเพศ หรือการส่งข้อความคุกคามผ่านระบบคอมพิวเตอร์ให้นักศึกษาหรือบุคลากร",
              },
            },
            {
              marker: "(3)",
              text: {
                en: "A student shall maintain the reputation and honour of the University, by not conducting themselves in a manner that may bring disrepute or damage to the University, such as becoming intoxicated with alcohol to the point of losing self-control, or displaying conduct unbecoming while wearing student attire, or dressing improperly in contravention of the regulations and notices of the University or of a faculty unit.",
                th: "นักศึกษาต้องรักษาไว้ซึ่งชื่อเสียงและเกียรติของมหาวิทยาลัย โดยต้องไม่ประพฤติตนในสิ่งที่อาจนำมาซึ่งความเสื่อมเสียหรือเสียหายแก่มหาวิทยาลัย เช่น ดื่มสุราจนมึนเมาจนครองสติไม่ได้ หรือแสดงพฤติกรรมที่ไม่เหมาะสมเมื่ออยู่ในชุดนักศึกษา หรือแต่งกายไม่ถูกต้องตามข้อบังคับและประกาศของมหาวิทยาลัยหรือส่วนงาน",
              },
            },
            {
              marker: "(4)",
              text: {
                en: "A student shall obey and comply with lawful orders, or the admonitions of a person working at the University in the performance of their duties.",
                th: "นักศึกษาต้องเชื่อฟังและปฏิบัติตามคำสั่งโดยชอบด้วยกฎหมาย หรือคำตักเตือนของผู้ปฏิบัติงานในมหาวิทยาลัยในการปฏิบัติหน้าที่",
              },
            },
          ],
        },
      ],
    },
    {
      num: 8,
      title: { en: "Serious disciplinary offences", th: "ความผิดวินัยอย่างร้ายแรง" },
      body: [
        {
          kind: "para",
          text: {
            en: "A student who commits any of the following acts is deemed to have committed a serious disciplinary offence:",
            th: "นักศึกษากระทำการดังต่อไปนี้ถือว่ากระทำผิดวินัยนักศึกษาอย่างร้ายแรง",
          },
        },
        {
          kind: "list",
          items: [
            {
              marker: "(1)",
              text: {
                en: "Committing any act, all elements of which constitute an offence for which the law prescribes a penalty of imprisonment exceeding five years.",
                th: "กระทำการใด ๆ ที่ครบองค์ประกอบความผิดซึ่งมีอัตราโทษตามกฎหมายให้จำคุกอย่างสูงเกินห้าปี",
              },
            },
            {
              marker: "(2)",
              text: {
                en: "Possessing or carrying a weapon, firearm, explosive, or other similarly dangerous item within the premises of the University, unless carried for the performance of duties, practice, or a sporting competition, or as part of instruction, or for any other purpose carried out with the authorisation of the Rector.",
                th: "ครอบครอง หรือพกพาอาวุธ ปืน วัตถุระเบิด หรือสิ่งอันตรายอื่นใดในลักษณะเดียวกันในบริเวณมหาวิทยาลัย เว้นแต่เป็นการพกพามาเพื่อปฏิบัติงาน ฝึกซ้อม หรือแข่งขันกีฬา หรือเป็นส่วนหนึ่งของการเรียนการสอน หรือเพื่อการดำเนินการอื่นใดโดยได้รับอนุญาตจากอธิการบดี",
              },
            },
            {
              marker: "(3)",
              text: {
                en: "Being liable to a term of imprisonment by a final judgment of the court, except where the penalty is for an offence committed negligently or a petty offence.",
                th: "ต้องโทษจำคุกโดยคำพิพากษาคดีอาญาถึงที่สุด เว้นแต่เป็นโทษสำหรับความผิดที่ได้กระทำโดยประมาท หรือความผิดลหุโทษ",
              },
            },
            {
              marker: "(4)",
              text: {
                en: "Committing dishonesty in academic assessment, which includes communicating with another person, or using a tool or other device without authorisation; hiring another person to answer questions or produce work in one's place without authorisation; copying another's work; infringing intellectual property; fabricating data; using a device fabricated for such purpose in contravention of a notice of the University; and including giving assistance of any kind to enable another student to commit dishonesty in academic assessment.",
                th: "กระทำการทุจริตในการวัดผลการศึกษา ซึ่งหมายความรวมถึงการสื่อสารกับบุคคลอื่น หรือใช้เครื่องมือหรืออุปกรณ์อื่นโดยไม่ได้รับอนุญาต การจ้างบุคคลอื่นในการทำคำตอบหรือทำผลงานแทนตนโดยไม่ได้รับอนุญาต การคัดลอกผลงาน การละเมิดทรัพย์สินทางปัญญา การสร้างข้อมูลเท็จ การใช้เครื่องมือทางปัญญาประดิษฐ์โดยขัดต่อประกาศมหาวิทยาลัย รวมถึงการให้ความช่วยเหลือด้วยประการใด ๆ ให้นักศึกษาคนอื่นทำการทุจริตในการวัดผลการศึกษา",
              },
            },
            {
              marker: "(5)",
              text: {
                en: "Committing an act prohibited under section 7(2) that constitutes unfair discrimination on grounds of place of origin, race, language, sex, gender, age, disability, physical condition, health condition, personal status, economic or social status, religious belief, or education or training.",
                th: "กระทำการซึ่งต้องห้ามตามข้อ ๗ (๒) อันเป็นการเลือกปฏิบัติโดยไม่เป็นธรรมเพราะเหตุความแตกต่างทางถิ่นกำเนิด เชื้อชาติ ภาษา เพศ เพศสภาพ อายุ ความพิการ สภาพทางกาย สุขภาพ สถานะของบุคคล ฐานะทางเศรษฐกิจหรือสังคม ความเชื่อทางศาสนา หรือการศึกษาอบรม",
              },
            },
            {
              marker: "(6)",
              text: {
                en: "Committing an act prohibited under section 7 to such an extent that it affects the normal operations of the University, or seriously affects the relationship between the University and any person or organisation.",
                th: "กระทำการซึ่งต้องห้ามตามข้อ ๗ จนเป็นเหตุให้กระทบต่อการดำเนินการของมหาวิทยาลัยตามปกติ หรือกระทบต่อความสัมพันธ์ระหว่างมหาวิทยาลัยกับบุคคล หรือองค์กรอื่นอย่างร้ายแรง",
              },
            },
            {
              marker: "(7)",
              text: {
                en: "Repeating, during the period one holds the status of a student, an act prohibited under section 7 for which the same penalty was previously imposed.",
                th: "กระทำการซึ่งต้องห้ามตามข้อ ๗ ในอนุมาตราเดิมซ้ำในระหว่างที่มีสถานภาพนักศึกษา",
              },
            },
          ],
        },
      ],
    },
    {
      num: 9,
      title: { en: "Instigators and abettors", th: "ผู้ใช้และผู้สนับสนุน" },
      body: [
        {
          kind: "para",
          text: {
            en: "Any student who acts as a principal, an instigator, an inciter, or an abettor of another student to commit a disciplinary offence under this Regulation shall be deemed to have committed a disciplinary offence of the same character.",
            th: "นักศึกษาผู้ใดประพฤติตนเป็นตัวการ ผู้ใช้ ผู้โฆษณา หรือผู้สนับสนุนนักศึกษาอื่นให้กระทำความผิดวินัยนักศึกษาในข้อบังคับนี้ ให้ถือว่ากระทำความผิดวินัยในลักษณะเดียวกัน",
          },
        },
      ],
    },
  ],
};
