import type { Part } from "./types";

export const part03: Part = {
  num: 3,
  title: {
    en: "The Political Science Student Committee (PSC)",
    th: "คณะกรรมการนักศึกษา คณะรัฐศาสตร์",
  },
  provisions: [
    {
      num: 6,
      title: { en: "Establishment of the PSC", th: "การจัดตั้ง กนศ.ร." },
      lead: {
        en: 'There shall be a "Political Science Student Committee", abbreviated as "กนศ.ร.", responsible for carrying out matters relating to student activities. Its official English name is the "Political Science Student\'s Committee of Thammasat University", abbreviated as "P.S.C.".',
        th: "ให้มี “คณะกรรมการนักศึกษา คณะรัฐศาสตร์” ชื่อย่อว่า “กนศ.ร.” เป็นผู้รับผิดชอบดำเนินการเกี่ยวกับกิจกรรมนักศึกษา มีชื่อภาษาอังกฤษว่า Political Science Student’s Committee of Thammasat University ใช้อักษรย่อ “P.S.C.”",
      },
    },
    {
      num: 7,
      title: { en: "Composition of the PSC", th: "องค์ประกอบ กนศ.ร." },
      lead: {
        en: "The PSC shall comprise no fewer than 7 and no more than 15 members, elected by students, holding the following positions:",
        th: "กนศ.ร. ประกอบด้วย กรรมการจำนวนไม่น้อยกว่า 7 คน แต่ไม่เกิน 15 คน ซึ่งนักศึกษาเป็นผู้เลือกตั้ง มีตำแหน่ง ดังต่อไปนี้",
      },
      items: [
        { marker: "(1)", text: { en: "President;", th: "ประธาน" } },
        { marker: "(2)", text: { en: "Vice-President;", th: "รองประธาน" } },
        { marker: "(3)", text: { en: "Secretary;", th: "เลขานุการ" } },
        { marker: "(4)", text: { en: "Treasurer;", th: "เหรัญญิก" } },
        { marker: "(5)", text: { en: "Head of the Academic Promotion Division;", th: "หัวหน้าฝ่ายส่งเสริมวิชาการ" } },
        { marker: "(6)", text: { en: "Head of the Public Relations Division;", th: "หัวหน้าฝ่ายประชาสัมพันธ์" } },
        {
          marker: "(7)",
          text: {
            en: "Committee Member for Tha Phrachan Coordination;",
            th: "กรรมการฝ่ายประสานงานท่าพระจันทร์",
          },
        },
        {
          marker: "(8)",
          text: {
            en: "no more than 8 further committee members holding such other positions as are appropriate.",
            th: "กรรมการอีกไม่เกิน 8 คน ซึ่งดำรงตำแหน่งอื่น ๆ ตามความเหมาะสม",
          },
        },
      ],
    },
    {
      num: 8,
      title: { en: "Powers and duties", th: "อำนาจหน้าที่" },
      lead: {
        en: "The PSC shall jointly have the following powers, duties, and responsibilities:",
        th: "กนศ.ร. มีอำนาจหน้าที่และความรับผิดชอบร่วมกัน ดังต่อไปนี้",
      },
      items: [
        {
          marker: "(1)",
          text: {
            en: "to administer and coordinate all affairs relating to student activities;",
            th: "บริหารจัดการและประสานงานกิจการทั้งปวงที่เกี่ยวกับกิจกรรมนักศึกษา",
          },
        },
        {
          marker: "(2)",
          text: { en: "to ensure compliance with this Notice;", th: "ดำเนินการให้เป็นไปตามประกาศนี้" },
        },
        {
          marker: "(3)",
          text: {
            en: "to determine policy and prepare the PSC's annual work plans, projects, and budget;",
            th: "กำหนดนโยบาย จัดทำแผนงาน โครงการ และงบประมาณประจำปีของ กนศ.ร.",
          },
        },
        {
          marker: "(4)",
          text: {
            en: "to supervise and facilitate the operations of Faculty activity groups;",
            th: "กำกับดูแลและให้ความสะดวกในการดำเนินงานของกลุ่มกิจกรรมคณะ",
          },
        },
        {
          marker: "(5)",
          text: {
            en: "to receive and take note of the annual work plans of Faculty activity groups;",
            th: "รับทราบแผนงานประจำปีของกลุ่มกิจกรรมคณะ",
          },
        },
        {
          marker: "(6)",
          text: {
            en: "the removal of a committee member holding a position on the PSC under section 7 shall be at the discretion of the PSC President, provided that the PSC President must submit the name to the Dean for the Dean to sign the removal;",
            th: "การถอดถอนกรรมการที่ดำรงตำแหน่งใน กนศ.ร. ตามข้อ 7 ให้เป็นไปตามดุลยพินิจของประธาน กนศ.ร. โดยประธาน กนศ.ร. ต้องเสนอชื่อต่อคณบดีเพื่อให้คณบดีลงนามถอดถอน",
          },
        },
        {
          marker: "(7)",
          text: {
            en: "to hear the opinions of students and faculty members on matters relating to student activities;",
            th: "รับฟังความคิดเห็นจากนักศึกษาและอาจารย์ในเรื่องเกี่ยวกับกิจกรรมนักศึกษา",
          },
        },
        {
          marker: "(8)",
          text: {
            en: "to appoint sub-committee members to perform functions relating to student activities as it sees fit.",
            th: "แต่งตั้งอนุกรรมการขึ้นเพื่อทำหน้าที่เกี่ยวกับกิจกรรมนักศึกษาตามที่เห็นสมควร",
          },
        },
      ],
    },
    {
      num: 9,
      title: { en: "Role of the President", th: "อำนาจหน้าที่ของประธาน กนศ.ร." },
      lead: {
        en: "The PSC President shall have the power and duty to control and organise the internal administration of the PSC, and to coordinate directly with the President of the Thammasat University Student Organisation.",
        th: "ให้ประธาน กนศ.ร. มีอำนาจหน้าที่ควบคุมและจัดระเบียบการบริหารภายใน กนศ.ร. และประสานงานกับนายกองค์การนักศึกษามหาวิทยาลัยธรรมศาสตร์โดยตรง",
      },
    },
    {
      num: 10,
      title: { en: "Electorate", th: "ผู้มีสิทธิเลือกตั้ง" },
      lead: {
        en: "Persons entitled to vote in the election of the PSC are undergraduate students of the Faculty of Political Science.",
        th: "ผู้มีสิทธิเลือกตั้ง กนศ.ร. คือ นักศึกษาคณะรัฐศาสตร์ ชั้นปริญญาตรี",
      },
    },
    {
      num: 11,
      title: { en: "Eligibility to stand", th: "คุณสมบัติผู้สมัคร" },
      lead: {
        en: "A person entitled to stand for election as a PSC member must have the following qualifications:",
        th: "ผู้มีสิทธิรับเลือกตั้งเป็น กนศ.ร. ต้องมีคุณสมบัติดังนี้",
      },
      items: [
        {
          marker: "(1)",
          text: {
            en: "be a student of the Faculty of Political Science currently studying at the undergraduate level of the University;",
            th: "เป็นนักศึกษาคณะรัฐศาสตร์ที่กำลังศึกษาอยู่ในชั้นปริญญาตรีของมหาวิทยาลัย",
          },
        },
        {
          marker: "(2)",
          text: {
            en: "have an academic record of not lower than 2.00;",
            th: "ต้องมีผลการศึกษาอยู่ในเกณฑ์ไม่ต่ำกว่า 2.00",
          },
        },
        {
          marker: "(3)",
          text: {
            en: "not be a committee member of any group or other activity within the Faculty of Political Science, Thammasat University;",
            th: "ไม่เป็นกรรมการกลุ่ม หรือกิจกรรมอื่นๆ ในคณะรัฐศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
          },
        },
        {
          marker: "(4)",
          text: {
            en: "have studied at the University for no more than 4 years as of the year in which they apply to stand for election;",
            th: "ได้ศึกษาอยู่ในมหาวิทยาลัยมาแล้วไม่เกิน 4 ปี ในปีที่สมัครเข้ารับเลือกตั้ง",
          },
        },
        {
          marker: "(5)",
          text: {
            en: "not be under disciplinary punishment under the University's regulations;",
            th: "ไม่อยู่ในระหว่างถูกลงโทษทางวินัย ตามข้อบังคับของมหาวิทยาลัย",
          },
        },
        {
          marker: "(6)",
          text: {
            en: "not be on a leave of absence from studies during that academic year.",
            th: "ไม่อยู่ในขณะลาพักการศึกษาในปีการศึกษานั้น",
          },
        },
      ],
    },
    {
      num: 12,
      title: { en: "Timing of the election", th: "กำหนดเวลาเลือกตั้ง" },
      lead: {
        en: "The election of the PSC for the relevant academic year shall be completed within 30 days before the end of the second semester, unless there is a necessary or urgent cause warranting an extension, in which case the extension of time as appropriate shall be at the Dean's discretion; the date, time, and place of the election shall be announced to students no less than 15 days in advance.",
        th: "ให้ดำเนินการเลือกตั้ง กนศ.ร. ประจำปีการศึกษานั้นให้เสร็จสิ้นภายใน 30 วันก่อนปิดการศึกษาภาคสอง เว้นแต่มีเหตุจำเป็น/ฉุกเฉินอันสมควร ให้เป็นดุลพินิจของคณบดีในการขยายเวลาได้ตามความเหมาะสม โดยให้ประกาศวัน เวลา และสถานที่ที่จะมีการเลือกตั้งให้นักศึกษาทราบล่วงหน้าไม่น้อยกว่า 15 วัน",
      },
    },
    {
      num: 13,
      title: { en: "Manner of election", th: "วิธีการสมัครรับเลือกตั้ง" },
      lead: {
        en: "The election of the PSC shall be conducted by general election within the Faculty of Political Science. Candidates for election must group together and specify positions so as to cover all positions set out in section 7.",
        th: "การเลือกตั้ง กนศ.ร. ให้กระทำโดยการเลือกตั้งทั่วไปภายในคณะรัฐศาสตร์ ผู้สมัครเข้ารับการเลือกตั้งต้องรวมกันเป็นกลุ่ม โดยระบุตำแหน่งหน้าที่ให้ครบตามข้อที่ 7",
      },
    },
    {
      num: 14,
      title: { en: "Voting and count", th: "การลงคะแนนและนับคะแนน" },
      lead: {
        en: "In the election of the PSC, each voter shall cast a vote for only one group. In counting the votes, the group receiving the highest number of votes shall be deemed elected. If the highest number of votes is tied, a new election shall be held only among the groups tied for the highest number of votes, until a group with the highest number of votes is obtained. If only one group applies, it must receive an endorsement vote of no less than one-half of the voters who cast votes; if it does not receive such endorsement, a new election must be completed within 7 days from the date of the first election.",
        th: "การเลือกตั้ง กนศ.ร. ให้ผู้เลือกตั้งลงคะแนนเสียงเพียง 1 กลุ่ม การนับคะแนนให้ถือว่ากลุ่มที่ได้รับคะแนนสูงสุดได้รับการเลือกตั้ง ถ้าคะแนนสูงสุดเท่ากัน ให้มีการเลือกตั้งใหม่เฉพาะกลุ่มที่ได้คะแนนสูงสุดเท่ากันจนกว่าจะได้กลุ่มที่ได้คะแนนสูงสุด ถ้าสมัครเพียงกลุ่มเดียว ต้องได้คะแนนเสียงรับรองไม่น้อยกว่ากึ่งหนึ่งของผู้ลงคะแนนเสียงหากไม่ได้รับการรับรองจะต้องดำเนินการเลือกตั้งใหม่ให้เสร็จสิ้นภายใน 7 วัน นับแต่วันเลือกตั้งครั้งแรก",
      },
    },
    {
      num: 15,
      title: { en: "No candidates", th: "กรณีไม่มีผู้สมัคร" },
      lead: {
        en: "In the case that there are no candidates for election to the PSC, the incumbent PSC shall act in a caretaker capacity until a new PSC is obtained. There shall be a nominating committee for candidates for election to the PSC, comprising the heads of activity groups, class representatives of every year, and the President of the BIR Student Association, whose function is to nominate candidates for election to the PSC so as to bring them into the election process within 30 days from the date the first round of applications for election closes.",
        th: "กรณีที่ไม่มีผู้สมัครรับเลือกตั้ง กนศ.ร. ให้ กนศ.ร. ชุดเดิมรักษาการต่อไปจนกว่าจะได้ กนศ.ร. ชุดใหม่ ให้มีคณะกรรมการสรรหาผู้สมัครรับเลือกตั้ง กนศ.ร. ประกอบด้วย ประธานกลุ่มกิจกรรม แกนรุ่นทุกชั้นปี และนายกสโมสรนักศึกษาสาขาการเมืองและการระหว่างประเทศ ภาคภาษาอังกฤษ ทำหน้าที่สรรหาผู้สมัครรับเลือกตั้ง กนศ.ร. เพื่อเข้าสู่กระบวนการเลือกตั้งให้ได้ ภายใน 30 วัน นับจากวันปิดรับสมัครเลือกตั้งในคราวแรก",
      },
    },
    {
      num: 16,
      title: { en: "Method of voting", th: "วิธีการลงคะแนนเลือกตั้ง" },
      lead: {
        en: "The election of the PSC shall be conducted at a polling booth, unless there is a necessary cause or an obstacle making it impossible to hold the election at a polling booth, in which case the Dean may exercise discretion to change to an online method of election, provided that this must be announced at least 7 days in advance.",
        th: "วิธีการเลือกตั้ง กนศ.ร. ให้จัดการเลือกตั้ง ณ คูหาเลือกตั้ง เว้นแต่มีเหตุจำเป็น หรือมีอุปสรรคจนทำให้ไม่สามารถจัดเลือกตั้ง ณ คูหาเลือกตั้งได้ ให้คณบดีใช้ดุลพินิจเปลี่ยนไปใช้วิธีเลือกตั้งแบบออนไลน์ได้ โดยต้องประกาศให้ทราบล่วงหน้าอย่างน้อย 7 วัน",
      },
    },
    {
      num: 17,
      title: { en: "Appointment and removal", th: "การแต่งตั้งและถอดถอน" },
      lead: {
        en: "The Dean shall sign the notice appointing and removing the PSC.",
        th: "คณบดีเป็นผู้ลงนามประกาศแต่งตั้ง และถอดถอน กนศ.ร.",
      },
    },
    {
      num: 18,
      title: { en: "Term of office", th: "วาระการดำรงตำแหน่ง" },
      lead: {
        en: "The PSC shall hold office for a term of 1 academic year, commencing duty from the date the Dean announces the appointment. The PSC must complete the handover of duties to the next PSC within 15 days from the date of that PSC's election. The term of the PSC ends on the date duties are handed over to the new PSC.",
        th: "กนศ.ร. อยู่ในตำแหน่งคราวละ 1 ปีการศึกษา โดยเริ่มปฏิบัติงานตั้งแต่วันที่คณบดีประกาศแต่งตั้ง และ กนศ.ร. ต้องมอบงานต่อ กนศ.ร. ชุดต่อไปให้เสร็จสิ้นภายใน 15 วัน นับแต่วันที่ได้รับการเลือกตั้ง อายุของ กนศ.ร. สิ้นสุดลงในวันมอบงานแก่ กนศ.ร. ชุดใหม่",
      },
    },
    {
      num: 19,
      title: { en: "Vacation of office", th: "การพ้นจากตำแหน่ง" },
      lead: {
        en: "A PSC committee member vacates office when:",
        th: "กรรมการ กนศ.ร. พ้นจากตำแหน่งเมื่อ",
      },
      items: [
        { marker: "(1)", text: { en: "leaving at the end of the term;", th: "ออกตามวาระ" } },
        { marker: "(2)", text: { en: "death;", th: "ตาย" } },
        { marker: "(3)", text: { en: "resignation;", th: "ลาออก" } },
        {
          marker: "(4)",
          text: { en: "loss of the qualifications under section 11;", th: "ขาดคุณสมบัติตามข้อ 11" },
        },
        {
          marker: "(5)",
          text: { en: "leaving under section 8(6);", th: "ออกตามข้อ 8 (6)" },
        },
        {
          marker: "(6)",
          text: {
            en: "being subject to disciplinary punishment under the University's regulations;",
            th: "ถูกลงโทษทางวินัย ตามข้อบังคับของมหาวิทยาลัย",
          },
        },
        {
          marker: "(7)",
          text: {
            en: "more than one-half of the total undergraduate students of the Faculty of Political Science sign a petition calling for removal, whether of the whole committee or of an individual member, with the approval of the Dean.",
            th: "นักศึกษาคณะรัฐศาสตร์ ชั้นปริญญาตรี เกินกว่ากึ่งหนึ่งของนักศึกษารัฐศาสตร์ ชั้นปริญญาตรีทั้งหมด เข้าชื่อกันให้ออก อาจเป็นทั้งคณะหรือรายบุคคล โดยความเห็นชอบของคณบดี",
          },
        },
      ],
    },
    {
      num: 20,
      title: { en: "Whole-committee vacancy", th: "การพ้นตำแหน่งทั้งคณะ" },
      lead: {
        en: "When the whole PSC vacates office under section 19(3) or 19(7), a new election of the PSC shall be held to be completed within 20 days after the PSC vacates office, and the incumbent PSC shall continue to perform its duties until the new PSC takes office. The term of the new PSC begins on the date of the announcement of appointment and ends according to the term of the preceding PSC. If the PSC vacates office no more than 60 days before the end of the second semester, no new election need be held under the foregoing paragraph; instead, the PSC shall consider and propose to the Dean the name of a suitable person for appointment to serve in its place.",
        th: "เมื่อ กนศ.ร. พ้นจากตำแหน่งทั้งคณะตามข้อ 19 (3) หรือ 19 (7) ในกรณีนี้ให้มีการเลือกตั้ง กนศ.ร. ใหม่ให้เสร็จสิ้นภายใน 20 วัน หลังจาก กนศ.ร. พ้นจากตำแหน่งโดยให้ กนศ.ร. ชุดเดิมปฏิบัติหน้าที่ต่อไปจนกว่า กนศ.ร. ชุดใหม่เข้ารับตำแหน่ง อายุของ กนศ.ร. ชุดใหม่นี้เริ่มตั้งแต่วันประกาศแต่งตั้ง และสิ้นสุดลงตามอายุของ กนศ.ร. ชุดก่อน ถ้า กนศ.ร. พ้นจากตำแหน่งก่อนปิดการศึกษาภาคสองไม่เกิน 60 วัน ก็ไม่ต้องมีการเลือกตั้งใหม่ตามวรรคหนึ่ง ให้ กนศ.ร. พิจารณาเสนอชื่อบุคคลที่สมควรต่อคณบดี เพื่อแต่งตั้งให้ดำรงตำแหน่งแทน",
      },
    },
    {
      num: 21,
      title: { en: "Individual vacancy", th: "การพ้นตำแหน่งรายบุคคล" },
      lead: {
        en: "Where any individual PSC committee member vacates office, the PSC shall consider and propose to the Dean the name of a suitable person for appointment to serve in that member's place.",
        th: "ในกรณีที่กรรมการ กนศ.ร. คนหนึ่งคนใดพ้นจากตำแหน่ง ให้ กนศ.ร. พิจารณาเสนอชื่อบุคคลที่สมควรต่อคณบดี เพื่อแต่งตั้งให้ดำรงตำแหน่งแทน",
      },
    },
    {
      num: 22,
      title: { en: "Meetings and quorum", th: "การประชุมและองค์ประชุม" },
      lead: {
        en: "The PSC shall meet during the open semester at least twice a month.",
        th: "ให้มีการประชุม กนศ.ร. ระหว่างเปิดภาคการศึกษา อย่างน้อยเดือนละ 2 ครั้ง",
      },
      items: [
        {
          marker: "(1)",
          text: {
            en: "At a meeting of the PSC, no fewer than one-half of the total number of committee members must attend for a quorum to be constituted.",
            th: "ในการประชุม กนศ.ร. ต้องมีกรรมการเข้าประชุมไม่น้อยกว่ากึ่งหนึ่งของจำนวนกรรมการทั้งหมด จึงถือว่าเป็นองค์ประชุม",
          },
        },
        {
          marker: "(2)",
          text: {
            en: "The PSC President shall chair the meeting. If the PSC President is absent or unable to perform this duty, the Vice-President shall act in that person's place; if both are absent, the members present shall choose one of their number to chair the meeting in their place.",
            th: "ให้ประธาน กนศ.ร. เป็นประธานที่ประชุม ในกรณีที่ประธาน กนศ.ร. ไม่อยู่ หรือไม่อาจปฏิบัติหน้าที่ได้ ให้รองประธานทำหน้าที่แทน กรณีที่บุคคลทั้งสองไม่อยู่ให้เลือกกรรมการคนใดคนหนึ่งที่เข้าร่วมประชุม เป็นประธานดำเนินการประชุมแทน",
          },
        },
        {
          marker: "(3)",
          text: {
            en: "Resolutions shall be passed by a simple majority of the meeting, each committee member having one vote. Where the votes are tied and the chair of the meeting has not yet exercised a vote, the chair of the meeting shall have the right to cast a deciding vote, except where the PSC treats the matter as an important one, and except in the cases under section 8(6) and section 86, in which a two-thirds majority of the total number of PSC committee members shall be required.",
            th: "การลงมติ ให้ถือเสียงข้างมากของที่ประชุม กรรมการคนหนึ่งออกเสียงได้หนึ่งเสียง ในกรณีที่คะแนนเสียงเท่ากันโดยประธานที่ประชุมยังไม่ได้ใช้สิทธิ์ออกเสียง ให้ประธานที่ประชุมมีสิทธิ์ออกเสียงชี้ขาด เฉพาะกรณีที่ กนศ.ร. ถือเป็นเรื่องสำคัญและกรณีข้อ 8 (6) และข้อ 86 ให้ใช้มติ 2 ใน 3 ของจำนวนกรรมการ กนศ.ร. ทั้งหมด",
          },
        },
      ],
    },
    {
      num: 23,
      title: { en: "Attendance by invitation", th: "การเชิญเข้าร่วมประชุม" },
      lead: {
        en: "The PSC may invite committee members of activity groups affiliated with the PSC, or any student organisation within the Faculty of Political Science, to attend a meeting to give explanations and express opinions.",
        th: "กนศ.ร. อาจเชิญกรรมการกลุ่มกิจกรรมสังกัด กนศ.ร. หรือองค์กรนักศึกษาใด ๆ ในคณะรัฐศาสตร์ เข้าร่วมประชุมชี้แจงแสดงความคิดเห็นได้",
      },
    },
  ],
};
