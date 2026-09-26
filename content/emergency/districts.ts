import type { BangkokDistrict } from "@/content/emergency/types";

/**
 * Sandbag points, shelters and free parking published for each of Bangkok's
 * 50 districts during the floods of September 2026, read from BMA, district
 * office and Thai news reports. Every place carries the page it was read on.
 * The district finder on the flooding guide searches this list. Shelters and
 * parking change through the day, so the guide also links to BKK Care
 * Monitor, the BMA's live list.
 */
export const districtsCheckedAt = "2026-09-26T21:00:00+07:00";

export const bangkokDistricts: BangkokDistrict[] = [
  {
    id: "phra-nakhon",
    name: { en: "Phra Nakhon", th: "พระนคร" },
    officePhone: "02-628-9068",
    sandbags: [
      {
        name: { en: "Phra Nakhon District Office (สำนักงานเขตพระนคร)", th: "สำนักงานเขตพระนคร" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "dusit",
    name: { en: "Dusit", th: "ดุสิต" },
    officePhone: "02-243-5311",
    sandbags: [
      {
        name: { en: "Dusit District Office (สำนักงานเขตดุสิต)", th: "สำนักงานเขตดุสิต" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "nong-chok",
    name: { en: "Nong Chok", th: "หนองจอก" },
    aliases: ["Nongjok"],
    officePhone: "02-543-1143",
    sandbags: [
      {
        name: { en: "Nong Chok District Office (สำนักงานเขตหนองจอก)", th: "สำนักงานเขตหนองจอก" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "bang-rak",
    name: { en: "Bang Rak", th: "บางรัก" },
    officePhone: "02-236-1395",
    sandbags: [
      {
        name: { en: "Bang Rak District Office (สำนักงานเขตบางรัก)", th: "สำนักงานเขตบางรัก" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "bang-khen",
    name: { en: "Bang Khen", th: "บางเขน" },
    officePhone: "02-521-0666",
    sandbags: [
      {
        name: { en: "Bang Khen District Office (สำนักงานเขตบางเขน)", th: "สำนักงานเขตบางเขน" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: { en: "Prachaphiban School (โรงเรียนประชาภิบาล)", th: "โรงเรียนประชาภิบาล" },
        phone: "089-783-3595",
        source: "https://www.thaipost.net/x-cite-news/1076601/",
      },
    ],
    parking: [
      {
        name: {
          en: "Parking opposite Wat Phra Si Mahathat (ตรงข้ามวัดพระศรีมหาธาตุฯ)",
          th: "จุดจอดรถตรงข้ามวัดพระศรีมหาธาตุฯ",
        },
        detail: {
          en: "Arranged by Bang Khen District Office. Call the district office for details.",
          th: "สำนักงานเขตบางเขนประสานจัดพื้นที่ไว้ โทรสอบถามรายละเอียดที่สำนักงานเขต",
        },
        source: "https://today.line.me/th/v3/article/vXLeMG3",
      },
      {
        name: { en: "Central Ramindra (เซ็นทรัล รามอินทรา)", th: "เซ็นทรัล รามอินทรา" },
        detail: {
          en: "Free parking for people affected by the floods, one of the Central Pattana malls taking part. Ask the mall which floor to use and until when.",
          th: "จอดรถฟรีสำหรับผู้ได้รับผลกระทบจากน้ำท่วม เป็นหนึ่งในศูนย์การค้าเซ็นทรัลที่ร่วมโครงการ สอบถามชั้นจอดและระยะเวลาได้ที่ศูนย์การค้าโดยตรง",
        },
        source: "https://mgronline.com/onlinesection/detail/9690000093939",
      },
    ],
  },
  {
    id: "bang-kapi",
    name: { en: "Bang Kapi", th: "บางกะปิ" },
    officePhone: "02-377-5494",
    sandbags: [
      {
        name: { en: "Bang Kapi District Office (สำนักงานเขตบางกะปิ)", th: "สำนักงานเขตบางกะปิ" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "pathum-wan",
    name: { en: "Pathum Wan", th: "ปทุมวัน" },
    aliases: ["Pathumwan"],
    officePhone: "02-214-3004",
    sandbags: [
      {
        name: { en: "Pathum Wan District Office (สำนักงานเขตปทุมวัน)", th: "สำนักงานเขตปทุมวัน" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [
      {
        name: {
          en: "Bangkok Railway Station, Hua Lamphong (สถานีรถไฟกรุงเทพ หัวลำโพง)",
          th: "สถานีรถไฟกรุงเทพ (หัวลำโพง)",
        },
        detail: {
          en: "About 100 cars, 26 to 28 September. Run by the State Railway of Thailand.",
          th: "รองรับรถยนต์ประมาณ 100 คัน วันที่ 26 ถึง 28 กันยายน การรถไฟแห่งประเทศไทยเป็นผู้ดูแล",
        },
        source: "https://brickinfotv.com/news/329338",
      },
    ],
  },
  {
    id: "pom-prap-sattru-phai",
    name: { en: "Pom Prap Sattru Phai", th: "ป้อมปราบศัตรูพ่าย" },
    aliases: ["Pom Prap", "ป้อมปราบฯ"],
    officePhone: "02-281-0281",
    sandbags: [
      {
        name: {
          en: "Pom Prap Sattru Phai District Office (สำนักงานเขตป้อมปราบศัตรูพ่าย)",
          th: "สำนักงานเขตป้อมปราบศัตรูพ่าย",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "phra-khanong",
    name: { en: "Phra Khanong", th: "พระโขนง" },
    aliases: ["Prakanong"],
    officePhone: "02-333-0964",
    sandbags: [
      {
        name: { en: "Phra Khanong District Office (สำนักงานเขตพระโขนง)", th: "สำนักงานเขตพระโขนง" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "min-buri",
    name: { en: "Min Buri", th: "มีนบุรี" },
    officePhone: "02-540-7160",
    sandbags: [
      {
        name: { en: "Min Buri District Office (สำนักงานเขตมีนบุรี)", th: "สำนักงานเขตมีนบุรี" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "lat-krabang",
    name: { en: "Lat Krabang", th: "ลาดกระบัง" },
    officePhone: "02-326-9149",
    sandbags: [
      {
        name: { en: "Wat Sutthaphot (วัดสุทธาโภชน์)", th: "วัดสุทธาโภชน์" },
        detail: {
          en: "5 truckloads delivered on 26 September. Fill the bags yourself and bring your own vehicle. Bring your ID card, up to 20 bags per household.",
          th: "จัดส่ง 5 คันรถ เมื่อวันที่ 26 กันยายน บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
      {
        name: { en: "Wat Thipphawat (วัดทิพพาวาส)", th: "วัดทิพพาวาส" },
        detail: {
          en: "5 truckloads delivered on 26 September. Fill the bags yourself and bring your own vehicle. Bring your ID card, up to 20 bags per household.",
          th: "จัดส่ง 5 คันรถ เมื่อวันที่ 26 กันยายน บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
      {
        name: { en: "Wat Khum Thong (วัดขุมทอง)", th: "วัดขุมทอง" },
        detail: {
          en: "5 truckloads delivered on 26 September. Fill the bags yourself and bring your own vehicle. Bring your ID card, up to 20 bags per household.",
          th: "จัดส่ง 5 คันรถ เมื่อวันที่ 26 กันยายน บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
      {
        name: { en: "Wat Ratchakosa (วัดราชโกษา)", th: "วัดราชโกษา" },
        detail: {
          en: "5 truckloads delivered on 26 September. Fill the bags yourself and bring your own vehicle. Bring your ID card, up to 20 bags per household.",
          th: "จัดส่ง 5 คันรถ เมื่อวันที่ 26 กันยายน บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
      {
        name: { en: "Wat Sangkharacha (วัดสังฆราชา)", th: "วัดสังฆราชา" },
        detail: {
          en: "5 truckloads delivered on 26 September. Fill the bags yourself and bring your own vehicle. Bring your ID card, up to 20 bags per household.",
          th: "จัดส่ง 5 คันรถ เมื่อวันที่ 26 กันยายน บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
      {
        name: { en: "Surao Thap Yao (สุเหร่าทับยาว)", th: "สุเหร่าทับยาว" },
        detail: {
          en: "3 truckloads delivered on 26 September. Fill the bags yourself and bring your own vehicle. Bring your ID card, up to 20 bags per household.",
          th: "จัดส่ง 3 คันรถ เมื่อวันที่ 26 กันยายน บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
      {
        name: {
          en: "Lat Krabang District Office (สำนักงานเขตลาดกระบัง)",
          th: "สำนักงานเขตลาดกระบัง",
        },
        detail: {
          en: "8 truckloads delivered on 26 September. Fill the bags yourself and bring your own vehicle. Bring your ID card, up to 20 bags per household.",
          th: "จัดส่ง 8 คันรถ เมื่อวันที่ 26 กันยายน บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "yan-nawa",
    name: { en: "Yan Nawa", th: "ยานนาวา" },
    aliases: ["Yannawa"],
    officePhone: "02-294-2393",
    sandbags: [
      {
        name: { en: "Yan Nawa District Office (สำนักงานเขตยานนาวา)", th: "สำนักงานเขตยานนาวา" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [
      {
        name: { en: "Central Rama 3 (เซ็นทรัล พระราม 3)", th: "เซ็นทรัล พระราม 3" },
        detail: {
          en: "Free parking for people affected by the floods, one of the Central Pattana malls taking part. Ask the mall which floor to use and until when.",
          th: "จอดรถฟรีสำหรับผู้ได้รับผลกระทบจากน้ำท่วม เป็นหนึ่งในศูนย์การค้าเซ็นทรัลที่ร่วมโครงการ สอบถามชั้นจอดและระยะเวลาได้ที่ศูนย์การค้าโดยตรง",
        },
        source: "https://mgronline.com/onlinesection/detail/9690000093939",
      },
    ],
  },
  {
    id: "samphanthawong",
    name: { en: "Samphanthawong", th: "สัมพันธวงศ์" },
    aliases: ["Sampantawong", "Chinatown", "Yaowarat", "เยาวราช"],
    officePhone: "02-233-1224",
    sandbags: [
      {
        name: {
          en: "Samphanthawong District Office (สำนักงานเขตสัมพันธวงศ์)",
          th: "สำนักงานเขตสัมพันธวงศ์",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "phaya-thai",
    name: { en: "Phaya Thai", th: "พญาไท" },
    aliases: ["Phayathai"],
    officePhone: "02-279-4140",
    sandbags: [
      {
        name: { en: "Phaya Thai District Office (สำนักงานเขตพญาไท)", th: "สำนักงานเขตพญาไท" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Public Health Service Centre 51 building, inside Wat Phai Ton (อาคารศูนย์บริการสาธารณสุข 51 เดิม ภายในวัดไผ่ตัน)",
          th: "อาคารศูนย์บริการสาธารณสุข 51 (เดิม) ภายในวัดไผ่ตัน ซอยพหลโยธิน 15",
        },
        phone: "02-279-4140",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Department of Public Works and Town and Country Planning, Rama VI Road (กรมโยธาธิการและผังเมือง ถนนพระรามที่ 6)",
          th: "ศูนย์พักพิงชั่วคราว กรมโยธาธิการและผังเมือง ถนนพระรามที่ 6",
        },
        detail: {
          en: "Open from 26 September for people who have had to leave flooded homes.",
          th: "เปิดตั้งแต่วันที่ 26 กันยายน สำหรับประชาชนที่อพยพจากพื้นที่น้ำท่วม",
        },
        source: "https://www.realnewsthailand.net/article/73464/",
      },
    ],
    parking: [
      {
        name: {
          en: "Department of Public Works and Town and Country Planning car park, Soi Phra Ram 6 Soi 30 (จุดจอดรถฟรี กรมโยธาธิการและผังเมือง ซอยพระราม 6 ซอย 30)",
          th: "จุดจอดรถฟรี เลขที่ 9 ซอยพระราม 6 ซอย 30 ถนนพระราม 6 แขวงพญาไท เขตพญาไท",
        },
        detail: {
          en: "Open from 26 September, next to the department's temporary shelter.",
          th: "เปิดตั้งแต่วันที่ 26 กันยายน อยู่ติดกับศูนย์พักพิงชั่วคราวของกรมฯ",
        },
        source: "https://www.realnewsthailand.net/article/73464/",
      },
    ],
  },
  {
    id: "thon-buri",
    name: { en: "Thon Buri", th: "ธนบุรี" },
    aliases: ["Thonburi"],
    officePhone: "02-465-0025",
    sandbags: [
      {
        name: { en: "Thon Buri District Office (สำนักงานเขตธนบุรี)", th: "สำนักงานเขตธนบุรี" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [
      {
        name: {
          en: "The Mall Lifestore Tha Phra (เดอะมอลล์ไลฟ์สโตร์ ท่าพระ)",
          th: "เดอะมอลล์ไลฟ์สโตร์ ท่าพระ",
        },
        detail: {
          en: "Free parking on floors 1M and 2M, 26 to 27 September. Register with a copy of an ID card and vehicle registration book, park only on the assigned floor, first come first served while space lasts. The car can only be collected by the person who registered it.",
          th: "จอดรถฟรีที่ชั้น 1M และ 2M วันที่ 26 ถึง 27 กันยายน ลงทะเบียนด้วยสำเนาบัตรประชาชนและสำเนาทะเบียนรถ จอดเฉพาะชั้นที่กำหนด ให้บริการตามลำดับการลงทะเบียนจนกว่าพื้นที่จะเต็ม รับรถคืนได้เฉพาะผู้ที่นำรถมาลงทะเบียนเท่านั้น",
        },
        phone: "02-469-1000",
        source: "https://www.dailynews.co.th/news/6223346/",
      },
    ],
  },
  {
    id: "bangkok-yai",
    name: { en: "Bangkok Yai", th: "บางกอกใหญ่" },
    officePhone: "02-457-0069",
    sandbags: [
      {
        name: {
          en: "Bangkok Yai District Office (สำนักงานเขตบางกอกใหญ่)",
          th: "สำนักงานเขตบางกอกใหญ่",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Wat Ratchasittharam School (โรงเรียนวัดราชสิทธาราม)",
          th: "โรงเรียนวัดราชสิทธาราม",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Wat Nak Klang School (โรงเรียนวัดนาคกลาง)", th: "โรงเรียนวัดนาคกลาง" },
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Wat Mai Phiren School (โรงเรียนวัดใหม่พิเรนทร์)",
          th: "โรงเรียนวัดใหม่พิเรนทร์",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Wat Tha Phra School (โรงเรียนวัดท่าพระ)", th: "โรงเรียนวัดท่าพระ" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Wat Di Duat School (โรงเรียนวัดดีดวด)", th: "โรงเรียนวัดดีดวด" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: {
          en: "Wat Pradu Chimphli School (โรงเรียนวัดประดู่ฉิมพลี)",
          th: "โรงเรียนวัดประดู่ฉิมพลี",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    parking: [],
  },
  {
    id: "huai-khwang",
    name: { en: "Huai Khwang", th: "ห้วยขวาง" },
    officePhone: "02-277-9100",
    sandbags: [
      {
        name: {
          en: "Huai Khwang District Office (สำนักงานเขตห้วยขวาง)",
          th: "สำนักงานเขตห้วยขวาง",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Pracharat Bamphen meeting room, 4th floor, Huai Khwang district office (ห้องประชุมประชาราษฎร์บำเพ็ญ ชั้น 4 สำนักงานเขตห้วยขวาง)",
          th: "ห้องประชุมประชาราษฎร์บำเพ็ญ ชั้น 4 สำนักงานเขตห้วยขวาง",
        },
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
    ],
    parking: [
      {
        name: { en: "Central Rama 9 (เซ็นทรัล พระราม 9)", th: "เซ็นทรัล พระราม 9" },
        detail: {
          en: "Free parking for people affected by the floods, one of the Central Pattana malls taking part. Ask the mall which floor to use and until when.",
          th: "จอดรถฟรีสำหรับผู้ได้รับผลกระทบจากน้ำท่วม เป็นหนึ่งในศูนย์การค้าเซ็นทรัลที่ร่วมโครงการ สอบถามชั้นจอดและระยะเวลาได้ที่ศูนย์การค้าโดยตรง",
        },
        source: "https://mgronline.com/onlinesection/detail/9690000093939",
      },
    ],
  },
  {
    id: "khlong-san",
    name: { en: "Khlong San", th: "คลองสาน" },
    aliases: ["Klongsan"],
    officePhone: "02-437-2342",
    sandbags: [
      {
        name: { en: "Khlong San District Office (สำนักงานเขตคลองสาน)", th: "สำนักงานเขตคลองสาน" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: { en: "Wat Suwan School (โรงเรียนวัดสุวรรณ)", th: "โรงเรียนวัดสุวรรณ" },
        phone: "063-156-9351",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Wat Thong Phleng School (โรงเรียนวัดทองเพลง)", th: "โรงเรียนวัดทองเพลง" },
        phone: "096-154-5286",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Wat Thong Thammachat School (โรงเรียนวัดทองธรรมชาติ)",
          th: "โรงเรียนวัดทองธรรมชาติ",
        },
        phone: "083-158-8555",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Wat Thong Noppakhun School (โรงเรียนวัดทองนพคุณ)", th: "โรงเรียนวัดทองนพคุณ" },
        phone: "081-445-9090",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Wat Sawet Chat School (โรงเรียนวัดเศวตฉัตร)", th: "โรงเรียนวัดเศวตฉัตร" },
        phone: "081-431-5427",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Wat Suttharam School (โรงเรียนวัดสุทธาราม)", th: "โรงเรียนวัดสุทธาราม" },
        phone: "083-725-7878",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Suttharam Secondary School (โรงเรียนมัธยมวัดสุทธาราม)",
          th: "โรงเรียนมัธยมวัดสุทธาราม",
        },
        phone: "086-891-2639",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Wat Phichaiyat School (โรงเรียนวัดพิชัยญาติ)", th: "โรงเรียนวัดพิชัยญาติ" },
        phone: "091-775-7806",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
    ],
    parking: [
      {
        name: {
          en: "ICS car park, opposite IconSiam (อาคารจอดรถ ICS ตรงข้ามไอคอนสยาม)",
          th: "อาคารจอดรถ ICS ตรงข้ามไอคอนสยาม",
        },
        detail: {
          en: "Siam Piwat opened free parking here for people affected by the flood, 26 to 27 September, as part of the Siam Ruam Jai Thai Chuai Thai project. Register with staff.",
          th: "สยามพิวรรธน์เปิดพื้นที่จอดรถฟรีให้ผู้ประสบภัยน้ำท่วม วันที่ 26 ถึง 27 กันยายน ภายใต้โครงการสยามรวมใจ ไทยช่วยไทย ลงทะเบียนกับเจ้าหน้าที่ก่อนเข้าจอด",
        },
        phone: "1338",
        source: "https://www.bangkokbiznews.com/news/news-update/1253694",
      },
    ],
  },
  {
    id: "taling-chan",
    name: { en: "Taling Chan", th: "ตลิ่งชัน" },
    officePhone: "02-424-1742",
    sandbags: [
      {
        name: {
          en: "Taling Chan District Office (สำนักงานเขตตลิ่งชัน)",
          th: "สำนักงานเขตตลิ่งชัน",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "bangkok-noi",
    name: { en: "Bangkok Noi", th: "บางกอกน้อย" },
    officePhone: "02-424-0056",
    sandbags: [
      {
        name: {
          en: "Bangkok Noi District Office (สำนักงานเขตบางกอกน้อย)",
          th: "สำนักงานเขตบางกอกน้อย",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [
      {
        name: { en: "Central Pinklao (เซ็นทรัล ปิ่นเกล้า)", th: "เซ็นทรัล ปิ่นเกล้า" },
        detail: {
          en: "Free parking for people affected by the floods, one of the Central Pattana malls taking part. Ask the mall which floor to use and until when.",
          th: "จอดรถฟรีสำหรับผู้ได้รับผลกระทบจากน้ำท่วม เป็นหนึ่งในศูนย์การค้าเซ็นทรัลที่ร่วมโครงการ สอบถามชั้นจอดและระยะเวลาได้ที่ศูนย์การค้าโดยตรง",
        },
        source: "https://mgronline.com/onlinesection/detail/9690000093939",
      },
    ],
  },
  {
    id: "bang-khun-thian",
    name: { en: "Bang Khun Thian", th: "บางขุนเทียน" },
    aliases: ["Bang Khun Tien"],
    officePhone: "02-415-1522",
    sandbags: [
      {
        name: {
          en: "Bang Khun Thian District Office (สำนักงานเขตบางขุนเทียน)",
          th: "สำนักงานเขตบางขุนเทียน",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Khlong Phitthayalongkon School (โรงเรียนคลองพิทยาลงกรณ์)",
          th: "โรงเรียนคลองพิทยาลงกรณ์",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    parking: [
      {
        name: { en: "Central Rama 2 (เซ็นทรัล พระราม 2)", th: "เซ็นทรัล พระราม 2" },
        detail: {
          en: "Free parking for people affected by the floods, one of the Central Pattana malls taking part. Ask the mall which floor to use and until when.",
          th: "จอดรถฟรีสำหรับผู้ได้รับผลกระทบจากน้ำท่วม เป็นหนึ่งในศูนย์การค้าเซ็นทรัลที่ร่วมโครงการ สอบถามชั้นจอดและระยะเวลาได้ที่ศูนย์การค้าโดยตรง",
        },
        source: "https://mgronline.com/onlinesection/detail/9690000093939",
      },
    ],
  },
  {
    id: "phasi-charoen",
    name: { en: "Phasi Charoen", th: "ภาษีเจริญ" },
    aliases: ["Pasicharoen"],
    officePhone: "02-413-0565",
    sandbags: [
      {
        name: {
          en: "Phasi Charoen District Office (สำนักงานเขตภาษีเจริญ)",
          th: "สำนักงานเขตภาษีเจริญ",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "nong-khaem",
    name: { en: "Nong Khaem", th: "หนองแขม" },
    aliases: ["Nong Kham"],
    officePhone: "02-421-0393",
    sandbags: [
      {
        name: { en: "Nong Khaem District Office (สำนักงานเขตหนองแขม)", th: "สำนักงานเขตหนองแขม" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "rat-burana",
    name: { en: "Rat Burana", th: "ราษฎร์บูรณะ" },
    aliases: ["Rasburana", "Ratburana"],
    officePhone: "02-427-4727",
    sandbags: [
      {
        name: {
          en: "Rat Burana District Office (สำนักงานเขตราษฎร์บูรณะ)",
          th: "สำนักงานเขตราษฎร์บูรณะ",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: { en: "Wat Bang Pakok School (โรงเรียนวัดบางปะกอก)", th: "โรงเรียนวัดบางปะกอก" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: {
          en: "Rattana Jeena Uthit School (โรงเรียนรัตนจีนะอุทิศ)",
          th: "โรงเรียนรัตนจีนะอุทิศ",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: {
          en: "Wat Prasert Sutthawat School (โรงเรียนวัดประเสริฐสุทธาวาส)",
          th: "โรงเรียนวัดประเสริฐสุทธาวาส",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Wat Sarod School (โรงเรียนวัดสารอด)", th: "โรงเรียนวัดสารอด" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Wat Son School (โรงเรียนวัดสน)", th: "โรงเรียนวัดสน" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Wat Chaeng Ron School (โรงเรียนวัดแจงร้อน)", th: "โรงเรียนวัดแจงร้อน" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    parking: [],
  },
  {
    id: "bang-phlat",
    name: { en: "Bang Phlat", th: "บางพลัด" },
    aliases: ["Bang Plad"],
    officePhone: "02-424-3777",
    sandbags: [
      {
        name: { en: "Bang Phlat District Office (สำนักงานเขตบางพลัด)", th: "สำนักงานเขตบางพลัด" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "din-daeng",
    name: { en: "Din Daeng", th: "ดินแดง" },
    officePhone: "02-245-2658",
    sandbags: [
      {
        name: { en: "Din Daeng District Office (สำนักงานเขตดินแดง)", th: "สำนักงานเขตดินแดง" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: { en: "Wichuthit School (โรงเรียนวิชูทิศ)", th: "โรงเรียนวิชูทิศ" },
        phone: "089-162-4325",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
    ],
    parking: [
      {
        name: { en: "Esplanade Ratchada (เอสพานาด รัชดา)", th: "เอสพานาด รัชดา" },
        detail: {
          en: "Free parking for people affected by the floods, one of the Central Pattana malls taking part. Ask the mall which floor to use and until when.",
          th: "จอดรถฟรีสำหรับผู้ได้รับผลกระทบจากน้ำท่วม เป็นหนึ่งในศูนย์การค้าเซ็นทรัลที่ร่วมโครงการ สอบถามชั้นจอดและระยะเวลาได้ที่ศูนย์การค้าโดยตรง",
        },
        source: "https://mgronline.com/onlinesection/detail/9690000093939",
      },
    ],
  },
  {
    id: "bueng-kum",
    name: { en: "Bueng Kum", th: "บึงกุ่ม" },
    aliases: ["Bung Kum", "Buengkum"],
    officePhone: "02-364-7349",
    sandbags: [
      {
        name: { en: "Bueng Kum District Office (สำนักงานเขตบึงกุ่ม)", th: "สำนักงานเขตบึงกุ่ม" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "sathon",
    name: { en: "Sathon", th: "สาทร" },
    aliases: ["Sathorn"],
    officePhone: "02-212-8112",
    sandbags: [
      {
        name: { en: "Sathon District Office (สำนักงานเขตสาทร)", th: "สำนักงานเขตสาทร" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "bang-sue",
    name: { en: "Bang Sue", th: "บางซื่อ" },
    aliases: ["Bangsue"],
    officePhone: "02-586-9977",
    sandbags: [
      {
        name: { en: "Bang Sue District Office (สำนักงานเขตบางซื่อ)", th: "สำนักงานเขตบางซื่อ" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Early childhood development centre, Hua Chakkraphat (ศูนย์พัฒนาเด็กก่อนวัยเรียน หัวจักรแดง)",
          th: "ศูนย์พัฒนาเด็กก่อนวัยเรียน (หัวจักรแดง)",
        },
        phone: "081-268-1104",
        source: "https://www.thaipost.net/x-cite-news/1076601/",
      },
      {
        name: {
          en: "Early childhood development centre, railway housing (ศูนย์พัฒนาเด็กก่อนวัยเรียน บ้านพักรถไฟ)",
          th: "ศูนย์พัฒนาเด็กก่อนวัยเรียน (บ้านพักรถไฟ)",
        },
        phone: "081-268-1104",
        source: "https://www.thaipost.net/x-cite-news/1076601/",
      },
    ],
    parking: [],
  },
  {
    id: "chatuchak",
    name: { en: "Chatuchak", th: "จตุจักร" },
    aliases: ["Jatujak", "Jatuchak"],
    officePhone: "02-513-3444",
    sandbags: [
      {
        name: { en: "Chatuchak District Office (สำนักงานเขตจตุจักร)", th: "สำนักงานเขตจตุจักร" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Prachaniwet Secondary School (โรงเรียนมัธยมประชานิเวศน์)",
          th: "โรงเรียนมัธยมประชานิเวศน์",
        },
        phone: "097-239-1627",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Prachaniwet School (โรงเรียนประชานิเวศน์)", th: "โรงเรียนประชานิเวศน์" },
        phone: "085-030-2814",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Senanikom School (โรงเรียนเสนานิคม)", th: "โรงเรียนเสนานิคม" },
        phone: "092-271-6787",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Ban Lat Phrao School (โรงเรียนบ้านลาดพร้าว)", th: "โรงเรียนบ้านลาดพร้าว" },
        phone: "02-541-8512",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Rattanakosin Somphot Ratchathan Upatham School (โรงเรียนรัตนโกสินทร์สมโภช ราชทานอุปถัมภ์)",
          th: "โรงเรียนรัตนโกสินทร์สมโภช ราชทานอุปถัมภ์",
        },
        phone: "098-054-4484",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Wat Thewasunthon school (โรงเรียนวัดเทวสุนทร)", th: "โรงเรียนวัดเทวสุนทร" },
        phone: "084-471-9056",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Wat Thewasunthon (วัดเทวสุนทร)", th: "วัดเทวสุนทร" },
        detail: {
          en: "About 10 people were staying here on 26 September. Also listed on 094-242-4571.",
          th: "เมื่อวันที่ 26 กันยายน มีผู้เข้าพักประมาณ 10 คน อีกเบอร์หนึ่งที่มีการเผยแพร่คือ 094-242-4571",
        },
        phone: "096-883-7585",
        source: "https://www.thaipost.net/x-cite-news/1076601/",
      },
      {
        name: { en: "Wat Semiannari School (โรงเรียนวัดเสมียนนารี)", th: "โรงเรียนวัดเสมียนนารี" },
        phone: "097-018-6879",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Rajabhat Chandrakasem University (ราชภัฏจันทรเกษม)", th: "ราชภัฏจันทรเกษม" },
        phone: "081-372-5898",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Chatuchak Centre (ศูนย์จตุจักร)", th: "ศูนย์จตุจักร" },
        phone: "088-672-2529",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
    ],
    parking: [
      {
        name: {
          en: "MRT Lat Phrao park and ride (อาคารจอดแล้วจร สถานีลาดพร้าว)",
          th: "อาคารจอดแล้วจร สถานีลาดพร้าว",
        },
        detail: {
          en: "Free for cars and motorcycles. Take your vehicle out by 2 October. The station is in Chatuchak, not Lat Phrao district.",
          th: "จอดรถยนต์และรถจักรยานยนต์ฟรี นำรถออกภายในวันที่ 2 ตุลาคม สถานีนี้อยู่ในเขตจตุจักร ไม่ใช่เขตลาดพร้าว",
        },
        source: "https://www.thansettakij.com/general-news/669877",
      },
      {
        name: {
          en: "Krung Thep Aphiwat Central Station free parking (bus lot behind the Juvenile Court)",
          th: "จุดจอดรถฟรี สถานีกลางกรุงเทพอภิวัฒน์ (ลานจอดรถบัส ด้านหลังศาลเยาวชนฯ)",
        },
        detail: {
          en: "About 200 to 250 cars in the bus park behind the Juvenile Court, 26 to 28 September. Run by the State Railway of Thailand.",
          th: "ลานจอดรถบัสด้านหลังศาลเยาวชนฯ รองรับรถยนต์ประมาณ 200 ถึง 250 คัน วันที่ 26 ถึง 28 กันยายน การรถไฟแห่งประเทศไทยเป็นผู้ดูแล",
        },
        source: "https://www.bangkokbiznews.com/news/news-update/1253683",
      },
      {
        name: { en: "Central Ladprao (เซ็นทรัล ลาดพร้าว)", th: "เซ็นทรัล ลาดพร้าว" },
        detail: {
          en: "Free parking for people affected by the floods, one of the Central Pattana malls taking part. Ask the mall which floor to use and until when.",
          th: "จอดรถฟรีสำหรับผู้ได้รับผลกระทบจากน้ำท่วม เป็นหนึ่งในศูนย์การค้าเซ็นทรัลที่ร่วมโครงการ สอบถามชั้นจอดและระยะเวลาได้ที่ศูนย์การค้าโดยตรง",
        },
        source: "https://mgronline.com/onlinesection/detail/9690000093939",
      },
    ],
  },
  {
    id: "bang-kho-laem",
    name: { en: "Bang Kho Laem", th: "บางคอแหลม" },
    aliases: ["Bang Kolaem"],
    officePhone: "02-291-3800",
    sandbags: [
      {
        name: {
          en: "Bang Kho Laem District Office (สำนักงานเขตบางคอแหลม)",
          th: "สำนักงานเขตบางคอแหลม",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "prawet",
    name: { en: "Prawet", th: "ประเวศ" },
    officePhone: "02-328-7149",
    sandbags: [
      {
        name: { en: "Prawet District Office (สำนักงานเขตประเวศ)", th: "สำนักงานเขตประเวศ" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "khlong-toei",
    name: { en: "Khlong Toei", th: "คลองเตย" },
    aliases: ["Klong Toey"],
    officePhone: "02-240-2121",
    sandbags: [
      {
        name: { en: "Khlong Toei District Office (สำนักงานเขตคลองเตย)", th: "สำนักงานเขตคลองเตย" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Chumchon Mu Ban Phatthana School (โรงเรียนชุมชนหมู่บ้านพัฒนา)",
          th: "โรงเรียนชุมชนหมู่บ้านพัฒนา",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Sun Ruam Namjai School (โรงเรียนศูนย์รวมน้ำใจ)", th: "โรงเรียนศูนย์รวมน้ำใจ" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Wat Saphan School (โรงเรียนวัดสะพาน)", th: "โรงเรียนวัดสะพาน" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Wat Khlong Toei School (โรงเรียนวัดคลองเตย)", th: "โรงเรียนวัดคลองเตย" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    parking: [],
  },
  {
    id: "suan-luang",
    name: { en: "Suan Luang", th: "สวนหลวง" },
    officePhone: "02-322-6688",
    sandbags: [
      {
        name: { en: "Suan Luang District Office (สำนักงานเขตสวนหลวง)", th: "สำนักงานเขตสวนหลวง" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Suan Luang meeting room, 6th floor, Suan Luang district office (ห้องประชุมสวนหลวง ชั้น 6 สำนักงานเขตสวนหลวง)",
          th: "ห้องประชุมสวนหลวง ชั้น 6 สำนักงานเขตสวนหลวง",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: {
          en: "Thammanurak Community pre school childcare centre (ศูนย์พัฒนาเด็กก่อนวัยเรียนชุมชนธรรมานุรักษ์)",
          th: "ศูนย์พัฒนาเด็กก่อนวัยเรียนชุมชนธรรมานุรักษ์",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    parking: [],
  },
  {
    id: "chom-thong",
    name: { en: "Chom Thong", th: "จอมทอง" },
    aliases: ["Jomtong"],
    officePhone: "02-427-1240",
    sandbags: [
      {
        name: { en: "Chom Thong District Office (สำนักงานเขตจอมทอง)", th: "สำนักงานเขตจอมทอง" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "don-mueang",
    name: { en: "Don Mueang", th: "ดอนเมือง" },
    aliases: ["Don Muang", "Donmuang"],
    officePhone: "02-565-9424",
    sandbags: [
      {
        name: { en: "Don Mueang District Office (สำนักงานเขตดอนเมือง)", th: "สำนักงานเขตดอนเมือง" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Wat Don Mueang School (โรงเรียนวัดดอนเมือง)",
          th: "โรงเรียนวัดดอนเมือง (แห่งที่ 1)",
        },
        phone: "092-396-3773",
        source: "https://www.thaipost.net/x-cite-news/1076601/",
      },
      {
        name: { en: "Phahonyothin School (โรงเรียนพหลโยธิน)", th: "โรงเรียนพหลโยธิน (แห่งที่ 2)" },
        phone: "085-028-8828",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
    ],
    parking: [
      {
        name: {
          en: "Don Mueang Airport free parking (Warehouse Building 4)",
          th: "ที่จอดรถฟรีสนามบินดอนเมือง (อาคารคลังสินค้า 4)",
        },
        detail: {
          en: "200 cars at Cargo Building 4.",
          th: "รองรับรถยนต์ 200 คัน ที่อาคารคลังสินค้า 4",
        },
        source: "https://www.thansettakij.com/business/tourism/669932",
      },
    ],
  },
  {
    id: "ratchathewi",
    name: { en: "Ratchathewi", th: "ราชเทวี" },
    aliases: ["Rajathevi", "Ratchatewi"],
    officePhone: "02-354-4201",
    sandbags: [
      {
        name: { en: "Ratchathewi District Office (สำนักงานเขตราชเทวี)", th: "สำนักงานเขตราชเทวี" },
        detail: {
          en: "The district office and volunteer soldiers are filling sandbags for residents. If you cannot collect them, get together with neighbours and ask the district office to deliver by truck.",
          th: "สำนักงานเขตราชเทวีและทหารจิตอาสาบรรจุกระสอบทรายแจกประชาชน หากไม่สะดวกมารับ รวมกลุ่มกับเพื่อนบ้านแล้วแจ้งให้สำนักงานเขตนำรถไปส่งได้",
        },
        source: "https://www.realnewsthailand.net/article/73452/",
      },
    ],
    shelters: [
      {
        name: { en: "Sri Ayutthaya School (โรงเรียนศรีอยุธยา)", th: "โรงเรียนศรีอยุธยา" },
        detail: {
          en: "One of five temporary shelters Ratchathewi District Office has prepared, mainly for people living by the canals.",
          th: "หนึ่งในศูนย์พักพิงชั่วคราว 5 แห่งที่สำนักงานเขตราชเทวีเตรียมไว้ โดยเฉพาะสำหรับประชาชนริมคลอง",
        },
        source: "https://www.realnewsthailand.net/article/73452/",
      },
      {
        name: { en: "Santirat School (โรงเรียนสันติราษฎร์)", th: "โรงเรียนสันติราษฎร์" },
        detail: {
          en: "One of five temporary shelters Ratchathewi District Office has prepared, mainly for people living by the canals.",
          th: "หนึ่งในศูนย์พักพิงชั่วคราว 5 แห่งที่สำนักงานเขตราชเทวีเตรียมไว้ โดยเฉพาะสำหรับประชาชนริมคลอง",
        },
        source: "https://www.realnewsthailand.net/article/73452/",
      },
      {
        name: { en: "Kingphet School (โรงเรียนกิ่งเพชร)", th: "โรงเรียนกิ่งเพชร" },
        detail: {
          en: "One of five temporary shelters Ratchathewi District Office has prepared, mainly for people living by the canals.",
          th: "หนึ่งในศูนย์พักพิงชั่วคราว 5 แห่งที่สำนักงานเขตราชเทวีเตรียมไว้ โดยเฉพาะสำหรับประชาชนริมคลอง",
        },
        source: "https://www.realnewsthailand.net/article/73452/",
      },
      {
        name: {
          en: "Wat Thatsanarun Suntharikaram School (โรงเรียนวัดทัศนารุณสุนทรีการาม)",
          th: "โรงเรียนวัดทัศนารุณสุนทรีการาม",
        },
        detail: {
          en: "One of five temporary shelters Ratchathewi District Office has prepared, mainly for people living by the canals.",
          th: "หนึ่งในศูนย์พักพิงชั่วคราว 5 แห่งที่สำนักงานเขตราชเทวีเตรียมไว้ โดยเฉพาะสำหรับประชาชนริมคลอง",
        },
        source: "https://www.realnewsthailand.net/article/73452/",
      },
    ],
    parking: [],
  },
  {
    id: "lat-phrao",
    name: { en: "Lat Phrao", th: "ลาดพร้าว" },
    aliases: ["Ladprao", "Lad Prao"],
    officePhone: "02-530-6641",
    sandbags: [
      {
        name: { en: "Lat Phrao District Office (สำนักงานเขตลาดพร้าว)", th: "สำนักงานเขตลาดพร้าว" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Wat Lat Pla Khao school (โรงเรียนวัดลาดปลาเค้า)",
          th: "โรงเรียนวัดลาดปลาเค้า",
        },
        phone: "089-815-6188",
        source: "https://www.thaipost.net/x-cite-news/1076601/",
      },
      {
        name: { en: "Wat Lat Phrao school (โรงเรียนวัดลาดพร้าว)", th: "โรงเรียนวัดลาดพร้าว" },
        phone: "094-491-3993",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Phetchanon School (โรงเรียนเพชรถนอม)", th: "โรงเรียนเพชรถนอม" },
        phone: "080-921-1177",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Thep Witthaya School (โรงเรียนเทพวิทยา)", th: "โรงเรียนเทพวิทยา" },
        phone: "086-324-1915",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Loi Sai Anusorn School (โรงเรียนลอยสายอนุสรณ์)", th: "โรงเรียนลอยสายอนุสรณ์" },
        phone: "095-623-9787",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Khlong Song Krathiam School (โรงเรียนคลองทรงกระเทียม)",
          th: "โรงเรียนคลองทรงกระเทียม",
        },
        phone: "086-549-0100",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Lat Phrao District Learning Promotion Centre (ศูนย์ส่งเสริมการเรียนรู้ระดับเขตลาดพร้าว)",
          th: "ศูนย์ส่งเสริมการเรียนรู้ระดับเขตลาดพร้าว",
        },
        phone: "093-165-4459",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Wat Lat Pla Khao (วัดลาดปลาเค้า)", th: "วัดลาดปลาเค้า" },
        phone: "081-694-8738",
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
    ],
    parking: [
      {
        name: { en: "Central EastVille (เซ็นทรัล อีสต์วิลล์)", th: "เซ็นทรัล อีสต์วิลล์" },
        detail: {
          en: "Free parking for people affected by the floods, one of the Central Pattana malls taking part. Ask the mall which floor to use and until when.",
          th: "จอดรถฟรีสำหรับผู้ได้รับผลกระทบจากน้ำท่วม เป็นหนึ่งในศูนย์การค้าเซ็นทรัลที่ร่วมโครงการ สอบถามชั้นจอดและระยะเวลาได้ที่ศูนย์การค้าโดยตรง",
        },
        source: "https://mgronline.com/onlinesection/detail/9690000093939",
      },
    ],
  },
  {
    id: "watthana",
    name: { en: "Watthana", th: "วัฒนา" },
    aliases: ["Wattana", "Vadhana"],
    officePhone: "02-391-4696",
    sandbags: [
      {
        name: { en: "Watthana District Office (สำนักงานเขตวัฒนา)", th: "สำนักงานเขตวัฒนา" },
        detail: {
          en: "Up to 20 bags per household. Call to ask, or request them through Traffy Fondue on LINE.",
          th: "ครัวเรือนละไม่เกิน 20 กระสอบ โทรติดต่อขอรับ หรือแจ้งผ่าน Traffy Fondue ใน LINE",
        },
        phone: "02-381-3107",
      },
    ],
    shelters: [
      {
        name: { en: "Surao Ban Don School (โรงเรียนสุเหร่าบ้านดอน)", th: "โรงเรียนสุเหร่าบ้านดอน" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Sawatdi Wittaya School (โรงเรียนสวัสดีวิทยา)", th: "โรงเรียนสวัสดีวิทยา" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Chaem Chan School (โรงเรียนแจ่มจันทร์)", th: "โรงเรียนแจ่มจันทร์" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Surao Sam In School (โรงเรียนสุเหร่าสามอิน)", th: "โรงเรียนสุเหร่าสามอิน" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: {
          en: "Wat That Thong School, Ruean Khiao Sa At building (โรงเรียนวัดธาตุทอง (เรือนเขียวสะอาด))",
          th: "โรงเรียนวัดธาตุทอง (เรือนเขียวสะอาด)",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: {
          en: "Surao Bang Makhuea School (โรงเรียนสุเหร่าบางมะเขือ)",
          th: "โรงเรียนสุเหร่าบางมะเขือ",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    parking: [],
  },
  {
    id: "bang-khae",
    name: { en: "Bang Khae", th: "บางแค" },
    aliases: ["Bangkae", "Bang Kae"],
    officePhone: "02-867-1631",
    sandbags: [
      {
        name: { en: "Bang Khae District Office (สำนักงานเขตบางแค)", th: "สำนักงานเขตบางแค" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Bang Khae Rueang Son Recreation Centre (ศูนย์นันทนาการบางแคเรืองสอน)",
          th: "ศูนย์นันทนาการบางแคเรืองสอน",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    parking: [
      {
        name: {
          en: "The Mall Lifestore Bang Khae (เดอะมอลล์ไลฟ์สโตร์ บางแค)",
          th: "เดอะมอลล์ไลฟ์สโตร์ บางแค",
        },
        detail: {
          en: "Free parking in Building B, floor 4M and the rooftop, 26 to 27 September. Bring a copy of your ID card and vehicle registration book to register, and show your ID card in person to collect the car.",
          th: "จอดรถฟรีที่อาคาร B ชั้น 4M และดาดฟ้า วันที่ 26 ถึง 27 กันยายน นำสำเนาบัตรประชาชนและสำเนาทะเบียนรถมาลงทะเบียน และแสดงบัตรประชาชนตัวจริงตอนรับรถคืน",
        },
        phone: "02-487-1000",
        source: "https://www.dailynews.co.th/news/6223346/",
      },
      {
        name: {
          en: "MRT Lak Song park and ride, 2 buildings (อาคารจอดแล้วจร สถานีหลักสอง)",
          th: "อาคารจอดแล้วจร สถานีหลักสอง (2 อาคาร)",
        },
        detail: {
          en: "Free for cars and motorcycles. Take your vehicle out by 2 October.",
          th: "จอดรถยนต์และรถจักรยานยนต์ฟรี นำรถออกภายในวันที่ 2 ตุลาคม",
        },
        source: "https://www.thansettakij.com/general-news/669877",
      },
    ],
  },
  {
    id: "lak-si",
    name: { en: "Lak Si", th: "หลักสี่" },
    aliases: ["Laksi"],
    officePhone: "02-982-2081",
    sandbags: [
      {
        name: { en: "Lak Si District Office (สำนักงานเขตหลักสี่)", th: "สำนักงานเขตหลักสี่" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Wat Lak Si school, Thongbai Tiwaree Wittaya (โรงเรียนวัดหลักสี่ ทองใบทิวารีวิทยา)",
          th: "โรงเรียนวัดหลักสี่ (ทองใบทิวารีวิทยา)",
        },
        phone: "096-999-4829",
        source: "https://www.thaipost.net/x-cite-news/1076601/",
      },
      {
        name: {
          en: "Bang Khen School, Wai Salee Anusorn (โรงเรียนบางเขน ไว้สาลีอนุสรณ์)",
          th: "โรงเรียนบางเขน (ไว้สาลีอนุสรณ์)",
        },
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Kanha Thatha Sai School (โรงเรียนการเคหะท่าทราย)",
          th: "โรงเรียนการเคหะท่าทราย",
        },
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Thung Song Hong School, Kuptasathian Uthit (โรงเรียนทุ่งสองห้อง คุปตัษเฐียรอุทิศ)",
          th: "โรงเรียนทุ่งสองห้อง (คุปตัษเฐียรอุทิศ)",
        },
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
    ],
    parking: [
      {
        name: { en: "IT Square (ไอที สแควร์)", th: "ไอที สแควร์" },
        detail: {
          en: "Floor T, about 100 cars, 25 to 28 September.",
          th: "ชั้น T รองรับประมาณ 100 คัน วันที่ 25 ถึง 28 กันยายน",
        },
        phone: "02-576-0333",
        source: "https://mgronline.com/onlinesection/detail/9690000093858",
      },
      {
        name: {
          en: "Chaeng Watthana Government Complex, Building D (ศูนย์ราชการฯ แจ้งวัฒนะ อาคาร D)",
          th: "ศูนย์ราชการเฉลิมพระเกียรติฯ แจ้งวัฒนะ อาคารจอดรถ D",
        },
        detail: {
          en: "Floors 3 and 4, about 300 cars, from 05.00 on 26 September to midnight on 28 September, for people in Lak Si and Don Mueang. Register at the information desk on floor 1 or with security.",
          th: "ชั้น 3 และ 4 รองรับประมาณ 300 คัน ตั้งแต่เวลา 05.00 น. วันที่ 26 กันยายน ถึงเที่ยงคืนวันที่ 28 กันยายน สำหรับประชาชนย่านหลักสี่และดอนเมือง ลงทะเบียนที่จุดประชาสัมพันธ์ชั้น 1 หรือแจ้งเจ้าหน้าที่รักษาความปลอดภัย",
        },
        source: "https://www.thaipost.net/news-update/1076764/",
      },
    ],
  },
  {
    id: "sai-mai",
    name: { en: "Sai Mai", th: "สายไหม" },
    aliases: ["Saimai"],
    officePhone: "02-158-7349",
    sandbags: [
      {
        name: { en: "Sai Mai District Office (สำนักงานเขตสายไหม)", th: "สำนักงานเขตสายไหม" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Prachanukul School, Sai Mai Soi 6 (โรงเรียนประชานุกูล ซอยสายไหม 6)",
          th: "โรงเรียนประชานุกูล (ซอยสายไหม 6)",
        },
        phone: "086-937-9294",
        source: "https://www.thaipost.net/x-cite-news/1076601/",
      },
    ],
    parking: [
      {
        name: { en: "AC Market, Sai Mai (ตลาด เอ.ซี. สายไหม)", th: "ตลาด เอ.ซี. สายไหม" },
        detail: { en: "About 50 cars.", th: "รองรับประมาณ 50 คัน" },
        source: "https://today.line.me/th/v3/article/vXLeMG3",
      },
    ],
  },
  {
    id: "khan-na-yao",
    name: { en: "Khan Na Yao", th: "คันนายาว" },
    aliases: ["Kannayao", "Khannayao"],
    officePhone: "02-379-9961",
    sandbags: [
      {
        name: {
          en: "Khan Na Yao District Office (สำนักงานเขตคันนายาว)",
          th: "สำนักงานเขตคันนายาว",
        },
        detail: {
          en: "Bring your ID card to register. Up to 20 bags per household.",
          th: "นำบัตรประจำตัวประชาชนมาลงทะเบียน ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "saphan-sung",
    name: { en: "Saphan Sung", th: "สะพานสูง" },
    aliases: ["Saphansung", "Sapan Sung"],
    officePhone: "02-372-2918",
    sandbags: [
      {
        name: {
          en: "Saphan Sung District Office (สำนักงานเขตสะพานสูง)",
          th: "สำนักงานเขตสะพานสูง",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [
      {
        name: {
          en: "MRT Khlong Ban Ma park and ride (อาคารจอดแล้วจร สถานีคลองบ้านม้า)",
          th: "อาคารจอดแล้วจร สถานีคลองบ้านม้า",
        },
        detail: {
          en: "Free for cars and motorcycles. Take your vehicle out by 2 October.",
          th: "จอดรถยนต์และรถจักรยานยนต์ฟรี นำรถออกภายในวันที่ 2 ตุลาคม",
        },
        source: "https://www.thansettakij.com/general-news/669877",
      },
    ],
  },
  {
    id: "wang-thonglang",
    name: { en: "Wang Thonglang", th: "วังทองหลาง" },
    aliases: ["Wang Thong Lang"],
    officePhone: "02-530-1740",
    sandbags: [
      {
        name: {
          en: "Wang Thonglang District Office (สำนักงานเขตวังทองหลาง)",
          th: "สำนักงานเขตวังทองหลาง",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "khlong-sam-wa",
    name: { en: "Khlong Sam Wa", th: "คลองสามวา" },
    aliases: ["Klong Sam Wa"],
    officePhone: "02-548-0326",
    sandbags: [
      {
        name: {
          en: "Khlong Sam Wa District Office (สำนักงานเขตคลองสามวา)",
          th: "สำนักงานเขตคลองสามวา",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "bang-na",
    name: { en: "Bang Na", th: "บางนา" },
    aliases: ["Bangna"],
    officePhone: "02-397-3705",
    sandbags: [
      {
        name: { en: "Bang Na District Office (สำนักงานเขตบางนา)", th: "สำนักงานเขตบางนา" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Phongploy Anusorn School (โรงเรียนผ่องพลอยอนุสรณ์)",
          th: "โรงเรียนผ่องพลอยอนุสรณ์",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: {
          en: "Amnuai Kanoksiri Anusorn School (โรงเรียนอำนวยกนกศิริอนุสรณ์)",
          th: "โรงเรียนอำนวยกนกศิริอนุสรณ์",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: { en: "Wat Bang Na Nok School (โรงเรียนวัดบางนานอก)", th: "โรงเรียนวัดบางนานอก" },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: {
          en: "Phianphin Anusorn School (โรงเรียนพี้ยนพินอนุสรณ์)",
          th: "โรงเรียนพี้ยนพินอนุสรณ์",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: {
          en: "Sri Iam Anusorn School (โรงเรียนศรีเอี่ยมอนุสรณ์)",
          th: "โรงเรียนศรีเอี่ยมอนุสรณ์",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: {
          en: "Wat Bang Na Nai (Ruen Sayamanon) School (โรงเรียนวัดบางนาใน (รื่น ศยามานนท์))",
          th: "โรงเรียนวัดบางนาใน (รื่น ศยามานนท์)",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: {
          en: "Rung Rueang Upatham School (โรงเรียนรุ่งเรืองอุปถัมภ์)",
          th: "โรงเรียนรุ่งเรืองอุปถัมภ์",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
      {
        name: {
          en: "Phongploy Anusorn (Likhit 2) Pre School Childcare Centre (ศูนย์พัฒนาเด็กก่อนวัยเรียน ผ่องพลอยอนุสรณ์ (ลิขิต 2))",
          th: "ศูนย์พัฒนาเด็กก่อนวัยเรียน ผ่องพลอยอนุสรณ์ (ลิขิต 2)",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    parking: [
      {
        name: { en: "Central Bangna (เซ็นทรัล บางนา)", th: "เซ็นทรัล บางนา" },
        detail: {
          en: "Free parking for people affected by the floods, one of the Central Pattana malls taking part. Ask the mall which floor to use and until when.",
          th: "จอดรถฟรีสำหรับผู้ได้รับผลกระทบจากน้ำท่วม เป็นหนึ่งในศูนย์การค้าเซ็นทรัลที่ร่วมโครงการ สอบถามชั้นจอดและระยะเวลาได้ที่ศูนย์การค้าโดยตรง",
        },
        source: "https://mgronline.com/onlinesection/detail/9690000093939",
      },
    ],
  },
  {
    id: "thawi-watthana",
    name: { en: "Thawi Watthana", th: "ทวีวัฒนา" },
    aliases: ["Taweewattana", "Thawee Watthana"],
    officePhone: "02-441-4973",
    sandbags: [
      {
        name: {
          en: "Thawi Watthana District Office (สำนักงานเขตทวีวัฒนา)",
          th: "สำนักงานเขตทวีวัฒนา",
        },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [
      {
        name: {
          en: "Matthayom Puranawat School (โรงเรียนมัธยมปุรณาวาส)",
          th: "โรงเรียนมัธยมปุรณาวาส",
        },
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Tang Phiroonlatham School (โรงเรียนตั้งพิรุฬห์ธรรม)",
          th: "โรงเรียนตั้งพิรุฬห์ธรรม",
        },
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Khlong Thawi Watthana School (Thong Nuam Anusorn) (โรงเรียนคลองทวีวัฒนา (ทองน่วมอนุสรณ์))",
          th: "โรงเรียนคลองทวีวัฒนา (ทองน่วมอนุสรณ์)",
        },
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Khlong Bang Phrom School (โรงเรียนคลองบางพรหม)", th: "โรงเรียนคลองบางพรหม" },
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Khlong Ton Sai School (Suk Lom Uthit) (โรงเรียนคลองต้นไทร (สุขล้อมอุทิศ))",
          th: "โรงเรียนคลองต้นไทร (สุขล้อมอุทิศ)",
        },
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: { en: "Wat Puranawat School (โรงเรียนวัดปุรณาวาส)", th: "โรงเรียนวัดปุรณาวาส" },
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
      {
        name: {
          en: "Khlong Maha Sawat School (โรงเรียนคลองมหาสวัสดิ์)",
          th: "โรงเรียนคลองมหาสวัสดิ์",
        },
        source:
          "https://www.pptvhd36.com/news/%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1/284169",
      },
    ],
    parking: [],
  },
  {
    id: "thung-khru",
    name: { en: "Thung Khru", th: "ทุ่งครุ" },
    aliases: ["Tung Kru"],
    officePhone: "02-464-4385",
    sandbags: [
      {
        name: { en: "Thung Khru District Office (สำนักงานเขตทุ่งครุ)", th: "สำนักงานเขตทุ่งครุ" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
  {
    id: "bang-bon",
    name: { en: "Bang Bon", th: "บางบอน" },
    aliases: ["Bangbon"],
    officePhone: "02-450-3201",
    sandbags: [
      {
        name: { en: "Bang Bon District Office (สำนักงานเขตบางบอน)", th: "สำนักงานเขตบางบอน" },
        detail: {
          en: "Free sandbags. Every district office is giving them out. Call before you go to check there are some left.",
          th: "แจกกระสอบทรายฟรี สำนักงานเขตทุกแห่งแจกกระสอบทราย โปรดโทรสอบถามก่อนเดินทางว่ายังมีเหลือหรือไม่",
        },
        source: "https://www.thansettakij.com/general-news/669908",
      },
    ],
    shelters: [],
    parking: [],
  },
];
