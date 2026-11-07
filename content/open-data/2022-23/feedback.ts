import type { Topic } from "@/lib/open-data";

export const feedback: Topic = {
  slug: "feedback",
  title: {
    en: "How satisfied were people with BIRSA events?",
    th: "ผู้เข้าร่วมพึงพอใจกิจกรรมของ BIRSA แค่ไหน",
  },
  summary: {
    en: "Four survey forms gathered 313 responses, with overall scores from 4.56 to 5.00 out of 5.",
    th: "แบบสอบถามสี่ชุดได้คำตอบรวม 313 คำตอบ คะแนนโดยรวมอยู่ระหว่าง 4.56 ถึง 5.00 จาก 5",
  },
  headlines: [
    {
      value: "5.00",
      label: { en: "Open House overall score", th: "คะแนนโดยรวมงาน Open House" },
      context: { en: "18 responses", th: "ผู้ตอบ 18 คน" },
    },
    {
      value: "4.81",
      label: { en: "Japan policy seminar overall score", th: "คะแนนโดยรวมงานเสวนาเรื่องญี่ปุ่น" },
      context: { en: "72 responses", th: "ผู้ตอบ 72 คน" },
    },
    {
      value: "4.61",
      label: { en: "Sports Day activities overall score", th: "คะแนนกิจกรรมโดยรวมงานกีฬาสี" },
      context: { en: "161 responses on the second form", th: "ผู้ตอบ 161 คนในแบบสอบถามชุดที่สอง" },
    },
    {
      value: "313",
      label: { en: "Responses in total", th: "จำนวนคำตอบทั้งหมด" },
      context: { en: "Four survey forms", th: "แบบสอบถามสี่ชุด" },
    },
  ],
  mainPoints: [
    {
      en: "Open House scored 5.00 overall, but only 18 people responded and all were school students.",
      th: "งาน Open House ได้คะแนนโดยรวม 5.00 แต่มีผู้ตอบเพียง 18 คน และทั้งหมดเป็นนักเรียนมัธยม",
    },
    {
      en: "The Japan policy seminar scored 4.81 overall from 72 responses, and 41 of those people watched online.",
      th: "งานเสวนาเรื่องญี่ปุ่นได้คะแนนโดยรวม 4.81 จากผู้ตอบ 72 คน โดย 41 คนในจำนวนนี้ชมทางออนไลน์",
    },
    {
      en: "Sports Day scored 4.61 for activities overall from 161 responses on its second form.",
      th: "งานกีฬาสีได้คะแนนกิจกรรมโดยรวม 4.61 จากผู้ตอบ 161 คนในแบบสอบถามชุดที่สอง",
    },
    {
      en: "Tug of war scored highest of the Sports Day activities, at 4.64 on the second form.",
      th: "ชักเย่อได้คะแนนสูงสุดในกิจกรรมงานกีฬาสี โดยได้ 4.64 ในแบบสอบถามชุดที่สอง",
    },
    {
      en: "The length of the event scored lowest at Sports Day, at 4.34 on both forms.",
      th: "ระยะเวลาที่ใช้จัดงานได้คะแนนต่ำสุดในงานกีฬาสี คือ 4.34 ทั้งสองชุด",
    },
    {
      en: "Venue and live stream scored lowest at the Japan seminar, at 4.53.",
      th: "สถานที่และการถ่ายทอดสดได้คะแนนต่ำสุดในงานเสวนาเรื่องญี่ปุ่น คือ 4.53",
    },
  ],
  warning: {
    en: "Scores come from people who chose to answer. BIRSA did not record how many people were asked, so the scores may not speak for everyone who took part.",
    th: "คะแนนมาจากผู้ที่เลือกตอบเอง BIRSA ไม่ได้บันทึกว่าขอให้ตอบกี่คน คะแนนจึงอาจไม่แทนผู้เข้าร่วมทุกคน",
  },
  datasets: [
    {
      id: "survey-overview",
      title: { en: "Overall score for each survey", th: "คะแนนโดยรวมของแต่ละแบบสอบถาม" },
      summary: {
        en: "Four survey forms gathered 313 responses on three events, and overall scores ran from 4.56 to 5.00 out of 5.",
        th: "แบบสอบถามสี่ชุดสำหรับสามกิจกรรมได้คำตอบรวม 313 คำตอบ คะแนนโดยรวมอยู่ระหว่าง 4.56 ถึง 5.00 จาก 5",
      },
      columns: [
        { key: "survey", label: { en: "Survey", th: "แบบสอบถาม" }, kind: "text" },
        { key: "eventDate", label: { en: "Event date", th: "วันที่จัดงาน" }, kind: "date" },
        {
          key: "responses",
          label: { en: "Responses", th: "จำนวนผู้ตอบ" },
          kind: "number",
          total: true,
        },
        {
          key: "overall",
          label: { en: "Overall score out of 5", th: "คะแนนโดยรวม เต็ม 5" },
          kind: "number",
          decimals: 2,
        },
      ],
      rows: [
        {
          survey: { en: "Sports Day, first form", th: "งานกีฬาสี แบบสอบถามชุดแรก" },
          eventDate: "2022-10-07",
          responses: 62,
          overall: 4.56,
        },
        {
          survey: { en: "Sports Day, second form", th: "งานกีฬาสี แบบสอบถามชุดที่สอง" },
          eventDate: "2022-10-07",
          responses: 161,
          overall: 4.61,
        },
        {
          survey: { en: "Japan policy seminar", th: "งานเสวนาเรื่องนโยบายต่างประเทศญี่ปุ่น" },
          eventDate: "2022-10-22",
          responses: 72,
          overall: 4.81,
        },
        {
          survey: { en: "BIR Open House 2023", th: "BIR Open House" },
          eventDate: "2023-02-10",
          responses: 18,
          overall: 5,
        },
      ],
      notes: [
        {
          en: "The overall score is the average for the overall satisfaction question. The Sports Day forms have no such question, so the activities overall question is used.",
          th: "คะแนนโดยรวมคือค่าเฉลี่ยของคำถามความพึงพอใจโดยรวม แบบสอบถามงานกีฬาสีไม่มีคำถามนี้ จึงใช้คำถามกิจกรรมโดยรวมแทน",
        },
        {
          en: "The two Sports Day forms may include some of the same people, so their responses should not be read as 223 different people.",
          th: "แบบสอบถามงานกีฬาสีสองชุดอาจมีผู้ตอบซ้ำกัน จึงไม่ควรอ่านว่าเป็นผู้ตอบ 223 คนที่แตกต่างกัน",
        },
        {
          en: "BIRSA computed each average from the raw response sheets. Blank answers are skipped and every question uses a scale of 1 to 5, where 5 is best.",
          th: "ค่าเฉลี่ยทุกค่าคำนวณจากข้อมูลดิบของแบบสอบถาม ข้ามคำตอบที่เว้นว่าง และทุกคำถามใช้คะแนนเต็ม 5 โดย 5 คือดีที่สุด",
        },
      ],
      source: {
        en: "Raw response sheets of the four BIRSA survey forms",
        th: "ข้อมูลดิบของแบบสอบถามสี่ชุดของ BIRSA",
      },
      period: { en: "October 2022 to February 2023", th: "ตุลาคม 2565 ถึงกุมภาพันธ์ 2566" },
    },
    {
      id: "sports-day-second-form",
      title: {
        en: "Sports Day scores, second survey form",
        th: "คะแนนงานกีฬาสี แบบสอบถามชุดที่สอง",
      },
      summary: {
        en: "Sports Day scored 4.61 for activities overall from 160 answers, and tug of war scored highest at 4.64.",
        th: "งานกีฬาสีได้คะแนนกิจกรรมโดยรวม 4.61 จากผู้ตอบ 160 คน และชักเย่อได้คะแนนสูงสุดที่ 4.64",
      },
      columns: [
        { key: "question", label: { en: "Question", th: "คำถาม" }, kind: "text" },
        { key: "responses", label: { en: "Responses", th: "จำนวนผู้ตอบ" }, kind: "number" },
        {
          key: "mean",
          label: { en: "Average score out of 5", th: "คะแนนเฉลี่ย เต็ม 5" },
          kind: "number",
          decimals: 2,
        },
        {
          key: "high",
          label: { en: "Scoring 4 or 5 (percent)", th: "ให้คะแนน 4 หรือ 5 (ร้อยละ)" },
          kind: "percent",
        },
      ],
      rows: [
        {
          question: { en: "Tug of war", th: "ชักเย่อ" },
          responses: 161,
          mean: 4.64,
          high: 98,
        },
        {
          question: { en: "Activities overall", th: "กิจกรรมโดยรวม" },
          responses: 160,
          mean: 4.61,
          high: 98,
        },
        {
          question: { en: "Recreation games", th: "สันทนาการ" },
          responses: 161,
          mean: 4.57,
          high: 95,
        },
        {
          question: { en: "Welfare", th: "สวัสดิการ" },
          responses: 161,
          mean: 4.55,
          high: 96,
        },
        {
          question: { en: "Share ball", th: "แชร์บอล" },
          responses: 161,
          mean: 4.55,
          high: 96,
        },
        {
          question: { en: "Basketball", th: "บาสเกตบอล" },
          responses: 161,
          mean: 4.55,
          high: 96,
        },
        {
          question: { en: "Venue", th: "สถานที่จัดงาน" },
          responses: 161,
          mean: 4.55,
          high: 93,
        },
        {
          question: { en: "Running tag", th: "วิ่งเปี้ยว" },
          responses: 161,
          mean: 4.5,
          high: 95,
        },
        {
          question: { en: "Balloon stomp", th: "เหยียบลูกโป่ง" },
          responses: 161,
          mean: 4.48,
          high: 93,
        },
        {
          question: { en: "Futsal", th: "ฟุตซอล" },
          responses: 161,
          mean: 4.43,
          high: 93,
        },
        {
          question: { en: "Length of the event", th: "ระยะเวลาที่ใช้จัดงาน" },
          responses: 161,
          mean: 4.34,
          high: 86,
        },
      ],
      notes: [
        {
          en: "One of the 161 responses left the activities overall question blank, so that row has 160 answers.",
          th: "ผู้ตอบ 1 คนจาก 161 คนเว้นคำถามกิจกรรมโดยรวมไว้ แถวนี้จึงมีผู้ตอบ 160 คน",
        },
        {
          en: "This form lists the activities in BIRSA's event report. Scores are on a scale of 1 to 5, where 5 is best.",
          th: "แบบสอบถามชุดนี้ใช้รายการกิจกรรมตามรายงานโครงการของ BIRSA คะแนนเต็ม 5 โดย 5 คือดีที่สุด",
        },
      ],
      source: {
        en: "BIRSA Sports Day satisfaction survey, raw responses, second form",
        th: "แบบสอบถามความพึงพอใจงานกีฬาสี BIR ข้อมูลดิบ ชุดที่สอง",
      },
      period: { en: "1 to 2 November 2022", th: "1 ถึง 2 พฤศจิกายน 2565" },
    },
    {
      id: "sports-day-first-form",
      title: { en: "Sports Day scores, first survey form", th: "คะแนนงานกีฬาสี แบบสอบถามชุดแรก" },
      summary: {
        en: "Sports Day scored 4.56 for activities overall from 62 answers, and tug of war scored highest at 4.74.",
        th: "งานกีฬาสีได้คะแนนกิจกรรมโดยรวม 4.56 จากผู้ตอบ 62 คน และชักเย่อได้คะแนนสูงสุดที่ 4.74",
      },
      columns: [
        { key: "question", label: { en: "Question", th: "คำถาม" }, kind: "text" },
        { key: "responses", label: { en: "Responses", th: "จำนวนผู้ตอบ" }, kind: "number" },
        {
          key: "mean",
          label: { en: "Average score out of 5", th: "คะแนนเฉลี่ย เต็ม 5" },
          kind: "number",
          decimals: 2,
        },
        {
          key: "high",
          label: { en: "Scoring 4 or 5 (percent)", th: "ให้คะแนน 4 หรือ 5 (ร้อยละ)" },
          kind: "percent",
        },
      ],
      rows: [
        {
          question: { en: "Tug of war", th: "ชักเย่อ" },
          responses: 62,
          mean: 4.74,
          high: 95,
        },
        {
          question: { en: "Share ball", th: "แชร์บอล" },
          responses: 62,
          mean: 4.61,
          high: 95,
        },
        {
          question: { en: "Activities overall", th: "กิจกรรมโดยรวม" },
          responses: 62,
          mean: 4.56,
          high: 94,
        },
        {
          question: { en: "Venue", th: "สถานที่จัดงาน" },
          responses: 62,
          mean: 4.55,
          high: 92,
        },
        {
          question: { en: "Futsal", th: "ฟุตซอล" },
          responses: 62,
          mean: 4.53,
          high: 95,
        },
        {
          question: { en: "Paper pull", th: "ดึงกระดาษ" },
          responses: 62,
          mean: 4.53,
          high: 92,
        },
        {
          question: { en: "Welfare", th: "สวัสดิการ" },
          responses: 62,
          mean: 4.53,
          high: 90,
        },
        {
          question: { en: "Running tag", th: "วิ่งเปี้ยว" },
          responses: 62,
          mean: 4.47,
          high: 90,
        },
        {
          question: { en: "Recreation games", th: "สันทนาการ" },
          responses: 62,
          mean: 4.4,
          high: 82,
        },
        {
          question: { en: "Length of the event", th: "ระยะเวลาที่ใช้จัดงาน" },
          responses: 62,
          mean: 4.34,
          high: 89,
        },
        {
          question: { en: "Dodgeball", th: "ดอดจ์บอล" },
          responses: 62,
          mean: 4.32,
          high: 84,
        },
      ],
      notes: [
        {
          en: "This form lists paper pull and dodgeball, which are not in the final event report. It was open from 14 to 28 October 2022.",
          th: "แบบสอบถามชุดนี้มีกิจกรรมดึงกระดาษและดอดจ์บอล ซึ่งไม่อยู่ในรายงานโครงการฉบับสุดท้าย เปิดรับคำตอบวันที่ 14 ถึง 28 ตุลาคม 2565",
        },
        {
          en: "Scores are on a scale of 1 to 5, where 5 is best.",
          th: "คะแนนเต็ม 5 โดย 5 คือดีที่สุด",
        },
      ],
      source: {
        en: "BIRSA Sports Day satisfaction survey, raw responses, first form",
        th: "แบบสอบถามความพึงพอใจงานกีฬาสี BIR ข้อมูลดิบ ชุดแรก",
      },
      period: { en: "14 to 28 October 2022", th: "14 ถึง 28 ตุลาคม 2565" },
    },
    {
      id: "japan-seminar-scores",
      title: {
        en: "Japan policy seminar scores by question",
        th: "คะแนนงานเสวนาเรื่องญี่ปุ่น แยกรายคำถาม",
      },
      summary: {
        en: "The seminar scored 4.81 for overall satisfaction from 72 responses, and its lowest score was 4.53 for venue and live stream.",
        th: "งานเสวนาได้คะแนนความพึงพอใจโดยรวม 4.81 จากผู้ตอบ 72 คน และคะแนนต่ำสุดคือสถานที่และการถ่ายทอดสดที่ 4.53",
      },
      columns: [
        { key: "question", label: { en: "Question", th: "คำถาม" }, kind: "text" },
        { key: "responses", label: { en: "Responses", th: "จำนวนผู้ตอบ" }, kind: "number" },
        {
          key: "mean",
          label: { en: "Average score out of 5", th: "คะแนนเฉลี่ย เต็ม 5" },
          kind: "number",
          decimals: 2,
        },
        {
          key: "high",
          label: { en: "Scoring 4 or 5 (percent)", th: "ให้คะแนน 4 หรือ 5 (ร้อยละ)" },
          kind: "percent",
        },
      ],
      rows: [
        {
          question: { en: "Speakers suited the topic", th: "วิทยากรเหมาะสมกับหัวข้อเสวนา" },
          responses: 72,
          mean: 4.88,
          high: 100,
        },
        {
          question: { en: "Audience questions were handled well", th: "การตอบคำถามจากผู้ชม" },
          responses: 72,
          mean: 4.85,
          high: 100,
        },
        {
          question: { en: "Host ran the event well", th: "ผู้ดำเนินรายการทำหน้าที่ได้ดี" },
          responses: 72,
          mean: 4.85,
          high: 99,
        },
        {
          question: { en: "Topic matched the content", th: "หัวข้อสอดคล้องกับเนื้อหา" },
          responses: 72,
          mean: 4.82,
          high: 97,
        },
        {
          question: { en: "Overall satisfaction", th: "ความพึงพอใจโดยรวม" },
          responses: 72,
          mean: 4.81,
          high: 100,
        },
        {
          question: { en: "Content was interesting", th: "เนื้อหาน่าสนใจ" },
          responses: 72,
          mean: 4.76,
          high: 97,
        },
        {
          question: { en: "Questions suited the topic", th: "คำถามเหมาะสมกับหัวข้อ" },
          responses: 72,
          mean: 4.74,
          high: 97,
        },
        {
          question: { en: "Content was useful", th: "เนื้อหามีประโยชน์" },
          responses: 72,
          mean: 4.74,
          high: 96,
        },
        {
          question: { en: "Length of the event", th: "ระยะเวลาการจัดงาน" },
          responses: 72,
          mean: 4.63,
          high: 92,
        },
        {
          question: { en: "Content could be used elsewhere", th: "นำเนื้อหาไปประยุกต์ใช้ได้" },
          responses: 72,
          mean: 4.56,
          high: 92,
        },
        {
          question: { en: "Venue and live stream", th: "สถานที่และการถ่ายทอดสด" },
          responses: 72,
          mean: 4.53,
          high: 92,
        },
      ],
      notes: [
        {
          en: "Scores are on a scale of 1 to 5, where 5 is best. Every question has all 72 answers.",
          th: "คะแนนเต็ม 5 โดย 5 คือดีที่สุด ทุกคำถามมีผู้ตอบครบ 72 คน",
        },
      ],
      source: {
        en: "Satisfaction survey for the academic seminar of 22 October 2022, raw responses",
        th: "แบบประเมินงานเสวนาวิชาการวันที่ 22 ตุลาคม 2565 ข้อมูลดิบ",
      },
      period: { en: "22 October to 12 November 2022", th: "22 ตุลาคม ถึง 12 พฤศจิกายน 2565" },
    },
    {
      id: "open-house-scores",
      title: { en: "Open House scores by question", th: "คะแนนงาน Open House แยกรายคำถาม" },
      summary: {
        en: "Open House scored 5.00 for overall satisfaction from 18 responses, with its lowest scores at 4.56 for timing.",
        th: "งาน Open House ได้คะแนนความพึงพอใจโดยรวม 5.00 จากผู้ตอบ 18 คน และคะแนนต่ำสุดคือเรื่องเวลาที่ 4.56",
      },
      columns: [
        { key: "question", label: { en: "Question", th: "คำถาม" }, kind: "text" },
        { key: "responses", label: { en: "Responses", th: "จำนวนผู้ตอบ" }, kind: "number" },
        {
          key: "mean",
          label: { en: "Average score out of 5", th: "คะแนนเฉลี่ย เต็ม 5" },
          kind: "number",
          decimals: 2,
        },
        {
          key: "high",
          label: { en: "Scoring 4 or 5 (percent)", th: "ให้คะแนน 4 หรือ 5 (ร้อยละ)" },
          kind: "percent",
        },
      ],
      rows: [
        {
          question: { en: "Host ran the event well", th: "ผู้ดำเนินรายการทำหน้าที่ได้ดี" },
          responses: 18,
          mean: 5.0,
          high: 100,
        },
        {
          question: { en: "Organisers answered questions fully", th: "ผู้จัดตอบคำถามได้ครบถ้วน" },
          responses: 18,
          mean: 5.0,
          high: 100,
        },
        {
          question: { en: "Overall satisfaction", th: "ความพึงพอใจโดยรวม" },
          responses: 18,
          mean: 5.0,
          high: 100,
        },
        {
          question: {
            en: "First talk matched its topic",
            th: "หัวข้อเสวนาช่วงแรกสอดคล้องกับเนื้อหา",
          },
          responses: 18,
          mean: 4.94,
          high: 100,
        },
        {
          question: { en: "Content could be used elsewhere", th: "นำเนื้อหาไปประยุกต์ใช้ได้" },
          responses: 18,
          mean: 4.94,
          high: 100,
        },
        {
          question: { en: "Questions suited the topic", th: "คำถามเหมาะสมกับหัวข้อ" },
          responses: 18,
          mean: 4.89,
          high: 100,
        },
        {
          question: { en: "Content was useful", th: "เนื้อหามีประโยชน์" },
          responses: 18,
          mean: 4.89,
          high: 100,
        },
        {
          question: {
            en: "Second talk matched its topic",
            th: "หัวข้อเสวนาช่วงที่สองสอดคล้องกับเนื้อหา",
          },
          responses: 18,
          mean: 4.83,
          high: 100,
        },
        {
          question: { en: "Content was interesting", th: "เนื้อหาน่าสนใจ" },
          responses: 18,
          mean: 4.83,
          high: 100,
        },
        {
          question: { en: "Speakers suited the topic", th: "วิทยากรเหมาะสมกับหัวข้อเสวนา" },
          responses: 18,
          mean: 4.78,
          high: 100,
        },
        {
          question: { en: "Venue", th: "สถานที่จัดงาน" },
          responses: 18,
          mean: 4.78,
          high: 94,
        },
        {
          question: { en: "Length of each activity", th: "ระยะเวลาของแต่ละกิจกรรม" },
          responses: 18,
          mean: 4.56,
          high: 94,
        },
        {
          question: { en: "Day and hours of the event", th: "วันและเวลาจัดงาน" },
          responses: 18,
          mean: 4.56,
          high: 89,
        },
      ],
      notes: [
        {
          en: "All 18 people who responded were school students under 20. The event had 90 guests, so most guests did not respond.",
          th: "ผู้ตอบทั้ง 18 คนเป็นนักเรียนอายุต่ำกว่า 20 ปี งานนี้มีผู้เข้าร่วมงาน 90 คน ผู้เข้าร่วมส่วนใหญ่จึงไม่ได้ตอบ",
        },
        {
          en: "Scores are on a scale of 1 to 5, where 5 is best. Length of each activity and day and hours of the event tie at 4.56.",
          th: "คะแนนเต็ม 5 โดย 5 คือดีที่สุด ระยะเวลาของแต่ละกิจกรรมและวันเวลาจัดงานได้คะแนนเท่ากันที่ 4.56",
        },
      ],
      source: {
        en: "BIRSA Open House 2023 evaluation form, raw responses",
        th: "แบบประเมินโครงการ BIR Open House เดือนกุมภาพันธ์ 2566 ข้อมูลดิบ",
      },
      period: { en: "10 February 2023", th: "10 กุมภาพันธ์ 2566" },
    },
    {
      id: "respondent-mix",
      title: { en: "Who answered the surveys", th: "ผู้ตอบแบบสอบถามเป็นใคร" },
      summary: {
        en: "Sports Day answers came most often from year 3 students, and 41 of 72 seminar answers came from people watching online.",
        th: "ผู้ตอบงานกีฬาสีเป็นนักศึกษาชั้นปีที่ 3 มากที่สุด และ 41 จาก 72 คำตอบของงานเสวนามาจากผู้ชมออนไลน์",
      },
      columns: [
        { key: "survey", label: { en: "Survey", th: "แบบสอบถาม" }, kind: "text" },
        { key: "group", label: { en: "Group", th: "กลุ่ม" }, kind: "text" },
        { key: "count", label: { en: "Responses", th: "จำนวนผู้ตอบ" }, kind: "number" },
      ],
      rows: [
        {
          survey: { en: "Sports Day, first form", th: "งานกีฬาสี ชุดแรก" },
          group: { en: "Year 1 students", th: "นักศึกษาชั้นปีที่ 1" },
          count: 11,
        },
        {
          survey: { en: "Sports Day, first form", th: "งานกีฬาสี ชุดแรก" },
          group: { en: "Year 2 students", th: "นักศึกษาชั้นปีที่ 2" },
          count: 13,
        },
        {
          survey: { en: "Sports Day, first form", th: "งานกีฬาสี ชุดแรก" },
          group: { en: "Year 3 students", th: "นักศึกษาชั้นปีที่ 3" },
          count: 27,
        },
        {
          survey: { en: "Sports Day, first form", th: "งานกีฬาสี ชุดแรก" },
          group: { en: "Year 4 students", th: "นักศึกษาชั้นปีที่ 4" },
          count: 11,
        },
        {
          survey: { en: "Sports Day, second form", th: "งานกีฬาสี ชุดที่สอง" },
          group: { en: "Year 1 students", th: "นักศึกษาชั้นปีที่ 1" },
          count: 40,
        },
        {
          survey: { en: "Sports Day, second form", th: "งานกีฬาสี ชุดที่สอง" },
          group: { en: "Year 2 students", th: "นักศึกษาชั้นปีที่ 2" },
          count: 27,
        },
        {
          survey: { en: "Sports Day, second form", th: "งานกีฬาสี ชุดที่สอง" },
          group: { en: "Year 3 students", th: "นักศึกษาชั้นปีที่ 3" },
          count: 63,
        },
        {
          survey: { en: "Sports Day, second form", th: "งานกีฬาสี ชุดที่สอง" },
          group: { en: "Year 4 students", th: "นักศึกษาชั้นปีที่ 4" },
          count: 31,
        },
        {
          survey: { en: "Japan policy seminar", th: "งานเสวนาเรื่องญี่ปุ่น" },
          group: { en: "Watched on Facebook Live", th: "ชมทาง Facebook Live" },
          count: 41,
        },
        {
          survey: { en: "Japan policy seminar", th: "งานเสวนาเรื่องญี่ปุ่น" },
          group: { en: "Attended in room R102", th: "เข้าร่วมในห้อง ร.102" },
          count: 31,
        },
        {
          survey: { en: "Japan policy seminar", th: "งานเสวนาเรื่องญี่ปุ่น" },
          group: { en: "Aged 20 to 29", th: "อายุ 20 ถึง 29 ปี" },
          count: 58,
        },
        {
          survey: { en: "Japan policy seminar", th: "งานเสวนาเรื่องญี่ปุ่น" },
          group: { en: "Aged under 20", th: "อายุต่ำกว่า 20 ปี" },
          count: 9,
        },
        {
          survey: { en: "Japan policy seminar", th: "งานเสวนาเรื่องญี่ปุ่น" },
          group: { en: "Aged 30 to 39", th: "อายุ 30 ถึง 39 ปี" },
          count: 5,
        },
        {
          survey: { en: "BIR Open House 2023", th: "BIR Open House" },
          group: { en: "School students aged under 20", th: "นักเรียนมัธยมอายุต่ำกว่า 20 ปี" },
          count: 18,
        },
      ],
      notes: [
        {
          en: "Sports Day forms record the respondent's year of study. The seminar form records how people took part and their age band. Groups within one survey overlap, so they are not added together.",
          th: "แบบสอบถามงานกีฬาสีบันทึกชั้นปีของผู้ตอบ แบบสอบถามงานเสวนาบันทึกช่องทางที่เข้าร่วมและช่วงอายุ กลุ่มในแบบสอบถามเดียวกันซ้อนกันอยู่ จึงไม่รวมเป็นยอดเดียว",
        },
      ],
      source: {
        en: "Raw response sheets of the BIRSA survey forms, counted by BIRSA",
        th: "ข้อมูลดิบของแบบสอบถามของ BIRSA นับโดย BIRSA",
      },
      period: { en: "October 2022 to February 2023", th: "ตุลาคม 2565 ถึงกุมภาพันธ์ 2566" },
    },
  ],
};
