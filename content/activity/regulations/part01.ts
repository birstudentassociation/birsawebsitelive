import type { Part } from "./types";

export const part01: Part = {
  num: 1,
  title: { en: "Objectives of activities", th: "วัตถุประสงค์ของกิจกรรม" },
  provisions: [
    {
      num: 4,
      title: { en: "Objectives", th: "วัตถุประสงค์ของกิจกรรม" },
      lead: {
        en: "Student activities have the following objectives:",
        th: "กิจกรรมของนักศึกษามีวัตถุประสงค์ ดังต่อไปนี้",
      },
      items: [
        {
          marker: "(1)",
          text: { en: "to instil morality in students;", th: "เพื่อปลูกฝังคุณธรรมแก่นักศึกษา" },
        },
        {
          marker: "(2)",
          text: {
            en: "to enable students to learn and practise the exercise of rights, freedoms, and self-government in accordance with democratic principles;",
            th: "เพื่อให้นักศึกษาเรียนรู้และฝึกฝนตัวเองในการใช้สิทธิเสรีภาพ และการปกครองตนเองตามหลักประชาธิปไตย",
          },
        },
        {
          marker: "(3)",
          text: { en: "to foster unity and solidarity among students;", th: "เพื่อให้นักศึกษามีความสามัคคีเป็นอันหนึ่งอันเดียวกัน" },
        },
        {
          marker: "(4)",
          text: {
            en: "to promote extracurricular activities, both academic and professional-experience-related, for students, with an emphasis on the field of political science;",
            th: "เพื่อส่งเสริมกิจกรรมเสริมหลักสูตรทั้งทางด้านวิชาการและประสบการณ์ในวิชาชีพแก่นักศึกษา โดยเน้นหนักสาขารัฐศาสตร์",
          },
        },
        {
          marker: "(5)",
          text: {
            en: "to promote good personality, physical health, and human relations among students;",
            th: "เพื่อส่งเสริมให้นักศึกษามีบุคลิกภาพพลานามัยและมนุษยสัมพันธ์ที่ดี",
          },
        },
        {
          marker: "(6)",
          text: {
            en: "to instil in and preserve for students the nation's good customs, traditions, and culture;",
            th: "เพื่อปลูกฝังและรักษาไว้ซึ่งขนบธรรมเนียมประเพณีและวัฒนธรรมอันดีงามของชาติ",
          },
        },
        {
          marker: "(7)",
          text: {
            en: "to instil in students a sense of responsibility towards themselves and society as a whole;",
            th: "เพื่อปลูกฝังให้นักศึกษามีความรับผิดชอบต่อตนเองและสังคมส่วนรวม",
          },
        },
        {
          marker: "(8)",
          text: {
            en: "to promote creative initiative and broad-mindedness among students, and to give them practice in organising activities in furtherance of the above objectives;",
            th: "เพื่อส่งเสริมให้นักศึกษามีความคิดริเริ่มสร้างสรรค์ มีทัศนคติกว้างขวางและฝึกฝนในการจัดกิจกรรมให้เป็นไปตามวัตถุประสงค์ข้างต้น",
          },
        },
        {
          marker: "(9)",
          text: {
            en: "to spread the good name and reputation of the Faculty and the University.",
            th: "เพื่อเผยแพร่ชื่อเสียงและเกียรติคุณของคณะและมหาวิทยาลัย",
          },
        },
      ],
    },
  ],
};
