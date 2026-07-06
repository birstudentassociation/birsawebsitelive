import type { Part } from "./types";

export const part05: Part = {
  num: 5,
  title: { en: "Faculty activity groups", th: "กลุ่มกิจกรรมคณะ" },
  provisions: [
    {
      num: 40,
      title: { en: "Meaning of a Faculty activity group", th: "ความหมายของกลุ่มกิจกรรมคณะ" },
      lead: {
        en: "A \"Faculty activity group\" means a group of students who have joined together under the same set of rules and regulations to carry out activities for the common good, open in character to students generally, and operating under the supervision of the PSC.",
        th: "กลุ่มกิจกรรมคณะ หมายถึงกลุ่มของนักศึกษารวมตัวกันภายใต้ระเบียบข้อบังคับเดียวกัน เพื่อทำกิจกรรมให้แก่ส่วนรวม มีลักษณะสำหรับนักศึกษาทั่วไป และอยู่ภายใต้การกำกับของ กนศ.ร.",
      },
    },
    {
      num: 41,
      title: { en: "Forming a group", th: "การจัดตั้งกลุ่ม" },
      lead: {
        en: "An activity group may be formed by not less than 30 students of the Faculty of Political Science signing a petition submitted to the Faculty, and the Faculty shall then give its opinion to the Dean for consideration and appointment. The application to form a group must also include the group's rules and regulations, which must at least contain the following particulars:",
        th: "การจัดตั้งกลุ่มกิจกรรม ให้ทำได้โดยมีนักศึกษาคณะรัฐศาสตร์ไม่น้อยกว่า 30 คน เข้าชื่อยื่นต่อคณะรัฐศาสตร์และให้คณะ เสนอความเห็นต่อคณบดี เพื่อพิจารณาแต่งตั้งการเสนอขอจัดตั้งต้องมีระเบียบข้อบังคับของกลุ่มด้วย อย่างน้อยต้องมีรายการต่อไปนี้",
      },
      items: [
        { marker: "(1)", text: { en: "The group's name", th: "ชื่อกลุ่ม" } },
        { marker: "(2)", text: { en: "The group's membership register", th: "ทะเบียนสมาชิกกลุ่ม" } },
        { marker: "(3)", text: { en: "The group's objectives, which must not contravene the University's rules and regulations", th: "วัตถุประสงค์ของกลุ่ม ที่ไม่ฝ่าฝืนต่อระเบียบข้อบังคับของมหาวิทยาลัย" } },
        { marker: "(4)", text: { en: "The rules and methods for the group's administration", th: "ระเบียบวิธีการดำเนินการบริหารงานของกลุ่ม" } },
      ],
      tail: {
        en: "The formation or dissolution of a Faculty activity group may be effected only by order of the Dean.",
        th: "การจัดตั้ง หรือยุบเลิกกลุ่มกิจกรรมคณะ ทำได้โดยคำสั่งของคณบดี",
      },
    },
    {
      num: 42,
      title: { en: "Faculty subsidy", th: "เงินอุดหนุนจากคณะ" },
      lead: {
        en: "A Faculty activity group shall receive a subsidy from the Faculty as appropriate.",
        th: "กลุ่มกิจกรรมคณะจะได้รับเงินอุดหนุนจากคณะตามสมควร",
      },
    },
    {
      num: 43,
      title: { en: "Membership minimum and its end", th: "จำนวนสมาชิกและสิ้นสุดสมาชิกภาพ" },
      lead: {
        en: "A Faculty activity group must have not less than 20 student members from the Faculty of Political Science. Membership of a Faculty activity group ends on the last day before the start of the first semester.",
        th: "กลุ่มกิจกรรมคณะ ต้องมีสมาชิกเป็นนักศึกษาคณะรัฐศาสตร์ ไม่น้อยกว่า 20 คน สมาชิกภาพของสมาชิกกลุ่มกิจกรรมคณะ สิ้นสุดลงในวันสุดท้ายก่อนเปิดภาคการศึกษาภาคแรก",
      },
    },
    {
      num: 44,
      title: { en: "Group committee positions", th: "องค์ประกอบคณะกรรมการกลุ่ม" },
      lead: {
        en: "Each Faculty activity group shall have a group committee of not less than 5 but not more than 10 members, elected by the members of that group, holding the following positions:",
        th: "กลุ่มกิจกรรมคณะ แต่ละกลุ่มให้มีคณะกรรมการกลุ่ม ไม่น้อยกว่า 5 คน แต่ไม่เกิน 10 คน ซึ่งสมาชิกของแต่ละกลุ่มเป็นผู้เลือกตั้งให้ดำรงตำแหน่ง ดังต่อไปนี้",
      },
      items: [
        { marker: "(1)", text: { en: "Chairperson", th: "ประธาน" } },
        { marker: "(2)", text: { en: "Secretary", th: "เลขานุการ" } },
        { marker: "(3)", text: { en: "Treasurer", th: "เหรัญญิก" } },
        { marker: "(4)", text: { en: "Not less than 2 but not more than 7 other committee members, as the group committee sees fit", th: "กรรมการอื่นไม่น้อยกว่า 2 คน แต่ไม่เกิน 7 คน ตามที่คณะกรรมการกลุ่มเห็นสมควร" } },
      ],
    },
    {
      num: 45,
      title: { en: "Eligibility of the chairperson", th: "คุณสมบัติประธานกลุ่ม" },
      lead: {
        en: "A candidate for election as chairperson of a group must have the same qualifications as a candidate for election to the PSC.",
        th: "ผู้สมัครรับเลือกตั้งเป็นประธานกลุ่มต้องมีคุณสมบัติเช่นเดียวกับผู้สมัครรับเลือกตั้งเป็น กนศ.ร.",
      },
    },
    {
      num: 46,
      title: { en: "Powers and duties of the group committee", th: "อำนาจหน้าที่คณะกรรมการกลุ่ม" },
      lead: {
        en: "The group committee shall have the following powers and duties:",
        th: "อำนาจหน้าที่ของคณะกรรมการกลุ่มมีดังต่อไปนี้",
      },
      items: [
        { marker: "(1)", text: { en: "To act as the group's representative and be responsible for conducting the group's affairs in accordance with its objectives", th: "มีฐานะเป็นผู้แทน และเป็นผู้รับผิดชอบในการดำเนินงานของกลุ่ม ให้เป็นไปตามวัตถุประสงค์" } },
        { marker: "(2)", text: { en: "To submit the annual work plan to the PSC", th: "เสนอแผนงานประจำปีต่อ กนศ.ร." } },
        { marker: "(3)", text: { en: "To establish the group's rules of practice", th: "วางระเบียบปฏิบัติของกลุ่ม" } },
        {
          marker: "(4)",
          text: { en: "To consider the conduct of a member who has contravened the group's rules or brought disrepute upon the group", th: "พิจารณาการกระทำของสมาชิกที่ฝ่าฝืนระเบียบของกลุ่ม หรือนำความเสื่อมเสียมาสู่กลุ่ม" },
          note: {
            en: "A resolution of the group committee suspending a member's rights or removing a member's name from the membership register must be passed by not less than a two-thirds majority of all members of the group committee.",
            th: "มติของคณะกรรมการกลุ่มที่ให้สมาชิกระงับการใช้สิทธิ์ หรือถอนชื่อออกจากเป็นสมาชิกกลุ่ม ต้องได้รับคะแนนเสียงไม่น้อยกว่า 2 ใน 3 ของจำนวนกรรมการกลุ่มทั้งหมด",
          },
        },
        { marker: "(5)", text: { en: "To be responsible for the care and safekeeping of the group's documents and equipment", th: "รับผิดชอบ ดูแลรักษาเอกสารและวัสดุอุปกรณ์ต่าง ๆ ของกลุ่ม" } },
      ],
    },
    {
      num: 47,
      title: { en: "Voting eligibility within a group", th: "คุณสมบัติผู้มีสิทธิเลือกตั้งในกลุ่ม" },
      lead: {
        en: "A person entitled to vote for, or to stand for election as, a group committee member must have been registered as a member of the group for not less than 60 days before the election.",
        th: "ผู้ใช้สิทธิ์เลือกตั้งกรรมการกลุ่ม และผู้รับสมัครเลือกตั้งเป็นกรรมการกลุ่มต้องจดทะเบียนเป็นสมาชิกของกลุ่มเป็นเวลาไม่น้อยกว่า 60 วัน ก่อนการเลือกตั้ง",
      },
    },
    {
      num: 48,
      title: { en: "Election timing and handover", th: "กำหนดเวลาเลือกตั้งและมอบงาน" },
      lead: {
        en: "The group committee shall conduct the election of members to the new committee to be completed 30 days before the end of the second semester, save that where necessary or in a proper emergency it shall be at the Dean's discretion to extend the time as appropriate, and shall hand over duties to the new committee within 15 days of the date of election. The term of the group committee ends on the day duties are handed over to the new committee.",
        th: "ให้คณะกรรมการกลุ่มดำเนินการเลือกตั้งสมาชิกขึ้นดำรงตำแหน่งกรรมการชุดใหม่ให้เสร็จสิ้นก่อนปิดการศึกษาภาคสอง 30 วัน เว้นแต่มีเหตุจำเป็น/ฉุกเฉินอันสมควร ให้เป็นดุลพินิจของคณบดีในการขยายเวลาได้ตามความเหมาะสม และมอบงานแก่กรรมการชุดใหม่ให้เสร็จสิ้นภายใน 15 วัน นับแต่วันเลือกตั้ง อายุของคณะกรรมการกลุ่มสิ้นสุดลงในวันมอบงานแก่คณะกรรมการชุดใหม่",
      },
    },
    {
      num: 49,
      title: { en: "Appointment and removal", th: "การแต่งตั้งและถอดถอน" },
      lead: {
        en: "The Dean shall sign the notice appointing or removing a group committee member.",
        th: "คณบดีเป็นผู้ลงนามประกาศแต่งตั้ง หรือถอดถอนกรรมการกลุ่ม",
      },
    },
    {
      num: 50,
      title: { en: "Vacation of office", th: "การพ้นจากตำแหน่ง" },
      lead: {
        en: "A group committee member vacates office when:",
        th: "กรรมการกลุ่มพ้นตำแหน่งเมื่อ",
      },
      items: [
        { marker: "(1)", text: { en: "Retiring at the end of the term", th: "ออกตามวาระ" } },
        { marker: "(2)", text: { en: "Death", th: "ตาย" } },
        { marker: "(3)", text: { en: "Resignation", th: "ลาออก" } },
        { marker: "(4)", text: { en: "Losing the qualifications required under section 45", th: "ขาดคุณสมบัติตามข้อ 45" } },
        { marker: "(5)", text: { en: "Being subject to disciplinary punishment under the University's regulations", th: "ถูกลงโทษทางวินัย ตามข้อบังคับของมหาวิทยาลัย" } },
        { marker: "(6)", text: { en: "More than one-half of the group's members sign a petition for the member's removal", th: "สมาชิกกลุ่มจำนวนเกินกว่ากึ่งหนึ่งเข้าชื่อให้ออก" } },
      ],
    },
    {
      num: 51,
      title: { en: "Meetings of the group committee", th: "การประชุมคณะกรรมการกลุ่ม" },
      lead: {
        en: "Meetings of a group committee shall apply section 22 mutatis mutandis.",
        th: "การประชุมคณะกรรมการกลุ่ม ให้ใช้ข้อ 22 โดยอนุโลม",
      },
    },
    {
      num: 52,
      title: { en: "Dissolution of a group", th: "การเลิกกลุ่ม" },
      lead: {
        en: "A Faculty activity group may be dissolved, or ordered to be dissolved, for any one of the following causes:",
        th: "กลุ่มกิจกรรมคณะ อาจเลิก หรือถูกยกเลิกได้โดยเหตุหนึ่งเหตุใดดังต่อไปนี้",
      },
      items: [
        { marker: "(1)", text: { en: "Dissolution for a cause specified in that group's own rules and regulations", th: "เลิกโดยเหตุที่กำหนดไว้ในระเบียบข้อบังคับของกลุ่มนั้นๆ" } },
        { marker: "(2)", text: { en: "Its membership falling below 20", th: "มีจำนวนสมาชิกลดลงต่ำกว่า 20 คน" } },
        { marker: "(3)", text: { en: "Failing to pursue, or acting contrary to, the group's objectives", th: "ไม่ได้ดำเนินการตามวัตถุประสงค์ของกลุ่ม หรือดำเนินการฝ่าฝืนวัตถุประสงค์ของกลุ่ม" } },
        { marker: "(4)", text: { en: "Contravening or failing to comply with this Notice", th: "ฝ่าฝืน ไม่ปฏิบัติตามระเบียบนี้" } },
        { marker: "(5)", text: { en: "Bringing disrepute upon the reputation and honour of the Faculty or the University", th: "ทำความเสื่อมเสียต่อชื่อเสียง และเกียรติคุณของคณะ หรือมหาวิทยาลัย" } },
      ],
    },
    {
      num: 53,
      title: { en: "Membership eligibility", th: "คุณสมบัติสมาชิกกลุ่ม" },
      lead: {
        en: "As to the group's membership register, a member of a Faculty activity group must have the following qualifications:",
        th: "ทะเบียนสมาชิกกลุ่ม โดยสมาชิกกลุ่มกิจกรรมคณะต้องมีคุณสมบัติดังต่อไปนี้",
      },
      items: [
        { marker: "(1)", text: { en: "Be a student of the Faculty of Political Science currently studying at undergraduate level at the University", th: "เป็นนักศึกษาคณะรัฐศาสตร์ ที่กำลังศึกษาอยู่ในระดับปริญญาตรี ของมหาวิทยาลัย" } },
        { marker: "(2)", text: { en: "Not be under disciplinary punishment under the University's regulations", th: "ไม่อยู่ในระหว่างถูกลงโทษทางวินัย ตามข้อบังคับของมหาวิทยาลัย" } },
        { marker: "(3)", text: { en: "Not be on a leave of absence during that academic year", th: "ไม่อยู่ในขณะลาพักการศึกษาในปีการศึกษานั้น" } },
      ],
    },
    {
      num: 54,
      title: { en: "Submission of registers to the Faculty", th: "การส่งทะเบียนต่อคณะ" },
      lead: {
        en: "A Faculty activity group shall submit its membership register and the list of group committee members under section 44 to the Faculty, for the Dean to announce their appointment and to consider under section 52, and this must be submitted not more than 30 days after the Dean announces the appointment of the PSC, save that where necessary or in a proper emergency it shall be at the Dean's discretion to extend the time as appropriate.",
        th: "ให้กลุ่มกิจกรรมคณะส่งทะเบียนสมาชิกกลุ่มและรายชื่อคณะกรรมการกลุ่มตามข้อ 44 ให้กับคณะ เพื่อให้คณบดีประกาศแต่งตั้ง และพิจารณาตามข้อ 52 โดยต้องส่งหลังจากคณบดีประกาศแต่งตั้ง กนศ.ร. ไม่เกิน 30 วัน เว้นแต่มีเหตุจำเป็น/ฉุกเฉินอันสมควร ให้เป็นดุลพินิจของคณบดีในการขยายเวลาได้ตามความเหมาะสม",
      },
    },
  ],
};
