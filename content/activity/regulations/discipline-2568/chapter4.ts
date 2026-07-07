import type { Section } from "../types";

/**
 * Chapter 4 (หมวด ๔ คณะกรรมการอุทธรณ์วินัยนักศึกษา, ข้อ 25–40) of the
 * Regulation of Thammasat University on Student Discipline, B.E. 2568 (2025).
 */
export const chapter4: Section = {
  kind: { en: "Chapter", th: "หมวด" },
  number: "4",
  title: {
    en: "The Student Discipline Appeals Committee",
    th: "คณะกรรมการอุทธรณ์วินัยนักศึกษา",
  },
  provisions: [
    {
      num: 25,
      title: { en: "Composition of the Appeals Committee", th: "องค์ประกอบของคณะกรรมการ" },
      body: [
        {
          kind: "para",
          text: {
            en: "There shall be a Student Discipline Appeals Committee appointed by the Rector, consisting of:",
            th: "ให้มีคณะกรรมการอุทธรณ์วินัยนักศึกษาคณะหนึ่งซึ่งอธิการบดีแต่งตั้ง ประกอบด้วย",
          },
        },
        {
          kind: "list",
          items: [
            {
              marker: "(1)",
              text: {
                en: "a legal expert, as Chairperson;",
                th: "ผู้ทรงคุณวุฒิด้านกฎหมาย เป็นประธาน",
              },
            },
            {
              marker: "(2)",
              text: {
                en: "full-time faculty members proposed by the Rector, numbering three persons, as members, drawn from the social-sciences group, the sciences group, and the health-sciences group, one from each group;",
                th: "คณาจารย์ประจำที่มาจากการเสนอชื่อโดยอธิการบดี จำนวนสามคน เป็นกรรมการ โดยมาจากคณะสายสังคมศาสตร์ สายวิทยาศาสตร์ และสายสุขศาสตร์ สายละหนึ่งคน",
              },
            },
            {
              marker: "(3)",
              text: {
                en: "full-time faculty members proposed by the Student Council, numbering two persons.",
                th: "คณาจารย์ประจำที่มาจากการเสนอชื่อของสภานักศึกษา จำนวนสองคน",
              },
            },
          ],
        },
        {
          kind: "para",
          text: {
            en: "The Director of the Student Affairs Division, or a representative, shall be a member and secretary, and an officer of the University attached to the Student Affairs Division, numbering one person, shall be an assistant secretary.",
            th: "ให้ผู้อำนวยการกองกิจการนักศึกษาหรือผู้แทนเป็นกรรมการและเลขานุการ และให้ผู้ปฏิบัติงานในมหาวิทยาลัยซึ่งสังกัดกองกิจการนักศึกษาจำนวนหนึ่งคน เป็นผู้ช่วยเลขานุการ",
          },
        },
      ],
    },
    {
      num: 26,
      title: { en: "Term of office", th: "วาระการดำรงตำแหน่ง" },
      body: [
        {
          kind: "para",
          text: {
            en: "The Student Discipline Appeals Committee shall hold office for a term of two years from the date of appointment, and may be reappointed.",
            th: "คณะกรรมการอุทธรณ์วินัยนักศึกษามีวาระการดำรงตำแหน่งคราวละสองปีนับแต่วันที่ได้รับแต่งตั้ง และอาจได้รับแต่งตั้งใหม่อีกได้",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where the Chairperson of the Student Discipline Appeals Committee and members of the Student Discipline Appeals Committee vacate office on expiry of their term, the appointment of persons to hold the new office shall be carried out within sixty days from the date on which the former Chairperson and members vacated office. Where appointment has not yet been made, the former Chairperson and members shall continue to perform their duties until persons are appointed to hold the new office.",
            th: "ในกรณีที่ประธานคณะกรรมการอุทธรณ์วินัยนักศึกษาและกรรมการอุทธรณ์วินัยนักศึกษาพ้นจากตำแหน่งตามวาระ ให้ดำเนินการแต่งตั้งผู้ดำรงตำแหน่งใหม่ภายในกำหนดหกสิบวันนับแต่วันที่ประธานคณะกรรมการอุทธรณ์วินัยนักศึกษาและกรรมการอุทธรณ์วินัยนักศึกษาเดิมพ้นจากตำแหน่ง กรณีที่ยังไม่ได้แต่งตั้ง ให้ประธานคณะกรรมการอุทธรณ์วินัยนักศึกษาและกรรมการอุทธรณ์วินัยนักศึกษาเดิมปฏิบัติหน้าที่ต่อไปก่อนจนกว่าจะได้แต่งตั้งผู้ดำรงตำแหน่งใหม่",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where the position of Chairperson of the Student Discipline Appeals Committee or of a member of the Student Discipline Appeals Committee falls vacant before the expiry of its term, the appointment of a person to hold the new office in place of the vacancy shall be carried out within sixty days from the date on which the vacancy arose. A person appointed as Chairperson of the Student Discipline Appeals Committee, or as a member of the Student Discipline Appeals Committee, in place of the vacancy shall remain in office only for the remainder of the term of the person he or she replaces.",
            th: "ในกรณีที่ตำแหน่งประธานคณะกรรมการอุทธรณ์วินัยนักศึกษาหรือกรรมการอุทธรณ์วินัยนักศึกษาว่างลงก่อนกำหนด ให้ดำเนินการแต่งตั้งผู้ดำรงตำแหน่งใหม่แทนภายในกำหนดหกสิบวันนับแต่วันที่ตำแหน่งดังกล่าวว่างลง ผู้ซึ่งได้รับแต่งตั้งเป็นประธานคณะกรรมการอุทธรณ์วินัยนักศึกษา หรือกรรมการอุทธรณ์วินัยนักศึกษาแทนนั้น ให้อยู่ในตำแหน่งได้เพียงเท่ากำหนดเวลาของผู้ซึ่งตนแทน",
          },
        },
      ],
    },
    {
      num: 27,
      title: { en: "Powers and duties", th: "อำนาจหน้าที่" },
      body: [
        {
          kind: "para",
          text: {
            en: "The Student Discipline Appeals Committee has the powers and duties as follows:",
            th: "คณะกรรมการอุทธรณ์วินัยนักศึกษามีอำนาจหน้าที่ ดังต่อไปนี้",
          },
        },
        {
          kind: "list",
          items: [
            {
              marker: "(1)",
              text: {
                en: "to consider and adjudicate matters under appeal;",
                th: "พิจารณาและวินิจฉัยสั่งการเรื่องที่อุทธรณ์",
              },
            },
            {
              marker: "(2)",
              text: {
                en: "to summon any person to give a statement, or to submit documents, electronic documents, or any object, for use in the consideration as necessary;",
                th: "เรียกบุคคลใดมาให้ถ้อยคำ หรือให้ส่งเอกสาร หรือเอกสารอิเล็กทรอนิกส์ หรือวัตถุใด ๆ มาเพื่อประกอบการพิจารณาได้ตามความจำเป็น",
              },
            },
            {
              marker: "(3)",
              text: {
                en: "to appoint a person or a body of persons to consider or perform any act that falls within the power of the Student Discipline Appeals Committee;",
                th: "แต่งตั้งบุคคลหรือคณะบุคคลเพื่อพิจารณา หรือปฏิบัติการอย่างใดอย่างหนึ่ง ซึ่งอยู่ในอำนาจของคณะกรรมการอุทธรณ์วินัยนักศึกษาก็ได้",
              },
            },
            {
              marker: "(4)",
              text: {
                en: "other duties as assigned by the University.",
                th: "หน้าที่อื่น ๆ ตามที่มหาวิทยาลัยมอบหมาย",
              },
            },
          ],
        },
      ],
    },
    {
      num: 28,
      title: { en: "Meetings and quorum", th: "การประชุมและองค์ประชุม" },
      body: [
        {
          kind: "para",
          text: {
            en: "A meeting shall require the attendance of not fewer than one-half of the total number of members of the Student Discipline Appeals Committee to constitute a quorum.",
            th: "การประชุมต้องมีกรรมการอุทธรณ์วินัยนักศึกษามาประชุมไม่น้อยกว่ากึ่งหนึ่งของจำนวนกรรมการทั้งหมด จึงเป็นองค์ประชุม",
          },
        },
        {
          kind: "para",
          text: {
            en: "At a meeting, if the Chairperson of the Student Discipline Appeals Committee is not present at the meeting, or is unable to perform his or her duty, or there is no Chairperson, the meeting shall select one of the members of the Appeals Committee to act as Chairperson of the Student Discipline Appeals Committee.",
            th: "ในการประชุม ถ้าประธานคณะกรรมการอุทธรณ์วินัยนักศึกษาไม่อยู่ในที่ประชุม หรือไม่สามารถปฏิบัติหน้าที่ได้ หรือไม่มีประธาน ให้ที่ประชุมเลือกกรรมการอุทธรณ์คนหนึ่งทำหน้าที่ประธานคณะกรรมการอุทธรณ์วินัยนักศึกษา",
          },
        },
        {
          kind: "para",
          text: {
            en: "A decision shall be made by a majority vote of those attending the meeting. In the event of an equality of votes, the Chairperson of the Student Discipline Appeals Committee at the meeting shall have an additional casting vote.",
            th: "การวินิจฉัยชี้ขาดให้ถือเสียงข้างมากของผู้เข้าประชุม ถ้ามีคะแนนเสียงเท่ากันให้ประธานคณะกรรมการอุทธรณ์วินัยนักศึกษาในที่ประชุมออกเสียงเพิ่มขึ้นอีกหนึ่งเสียงเป็นเสียงชี้ขาด",
          },
        },
      ],
    },
    {
      num: 29,
      title: { en: "Right of appeal", th: "สิทธิในการอุทธรณ์" },
      body: [
        {
          kind: "para",
          text: {
            en: "An appeal may be lodged for oneself only, and an appeal must be lodged within thirty days from the date of receiving notice or being deemed to have received notice of the order.",
            th: "การอุทธรณ์ ให้อุทธรณ์ได้สำหรับตนเองเท่านั้น และให้อุทธรณ์ภายในสามสิบวันนับแต่วันได้รับทราบหรือถือว่าทราบคำสั่ง",
          },
        },
        {
          kind: "para",
          text: {
            en: "An appeal must be made in writing setting out the facts and the grounds of the appeal, and must show how the order is incorrect, inappropriate, or has not accorded fairness, together with the signature, the unit to which the appellant belongs, and the address of the appealing student.",
            th: "การอุทธรณ์ต้องทำเป็นหนังสือแสดงข้อเท็จจริงและเหตุผลในการอุทธรณ์ และแสดงให้เห็นว่าคำสั่งไม่ถูกต้อง ไม่เหมาะสม หรือไม่ได้รับความเป็นธรรมอย่างไร พร้อมลงลายมือชื่อ ส่วนงานที่สังกัด และที่อยู่ของนักศึกษาผู้อุทธรณ์",
          },
        },
        {
          kind: "para",
          text: {
            en: "In lodging an appeal, if the appealing student wishes to make an oral statement in the course of consideration by the Student Discipline Appeals Committee, this wish shall be indicated in the notice of appeal.",
            th: "ในการอุทธรณ์ ถ้านักศึกษาผู้อุทธรณ์ประสงค์จะแถลงการณ์ด้วยวาจาในชั้นพิจารณาของคณะกรรมการอุทธรณ์วินัยนักศึกษา ให้แสดงความประสงค์ไว้ในหนังสืออุทธรณ์",
          },
        },
      ],
    },
    {
      num: 30,
      title: { en: "Appeal does not stay penalty", th: "อุทธรณ์ไม่เป็นเหตุทุเลาการบังคับ" },
      body: [
        {
          kind: "para",
          text: {
            en: "An appeal is not grounds for a stay of enforcement of a penalty order under section 22, except where the Appeals Committee orders a stay of enforcement of a case under appeal under section 38, paragraph two. In such a case, enforcement of the penalty order shall be stayed pending the consideration and adjudication of the Student Discipline Appeals Committee.",
            th: "การอุทธรณ์ไม่เป็นเหตุให้ทุเลาการบังคับตามคำสั่งลงโทษตามข้อ ๒๒ เว้นแต่คณะกรรมการอุทธรณ์จะมีคำสั่งให้ทุเลาการบังคับคดีอุทธรณ์วินัยนักศึกษาตามข้อ ๓๘ วรรคสอง ในกรณีดังกล่าว ให้ทุเลาการบังคับตามคำสั่งลงโทษไว้ก่อนจนกว่าคณะกรรมการอุทธรณ์วินัยนักศึกษาจะพิจารณาและมีคำวินิจฉัย",
          },
        },
      ],
    },
    {
      num: 31,
      title: { en: "Access to evidence", th: "สิทธิขอตรวจหรือคัดเอกสาร" },
      body: [
        {
          kind: "para",
          text: {
            en: "For the purpose of preparing the notice of appeal, the appealing student has the right to request to inspect or copy a record of statements, documents, electronic documents, or other evidence relevant to the case, provided always that this shall be subject to the discretion of the person who issued the penalty order to permit or refuse it under any conditions whatsoever.",
            th: "เพื่อประโยชน์ในการจัดทำคำอุทธรณ์ นักศึกษาผู้อุทธรณ์มีสิทธิขอตรวจหรือคัดบันทึกถ้อยคำ หรือเอกสาร หรือเอกสารอิเล็กทรอนิกส์ หรือพยานหลักฐานอื่นที่เกี่ยวข้องได้ แต่ทั้งนี้ให้อยู่ในดุลยพินิจของผู้มีคำสั่งลงโทษที่จะอนุญาตหรือจะอนุญาตภายใต้เงื่อนไขอย่างใดก็ได้",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where a request to copy a record of a person's statement is made under paragraph one, if the person who issued the penalty order considers that the witness or evidence in question is necessary for the purpose of the appeal, that person may permit the record of a person's statement to be copied without identifying the person.",
            th: "กรณีการขอคัดบันทึกถ้อยคำบุคคลตามวรรคหนึ่ง หากผู้มีคำสั่งลงโทษพิจารณาแล้วเห็นว่าพยาน หลักฐานดังกล่าวมีความจำเป็นเพื่อประโยชน์ในการอุทธรณ์ จะอนุญาตให้คัดบันทึกถ้อยคำบุคคลโดยไม่ระบุชื่อบุคคลก็ได้",
          },
        },
      ],
    },
    {
      num: 32,
      title: { en: "Objection to a member", th: "การคัดค้านกรรมการ" },
      body: [
        {
          kind: "para",
          text: {
            en: "The appealing student has the right to object to one or several members of the Student Discipline Appeals Committee if that person has any of the following grounds:",
            th: "นักศึกษาผู้อุทธรณ์มีสิทธิคัดค้านกรรมการอุทธรณ์วินัยนักศึกษาคนใดคนหนึ่งหรือหลายคน ถ้าผู้นั้นมีเหตุอย่างหนึ่งอย่างใด ดังต่อไปนี้",
          },
        },
        {
          kind: "list",
          items: [
            {
              marker: "(1)",
              text: {
                en: "having personal knowledge of the facts of the act appealed against;",
                th: "รู้เห็นเหตุการณ์ในการกระทำที่อุทธรณ์",
              },
            },
            {
              marker: "(2)",
              text: {
                en: "having an interest in the act appealed against;",
                th: "มีส่วนได้ส่วนเสียในการกระทำที่อุทธรณ์",
              },
            },
            {
              marker: "(3)",
              text: {
                en: "having a cause of enmity with the appealing student;",
                th: "มีสาเหตุโกรธเคืองกับนักศึกษาผู้อุทธรณ์",
              },
            },
            {
              marker: "(4)",
              text: {
                en: "being the spouse, a person cohabiting as husband and wife without registration of marriage, a parent, an adoptive child, a guardian, a person under guardianship, a lineal ascendant or descendant, an adopted child, a person under parental power, a person under care, or a sibling of the same parents or of the same father or mother, of the person who lodged the complaint or of the person who issued the order;",
                th: "เป็นคู่สมรส ผู้ซึ่งอยู่กินกันฉันสามีภริยาซึ่งมิได้จดทะเบียนสมรส บุพการี ผู้รับบุตรบุญธรรม ผู้ปกครอง ผู้อุปการะ ผู้สืบสันดาน บุตรบุญธรรม ผู้อยู่ในอำนาจปกครอง ผู้อยู่ในอุปการะ หรือพี่น้องร่วมบิดามารดา หรือร่วมบิดาหรือมารดากับผู้กล่าวหาหรือผู้มีคำสั่ง",
              },
            },
            {
              marker: "(5)",
              text: {
                en: "having been a member of the disciplinary inquiry into the penalty order for which the appeal was already lodged;",
                th: "หรือเป็นกรรมการสอบสวนวินัยนักศึกษาในคำสั่งลงโทษซึ่งขอยื่นอุทธรณ์ก่อนแล้ว",
              },
            },
            {
              marker: "(6)",
              text: {
                en: "having any other ground that may cause the consideration of the appeal to lack fairness.",
                th: "มีเหตุอื่นซึ่งอาจทำให้การพิจารณาอุทธรณ์เสียความเป็นธรรม",
              },
            },
          ],
        },
        {
          kind: "para",
          text: {
            en: "An objection to a member of the Appeals Committee must state the facts constituting the grounds for the objection in the notice of appeal, or must give additional notice in writing before the Student Discipline Appeals Committee begins considering the appeal.",
            th: "การคัดค้านกรรมการอุทธรณ์วินัยนักศึกษานั้น ต้องแสดงข้อเท็จจริงที่เป็นเหตุแห่งการคัดค้านไว้ในหนังสืออุทธรณ์ หรือแจ้งเพิ่มเติมเป็นหนังสือก่อนที่คณะกรรมการอุทธรณ์วินัยนักศึกษาเริ่มพิจารณาเรื่องอุทธรณ์",
          },
        },
        {
          kind: "para",
          text: {
            en: "When there is a ground, or an objection has been made, under paragraph one, the member of the Appeals Committee concerned may withdraw from participating in the consideration of that appeal. If the member of the Appeals Committee concerned has not withdrawn, the remaining members of the Student Discipline Appeals Committee shall jointly consider and decide on the facts objected to; if it is found that the facts are credible, the member of the Appeals Committee concerned shall be so notified and shall not be permitted to participate in considering that matter.",
            th: "เมื่อมีเหตุหรือมีการคัดค้านตามวรรคหนึ่ง กรรมการอุทธรณ์วินัยนักศึกษาผู้นั้นจะขอถอนตัวไม่ร่วมพิจารณาเรื่องที่อุทธรณ์นั้นก็ได้ ถ้ากรรมการอุทธรณ์วินัยนักศึกษาผู้นั้นมิได้ขอถอนตัว ให้คณะกรรมการอุทธรณ์วินัยนักศึกษาที่เหลือร่วมกันพิจารณาวินิจฉัยข้อเท็จจริงที่คัดค้าน หากเห็นว่าข้อเท็จจริงน่าเชื่อถือ ให้แจ้งกรรมการอุทธรณ์วินัยนักศึกษาผู้นั้นทราบและไม่ให้ร่วมพิจารณาเรื่องนั้น",
          },
        },
      ],
    },
    {
      num: 33,
      title: { en: "Reckoning the appeal period", th: "การนับระยะเวลาอุทธรณ์" },
      body: [
        {
          kind: "para",
          text: {
            en: "For the purpose of reckoning the period for appeal, the date on which the person responsible for notifying the penalty order has given written notice to the penalised student who is present in person, with the penalised student signing to acknowledge the order, shall be taken as the date of notice.",
            th: "เพื่อประโยชน์ในการนับระยะเวลาอุทธรณ์ ให้ถือเอาวันที่ผู้มีหน้าที่แจ้งคำสั่งลงโทษได้แจ้งเป็นหนังสือต่อนักศึกษาผู้ถูกลงโทษซึ่งอยู่ต่อหน้า โดยให้นักศึกษาผู้ถูกลงโทษลงลายมือชื่อรับทราบคำสั่งเป็นวันที่ได้รับแจ้ง",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where it is not possible to give notice to the penalised person to acknowledge the order under paragraph one, the person responsible for notifying the penalty order shall give notice to the penalised person by registered mail with acknowledgment of receipt to the address appearing as the domicile of the penalised person, and the penalised person shall be deemed to have received notice of the penalty order upon expiry of seven days from the date of dispatch, for a case within the country, or upon expiry of fifteen days from the date of dispatch, for a case sent abroad.",
            th: "ในกรณีที่ไม่อาจแจ้งให้ผู้ถูกลงโทษรับทราบคำสั่งตามวรรคแรกได้ ให้ผู้มีหน้าที่แจ้งคำสั่งลงโทษแจ้งไปยังผู้ถูกลงโทษโดยวิธีการส่งทางไปรษณีย์ตอบรับไปยังที่อยู่ซึ่งปรากฏเป็นภูมิลำเนาของผู้ถูกลงโทษนั้น และให้ถือว่าผู้ถูกลงโทษได้รับทราบคำสั่งลงโทษแล้วเมื่อครบกำหนดเจ็ดวันนับแต่วันส่งสำหรับกรณีภายในประเทศ หรือเมื่อครบกำหนดสิบห้าวันนับแต่วันส่งสำหรับกรณีส่งไปยังต่างประเทศ",
          },
        },
      ],
    },
    {
      num: 34,
      title: { en: "Lodging an appeal", th: "การยื่นอุทธรณ์" },
      body: [
        {
          kind: "para",
          text: {
            en: "An appeal shall be made as a letter addressed to the Chairperson of the Student Discipline Appeals Committee by submitting or sending the notice of appeal. It may be submitted or sent directly to the Chairperson of the Student Discipline Appeals Committee, or through the head of the unit to which the appealing student belongs, and the head of that unit shall proceed as provided in section 35.",
            th: "การอุทธรณ์ให้ทำหนังสือถึงประธานคณะกรรมการอุทธรณ์วินัยนักศึกษาโดยการยื่นหรือส่งหนังสืออุทธรณ์ จะยื่นหรือส่งต่อประธานคณะกรรมการอุทธรณ์วินัยนักศึกษาโดยตรง หรือผ่านหัวหน้าส่วนงานที่นักศึกษาผู้อุทธรณ์สังกัดก็ได้ และให้หัวหน้าส่วนงานนั้นดำเนินการตามข้อ ๓๕",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where a person brings a notice of appeal to submit it, the recipient of the notice shall issue a receipt for the notice to the person submitting the appeal, and shall register receipt of the notice as evidence on the date the notice is received under the University's correspondence system, and the date the notice is received according to that record shall be taken as the date of submission of the notice of appeal.",
            th: "ในกรณีมีผู้นำหนังสืออุทธรณ์มายื่น ให้ผู้รับหนังสือออกใบรับหนังสือให้แก่ผู้ยื่นอุทธรณ์ และลงทะเบียนรับหนังสือไว้เป็นหลักฐานในวันที่รับหนังสือตามระบบงานสารบรรณของมหาวิทยาลัย และให้ถือวันที่รับหนังสือตามหลักฐานดังกล่าวเป็นวันที่ยื่นหนังสืออุทธรณ์",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where a notice of appeal is sent by registered mail with acknowledgment of receipt, the date on which the post office issues the receipt of posting shall be taken as the date of submission of the notice of appeal, and once the notice of appeal is received, the recipient of the notice shall proceed to issue a receipt for the notice and register receipt of the notice as evidence on the date the notice is received under the University's correspondence system.",
            th: "ในกรณีส่งหนังสืออุทธรณ์ทางไปรษณีย์ลงทะเบียนตอบรับ ให้ถือวันที่ที่ทำการไปรษณีย์ออกใบรับฝากเป็นวันยื่นหนังสืออุทธรณ์ และเมื่อได้รับหนังสืออุทธรณ์แล้ว ให้ผู้รับหนังสือดำเนินการออกใบรับหนังสือและลงทะเบียนรับหนังสือไว้เป็นหลักฐานในวันที่รับหนังสือตามระบบงานสารบรรณของมหาวิทยาลัย",
          },
        },
        {
          kind: "para",
          text: {
            en: "Once the notice of appeal has been submitted or sent, the appealing student may submit or send an additional statement or supporting documents before the Student Discipline Appeals Committee makes its decision on the appeal, by submitting or sending it directly to the Chairperson of the Student Discipline Appeals Committee.",
            th: "เมื่อได้ยื่นหรือส่งหนังสืออุทธรณ์ไว้แล้ว นักศึกษาผู้อุทธรณ์จะยื่นหรือส่งคำแถลงการณ์หรือเอกสารหลักฐานเพิ่มเติมก่อนที่คณะกรรมการอุทธรณ์วินัยนักศึกษาจะมีคำวินิจฉัยเรื่องอุทธรณ์ก็ได้ โดยยื่นหรือส่งตรงต่อประธานคณะกรรมการอุทธรณ์วินัยนักศึกษา",
          },
        },
      ],
    },
    {
      num: 35,
      title: { en: "Forwarding the appeal", th: "การส่งเรื่องอุทธรณ์" },
      body: [
        {
          kind: "para",
          text: {
            en: "When the head of a unit receives a notice of appeal submitted or sent under section 34, the head of the unit shall send the notice of appeal, together with copies of evidence of the appealing student's acknowledgment of the order, the inquiry file, and the file on the disciplinary proceedings, along with the explanation of the person who issued the order and relevant documents, to the Chairperson of the Student Discipline Appeals Committee within seven working days from the date of receiving the notice.",
            th: "เมื่อหัวหน้าส่วนงานได้รับหนังสืออุทธรณ์ที่ได้ยื่นหรือส่งตามข้อ ๓๔ แล้วให้หัวหน้าส่วนงานจัดส่งหนังสืออุทธรณ์พร้อมสำเนาหลักฐานการรับทราบคำสั่งของนักศึกษาผู้อุทธรณ์ สำนวนการสอบสวน และสำนวนการดำเนินการทางวินัย พร้อมคำชี้แจงของผู้มีคำสั่ง และเอกสารที่เกี่ยวข้อง ไปยังประธานคณะกรรมการอุทธรณ์วินัยนักศึกษาภายในเจ็ดวันทำการนับแต่วันที่ได้รับหนังสือ",
          },
        },
      ],
    },
    {
      num: 36,
      title: { en: "Admissible appeals", th: "เรื่องอุทธรณ์ที่รับไว้พิจารณา" },
      body: [
        {
          kind: "para",
          text: {
            en: "A matter under appeal that may be accepted for consideration must be a matter of appeal that is correct in substance under section 29. Where there is a question whether any appeal is a matter to be accepted for consideration, the Student Discipline Appeals Committee shall be the one to consider and decide, and shall promptly notify its ruling to the appealing student, all of which shall be within not more than thirty days from the date the notice of appeal was submitted, and the Student Discipline Appeals Committee shall consider the matter promptly, but in any case within not more than one hundred and twenty days from the date the Student Discipline Appeals Committee resolved to accept the appeal.",
            th: "เรื่องอุทธรณ์ที่จะรับไว้พิจารณาได้ต้องเป็นเรื่องอุทธรณ์ที่ถูกต้องในสาระสำคัญตามข้อ ๒๙ ในกรณีมีปัญหาว่าเรื่องอุทธรณ์รายใดเป็นเรื่องที่จะรับไว้พิจารณาได้หรือไม่ ให้คณะกรรมการอุทธรณ์วินัยนักศึกษาเป็นผู้พิจารณาวินิจฉัย และแจ้งมตินั้นให้นักศึกษาผู้อุทธรณ์ทราบโดยเร็ว ทั้งนี้ไม่เกินสามสิบวันนับแต่วันที่มีการยื่นหนังสืออุทธรณ์และให้คณะกรรมการอุทธรณ์วินัยนักศึกษาพิจารณาโดยเร็ว แต่ทั้งนี้ไม่เกินหกสิบวันนับแต่วันที่คณะกรรมการอุทธรณ์วินัยนักศึกษามีมติรับเรื่องอุทธรณ์",
          },
        },
      ],
    },
    {
      num: 37,
      title: { en: "Withdrawing an appeal", th: "การถอนเรื่องอุทธรณ์" },
      body: [
        {
          kind: "para",
          text: {
            en: "The appealing student may withdraw the matter under appeal before the Student Discipline Appeals Committee finishes its adjudication, by making a written notice submitted to the Chairperson of the Student Discipline Appeals Committee. Once the matter is withdrawn, consideration of the appeal shall be finally terminated.",
            th: "นักศึกษาผู้อุทธรณ์จะขอถอนเรื่องอุทธรณ์ก่อนที่คณะกรรมการอุทธรณ์วินัยนักศึกษาวินิจฉัยเสร็จสิ้นก็ได้ โดยทำเป็นหนังสือยื่นต่อประธานคณะกรรมการอุทธรณ์วินัยนักศึกษา เมื่อได้ถอนเรื่องแล้ว การพิจารณาอุทธรณ์ให้เป็นอันยุติ",
          },
        },
      ],
    },
    {
      num: 38,
      title: { en: "Consideration of appeals", th: "การพิจารณาเรื่องอุทธรณ์" },
      body: [
        {
          kind: "para",
          text: {
            en: "In considering a matter under appeal, the Student Discipline Appeals Committee shall consider the file on the inquiry or the consideration of preliminary disciplinary proceedings. Where necessary and appropriate, it may request additional documents and evidence from a person or unit concerned for use in its consideration.",
            th: "การพิจารณาเรื่องอุทธรณ์ ให้คณะกรรมการอุทธรณ์วินัยนักศึกษาพิจารณาจากสำนวนการสอบสวน หรือการพิจารณาดำเนินการทางวินัยในเบื้องต้น ในกรณีจำเป็นและสมควรอาจขอเอกสารและหลักฐานเพิ่มเติมจากบุคคลหรือหน่วยงานที่เกี่ยวข้องเพื่อประกอบการพิจารณาได้",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where it considers it appropriate, the Student Discipline Appeals Committee may order a stay of enforcement of the penalty order under section 22 in the interim, provided always that a stay of enforcement of the penalty order must not be ordered in a case involving a penalty under section 10 (4) or (5).",
            th: "ในกรณีเห็นสมควรคณะกรรมการอุทธรณ์วินัยนักศึกษาอาจสั่งให้มีการทุเลาการบังคับตามคำสั่งลงโทษตามข้อ ๒๒ ไว้ก่อน อย่างไรก็ตาม ห้ามมิให้มีการทุเลาการบังคับตามคำสั่งลงโทษ ในกรณีที่เป็นการลงโทษตามข้อ ๑๐ (๔) หรือ (๕)",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where the appealing student requests to make an oral statement, if the Student Discipline Appeals Committee considers that an oral statement is not necessary for deciding the appeal, it may deny the oral statement.",
            th: "ในกรณีนักศึกษาผู้อุทธรณ์ขอแถลงการณ์ด้วยวาจา หากคณะกรรมการอุทธรณ์วินัยนักศึกษาพิจารณาเห็นว่าการแถลงการณ์ด้วยวาจาไม่จำเป็นแก่การพิจารณาวินิจฉัยอุทธรณ์จะให้งดแถลงการณ์ด้วยวาจาก็ได้",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where the appealing student comes to make an oral statement before the Student Discipline Appeals Committee, the person who issued the penalty order shall also be notified that, should that person wish to make a statement in response, that person may likewise come to make a statement at that meeting, provided that advance notice as appropriate to the circumstances shall be given; and for the purpose of making a statement in response, the person who issued the penalty order or a representative may attend to hear the oral statement of the appealing student.",
            th: "ในกรณีที่นักศึกษาผู้อุทธรณ์มาแถลงการณ์ด้วยวาจาต่อคณะกรรมการอุทธรณ์วินัยนักศึกษา ให้แจ้งผู้ที่ออกคำสั่งลงโทษทราบด้วยว่า ถ้าประสงค์จะแถลงแก้ก็ให้มาแถลงต่อที่ประชุมในครั้งนั้นได้ ทั้งนี้ ให้แจ้งล่วงหน้าตามควรแก่กรณี และเพื่อประโยชน์ในการแถลงแก้ดังกล่าว ให้ผู้ออกคำสั่งลงโทษหรือผู้แทนเข้าฟังคำแถลงการณ์ด้วยวาจาของนักศึกษาผู้อุทธรณ์ได้",
          },
        },
      ],
    },
    {
      num: 39,
      title: { en: "Appeal decisions", th: "มติเรื่องอุทธรณ์" },
      body: [
        {
          kind: "para",
          text: {
            en: "When the Student Discipline Appeals Committee has finished considering and adjudicating an appeal, a decision shall be made as follows:",
            th: "เมื่อคณะกรรมการอุทธรณ์วินัยนักศึกษาได้พิจารณาวินิจฉัยอุทธรณ์แล้วเสร็จให้มีมติ ดังนี้",
          },
        },
        {
          kind: "list",
          items: [
            {
              marker: "(1)",
              text: {
                en: "if it considers that the order is correct and appropriate to the offence, a decision shall be made to dismiss the appeal;",
                th: "ถ้าเห็นว่าคำสั่งถูกต้องเหมาะสมกับความผิดแล้ว ให้มีมติยกอุทธรณ์",
              },
            },
            {
              marker: "(2)",
              text: {
                en: "if it considers that the order is incorrect or inappropriate to the offence in any particular, a decision shall be made to amend it to make it correct and appropriate, provided that the penalty may not be made more severe;",
                th: "ถ้าเห็นว่าคำสั่งไม่ถูกต้องหรือไม่เหมาะสมกับความผิดประการใด ให้มีมติแก้ไขเปลี่ยนแปลงให้ถูกต้องและเหมาะสม แต่จะเพิ่มโทษหนักขึ้นไม่ได้",
              },
            },
            {
              marker: "(3)",
              text: {
                en: "if it considers it appropriate to proceed on any other particular so as to bring about fairness and correctness as a matter of law, a decision shall be made to proceed as appropriate to the case.",
                th: "ถ้าเห็นว่าสมควรดำเนินการโดยประการอื่นเพื่อให้เกิดความเป็นธรรมและถูกต้องตามกฎหมาย ให้มีมติดำเนินการได้ตามควรแก่กรณี",
              },
            },
          ],
        },
        {
          kind: "para",
          text: {
            en: "A decision on the consideration and adjudication of the Student Discipline Appeals Committee shall have effect only for the person who exercised the right of appeal, even where it appears as a fact that the order which is the ground of the appeal has a penal effect on several persons who committed the offence jointly or engaged in the same conduct jointly, provided always that the exercise of the right of appeal by one penalised student shall not deprive another penalised person of the right of appeal, should that other person request to join as a co-appellant during the consideration and adjudication of the appeal.",
            th: "มติการพิจารณาวินิจฉัยของคณะกรรมการอุทธรณ์วินัยนักศึกษาให้เป็นผลแก่ผู้ใช้สิทธิอุทธรณ์เท่านั้น แม้ปรากฏข้อเท็จจริงว่าคำสั่งอันเป็นเหตุแห่งการอุทธรณ์นี้มีผลลงโทษแก่ผู้กระทำผิดหลายรายในลักษณะที่ได้กระทำร่วมกันหรือมีพฤติการณ์เดียวกันร่วมกันหลายราย ทั้งนี้ การใช้สิทธิอุทธรณ์ของนักศึกษาผู้ถูกลงโทษรายหนึ่งไม่เป็นการตัดสิทธิอุทธรณ์แก่ผู้ถูกลงโทษรายอื่น หากร้องขอเข้าเป็นผู้อุทธรณ์ร่วมในระหว่างพิจารณาวินิจฉัยเรื่องอุทธรณ์",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where there are those who have lodged an appeal against any one order affecting the same result of the same penalty order, which has consequences for other penalised students engaged in the same conduct, in several instances, the Student Discipline Appeals Committee shall afford the other penalised persons the opportunity to join as co-appellants, by preparing a written notice of the right to become a co-appellant for the other penalised persons for the record. This must not conflict with section 29, and a co-appellant shall have the same rights as the student who lodged the original appeal.",
            th: "ในกรณีที่มีผู้ยื่นอุทธรณ์ในคำสั่งใดคำสั่งหนึ่งซึ่งผลแห่งคำสั่งลงโทษเดียวกันนี้ ส่งผลต่อนักศึกษาผู้ถูกลงโทษรายอื่นในพฤติการณ์เดียวกันหลายราย ให้คณะกรรมการอุทธรณ์วินัยนักศึกษาเปิดโอกาสให้แก่ผู้ถูกลงโทษรายอื่นเพื่อเข้าเป็นผู้อุทธรณ์ร่วม โดยจัดทำเป็นหนังสือแจ้งสิทธิการเป็นผู้อุทธรณ์ร่วมแก่ผู้ถูกลงโทษรายอื่นไว้เป็นสำคัญ ทั้งนี้ ต้องไม่ขัดต่อข้อ ๒๙ และให้ผู้อุทธรณ์ร่วมมีสิทธิเช่นเดียวกับนักศึกษาผู้ยื่นอุทธรณ์รายแรก",
          },
        },
      ],
    },
    {
      num: 40,
      title: { en: "Notification of decision", th: "การแจ้งมติ" },
      body: [
        {
          kind: "para",
          text: {
            en: "When the Student Discipline Appeals Committee has reached a decision under section 39, the Chairperson of the Student Discipline Appeals Committee shall notify the Rector, the appealing student, and any other person concerned for their information, and shall notify the person who issued the penalty order, for that person to proceed promptly in accordance with the decision of the Student Discipline Appeals Committee.",
            th: "เมื่อคณะกรรมการอุทธรณ์วินัยนักศึกษาได้มีมติตามข้อ ๓๙ แล้ว ให้ประธานคณะกรรมการอุทธรณ์วินัยนักศึกษาแจ้งอธิการบดี นักศึกษาผู้อุทธรณ์ รวมถึงผู้เกี่ยวข้องรายอื่นเพื่อทราบ และแจ้งผู้ออกคำสั่งลงโทษ เพื่อดำเนินการตามคำวินิจฉัยของคณะกรรมการอุทธรณ์วินัยนักศึกษาโดยเร็ว",
          },
        },
      ],
    },
  ],
};
