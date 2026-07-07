import type { Section } from "../types";

/**
 * Chapter 3 (หมวด ๓): Disciplinary proceedings (ข้อ 13–24) of the Regulation
 * of Thammasat University on Student Discipline, B.E. 2568 (2025).
 */
export const chapter3: Section = {
  kind: { en: "Chapter", th: "หมวด" },
  number: "3",
  title: { en: "Disciplinary proceedings", th: "การดำเนินการทางวินัย" },
  provisions: [
    {
      num: 13,
      title: { en: "Commencing proceedings", th: "การเริ่มดำเนินการทางวินัย" },
      body: [
        {
          kind: "para",
          text: {
            en: "Where a student is accused, on evidence reasonably indicating that the student has committed a disciplinary offence, or it appears to the Dean that a student has committed a disciplinary offence, the Dean shall take disciplinary proceedings under this Regulation without delay, except that where the matter concerns students of more than one division, or where there is some other appropriate cause, the Rector may instead take the proceedings.",
            th: "เมื่อมีกรณีนักศึกษาผู้ใดถูกกล่าวหา โดยมีหลักฐานตามสมควรว่าได้กระทำผิดวินัย หรือความปรากฏต่อคณบดีว่านักศึกษากระทำความผิดทางวินัย ให้คณบดีดำเนินการทางวินัยตามข้อบังคับนี้โดยไม่ชักช้า เว้นแต่กรณีที่เกี่ยวข้องกับนักศึกษาหลายส่วนงาน หรือที่มีเหตุสมควรอื่น อาจให้อธิการบดีดำเนินการก็ได้",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where the accused student confesses in writing to the Rector or the Dean, or a final judgment sentences that student to imprisonment, the Rector or the Dean may order a disciplinary penalty on the student without appointing an investigation committee, or may have the investigation committee terminate the investigation.",
            th: "ในกรณีนักศึกษาที่ถูกกล่าวหารับสารภาพเป็นหนังสือต่ออธิการบดีหรือคณบดี หรือผู้นั้นต้องคำพิพากษาถึงที่สุดให้จำคุก อธิการบดีหรือคณบดีอาจสั่งลงโทษทางวินัยนักศึกษาโดยไม่ต้องตั้งคณะกรรมการสอบสวน หรือให้คณะกรรมการสอบสวนยุติการสอบสวนก็ได้",
          },
        },
      ],
    },
    {
      num: 14,
      title: { en: "Investigation committee", th: "คณะกรรมการสอบสวน" },
      body: [
        {
          kind: "para",
          text: {
            en: "The Rector or the Dean shall appoint an investigation committee, composed of a chairperson who is a full-time faculty member and at least two other members of the investigation committee, with one member of the investigation committee acting as secretary, and an assistant secretary may also be provided; in appointing the committee, it must be composed of persons of more than one sex.",
            th: "ให้อธิการบดีหรือคณบดีแต่งตั้งคณะกรรมการสอบสวน ประกอบด้วย ประธานซึ่งเป็นคณาจารย์ประจำ และกรรมการสอบสวนอื่นอีกอย่างน้อยสองคน โดยให้กรรมการสอบสวนคนหนึ่งเป็นเลขานุการ และอาจให้มีผู้ช่วยเลขานุการด้วยก็ได้ ทั้งนี้ ในการแต่งตั้งกรรมการ ต้องประกอบด้วยบุคคลมากกว่าหนึ่งเพศ",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where the disciplinary offence concerns an act of a sexual nature, an expert or full-time faculty member in the field of psychology or social work, or who is a psychiatrist, together with a full-time faculty member in the field of law, shall also serve as members of the committee, and where the injured party so requests, not more than two persons requested by the injured party shall be permitted to attend and observe the taking of the injured party's testimony.",
            th: "ในกรณีที่เป็นการกระทำความผิดวินัยที่เกี่ยวข้องกับการกระทำทางเพศ ให้มีผู้เชี่ยวชาญหรือคณาจารย์ประจำด้านจิตวิทยาหรือด้านสังคมสงเคราะห์หรือที่เป็นจิตแพทย์ และคณาจารย์ประจำด้านกฎหมายร่วมเป็นกรรมการด้วย และในกรณีที่ผู้เสียหายร้องขอ ให้อนุญาตให้บุคคลที่ผู้เสียหายร้องขอจำนวนไม่เกินสองคน เข้าร่วมสังเกตการณ์ในการถามปากคำผู้เสียหายได้",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where the investigation committee considers it appropriate, or upon receiving a request, the investigation committee shall notify the Student Affairs Division so as to coordinate a psychologist or social worker attached to the Student Affairs Division to provide care or advice to the students or University personnel concerned.",
            th: "ในกรณีที่คณะกรรมการสอบสวนเห็นสมควรหรือเมื่อได้รับการร้องขอ ให้คณะกรรมการสอบสวนแจ้งกองกิจการนักศึกษาเพื่อประสานนักจิตวิทยาหรือนักสังคมสงเคราะห์ซึ่งสังกัดกองกิจการนักศึกษาเพื่อดูแลหรือให้คำปรึกษาแก่ผู้เกี่ยวข้องที่เป็นนักศึกษาหรือผู้ปฏิบัติงานในมหาวิทยาลัย",
          },
        },
        {
          kind: "para",
          text: {
            en: "In taking such testimony, the committee may permit the psychologist or social worker referred to above to attend and observe the taking of testimony; and where a question could be expected to have a severely distressing effect on that person's mind, the committee shall put the question through the psychologist or social worker specifically for that purpose.",
            th: "ในการถามปากคำนั้น กรรมการอาจให้นักจิตวิทยาหรือนักสังคมสงเคราะห์ดังกล่าวเข้าร่วมสังเกตการณ์ในการถามปากคำได้ ทั้งนี้ หากเป็นคำถามที่อาจมีผลกระทบกระเทือนต่อจิตใจบุคคลนั้นอย่างรุนแรง ให้กรรมการถามปากคำผ่านนักจิตวิทยาหรือนักสังคมสงเคราะห์เป็นการเฉพาะ",
          },
        },
      ],
    },
    {
      num: 15,
      title: { en: "Grounds for disqualification", th: "ลักษณะต้องห้ามของกรรมการ" },
      body: [
        {
          kind: "para",
          text: {
            en: "A committee member under section 14 must not have any of the following prohibited characteristics:",
            th: "กรรมการตามข้อ ๑๔ ต้องไม่มีลักษณะต้องห้าม ดังต่อไปนี้",
          },
        },
        {
          kind: "list",
          items: [
            {
              marker: "(1)",
              text: { en: "having witnessed the events of the act;", th: "รู้เห็นเหตุการณ์ในการกระทำ" },
            },
            {
              marker: "(2)",
              text: { en: "having an interest in the act;", th: "มีส่วนได้ส่วนเสียในการกระทำ" },
            },
            {
              marker: "(3)",
              text: {
                en: "having a cause of enmity with the accused student or the complainant;",
                th: "มีสาเหตุโกรธเคืองกับนักศึกษาผู้กล่าวหา หรือผู้ถูกกล่าวหา",
              },
            },
            {
              marker: "(4)",
              text: {
                en: "being a fiancé(e), spouse, a person cohabiting as spouses without registration of marriage, an ascendant, an adopted child, a guardian, a supporter, a descendant, an adopted parent, a person under whose parental power the complainant or the accused student is, a person under whose support the complainant or the accused student is, or a sibling of the whole blood or of the half blood, a first cousin, a legal representative, a custodian, or an agent of the complainant or the accused student;",
                th: "เป็นคู่หมั้น คู่สมรส ผู้ซึ่งอยู่กินกันฉันคู่สมรสซึ่งมิได้จดทะเบียนสมรส บุพการี ผู้รับบุตรบุญธรรม ผู้ปกครอง ผู้อุปการะ ผู้สืบสันดาน บุตรบุญธรรม ผู้อยู่ในอำนาจปกครอง ผู้อยู่ในอุปการะ หรือพี่น้องร่วมบิดามารดา หรือร่วมบิดาหรือมารดา ลูกพี่ลูกน้องนับได้เพียงภายในสามชั้น ผู้แทนโดยชอบธรรม ผู้พิทักษ์ หรือตัวแทนของผู้กล่าวหาหรือผู้ถูกกล่าวหา",
              },
            },
            {
              marker: "(5)",
              text: {
                en: "being a creditor or debtor, or an employer, of the complainant or the accused student;",
                th: "เป็นเจ้าหนี้ หรือลูกหนี้ หรือนายจ้างของผู้กล่าวหาหรือผู้ถูกกล่าวหา",
              },
            },
            {
              marker: "(6)",
              text: {
                en: "having some other cause which the person with power to appoint considers may render the consideration unjust.",
                th: "มีเหตุอื่นซึ่งผู้มีอำนาจแต่งตั้งเห็นว่าอาจทำให้การพิจารณาเสียความเป็นธรรม",
              },
            },
          ],
        },
      ],
    },
    {
      num: 16,
      title: { en: "Investigation timeframe", th: "กำหนดเวลาการสอบสวน" },
      body: [
        {
          kind: "para",
          text: {
            en: "The investigation committee shall conduct the investigation and summarise the case together with its opinion without delay, and this shall be completed within sixty days from the date the chairperson of the investigation committee received notice of the appointment order.",
            th: "ให้คณะกรรมการสอบสวนดำเนินการสอบสวน และสรุปสำนวนพร้อมความเห็นโดยไม่ชักช้า ทั้งนี้ ให้แล้วเสร็จภายในหกสิบวัน นับแต่วันที่ประธานคณะกรรมการสอบสวนได้รับทราบคำสั่งแต่งตั้ง",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where necessary, the investigation committee may request an extension of the investigation period from the person with power to appoint, each time for not more than thirty days, but not more than two times.",
            th: "ในกรณีที่มีความจำเป็น คณะกรรมการสอบสวนอาจเสนอขอขยายระยะเวลาการสอบสวนจากผู้มีอำนาจแต่งตั้งได้ครั้งละไม่เกินสามสิบวัน แต่ต้องไม่เกินสองครั้ง",
          },
        },
      ],
    },
    {
      num: 17,
      title: { en: "Notice of allegations", th: "การแจ้งข้อกล่าวหา" },
      body: [
        {
          kind: "para",
          text: {
            en: "The investigation committee shall notify the accused student of the facts alleged that the student committed the offence, the disciplinary charge, and the material evidence available, to the extent known to the accused student, and shall also notify the accused student of the right to explain and rebut the allegation orally, and that the student may bring witnesses and evidence to rebut the allegation.",
            th: "ให้คณะกรรมการสอบสวนแจ้งข้อเท็จจริงที่กล่าวหาว่า นักศึกษากระทำความผิดฐานความผิดทางวินัย และพยานหลักฐานที่เกี่ยวข้องเท่าที่มีให้นักศึกษาผู้ถูกกล่าวหาทราบ รวมทั้งแจ้งสิทธิแก่นักศึกษาผู้ถูกกล่าวหาว่ามีสิทธิที่จะชี้แจงและแก้ข้อกล่าวหาด้วยวาจา รวมทั้งสามารถนำพยานหลักฐานมาแก้ข้อกล่าวหาได้",
          },
        },
        {
          kind: "para",
          text: {
            en: "The accused student has the right to object to a member of the investigation committee by stating the facts constituting the ground for the objection in a written explanation rebutting the allegation, or by additionally notifying it in writing before the investigation committee begins the investigation.",
            th: "นักศึกษาผู้ถูกกล่าวหามีสิทธิที่จะคัดค้านกรรมการสอบสวน โดยแสดงข้อเท็จจริงที่เป็นเหตุแห่งการคัดค้านไว้ในหนังสือชี้แจงแก้ข้อกล่าวหา หรือแจ้งเพิ่มเติมเป็นหนังสือก่อนที่คณะกรรมการสอบสวนเริ่มสอบสวน",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where there is a ground for or an objection is made under paragraph one, that member of the investigation committee may withdraw from participating in the consideration of the matter under investigation; if that member does not withdraw, the remaining members of the investigation committee shall jointly consider and decide the disputed facts, and if they consider the facts credible, that member of the investigation committee shall be so notified and shall not participate in the consideration of that matter.",
            th: "เมื่อมีเหตุหรือมีการคัดค้านตามวรรคหนึ่ง กรรมการสอบสวนผู้นั้นจะขอถอนตัวไม่ร่วมพิจารณาเรื่องที่สอบสวนนั้นก็ได้ ถ้ากรรมการสอบสวนผู้นั้นมิได้ขอถอนตัว ให้คณะกรรมการสอบสวนที่เหลือร่วมกันพิจารณาวินิจฉัยข้อเท็จจริงที่คัดค้าน หากเห็นว่าข้อเท็จจริงน่าเชื่อถือ ให้แจ้งกรรมการสอบสวนผู้นั้นทราบ และไม่ให้ร่วมพิจารณาเรื่องนั้น",
          },
        },
      ],
    },
    {
      num: 18,
      title: { en: "Meetings and quorum", th: "การประชุมและองค์ประชุม" },
      body: [
        {
          kind: "para",
          text: {
            en: "A meeting must have not less than one-half of the total number of members of the investigation committee attending in order to constitute a quorum.",
            th: "การประชุมต้องมีกรรมการสอบสวนมาประชุมไม่น้อยกว่ากึ่งหนึ่งของจำนวนกรรมการทั้งหมด จึงเป็นองค์ประชุม",
          },
        },
        {
          kind: "para",
          text: {
            en: "At a meeting, if the chairperson of the investigation committee is not present at the meeting, or is unable to perform the duty, or there is no chairperson, the meeting shall select one member of the investigation committee to act as chairperson of the investigation committee.",
            th: "ในการประชุม ถ้าประธานคณะกรรมการสอบสวนไม่อยู่ในที่ประชุม หรือไม่สามารถปฏิบัติหน้าที่ได้ หรือไม่มีประธาน ให้ที่ประชุมเลือกกรรมการสอบสวนคนหนึ่งทำหน้าที่ประธานคณะกรรมการสอบสวน",
          },
        },
        {
          kind: "para",
          text: {
            en: "A decision shall be made by a majority vote of those attending the meeting; where the votes are equal, the chairperson of the investigation committee at the meeting shall cast an additional vote as a casting vote.",
            th: "การวินิจฉัยชี้ขาดให้ถือเสียงข้างมากของผู้เข้าประชุม ถ้ามีคะแนนเสียงเท่ากันให้ประธานคณะกรรมการสอบสวนในที่ประชุมออกเสียงเพิ่มขึ้นอีกหนึ่งเสียงเป็นเสียงชี้ขาด",
          },
        },
      ],
    },
    {
      num: 19,
      title: { en: "Right to respond", th: "สิทธิชี้แจงแก้ข้อกล่าวหา" },
      body: [
        {
          kind: "para",
          text: {
            en: "Whether or not the accused student has explained and rebutted the allegation orally, that student has the right to submit a written explanation rebutting the allegation to the investigation committee within fifteen days from the date of receiving notice under section 17.",
            th: "ไม่ว่านักศึกษาผู้ถูกกล่าวหาจะได้ชี้แจงและแก้ข้อกล่าวหาด้วยวาจาหรือไม่ นักศึกษาผู้นั้นมีสิทธิชี้แจงแก้ข้อกล่าวหาเป็นหนังสือต่อคณะกรรมการสอบสวนภายในสิบห้าวัน นับแต่วันที่ได้รับแจ้งตามข้อ ๑๗",
          },
        },
      ],
    },
    {
      num: 20,
      title: { en: "Investigation report", th: "รายงานผลการสอบสวน" },
      body: [
        {
          kind: "para",
          text: {
            en: "The investigation committee shall gather the facts and formulate an opinion, together with reasons, for the person with power to appoint, as to whether the accused student has committed a disciplinary offence or not, and if so, under which section, and if the student has committed an offence, what penalty should be imposed.",
            th: "ให้คณะกรรมการสอบสวนรวบรวมข้อเท็จจริง และทำความเห็นประกอบเหตุผลต่อผู้มีอำนาจแต่งตั้งว่านักศึกษาที่ถูกกล่าวหากระทำความผิดวินัยนักศึกษาหรือไม่ได้กระทำความผิดในข้อใด และหากกระทำความผิด สมควรถูกลงโทษสถานใด",
          },
        },
      ],
    },
    {
      num: 21,
      title: { en: "Dean's powers", th: "อำนาจของคณบดี" },
      body: [
        {
          kind: "para",
          text: {
            en: "Subject to sections 11 and 12, where the Dean is the person who appointed the investigation committee, and:",
            th: "ภายใต้บังคับของข้อ ๑๑ และข้อ ๑๒ หากคณบดีเป็นผู้แต่งตั้งคณะกรรมการสอบสวน และ",
          },
        },
        {
          kind: "list",
          items: [
            {
              marker: "(1)",
              text: {
                en: "the Dean considers it appropriate to waive the penalty by instead giving a verbal admonishment, under paragraph three of section 11, or considers that the student should be penalised with the penalty under section 10(1), the Dean shall proceed accordingly, and shall report to the Rector without delay;",
                th: "คณบดีเห็นควรงดโทษด้วยการว่ากล่าวตักเตือนแทนตามข้อ ๑๑ วรรคสาม หรือเห็นควรให้ลงโทษนักศึกษาด้วยโทษตามข้อ ๑๐ (๑) ให้คณบดีดำเนินการดังกล่าว และรายงานอธิการบดีโดยไม่ชักช้า",
              },
            },
            {
              marker: "(2)",
              text: {
                en: "the Dean considers that the student should be penalised with the penalty under section 10(2), (3), (4), (5), (6), or (7), the Dean shall report the results of the investigation and this opinion to the Rector.",
                th: "คณบดีเห็นควรให้ลงโทษนักศึกษาด้วยโทษตามข้อ ๑๐ (๒) (๓) (๔) (๕) (๖) หรือ (๗) ให้คณบดีรายงานผลการสอบสวนและความเห็นดังกล่าวต่ออธิการบดี",
              },
            },
          ],
        },
      ],
    },
    {
      num: 22,
      title: { en: "Rector's powers", th: "อำนาจของอธิการบดี" },
      body: [
        {
          kind: "para",
          text: {
            en: "Where the Rector is the person who appointed the investigation committee, or the case is one under section 21(2), the Rector shall consider the severity of the case constituting the offence, and shall then issue an order under section 11 or section 12, as the case may be.",
            th: "ในกรณีที่อธิการบดีเป็นผู้แต่งตั้งคณะกรรมการสอบสวน หรือเป็นกรณีตามข้อ ๒๑ (๒) ให้อธิการบดีพิจารณาความร้ายแรงแห่งกรณีความผิด แล้วมีคำสั่งตามข้อ ๑๑ หรือข้อ ๑๒ แล้วแต่กรณี",
          },
        },
      ],
    },
    {
      num: 23,
      title: { en: "Suspension of penalty", th: "การรอการลงโทษ" },
      body: [
        {
          kind: "para",
          text: {
            en: "Where a student has committed a disciplinary offence, if that student admits fault and submits a petition to the Rector requesting suspension of the penalty or mitigation of the penalty, and having regard to the record, conduct, health, state of mind, and circumstances of that student, or the nature of the offence, the acknowledgement of fault, and the effort to mitigate the resulting harm, or some other cause warranting clemency, the Rector may order:",
            th: "นักศึกษาผู้ใดกระทำผิดวินัย หากนักศึกษาผู้นั้นสำนึกผิด และยื่นคำร้องต่ออธิการบดีเพื่อขอรอการลงโทษ หรือบรรเทาโทษ เมื่อคำนึงถึงประวัติ ความประพฤติ สุขภาพ ภาวะแห่งจิต และสภาพแวดล้อมของนักศึกษาผู้นั้น หรือสภาพความผิด การสำนึกในความผิด และพยายามบรรเทาผลร้ายที่เกิดขึ้น หรือเหตุอื่นอันควรปรานีแล้ว อธิการบดีอาจมีคำสั่ง",
          },
        },
        {
          kind: "list",
          items: [
            {
              marker: "(1)",
              text: {
                en: "to suspend the penalty, so as to give the student an opportunity to reform within the period determined by the Rector, but not exceeding one year from the date the Rector orders the penalty suspended;",
                th: "ให้รอการลงโทษ เพื่อให้โอกาสนักศึกษากลับตัวภายในระยะเวลาที่อธิการบดีกำหนด แต่ต้องไม่เกินหนึ่งปีนับแต่วันที่อธิการบดีมีคำสั่งให้รอการลงโทษ",
              },
            },
            {
              marker: "(2)",
              text: {
                en: "to mitigate the penalty from section 10(2) or (4) to section 10(1);",
                th: "ให้บรรเทาโทษจากข้อ ๑๐ (๒) หรือ (๔) เป็น ข้อ ๑๐ (๑)",
              },
            },
            {
              marker: "(3)",
              text: {
                en: "to mitigate the penalty from section 10(3) or (5) to section 10(2) or (4), as the case may be.",
                th: "ให้บรรเทาโทษ จากข้อ ๑๐ (๓) หรือ (๕) เป็น ข้อ ๑๐ (๒) หรือ (๔) แล้วแต่กรณี",
              },
            },
          ],
        },
        {
          kind: "para",
          text: {
            en: "Where the Rector has issued an order under paragraph one, the Rector may order that the student enter a self-development programme, or perform public service, or perform work for a division or the University, or refrain from any conduct that may lead to the commission of a disciplinary offence.",
            th: "ในกรณีที่อธิการบดีมีคำสั่งตามวรรคแรก อธิการบดีอาจออกคำสั่งให้นักศึกษาเข้าโครงการพัฒนาตนเอง หรือบำเพ็ญประโยชน์สาธารณะ หรือปฏิบัติงานให้กับส่วนงานหรือมหาวิทยาลัย หรือให้ละเว้นการประพฤติใด ๆ อันอาจนำไปสู่การกระทำผิดวินัยนักศึกษา",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where the disciplinary offence committed by the student has a cause arising from a mental abnormality or other significant problem, the Rector may issue an order under paragraph one directing that the student remain under the care of a social worker, psychologist, or psychiatrist.",
            th: "ในกรณีการกระทำผิดวินัยนักศึกษามีสาเหตุมาจากความผิดปกติทางจิตใจ หรือปัญหาสำคัญประการอื่น อธิการบดีอาจมีคำสั่งตามวรรคแรก โดยสั่งให้นักศึกษาผู้นั้นอยู่ในความดูแลของนักสังคมสงเคราะห์ นักจิตวิทยา หรือจิตแพทย์ก็ได้",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where it appears to the University that the student has not complied with an order under paragraph two or paragraph three, as the case may be, whether or not the Rector has already given a written admonishment, or the student commits the same offence again during the period of suspension of the penalty or the period during which the penalty was imposed, the Rector shall revoke the order under paragraph one and impose the original disciplinary penalty on the student under the order under section 21 or section 22, as the case may be.",
            th: "ทั้งนี้ ในกรณีที่ความปรากฏแก่มหาวิทยาลัยว่านักศึกษาผู้นั้น ไม่กระทำตามคำสั่งในวรรคสองหรือวรรคสามแล้วแต่กรณี ทั้งที่อธิการบดีได้ตักเตือนเป็นลายลักษณ์อักษรแล้ว หรือกระทำความผิดซ้ำในระยะเวลารอการลงโทษ หรือระยะเวลาที่ถูกลงโทษ ให้อธิการบดียกเลิกคำสั่งตามวรรคแรก และลงโทษนักศึกษาตามคำสั่งลงโทษทางวินัยเดิมตามข้อ ๒๑ หรือข้อ ๒๒ แล้วแต่กรณี",
          },
        },
      ],
    },
    {
      num: 24,
      title: { en: "Penalty orders", th: "คำสั่งลงโทษ" },
      body: [
        {
          kind: "para",
          text: {
            en: "A penalty imposed on a student under section 10(2), (3), (4), (5), (6), or (7) shall be made as a University order signed by the Rector, and there shall be a letter notifying the penalty order, together with notice of the right of appeal under sections 29 and 31, given to the student.",
            th: "การลงโทษนักศึกษาตามข้อ ๑๐ (๒) (๓) (๔) (๕) (๖) หรือ (๗) ให้ทำเป็นคำสั่งมหาวิทยาลัยลงนามโดยอธิการบดี และมีหนังสือแจ้งคำสั่งลงโทษ พร้อมแจ้งสิทธิในการอุทธรณ์ตามข้อ ๒๙ และข้อ ๓๑ ให้นักศึกษาทราบ",
          },
        },
        {
          kind: "para",
          text: {
            en: "Where the student is at the bachelor's degree level or lower, once the penalty on the student has been ordered, the student's father, mother, or guardian shall also be so notified, except where the student is a bachelor's-degree graduate-level student.",
            th: "ในกรณีที่เป็นนักศึกษาระดับปริญญาตรีหรือต่ำกว่า เมื่อได้สั่งลงโทษนักศึกษาแล้ว ให้แจ้งต่อบิดามารดา หรือผู้ปกครองของนักศึกษาผู้นั้นทราบด้วย เว้นแต่กรณีนักศึกษาระดับปริญญาตรีภาคบัณฑิต",
          },
        },
        {
          kind: "para",
          text: {
            en: "The Rector shall report the penalty imposed under paragraph one to the University Council for information.",
            th: "ให้อธิการบดีรายงานการลงโทษตามวรรคแรกต่อสภามหาวิทยาลัยเพื่อทราบด้วย",
          },
        },
      ],
    },
  ],
};
