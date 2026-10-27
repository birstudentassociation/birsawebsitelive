import type { Locale } from "@/lib/i18n";

type Bi = Record<Locale, string>;

export const ADVISORY_FROM = "2026-10-27";
export const ADVISORY_TO = "2026-11-05";

export const advisoryCopy: Record<
  Locale,
  {
    title: string;
    metaDescription: string;
    lede: string;
    breadcrumb: string;
    ogContext: string;
    noticeTitle: string;
    notice: string;
    liveHeading: string;
    liveLede: string;
    checkedAt: string;
    conditionsLink: string;
    tableHeading: string;
    tableLede: string;
    caption: string;
    columns: { date: string; highs: string; lows: string };
    today: string;
    metres: string;
    tableUnavailable: string;
    tableSource: string;
    areasHeading: string;
    areasLede: string;
    areas: string[];
    doHeading: string;
    do: string[];
    helpHeading: string;
    help: string[];
    floodGuideLink: string;
    aboutHeading: string;
    about: string[];
  }
> = {
  en: {
    title: "High tides on the Chao Phraya until 5 November",
    metaDescription:
      "The Department of Disaster Prevention and Mitigation warns of high sea tides in Bangkok and 6 central provinces from 27 October to 5 November 2026, with the highest water between 6am and 3pm.",
    lede: "The Department of Disaster Prevention and Mitigation (DDPM) has warned that high sea tides could push the Chao Phraya over its banks in Bangkok and 6 central provinces from 27 October to 5 November 2026. The water is expected to be highest between 6am and 3pm.",
    breadcrumb: "Advisory",
    ogContext: "27 October to 5 November 2026, 6am to 3pm",
    noticeTitle: "Riverside areas may flood between 6am and 3pm",
    notice:
      "Tha Prachan campus is on the Chao Phraya. Water may come over the bank into low-lying areas by rivers and canals, communities outside the flood walls, and gaps where there is no permanent flood defence.",
    liveHeading: "Tide and river now",
    liveLede:
      "These readings update every 5 minutes. The tide is a prediction from a model, so check the river level as well.",
    checkedAt: "Checked at {time}",
    conditionsLink: "See all river, weather and travel conditions",
    tableHeading: "Predicted tides, 27 October to 5 November",
    tableLede:
      "Predicted heights in metres at the Navy Headquarters tide station (N01), on the river near Tha Prachan. Times are Bangkok time. The highest tide of each day is in bold.",
    caption:
      "Predicted high and low tides at the Navy Headquarters tide station, 27 October to 5 November 2026",
    columns: { date: "Date", highs: "High tide", lows: "Low tide" },
    today: "Today",
    metres: "m",
    tableUnavailable:
      "The tide prediction is not available at the moment. Check again later, or use the ThaiWater website.",
    tableSource: "Prediction from the Hydro Informatics Institute",
    areasHeading: "Areas to watch",
    areasLede: "The DDPM has asked these areas to watch for high water.",
    areas: [
      "Bangkok",
      "Pathum Thani, in Mueang Pathum Thani and Sam Khok districts",
      "Nonthaburi, in Mueang Nonthaburi, Pak Kret and Bang Kruai districts",
      "Nakhon Pathom, in Bang Len, Nakhon Chai Si and Sam Phran districts",
      "Samut Sakhon, in all districts",
      "Samut Songkhram, in all districts",
      "Samut Prakan, in Mueang Samut Prakan, Phra Samut Chedi, Phra Pradaeng and Bang Bo districts",
    ],
    doHeading: "What you should do",
    do: [
      "Check the river level before you go to the riverside or a pier, especially between 6am and 3pm.",
      "Keep away from the river bank when the water is high. Do not walk or ride through flood water.",
      "If you live by a river or canal, or in a low-lying area, move belongings and electrical items off the floor and be ready to act.",
      "Follow warnings on the THAI DISASTER ALERT app.",
    ],
    helpHeading: "If you need help",
    help: [
      "Call the DDPM safety hotline on 1784. It is open 24 hours a day.",
      "Add the DDPM LINE account @1784DDPM to report an incident and ask for help.",
    ],
    floodGuideLink: "Read what to do in a flood",
    aboutHeading: "About this warning",
    about: [
      "The Hydrographic Department of the Royal Thai Navy issued announcement 14/2569 on 26 October 2026 about water levels in the Chao Phraya at Phra Chulachomklao Fort and nearby areas. It said sea tides would be high from 27 October to 5 November 2026 between 6am and 3pm.",
      "On 27 October 2026 Nirat Phongsitthithavorn, Director General of the DDPM, said the department, as the Central Disaster Prevention and Mitigation Command, had asked Bangkok and the 6 provinces to tell people when the tides are high, check flood walls, and keep machinery and response teams ready to help people 24 hours a day.",
    ],
  },
  th: {
    title: "เฝ้าระวังน้ำทะเลหนุนสูงถึงวันที่ 5 พฤศจิกายน",
    metaDescription:
      "ปภ. แจ้งกรุงเทพมหานครและ 6 จังหวัดภาคกลางเฝ้าระวังน้ำทะเลหนุนสูงระหว่างวันที่ 27 ตุลาคม ถึง 5 พฤศจิกายน 2569 ช่วงเวลา 06.00 ถึง 15.00 น.",
    lede: "กรมป้องกันและบรรเทาสาธารณภัย (ปภ.) แจ้งให้กรุงเทพมหานครและ 6 จังหวัดภาคกลางเฝ้าระวังน้ำทะเลหนุนสูงระหว่างวันที่ 27 ตุลาคม ถึง 5 พฤศจิกายน 2569 ช่วงเวลา 06.00 ถึง 15.00 น. น้ำในแม่น้ำเจ้าพระยาอาจล้นตลิ่ง",
    breadcrumb: "ประกาศแจ้งเตือน",
    ogContext: "27 ตุลาคม ถึง 5 พฤศจิกายน 2569 เวลา 06.00 ถึง 15.00 น.",
    noticeTitle: "พื้นที่ริมน้ำอาจมีน้ำท่วมช่วง 06.00 ถึง 15.00 น.",
    notice:
      "ธรรมศาสตร์ ท่าพระจันทร์ตั้งอยู่ริมแม่น้ำเจ้าพระยา น้ำอาจไหลเข้าท่วมพื้นที่ลุ่มต่ำริมแม่น้ำและคลอง ชุมชนนอกแนวคันกั้นน้ำ และจุดที่ไม่มีแนวป้องกันน้ำถาวร (แนวฟันหลอ)",
    liveHeading: "ระดับน้ำขณะนี้",
    liveLede:
      "ข้อมูลส่วนนี้ปรับทุก 5 นาที ระดับน้ำขึ้นน้ำลงเป็นค่าพยากรณ์จากแบบจำลอง จึงควรดูระดับน้ำในแม่น้ำประกอบด้วย",
    checkedAt: "ตรวจสอบเมื่อเวลา {time} น.",
    conditionsLink: "ดูสภาพแม่น้ำ อากาศ และการเดินทางทั้งหมด",
    tableHeading: "ตารางน้ำขึ้นน้ำลง 27 ตุลาคม ถึง 5 พฤศจิกายน",
    tableLede:
      "ค่าพยากรณ์ความสูงของน้ำเป็นเมตร ที่สถานีน้ำขึ้นน้ำลงกองบัญชาการกองทัพเรือ (N01) ริมแม่น้ำใกล้ท่าพระจันทร์ เวลาเป็นเวลาประเทศไทย ตัวหนาคือน้ำขึ้นสูงสุดของแต่ละวัน",
    caption:
      "ค่าพยากรณ์น้ำขึ้นและน้ำลงที่สถานีกองบัญชาการกองทัพเรือ วันที่ 27 ตุลาคม ถึง 5 พฤศจิกายน 2569",
    columns: { date: "วันที่", highs: "น้ำขึ้น", lows: "น้ำลง" },
    today: "วันนี้",
    metres: "ม.",
    tableUnavailable:
      "ขณะนี้ยังไม่มีข้อมูลพยากรณ์น้ำขึ้นน้ำลง โปรดตรวจสอบอีกครั้งภายหลัง หรือดูที่เว็บไซต์คลังข้อมูลน้ำแห่งชาติ",
    tableSource: "ค่าพยากรณ์จากสถาบันสารสนเทศทรัพยากรน้ำ (สสน.)",
    areasHeading: "พื้นที่เฝ้าระวัง",
    areasLede: "ปภ. แจ้งให้พื้นที่ต่อไปนี้เฝ้าระวังสถานการณ์น้ำทะเลหนุนสูง",
    areas: [
      "กรุงเทพมหานคร",
      "ปทุมธานี อำเภอเมืองปทุมธานี และอำเภอสามโคก",
      "นนทบุรี อำเภอเมืองนนทบุรี อำเภอปากเกร็ด และอำเภอบางกรวย",
      "นครปฐม อำเภอบางเลน อำเภอนครชัยศรี และอำเภอสามพราน",
      "สมุทรสาคร ทุกอำเภอ",
      "สมุทรสงคราม ทุกอำเภอ",
      "สมุทรปราการ อำเภอเมืองสมุทรปราการ อำเภอพระสมุทรเจดีย์ อำเภอพระประแดง และอำเภอบางบ่อ",
    ],
    doHeading: "สิ่งที่ควรทำ",
    do: [
      "ดูระดับน้ำก่อนไปริมแม่น้ำหรือท่าเรือ โดยเฉพาะช่วง 06.00 ถึง 15.00 น.",
      "อยู่ห่างจากตลิ่งเมื่อน้ำขึ้นสูง และอย่าเดินหรือขับขี่ผ่านน้ำท่วม",
      "หากพักอาศัยริมแม่น้ำ ริมคลอง หรือในพื้นที่ลุ่มต่ำ ให้ยกของและเครื่องใช้ไฟฟ้าขึ้นที่สูง และเตรียมพร้อมรับมือ",
      "ติดตามประกาศแจ้งเตือนภัยในแอปพลิเคชัน THAI DISASTER ALERT",
    ],
    helpHeading: "หากต้องการความช่วยเหลือ",
    help: [
      "โทรสายด่วนนิรภัย 1784 ได้ตลอด 24 ชั่วโมง",
      "เพิ่มเพื่อนไลน์ ปภ.รับแจ้งเหตุ1784 (@1784DDPM) เพื่อแจ้งเหตุและขอความช่วยเหลือ",
    ],
    floodGuideLink: "อ่านวิธีรับมือน้ำท่วม",
    aboutHeading: "ที่มาของประกาศ",
    about: [
      "กรมอุทกศาสตร์ กองทัพเรือ ออกประกาศเรื่องสภาวะระดับน้ำในแม่น้ำเจ้าพระยา บริเวณป้อมพระจุลจอมเกล้าและพื้นที่ใกล้เคียง ฉบับที่ 14/2569 เมื่อวันที่ 26 ตุลาคม 2569 แจ้งว่าระหว่างวันที่ 27 ตุลาคม ถึง 5 พฤศจิกายน 2569 เวลา 06.00 ถึง 15.00 น. เป็นช่วงที่น้ำทะเลหนุนสูง",
      "เมื่อวันที่ 27 ตุลาคม 2569 นายนิรัตน์ พงษ์สิทธิถาวร อธิบดีกรมป้องกันและบรรเทาสาธารณภัย เปิดเผยว่า ปภ. ในฐานะกองอำนวยการป้องกันและบรรเทาสาธารณภัยกลาง (กอปภ.ก.) ได้แจ้งให้กรุงเทพมหานครและ 6 จังหวัดประชาสัมพันธ์ให้ประชาชนทราบช่วงเวลาที่น้ำทะเลหนุนสูง ตรวจสอบแนวคันกั้นน้ำ และเตรียมเครื่องจักรกลและทีมปฏิบัติการให้พร้อมช่วยเหลือประชาชนตลอด 24 ชั่วโมง",
    ],
  },
};

export const advisoryBanner: { message: Bi; cta: Bi } = {
  message: {
    en: "High tides may flood riverside areas of Bangkok between 6am and 3pm until 5 November.",
    th: "เฝ้าระวังน้ำทะเลหนุนสูงริมแม่น้ำเจ้าพระยา ช่วง 06.00 ถึง 15.00 น. จนถึงวันที่ 5 พฤศจิกายน",
  },
  cta: { en: "Check the tides", th: "ดูระดับน้ำล่าสุด" },
};
