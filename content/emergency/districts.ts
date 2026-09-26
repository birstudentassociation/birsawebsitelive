import type { BangkokDistrict } from "@/content/emergency/types";

/**
 * Sandbag points, shelters and free parking published for each of Bangkok's
 * 50 districts during the floods of September 2026, read from BMA, district
 * office and Thai news reports. Every place carries the page it was read on.
 * The district finder on the flooding guide searches this list. Shelters and
 * parking change through the day, so the guide also links to BKK Care
 * Monitor, the BMA's live list.
 */
export const districtsCheckedAt = "2026-09-26T23:45:48+07:00";

export const bangkokDistricts: BangkokDistrict[] = [
  {
    id: "phra-nakhon",
    name: {
      en: "Phra Nakhon",
      th: "พระนคร",
    },
    officePhone: "02-628-9068",
    sandbags: [
      {
        name: {
          en: "Phra Nakhon District Office (สำนักงานเขตพระนคร)",
          th: "สำนักงานเขตพระนคร",
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
          en: "Wat Khlong Phum School (โรงเรียนวัดคลองภูมิ)",
          th: "โรงเรียนวัดคลองภูมิ",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/g6ka5gor8jLLrJ2y6",
      },
    ],
    parking: [],
  },
  {
    id: "dusit",
    name: {
      en: "Dusit",
      th: "ดุสิต",
    },
    officePhone: "02-243-5311",
    sandbags: [
      {
        name: {
          en: "Dusit District Office (สำนักงานเขตดุสิต)",
          th: "สำนักงานเขตดุสิต",
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
          en: "Wat Sawatwari Simaram (วัดสวัสดิ์วารีสีมาราม)",
          th: "วัดสวัสดิ์วารีสีมาราม",
        },
        detail: {
          en: "Room for 50 people. Prepared but not open yet. Call before you go.",
          th: "รองรับ 50 คน เตรียมไว้แต่ยังไม่เปิด โปรดโทรสอบถามก่อนเดินทาง",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Sukhantharam (วัดสุคันธาราม)",
          th: "วัดสุคันธาราม",
        },
        detail: {
          en: "Room for 50 people. Prepared but not open yet. Call before you go.",
          th: "รองรับ 50 คน เตรียมไว้แต่ยังไม่เปิด โปรดโทรสอบถามก่อนเดินทาง",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Suan Oi Recreation Centre (ศูนย์นันทนาการสวนอ้อย)",
          th: "ศูนย์นันทนาการสวนอ้อย",
        },
        detail: {
          en: "Room for 20 people. Prepared but not open yet. Call before you go.",
          th: "รองรับ 20 คน เตรียมไว้แต่ยังไม่เปิด โปรดโทรสอบถามก่อนเดินทาง",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Samananam Borihan School (โรงเรียนวัดสมณานัมบริหาร)",
          th: "โรงเรียนวัดสมณานัมบริหาร",
        },
        detail: {
          en: "Room for 50 people. Prepared but not open yet. Call before you go.",
          th: "รองรับ 50 คน เตรียมไว้แต่ยังไม่เปิด โปรดโทรสอบถามก่อนเดินทาง",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Sawatwari Simaram School (โรงเรียนวัดสวัสดิ์วารีสีมาราม)",
          th: "โรงเรียนวัดสวัสดิ์วารีสีมาราม",
        },
        detail: {
          en: "Room for 50 people. Prepared but not open yet. Call before you go.",
          th: "รองรับ 50 คน เตรียมไว้แต่ยังไม่เปิด โปรดโทรสอบถามก่อนเดินทาง",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Thewarat Kunchon School (โรงเรียนวัดเทวราชกุญชร)",
          th: "โรงเรียนวัดเทวราชกุญชร",
        },
        detail: {
          en: "Room for 50 people. Prepared but not open yet. Call before you go.",
          th: "รองรับ 50 คน เตรียมไว้แต่ยังไม่เปิด โปรดโทรสอบถามก่อนเดินทาง",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Benchamabophit School (โรงเรียนวัดเบญจมบพิตร)",
          th: "โรงเรียนวัดเบญจมบพิตร",
        },
        detail: {
          en: "Room for 50 people. Prepared but not open yet. Call before you go.",
          th: "รองรับ 50 คน เตรียมไว้แต่ยังไม่เปิด โปรดโทรสอบถามก่อนเดินทาง",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
    parking: [
      {
        name: {
          en: "BMA Government Centre, Kiak Kai (ศูนย์ราชการกรุงเทพมหานครเกียกกาย)",
          th: "ศูนย์ราชการกรุงเทพมหานครเกียกกาย",
        },
        detail: {
          en: "Room for 50 cars. Free.",
          th: "รองรับ 50 คัน ไม่มีค่าใช้จ่าย",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Supreme Complex, Samsen (ห้างสรรพสินค้าสุพรีม คอมเพล็กซ์)",
          th: "ห้างสรรพสินค้าสุพรีม คอมเพล็กซ์",
        },
        detail: {
          en: "Room for 70 cars. Free on floors 3B and 3C, 26 to 30 September, for people in Dusit. One car per person, and you cannot stay in the car. Register at the security office by the car park exit, 10.30 to 21.00. Only the person who left the car can collect it, with their ID card.",
          th: "รองรับ 70 คัน จอดฟรีที่ชั้น 3B และ 3C วันที่ 26 ถึง 30 กันยายน สำหรับผู้ได้รับผลกระทบในเขตดุสิต 1 ท่านฝากรถได้ 1 คัน ห้ามพักหรือนอนค้างในรถ ลงทะเบียนที่ห้อง รปภ. ใกล้ป้อมขาออกลานจอดรถ เวลา 10.30 ถึง 21.00 น. ผู้รับรถคืนต้องเป็นผู้ฝากและแสดงบัตรประชาชนตัวจริง",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
  },
  {
    id: "nong-chok",
    name: {
      en: "Nong Chok",
      th: "หนองจอก",
    },
    aliases: ["Nongjok"],
    officePhone: "02-543-1143",
    sandbags: [
      {
        name: {
          en: "Nong Chok District Office (สำนักงานเขตหนองจอก)",
          th: "สำนักงานเขตหนองจอก",
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
          en: "Khlong Song School (โรงเรียนคลองสอง)",
          th: "โรงเรียนคลองสอง",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/q7iC5c83vD9nsXW6A",
      },
      {
        name: {
          en: "Khari Upatham School (โรงเรียนคารีอุปถัมภ์)",
          th: "โรงเรียนคารีอุปถัมภ์",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/TXfCB7iZADkfkkBF9",
      },
      {
        name: {
          en: "Ninlarat Upatham School (โรงเรียนนีลราษฎร์อุปถัมภ์)",
          th: "โรงเรียนนีลราษฎร์อุปถัมภ์",
        },
        detail: {
          en: "Room for 40 people.",
          th: "รองรับ 40 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/jgYDq59rjiwviKd66",
      },
      {
        name: {
          en: "Ban Lam Ton Kluai School (โรงเรียนบ้านลำต้นกล้วย)",
          th: "โรงเรียนบ้านลำต้นกล้วย",
        },
        detail: {
          en: "Room for 20 people. At 23:45 on 26 September, 8 people were staying.",
          th: "รองรับ 20 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 8 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/ciFTJKRkFD7fETna6",
      },
      {
        name: {
          en: "Phonli Rungrueang School (โรงเรียนผลลีรุ่งเรือง)",
          th: "โรงเรียนผลลีรุ่งเรือง",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/EiMaZPsE8pG5p3Sb7",
      },
      {
        name: {
          en: "BMA Vocational Training School (Nong Chok) (โรงเรียนฝึกอาชีพกรุงเทพมหานคร (หนองจอก))",
          th: "โรงเรียนฝึกอาชีพกรุงเทพมหานคร (หนองจอก)",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/NrxRK5TZ6NKyz4ev5",
      },
      {
        name: {
          en: "Lam Buri Phuang School (โรงเรียนลำบุหรี่พวง)",
          th: "โรงเรียนลำบุหรี่พวง",
        },
        detail: {
          en: "Room for 30 people. At 23:45 on 26 September, 3 people were staying.",
          th: "รองรับ 30 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 3 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/dsD5XwNdEk66Wvwv6",
      },
      {
        name: {
          en: "Lam Chedi School (โรงเรียนลำเจดีย์)",
          th: "โรงเรียนลำเจดีย์",
        },
        detail: {
          en: "Room for 50 people. At 23:45 on 26 September, 30 people were staying.",
          th: "รองรับ 50 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/qae2bKepKAjX7BSe7",
      },
      {
        name: {
          en: "Wat Sap Mosorn School (โรงเรียนวัดทรัพย์โมสร)",
          th: "โรงเรียนวัดทรัพย์โมสร",
        },
        detail: {
          en: "Room for 60 people.",
          th: "รองรับ 60 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/7FLVy8SLuAA1AHTc6",
      },
      {
        name: {
          en: "Wat Phraya Pla School (primary) (โรงเรียนวัดพระยาปลา (ฝั่งประถมศึกษา))",
          th: "โรงเรียนวัดพระยาปลา (ฝั่งประถมศึกษา)",
        },
        detail: {
          en: "Room for 80 people.",
          th: "รองรับ 80 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/ozUtE4zfnF6sSJfm8",
      },
      {
        name: {
          en: "Wat Phraya Pla School (secondary) (โรงเรียนวัดพระยาปลา (ฝั่งมัธยมศึกษา))",
          th: "โรงเรียนวัดพระยาปลา (ฝั่งมัธยมศึกษา)",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/otZNDMvU88uB8ZwPA",
      },
      {
        name: {
          en: "Wat Rat Bamrung School (โรงเรียนวัดราษฎร์บำรุง)",
          th: "โรงเรียนวัดราษฎร์บำรุง",
        },
        detail: {
          en: "Room for 40 people.",
          th: "รองรับ 40 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/Z6s49csj2DjwefFSA",
      },
      {
        name: {
          en: "Wat Nong Chok School (Phakdi Norasret) (โรงเรียนวัดหนองจอก(ภักดีนรเศรษฐ))",
          th: "โรงเรียนวัดหนองจอก(ภักดีนรเศรษฐ)",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/eBpYKnPhwVJQwCnJ9",
      },
      {
        name: {
          en: "Sangkha Prachanusson School (โรงเรียนสังฆประชานุสสรณ์)",
          th: "โรงเรียนสังฆประชานุสสรณ์",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/XT4rgiZXfpNQ3H5a8?g_st=al",
      },
      {
        name: {
          en: "Surao Khlong Sip School (โรงเรียนสุเหร่าคลองสิบ)",
          th: "โรงเรียนสุเหร่าคลองสิบ",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Surao Khlong Sip Et School (โรงเรียนสุเหร่าคลองสิบเอ็ด)",
          th: "โรงเรียนสุเหร่าคลองสิบเอ็ด",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/si7Bas7vEUH8MqDz8",
      },
      {
        name: {
          en: "Surao Na Tap School (โรงเรียนสุเหร่านาตับ)",
          th: "โรงเรียนสุเหร่านาตับ",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/4DCorFhPRR7nfjjz8",
      },
      {
        name: {
          en: "Surao Lam Khaek School (โรงเรียนสุเหร่าลำแขก)",
          th: "โรงเรียนสุเหร่าลำแขก",
        },
        detail: {
          en: "Room for 40 people.",
          th: "รองรับ 40 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/jWYh8tzFpw9cEub59",
      },
      {
        name: {
          en: "Surao Sala Daeng School (โรงเรียนสุเหร่าศาลาแดง)",
          th: "โรงเรียนสุเหร่าศาลาแดง",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/4228AUHU28SfxWNb9",
      },
      {
        name: {
          en: "Surao Haji Mina School (โรงเรียนสุเหร่าหะยีมินา)",
          th: "โรงเรียนสุเหร่าหะยีมินา",
        },
        detail: {
          en: "Room for 60 people.",
          th: "รองรับ 60 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/jACSjv3fr2LePb4M8",
      },
      {
        name: {
          en: "Nong Chok Phitthayanuson School (โรงเรียนหนองจอกพิทยานุสรณ์)",
          th: "โรงเรียนหนองจอกพิทยานุสรณ์",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/RsJNMp56gKesoAY17",
      },
      {
        name: {
          en: "Luang Phaeng School (Bamrung Ratthakit) (โรงเรียนหลวงแพ่ง (บำรุงรัฐกิจ))",
          th: "โรงเรียนหลวงแพ่ง (บำรุงรัฐกิจ)",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/zc1Zw7ow2HLyJdqq5",
      },
      {
        name: {
          en: "Islam Lam Sai School (โรงเรียนอิสลามลำไทร)",
          th: "โรงเรียนอิสลามลำไทร",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/LWYeuWVKcyMC1jrV8",
      },
    ],
    parking: [
      {
        name: {
          en: "Kamon FBT Sports Park, Suwinthawong Road, Nong Chok (สวนกีฬากมล เอฟบีที  ถนนสุวินทวงศ์ เขตหนองจอก)",
          th: "สวนกีฬากมล เอฟบีที  ถนนสุวินทวงศ์ เขตหนองจอก",
        },
        detail: {
          en: "Room for 200 cars. At 23:45 on 26 September, 10 cars were parked.",
          th: "รองรับ 200 คัน เวลา 23.45 น. วันที่ 26 กันยายน มีรถจอด 10 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/3fDew1D36FaGnZc89",
      },
    ],
  },
  {
    id: "bang-rak",
    name: {
      en: "Bang Rak",
      th: "บางรัก",
    },
    officePhone: "02-236-1395",
    sandbags: [
      {
        name: {
          en: "Bang Rak District Office (สำนักงานเขตบางรัก)",
          th: "สำนักงานเขตบางรัก",
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
          en: "Wat Hua Lamphong School (โรงเรียนวัดหัวลำโพง)",
          th: "โรงเรียนวัดหัวลำโพง",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://share.google/SN3IeQUtAgTeMzEf6",
      },
      {
        name: {
          en: "Wat Kaeo Chaem Fa School (โรงเรียนวัดแก้วแจ่มฟ้า)",
          th: "โรงเรียนวัดแก้วแจ่มฟ้า",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://share.google/SU8mNHuRZCgSxXtcj",
      },
    ],
    parking: [
      {
        name: {
          en: "Jewelry Trade Center (อาคารจูเวลเลอรี่ เซ็นเตอร์)",
          th: "อาคารจูเวลเลอรี่ เซ็นเตอร์",
        },
        detail: {
          en: "Room for 100 cars. Costs 200 baht a day per car.",
          th: "รองรับ 100 คัน มีค่าใช้จ่าย 200 บาทต่อวันต่อคัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://share.google/Wl204hv47gmSyQ2lY",
      },
    ],
  },
  {
    id: "bang-khen",
    name: {
      en: "Bang Khen",
      th: "บางเขน",
    },
    officePhone: "02-521-0666",
    sandbags: [
      {
        name: {
          en: "Bang Khen District Office (สำนักงานเขตบางเขน)",
          th: "สำนักงานเขตบางเขน",
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
          en: "Prachaphiban School (โรงเรียนประชาภิบาล)",
          th: "โรงเรียนประชาภิบาล",
        },
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
        name: {
          en: "Central Ramindra (เซ็นทรัล รามอินทรา)",
          th: "เซ็นทรัล รามอินทรา",
        },
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
    name: {
      en: "Bang Kapi",
      th: "บางกะปิ",
    },
    officePhone: "02-377-5494",
    sandbags: [
      {
        name: {
          en: "Bang Kapi District Office (สำนักงานเขตบางกะปิ)",
          th: "สำนักงานเขตบางกะปิ",
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
          en: "The Mall Lifestore Bangkapi (เดอะมอลล์ไลฟ์สโตร์ บางกะปิ)",
          th: "เดอะมอลล์ไลฟ์สโตร์ บางกะปิ",
        },
        detail: {
          en: "Floors 1M and 2M, 26 to 27 September. Register with a copy of your ID card and vehicle registration book. Spaces go in order of registration, and only the person who left the car can collect it.",
          th: "ชั้น 1M และ 2M วันที่ 26 ถึง 27 กันยายน ลงทะเบียนด้วยสำเนาบัตรประชาชนและสำเนาทะเบียนรถ ให้บริการตามลำดับการลงทะเบียน และผู้รับรถคืนต้องเป็นผู้ฝากคนเดิม",
        },
        phone: "02-173-1000",
        source: "https://www.dailynews.co.th/news/6223346/",
      },
      {
        name: {
          en: "Bang Kapi Park (สวนบางกะปิ)",
          th: "สวนบางกะปิ",
        },
        detail: {
          en: "BMA park. Room for about 55 cars. That is 35 in the car park and 20 on the west side.",
          th: "สวนสาธารณะของ กทม. จอดได้ประมาณ 55 คัน แบ่งเป็นลานจอด 35 คัน และฝั่งตะวันตก 20 คัน",
        },
      },
    ],
  },
  {
    id: "pathum-wan",
    name: {
      en: "Pathum Wan",
      th: "ปทุมวัน",
    },
    aliases: ["Pathumwan"],
    officePhone: "02-214-3004",
    sandbags: [
      {
        name: {
          en: "Pathum Wan District Office (สำนักงานเขตปทุมวัน)",
          th: "สำนักงานเขตปทุมวัน",
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
          en: "P80Go car park (ลานจอดรถ P80Go)",
          th: "ลานจอดรถ P80Go",
        },
        detail: {
          en: "Room for 200 cars.",
          th: "รองรับ 200 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/FAZ6GpD1mW9wT6rP9",
      },
      {
        name: {
          en: "CentralWorld (เซ็นทรัลเวิลด์)",
          th: "เซ็นทรัลเวิลด์",
        },
        detail: {
          en: "Room for 220 cars. Park on floor 7 and a half.",
          th: "รองรับ 220 คัน จอดได้ที่ชั้น 7 ครึ่ง",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/6Zd2V2mzMKiJhjSV8?g_st=ic",
      },
    ],
  },
  {
    id: "pom-prap-sattru-phai",
    name: {
      en: "Pom Prap Sattru Phai",
      th: "ป้อมปราบศัตรูพ่าย",
    },
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
    name: {
      en: "Phra Khanong",
      th: "พระโขนง",
    },
    aliases: ["Prakanong"],
    officePhone: "02-333-0964",
    sandbags: [
      {
        name: {
          en: "Phra Khanong District Office (สำนักงานเขตพระโขนง)",
          th: "สำนักงานเขตพระโขนง",
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
          en: "Wat Thammamongkhon Thao Bun Nonthawihan (วัดธรรมมงคลเถาบุญนนทวิหาร)",
          th: "วัดธรรมมงคลเถาบุญนนทวิหาร",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Bun Rot Thammaram (วัดบุญรอดธรรมาราม)",
          th: "วัดบุญรอดธรรมาราม",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Wachirathammasathit Worawihan (วัดวชิรธรรมสาธิตวรวิหาร)",
          th: "วัดวชิรธรรมสาธิตวรวิหาร",
        },
        detail: {
          en: "Room for 50 people. At 23:45 on 26 September, 8 people were staying.",
          th: "รองรับ 50 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 8 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
    parking: [
      {
        name: {
          en: "Cloud 11 Bangkok (ศูนย์การค้า Cloud 11 Bangkok)",
          th: "ศูนย์การค้า Cloud 11 Bangkok",
        },
        detail: {
          en: "Room for 90 cars.",
          th: "รองรับ 90 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
  },
  {
    id: "min-buri",
    name: {
      en: "Min Buri",
      th: "มีนบุรี",
    },
    officePhone: "02-540-7160",
    sandbags: [
      {
        name: {
          en: "Min Buri District Office (สำนักงานเขตมีนบุรี)",
          th: "สำนักงานเขตมีนบุรี",
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
          en: "Community hall, Min Buri District Office (อาคารศาลาประชาคม สำนักงานเขตมีนบุรี)",
          th: "อาคารศาลาประชาคม สำนักงานเขตมีนบุรี",
        },
        detail: {
          en: "Room for 50 people. At 23:45 on 26 September, 25 people were staying.",
          th: "รองรับ 50 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 25 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/qqwV7uN5wtcpXmwX8",
      },
      {
        name: {
          en: "Wang Lek Witthayanuson School (โรงเรียนวังเล็กวิทยานุสรณ์)",
          th: "โรงเรียนวังเล็กวิทยานุสรณ์",
        },
        detail: {
          en: "Room for 100 people. At 23:45 on 26 September, 4 people were staying.",
          th: "รองรับ 100 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 4 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/STehFm7UqdtWCgov7",
      },
      {
        name: {
          en: "Sala Khu School (โรงเรียนศาลาคู้)",
          th: "โรงเรียนศาลาคู้",
        },
        detail: {
          en: "Room for 60 people.",
          th: "รองรับ 60 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/ommx5M5VvMYWR7ReA",
      },
      {
        name: {
          en: "Surao Sai Kong Din School (โรงเรียนสุเหร่าทรายกองดิน)",
          th: "โรงเรียนสุเหร่าทรายกองดิน",
        },
        detail: {
          en: "Room for 100 people. At 23:45 on 26 September, 21 people were staying.",
          th: "รองรับ 100 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 21 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/6uSbkzoc8Nyn6W2f6",
      },
      {
        name: {
          en: "Surao Bang Chan School (โรงเรียนสุเหร่าบางชัน)",
          th: "โรงเรียนสุเหร่าบางชัน",
        },
        detail: {
          en: "Room for 100 people. At 23:45 on 26 September, 50 people were staying.",
          th: "รองรับ 100 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/XiobPtqF3zAaWiEd8",
      },
    ],
    parking: [
      {
        name: {
          en: "Pink Line Min Buri station park and ride (PK30) (อาคารจอดแล้วจร รถไฟฟ้าสายสีชมพู สถานีมีนบุรี (PK30))",
          th: "อาคารจอดแล้วจร รถไฟฟ้าสายสีชมพู สถานีมีนบุรี (PK30)",
        },
        detail: {
          en: "Room for 3025 cars. At 23:45 on 26 September, 1875 cars were parked.",
          th: "รองรับ 3025 คัน เวลา 23.45 น. วันที่ 26 กันยายน มีรถจอด 1875 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
  },
  {
    id: "lat-krabang",
    name: {
      en: "Lat Krabang",
      th: "ลาดกระบัง",
    },
    officePhone: "02-326-9149",
    sandbags: [
      {
        name: {
          en: "Wat Sutthaphot (วัดสุทธาโภชน์)",
          th: "วัดสุทธาโภชน์",
        },
        detail: {
          en: "5 truckloads delivered on 26 September. Fill the bags yourself and bring your own vehicle. Bring your ID card, up to 20 bags per household.",
          th: "จัดส่ง 5 คันรถ เมื่อวันที่ 26 กันยายน บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
      {
        name: {
          en: "Wat Thipphawat (วัดทิพพาวาส)",
          th: "วัดทิพพาวาส",
        },
        detail: {
          en: "5 truckloads delivered on 26 September. Fill the bags yourself and bring your own vehicle. Bring your ID card, up to 20 bags per household.",
          th: "จัดส่ง 5 คันรถ เมื่อวันที่ 26 กันยายน บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
      {
        name: {
          en: "Wat Khum Thong (วัดขุมทอง)",
          th: "วัดขุมทอง",
        },
        detail: {
          en: "5 truckloads delivered on 26 September. Fill the bags yourself and bring your own vehicle. Bring your ID card, up to 20 bags per household.",
          th: "จัดส่ง 5 คันรถ เมื่อวันที่ 26 กันยายน บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
      {
        name: {
          en: "Wat Ratchakosa (วัดราชโกษา)",
          th: "วัดราชโกษา",
        },
        detail: {
          en: "5 truckloads delivered on 26 September. Fill the bags yourself and bring your own vehicle. Bring your ID card, up to 20 bags per household.",
          th: "จัดส่ง 5 คันรถ เมื่อวันที่ 26 กันยายน บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
      {
        name: {
          en: "Wat Sangkharacha (วัดสังฆราชา)",
          th: "วัดสังฆราชา",
        },
        detail: {
          en: "5 truckloads delivered on 26 September. Fill the bags yourself and bring your own vehicle. Bring your ID card, up to 20 bags per household.",
          th: "จัดส่ง 5 คันรถ เมื่อวันที่ 26 กันยายน บรรจุกระสอบเองและเตรียมยานพาหนะมาขนกลับเอง นำบัตรประจำตัวประชาชนไปติดต่อ ครัวเรือนละไม่เกิน 20 กระสอบ",
        },
      },
      {
        name: {
          en: "Surao Thap Yao (สุเหร่าทับยาว)",
          th: "สุเหร่าทับยาว",
        },
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
    shelters: [
      {
        name: {
          en: "Lat Krabang Recreation Centre (ศูนย์นันทนาการลาดกระบัง)",
          th: "ศูนย์นันทนาการลาดกระบัง",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Khum Thong School (โรงเรียนขุุมทอง)",
          th: "โรงเรียนขุุมทอง",
        },
        detail: {
          en: "Room for 20 people. At 23:45 on 26 September, 9 people were staying.",
          th: "รองรับ 20 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 9 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://share.google/41On0UmQrV4qs2ZRU",
      },
      {
        name: {
          en: "Tambon Khum Thong School (โรงเรียนตำบลขุมทอง)",
          th: "โรงเรียนตำบลขุมทอง",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Prasan Samakkhi School (โรงเรียนประสานสามัคคี)",
          th: "โรงเรียนประสานสามัคคี",
        },
        detail: {
          en: "Room for 40 people.",
          th: "รองรับ 40 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Bamrung Ruen School (โรงเรียนวัดบำรุงรื่น)",
          th: "โรงเรียนวัดบำรุงรื่น",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Pak Bueng School (โรงเรียนวัดปากบึง)",
          th: "โรงเรียนวัดปากบึง",
        },
        detail: {
          en: "Room for 60 people.",
          th: "รองรับ 60 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Lat Krabang School (โรงเรียนวัดลาดกระบัง)",
          th: "โรงเรียนวัดลาดกระบัง",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Lan Bun School (โรงเรียนวัดลานบุญ)",
          th: "โรงเรียนวัดลานบุญ",
        },
        detail: {
          en: "Room for 50 people. At 23:45 on 26 September, 30 people were staying.",
          th: "รองรับ 50 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Sangkharacha School (โรงเรียนวัดสังฆราชา)",
          th: "โรงเรียนวัดสังฆราชา",
        },
        detail: {
          en: "Room for 40 people. At 23:45 on 26 September, 38 people were staying.",
          th: "รองรับ 40 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 38 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        status: "nearlyFull",
      },
      {
        name: {
          en: "Wat Sutthaphot School (โรงเรียนวัดสุทธาโภชน์)",
          th: "โรงเรียนวัดสุทธาโภชน์",
        },
        detail: {
          en: "Room for 40 people. At 23:45 on 26 September, 4 people were staying.",
          th: "รองรับ 40 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 4 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Kheha Chumchon Lat Krabang School (โรงเรียนเคหะชุมชนลาดกระบัง)",
          th: "โรงเรียนเคหะชุมชนลาดกระบัง",
        },
        detail: {
          en: "Room for 200 people. At 23:45 on 26 September, 160 people were staying.",
          th: "รองรับ 200 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 160 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Daeng Pao School (โรงเรียนแดงเป้า)",
          th: "โรงเรียนแดงเป้า",
        },
        detail: {
          en: "Room for 50 people. At 23:45 on 26 September, 12 people were staying.",
          th: "รองรับ 50 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 12 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Saeng Hiran Witthaya School (โรงเรียนแสงหิรัญวิทยา)",
          th: "โรงเรียนแสงหิรัญวิทยา",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
    parking: [
      {
        name: {
          en: "Robinson Lifestyle Suvarnabhumi, car park floor 7 (โรบินสันไลฟ์สไตล์ สุวรรณภูมิ อาคารจอดรถ ชั้น 7)",
          th: "โรบินสันไลฟ์สไตล์ สุวรรณภูมิ อาคารจอดรถ ชั้น 7",
        },
        detail: {
          en: "Room for 170 cars. At 23:45 on 26 September, 170 cars were parked.",
          th: "รองรับ 170 คัน เวลา 23.45 น. วันที่ 26 กันยายน มีรถจอด 170 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/vA93RN6imRY5ZJWP7",
        status: "full",
      },
    ],
  },
  {
    id: "yan-nawa",
    name: {
      en: "Yan Nawa",
      th: "ยานนาวา",
    },
    aliases: ["Yannawa"],
    officePhone: "02-294-2393",
    sandbags: [
      {
        name: {
          en: "Yan Nawa District Office (สำนักงานเขตยานนาวา)",
          th: "สำนักงานเขตยานนาวา",
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
          en: "Wat Khlong Phum School (โรงเรียนวัดคลองภูมิ)",
          th: "โรงเรียนวัดคลองภูมิ",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/g6ka5gor8jLLrJ2y6?g_st=ac",
      },
    ],
    parking: [],
  },
  {
    id: "samphanthawong",
    name: {
      en: "Samphanthawong",
      th: "สัมพันธวงศ์",
    },
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
    shelters: [
      {
        name: {
          en: "Samphanthawong District Office (สำนักงานเขตสัมพันธวงศ์)",
          th: "สำนักงานเขตสัมพันธวงศ์",
        },
        detail: {
          en: "Room for 70 people.",
          th: "รองรับ 70 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/JSHyKz2iro5FmL8W8?g_st=ic",
      },
      {
        name: {
          en: "Wat Chakkrawat School (โรงเรียนวัดจักรวรรดิ)",
          th: "โรงเรียนวัดจักรวรรดิ",
        },
        detail: {
          en: "Room for 40 people.",
          th: "รองรับ 40 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/mrs2zd7eUGfAeJot8?g_st=ic",
      },
    ],
    parking: [
      {
        name: {
          en: "Phichaiyat Building (อาคารพิชัยญาติ)",
          th: "อาคารพิชัยญาติ",
        },
        detail: {
          en: "Room for 300 cars. Costs 300 baht a day per car.",
          th: "รองรับ 300 คัน คิดค่าบริการ 300 บาทต่อวันต่อคัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/rBSD3GxsfcKpTjfi6",
      },
    ],
  },
  {
    id: "phaya-thai",
    name: {
      en: "Phaya Thai",
      th: "พญาไท",
    },
    aliases: ["Phayathai"],
    officePhone: "02-279-4140",
    sandbags: [
      {
        name: {
          en: "Phaya Thai District Office (สำนักงานเขตพญาไท)",
          th: "สำนักงานเขตพญาไท",
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
          en: "Public Health Service Centre 51 (old) building, on the grounds of Wat Phai Tan (อาคารศูนย์บริการสาธารณสุข 51(เดิม)  ในบริเวณวัดไผ่ตัน)",
          th: "อาคารศูนย์บริการสาธารณสุข 51(เดิม)  ในบริเวณวัดไผ่ตัน",
        },
        detail: {
          en: "Room for 50 people. Open 08.00 to 18.00.",
          th: "รองรับ 50 คน เปิด 08.00 ถึง 18.00 น.",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
    parking: [],
  },
  {
    id: "thon-buri",
    name: {
      en: "Thon Buri",
      th: "ธนบุรี",
    },
    aliases: ["Thonburi"],
    officePhone: "02-465-0025",
    sandbags: [
      {
        name: {
          en: "Thon Buri District Office (สำนักงานเขตธนบุรี)",
          th: "สำนักงานเขตธนบุรี",
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
          en: "Kantatararam School (โรงเรียนกันตทาราราม)",
          th: "โรงเรียนกันตทาราราม",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        phone: "099-986-4500",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Krachap Phinit School (โรงเรียนวัดกระจับพินิจ)",
          th: "โรงเรียนวัดกระจับพินิจ",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        phone: "099-291-5594",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Kanlayanamit School (โรงเรียนวัดกัลยาณมิตร)",
          th: "โรงเรียนวัดกัลยาณมิตร",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        phone: "089-780-6433",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Khun Chan School (โรงเรียนวัดขุนจันทร์)",
          th: "โรงเรียนวัดขุนจันทร์",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        phone: "089-780-7242",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Bang Nam Chon School (โรงเรียนวัดบางน้ำชน)",
          th: "โรงเรียนวัดบางน้ำชน",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        phone: "081-744-2111",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Bukkhalo School (โรงเรียนวัดบุคคโล)",
          th: "โรงเรียนวัดบุคคโล",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        phone: "081-448-1965",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Yai Si Suphan School (โรงเรียนวัดใหญ่ศรีสุพรรณ)",
          th: "โรงเรียนวัดใหญ่ศรีสุพรรณ",
        },
        detail: {
          en: "Room for 10 people.",
          th: "รองรับ 10 คน",
        },
        phone: "088-096-6421",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Mai Yai Nui School (โรงเรียนวัดใหม่ยายนุ้ย)",
          th: "โรงเรียนวัดใหม่ยายนุ้ย",
        },
        detail: {
          en: "Room for 10 people.",
          th: "รองรับ 10 คน",
        },
        phone: "086-774-5521",
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
    parking: [],
  },
  {
    id: "bangkok-yai",
    name: {
      en: "Bangkok Yai",
      th: "บางกอกใหญ่",
    },
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
          en: "Wat Di Duat School (โรงเรียนวัดดีดวด)",
          th: "โรงเรียนวัดดีดวด",
        },
        detail: {
          en: "Room for 40 people.",
          th: "รองรับ 40 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/AAK9oFKoK3aXWG7T6?g_st=ic",
      },
      {
        name: {
          en: "Wat Tha Phra School (โรงเรียนวัดท่าพระ)",
          th: "โรงเรียนวัดท่าพระ",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/QfgRkEdmLnXMaYze7?g_st=ic",
      },
      {
        name: {
          en: "Wat Pradu Chimphli School (โรงเรียนวัดประดู่ฉิมพลี)",
          th: "โรงเรียนวัดประดู่ฉิมพลี",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/TkZ7VX2z2eMBVS8a9?g_st=ic",
      },
      {
        name: {
          en: "Wat Ratchasittharam School (โรงเรียนวัดราชสิทธาราม)",
          th: "โรงเรียนวัดราชสิทธาราม",
        },
        detail: {
          en: "Room for 80 people.",
          th: "รองรับ 80 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/m6iri1jNpHM3K1Y59?g_st=ic",
      },
      {
        name: {
          en: "Wat Mai Phiren School (โรงเรียนวัดใหม่พิเรนทร์)",
          th: "โรงเรียนวัดใหม่พิเรนทร์",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/vjb5VHhVZDzquQoaA?g_st=ic",
      },
    ],
    parking: [],
  },
  {
    id: "huai-khwang",
    name: {
      en: "Huai Khwang",
      th: "ห้วยขวาง",
    },
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
        name: {
          en: "Central Rama 9 (เซ็นทรัล พระราม 9)",
          th: "เซ็นทรัล พระราม 9",
        },
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
    name: {
      en: "Khlong San",
      th: "คลองสาน",
    },
    aliases: ["Klongsan"],
    officePhone: "02-437-2342",
    sandbags: [
      {
        name: {
          en: "Khlong San District Office (สำนักงานเขตคลองสาน)",
          th: "สำนักงานเขตคลองสาน",
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
          en: "Wat Suttharam Secondary School (โรงเรียนมัธยมวัดสุทธาราม)",
          th: "โรงเรียนมัธยมวัดสุทธาราม",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/THU6UjkuSK843fuaA?g_st=ac",
      },
      {
        name: {
          en: "Wat Thong Thammachat School (โรงเรียนวัดทองธรรมชาติ)",
          th: "โรงเรียนวัดทองธรรมชาติ",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/Mck4hhX59JTUj3a27?g_st=ac",
      },
      {
        name: {
          en: "Wat Thong Nopphakhun School (โรงเรียนวัดทองนพคุณ)",
          th: "โรงเรียนวัดทองนพคุณ",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/8GDhqan3HNmxio5o6?g_st=ac",
      },
      {
        name: {
          en: "Wat Thong Phleng School (โรงเรียนวัดทองเพลง)",
          th: "โรงเรียนวัดทองเพลง",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/TP3AwKk5fgBeDXP4A?g_st=ac",
      },
      {
        name: {
          en: "Wat Phichaiyat School (โรงเรียนวัดพิชัยญาติ)",
          th: "โรงเรียนวัดพิชัยญาติ",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/VmSL2ibA2WyXGT41A?g_st=ac",
      },
      {
        name: {
          en: "Wat Suttharam School (โรงเรียนวัดสุทธาราม)",
          th: "โรงเรียนวัดสุทธาราม",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/rg8VbkBh5VSzg55y7?g_st=ac",
      },
      {
        name: {
          en: "Wat Suwan School (โรงเรียนวัดสุวรรณ)",
          th: "โรงเรียนวัดสุวรรณ",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/vyGbvEjQCpvuzhFw9?g_st=ac",
      },
      {
        name: {
          en: "Wat Sawetchat School (โรงเรียนวัดเศวตฉัตร)",
          th: "โรงเรียนวัดเศวตฉัตร",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/VDLF36p77vs9eniw6?g_st=ac",
      },
    ],
    parking: [],
  },
  {
    id: "taling-chan",
    name: {
      en: "Taling Chan",
      th: "ตลิ่งชัน",
    },
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
    name: {
      en: "Bangkok Noi",
      th: "บางกอกน้อย",
    },
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
    shelters: [
      {
        name: {
          en: "Wat Dong Mun Lek School (โรงเรียนวัดดงมูลเหล็ก)",
          th: "โรงเรียนวัดดงมูลเหล็ก",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        phone: "02-411-3981",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/UjCcAbUePvdzGMoZ7",
      },
      {
        name: {
          en: "Wat Dusitaram School (โรงเรียนวัดดุสิตาราม)",
          th: "โรงเรียนวัดดุสิตาราม",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        phone: "02-424-0418",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/fc7zNCiTJbjNv1zc8",
      },
      {
        name: {
          en: "Wat Bang Khun Non School (โรงเรียนวัดบางขุนนนท์)",
          th: "โรงเรียนวัดบางขุนนนท์",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        phone: "02-424-5827",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/PG2qVn4tGCaPwnB98",
      },
      {
        name: {
          en: "Wat Bang Sao Thong School (โรงเรียนวัดบางเสาธง)",
          th: "โรงเรียนวัดบางเสาธง",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        phone: "02-411-2256",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/5X1wFufXFjNG1PRx9",
      },
      {
        name: {
          en: "Wat Pathombut Itsararam School (โรงเรียนวัดปฐมบุตรอิศราราม)",
          th: "โรงเรียนวัดปฐมบุตรอิศราราม",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        phone: "02-424-0415",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/phNZeL9hHE3dgBMR9",
      },
      {
        name: {
          en: "Wat Phraya Tham School (โรงเรียนวัดพระยาทำ)",
          th: "โรงเรียนวัดพระยาทำ",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        phone: "02-411-1251",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/uGeVZ32ov1Z2JDPX9",
      },
      {
        name: {
          en: "Wat Mali School (โรงเรียนวัดมะลิ)",
          th: "โรงเรียนวัดมะลิ",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        phone: "02-412-2481",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/sTj3Z1czH9ng2MJe7",
      },
      {
        name: {
          en: "Wat Yang Suttharam School (โรงเรียนวัดยางสุทธาราม)",
          th: "โรงเรียนวัดยางสุทธาราม",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        phone: "02-411-3176",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/G5KyYpqqRTqyCV8cA",
      },
      {
        name: {
          en: "Wat Wiset Kan School (โรงเรียนวัดวิเศษการ)",
          th: "โรงเรียนวัดวิเศษการ",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        phone: "02-412-3193",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/T589DZXzaBciMh5Y8",
      },
      {
        name: {
          en: "Wat Suwannaram School (โรงเรียนวัดสุวรรณาราม)",
          th: "โรงเรียนวัดสุวรรณาราม",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        phone: "02-424-4087",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Amphawa School (โรงเรียนวัดอัมพวา)",
          th: "โรงเรียนวัดอัมพวา",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        phone: "02-411-0548",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/ZsP2Pj47Q7fyVy9J7",
      },
      {
        name: {
          en: "Wat Chao Am School (โรงเรียนวัดเจ้าอาม)",
          th: "โรงเรียนวัดเจ้าอาม",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        phone: "02-424-1377",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/xDf9my4VF9xArpQH7",
      },
      {
        name: {
          en: "Wat Pho Riang School (โรงเรียนวัดโพธิ์เรียง)",
          th: "โรงเรียนวัดโพธิ์เรียง",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        phone: "02-412-3036",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/tRnkZguVB63ysmoC7",
      },
      {
        name: {
          en: "Wat Suwannakhiri School (โรงเรียนวัเสุวรรณคีรี)",
          th: "โรงเรียนวัเสุวรรณคีรี",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        phone: "02-424-0416",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/VpK4JpmMrPMEW24A7",
      },
      {
        name: {
          en: "Wat Si Sudaram School (โรงเรียนวีดศรีสุดาราม)",
          th: "โรงเรียนวีดศรีสุดาราม",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        phone: "02-424-0424",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/mCEC959RGxGQQpCFA",
      },
    ],
    parking: [
      {
        name: {
          en: "Bangkok Noi District Office (สำนักงานเขตบางกอกน้อย)",
          th: "สำนักงานเขตบางกอกน้อย",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/VPNwheueukEt6mst9",
      },
    ],
  },
  {
    id: "bang-khun-thian",
    name: {
      en: "Bang Khun Thian",
      th: "บางขุนเทียน",
    },
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
          en: "Bang Khun Thian Recreation Centre (Rama 2 Soi 69) (ศูนย์นันทนาการบางขุนเทียน (ถนนพระรามที่ 2 ซอย 69))",
          th: "ศูนย์นันทนาการบางขุนเทียน (ถนนพระรามที่ 2 ซอย 69)",
        },
        detail: {
          en: "Room for 300 people.",
          th: "รองรับ 300 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/XTXFj9WedQYrZHWd7",
      },
      {
        name: {
          en: "Khlong Phitthayalongkon School (โรงเรียนคลองพิทยาลงกรณ์)",
          th: "โรงเรียนคลองพิทยาลงกรณ์",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/o1Mf1w7cRfwJzY2j9",
      },
    ],
    parking: [
      {
        name: {
          en: "Big C Supercenter Rama 2, branch 2 (inbound side) (บิ๊กซี ซูเปอร์เซ็นเตอร์ พระราม 2 สาขา 2 (ขาเข้า))",
          th: "บิ๊กซี ซูเปอร์เซ็นเตอร์ พระราม 2 สาขา 2 (ขาเข้า)",
        },
        detail: {
          en: "Room for 50 cars. At 23:45 on 26 September, 25 cars were parked.",
          th: "รองรับ 50 คัน เวลา 23.45 น. วันที่ 26 กันยายน มีรถจอด 25 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/isrzNmXvh7Lkzmmt6",
      },
      {
        name: {
          en: "Central Rama 2 (เซ็นทรัล พระราม 2)",
          th: "เซ็นทรัล พระราม 2 (Central Rama 2)",
        },
        detail: {
          en: "Room for 1500 cars. At 23:45 on 26 September, 217 cars were parked.",
          th: "รองรับ 1500 คัน เวลา 23.45 น. วันที่ 26 กันยายน มีรถจอด 217 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/2UVi1qBMKPJz72o9A",
      },
    ],
  },
  {
    id: "phasi-charoen",
    name: {
      en: "Phasi Charoen",
      th: "ภาษีเจริญ",
    },
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
    name: {
      en: "Nong Khaem",
      th: "หนองแขม",
    },
    aliases: ["Nong Kham"],
    officePhone: "02-421-0393",
    sandbags: [
      {
        name: {
          en: "Nong Khaem District Office (สำนักงานเขตหนองแขม)",
          th: "สำนักงานเขตหนองแขม",
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
    id: "rat-burana",
    name: {
      en: "Rat Burana",
      th: "ราษฎร์บูรณะ",
    },
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
        name: {
          en: "Rattana China Uthit School (โรงเรียนรัตนจีนะอุทิศ)",
          th: "โรงเรียนรัตนจีนะอุทิศ",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/BM79ZsJkXavdF3qr8",
      },
      {
        name: {
          en: "Wat Bang Pakok School (โรงเรียนวัดบางปะกอก)",
          th: "โรงเรียนวัดบางปะกอก",
        },
        detail: {
          en: "Room for 40 people.",
          th: "รองรับ 40 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/2cg64tVEfKALEc4E8",
      },
      {
        name: {
          en: "Wat Prasoet Sutthawat School (โรงเรียนวัดประเสริฐสุทธาวาส)",
          th: "โรงเรียนวัดประเสริฐสุทธาวาส",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/jocJXZyQenCUBxhB8",
      },
      {
        name: {
          en: "Wat Son School (โรงเรียนวัดสน)",
          th: "โรงเรียนวัดสน",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/mLWuTF19LmUWtciD9",
      },
      {
        name: {
          en: "Wat Sarot School (โรงเรียนวัดสารอด)",
          th: "โรงเรียนวัดสารอด",
        },
        detail: {
          en: "Room for 40 people.",
          th: "รองรับ 40 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/HqLkMx9J73535Kqq9",
      },
      {
        name: {
          en: "Wat Chaeng Ron School (โรงเรียนวัดแจงร้อน)",
          th: "โรงเรียนวัดแจงร้อน",
        },
        detail: {
          en: "Room for 60 people.",
          th: "รองรับ 60 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/JwqkUGanTRMf64SVA",
      },
    ],
    parking: [],
  },
  {
    id: "bang-phlat",
    name: {
      en: "Bang Phlat",
      th: "บางพลัด",
    },
    aliases: ["Bang Plad"],
    officePhone: "02-424-3777",
    sandbags: [
      {
        name: {
          en: "Bang Phlat District Office (สำนักงานเขตบางพลัด)",
          th: "สำนักงานเขตบางพลัด",
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
    id: "din-daeng",
    name: {
      en: "Din Daeng",
      th: "ดินแดง",
    },
    officePhone: "02-245-2658",
    sandbags: [
      {
        name: {
          en: "Din Daeng District Office (สำนักงานเขตดินแดง)",
          th: "สำนักงานเขตดินแดง",
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
          en: "Wichuthit School (โรงเรียนวิชูทิศ)",
          th: "โรงเรียนวิชูทิศ",
        },
        detail: {
          en: "Room for 200 people.",
          th: "รองรับ 200 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/Ly1YWbV27Q3SkPYY8",
      },
    ],
    parking: [
      {
        name: {
          en: "Esplanade Ratchada (เอสพละนาด รัชดา)",
          th: "เอสพละนาด รัชดา",
        },
        detail: {
          en: "Park only on floors 3 and 4.",
          th: "จอดได้เฉพาะลานจอดรถชั้น 3 และชั้น 4",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/RV2YEeAsuWjFwNVX6",
      },
    ],
  },
  {
    id: "bueng-kum",
    name: {
      en: "Bueng Kum",
      th: "บึงกุ่ม",
    },
    aliases: ["Bung Kum", "Buengkum"],
    officePhone: "02-364-7349",
    sandbags: [
      {
        name: {
          en: "Bueng Kum District Office (สำนักงานเขตบึงกุ่ม)",
          th: "สำนักงานเขตบึงกุ่ม",
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
          en: "Bueng Kum District Office (สำนักงานเขตบึงกุ่ม)",
          th: "สำนักงานเขตบึงกุ่ม",
        },
        detail: {
          en: "Room for 50 people. At 23:45 on 26 September, 10 people were staying. Open 08.00 to 18.00.",
          th: "รองรับ 50 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 10 คน เปิด 08.00 ถึง 18.00 น.",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/place/%E0%B8%AA%E0%B8%B3%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%9A%E0%B8%B6%E0%B8%87%E0%B8%81%E0%B8%B8%E0%B9%88%E0%B8%A1/@13.7853412,100.6670472,17z/data=!4m10!1m2!2m1!1z4Liq4Liz4LiZ4Lix4LiB4LiH4Liy4LiZ4LmA4LiC4LiV4Lia4Li24LiH4LiB4Li44LmI4Lih!3m6!1s0x311d63d208caace7:0xe0eb5e5a36504d0c!8m2!3d13.7852767!4d100.6696489!15sCjbguKrguLPguJnguLHguIHguIfguLLguJnguYDguILguJXguJrguLbguIfguIHguLjguYjguKFaOiI44Liq4Liz4LiZ4Lix4LiB4LiH4Liy4LiZIOC5gOC4guC4lSDguJrguLbguIfguIHguLjguYjguKGSARpkaXN0cmljdF9nb3Zlcm5tZW50X29mZmljZZoBI0NoWkRTVWhOTUc5blMwVkpRMEZuU1VNekxXTnVZVWxuRUFF4AEA-gEFCI4BEDg!16s%2Fg%2F1hm66vbn1?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        name: {
          en: "Khlong Lam Chiak School (Wang Thong Bamrung) (โรงเรียนคลองลำเจียก (หวังทองบำรุง))",
          th: "โรงเรียนคลองลำเจียก (หวังทองบำรุง)",
        },
        detail: {
          en: "Room for 30 people. At 23:45 on 26 September, 11 people were staying. Open 08.00 to 18.00.",
          th: "รองรับ 30 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 11 คน เปิด 08.00 ถึง 18.00 น.",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/place/%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%84%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B8%A5%E0%B8%B3%E0%B9%80%E0%B8%88%E0%B8%B5%E0%B8%A2%E0%B8%81(%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%87%E0%B8%97%E0%B8%AD%E0%B8%87%E0%B8%9A%E0%B8%B3%E0%B8%A3%E0%B8%B8%E0%B8%87)/@13.8183053,100.6317623,17z/data=!3m1!4b1!4m6!3m5!1s0x311d6263b5d7a89b:0x4ef074fec9dc676f!8m2!3d13.8183001!4d100.6343372!16s%2Fg%2F1tg7zy61?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        name: {
          en: "Wat Bang Toei School (โรงเรียนวัดบางเตย)",
          th: "โรงเรียนวัดบางเตย",
        },
        detail: {
          en: "Open 08.00 to 18.00.",
          th: "เปิด 08.00 ถึง 18.00 น.",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/place/%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B9%80%E0%B8%95%E0%B8%A2/@13.8032215,100.6466499,17z/data=!4m14!1m7!3m6!1s0x311d6246bcce2755:0x787d39ef3f046e8e!2z4LmC4Lij4LiH4LmA4Lij4Li14Lii4LiZ4Lin4Lix4LiU4Lia4Liy4LiH4LmA4LiV4Lii!8m2!3d13.8032163!4d100.6492248!16s%2Fg%2F1tfjy9x3!3m5!1s0x311d6246bcce2755:0x787d39ef3f046e8e!8m2!3d13.8032163!4d100.6492248!16s%2Fg%2F1tfjy9x3?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        name: {
          en: "Yaemchat Witchanuson School (โรงเรียมแย้มจาดวิชชานุสรณ์)",
          th: "โรงเรียมแย้มจาดวิชชานุสรณ์",
        },
        detail: {
          en: "Open 08.00 to 18.00.",
          th: "เปิด 08.00 ถึง 18.00 น.",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/place/%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99+%E0%B9%81%E0%B8%A2%E0%B9%89%E0%B8%A1%E0%B8%88%E0%B8%B2%E0%B8%94%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%8A%E0%B8%B2%E0%B8%99%E0%B8%B8%E0%B8%AA%E0%B8%A3%E0%B8%93%E0%B9%8C/@13.8336434,100.650068,17z/data=!4m14!1m7!3m6!1s0x311d62f03fbf4f27:0x7c0e2bce5bf7dfac!2z4LmC4Lij4LiH4LmA4Lij4Li14Lii4LiZIOC5geC4ouC5ieC4oeC4iOC4suC4lOC4p-C4tOC4iuC4iuC4suC4meC4uOC4quC4o-C4k-C5jA!8m2!3d13.8336382!4d100.6526429!16s%2Fg%2F1vyn1b1x!3m5!1s0x311d62f03fbf4f27:0x7c0e2bce5bf7dfac!8m2!3d13.8336382!4d100.6526429!16s%2Fg%2F1vyn1b1x?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
      },
    ],
    parking: [],
  },
  {
    id: "sathon",
    name: {
      en: "Sathon",
      th: "สาทร",
    },
    aliases: ["Sathorn"],
    officePhone: "02-212-8112",
    sandbags: [
      {
        name: {
          en: "Sathon District Office (สำนักงานเขตสาทร)",
          th: "สำนักงานเขตสาทร",
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
    id: "bang-sue",
    name: {
      en: "Bang Sue",
      th: "บางซื่อ",
    },
    aliases: ["Bangsue"],
    officePhone: "02-586-9977",
    sandbags: [
      {
        name: {
          en: "Bang Sue District Office (สำนักงานเขตบางซื่อ)",
          th: "สำนักงานเขตบางซื่อ",
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
          en: "Hua Chak Rot Fai Tuek Daeng Community Early Childhood Centre (ศูนย์พัฒนาเด็กเล็กชุมชนหัวจักรรถไฟตึกแดง)",
          th: "ศูนย์พัฒนาเด็กเล็กชุมชนหัวจักรรถไฟตึกแดง",
        },
        detail: {
          en: "Room for 60 people. At 23:45 on 26 September, 55 people were staying.",
          th: "รองรับ 60 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 55 คน",
        },
        phone: "081-268-1104",
        source: "https://floodsupport.awarehouse.tech/",
        status: "nearlyFull",
      },
      {
        name: {
          en: "Wat Bang Pho Omawat School (โรงเรียนวัดบางโพโอมาวาส)",
          th: "โรงเรียนวัดบางโพโอมาวาส",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        phone: "089-832-8837",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Pradu Tham Prachathipat School (โรงเรียนวัดประดู่ธรรมประชาธิปัตย์)",
          th: "โรงเรียนวัดประดู่ธรรมประชาธิปัตย์",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
    parking: [
      {
        name: {
          en: "Kamphaeng Phet 6 Road, from the railway police box to the underpass ramp (ถนนกำแพงเพชร 6 จากตำรวจรถไฟถึงทางลงอุโมงค์)",
          th: "ถนนกำแพงเพชร 6 จากตำรวจรถไฟถึงทางลงอุโมงค์",
        },
        detail: {
          en: "Room for 200 cars.",
          th: "รองรับ 200 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Forest Industry Organization (องค์การอุตสาหกรรมป่าไม้)",
          th: "องค์การอุตสาหกรรมป่าไม้",
        },
        detail: {
          en: "Room for 300 cars.",
          th: "รองรับ 300 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/BbxJR6Ruiz6Y51hS8",
      },
    ],
  },
  {
    id: "chatuchak",
    name: {
      en: "Chatuchak",
      th: "จตุจักร",
    },
    aliases: ["Jatujak", "Jatuchak"],
    officePhone: "02-513-3444",
    sandbags: [
      {
        name: {
          en: "Chatuchak District Office (สำนักงานเขตจตุจักร)",
          th: "สำนักงานเขตจตุจักร",
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
          en: "Chandrakasem Rajabhat University (ราชภัฏจันทรเกษม)",
          th: "ราชภัฏจันทรเกษม",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        phone: "081-372-5898",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Thewasunthon (วัดเทวสุนทร)",
          th: "วัดเทวสุนทร",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        phone: "094-242-4571",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Chatuchak Centre (ศูนย์จตุจักร)",
          th: "ศูนย์จตุจักร",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        phone: "088-672-2529",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Ban Lat Phrao School (โรงเรียนบ้านลาดพร้าว)",
          th: "โรงเรียนบ้านลาดพร้าว",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        phone: "02-541-8512",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Prachaniwet School (โรงเรียนประชานิเวศน์)",
          th: "โรงเรียนประชานิเวศน์",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        phone: "085-030-2814",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Prachaniwet Secondary School (โรงเรียนมัธยมประชานิเวศน์)",
          th: "โรงเรียนมัธยมประชานิเวศน์",
        },
        detail: {
          en: "Room for 150 people. At 23:45 on 26 September, 4 people were staying.",
          th: "รองรับ 150 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 4 คน",
        },
        phone: "097-239-1627",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Rattanakosin Sompot Ratchathan Upatham School (โรงเรียนรัตนโกสินทร์สมโภช ราชทานอุปถัมภ์)",
          th: "โรงเรียนรัตนโกสินทร์สมโภช ราชทานอุปถัมภ์",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        phone: "098-054-4484",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Thewasunthon School (โรงเรียนวัดเทวสุนทร)",
          th: "โรงเรียนวัดเทวสุนทร",
        },
        detail: {
          en: "Room for 80 people.",
          th: "รองรับ 80 คน",
        },
        phone: "084-471-9056",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Samian Nari School (โรงเรียนวัดเสมียนนารี)",
          th: "โรงเรียนวัดเสมียนนารี",
        },
        detail: {
          en: "Room for 150 people.",
          th: "รองรับ 150 คน",
        },
        phone: "097-018-6879",
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Sena Nikhom School (โรงเรียนเสนานิคม)",
          th: "โรงเรียนเสนานิคม",
        },
        detail: {
          en: "Room for 150 people. At 23:45 on 26 September, 66 people were staying.",
          th: "รองรับ 150 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 66 คน",
        },
        phone: "092-271-6787",
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
    parking: [
      {
        name: {
          en: "Vibhavadi Rangsit Soi 34 (ซอยวิภาฯ 34)",
          th: "ซอยวิภาฯ 34",
        },
        detail: {
          en: "Free shuttle service, 08.00 to 22.00 every day, calling at Vibhavadi Rangsit Soi 34, Central Ladprao, Kasetsart University, Sripatum University, Phahonyothin 49/1, Wat Semmanari, Vibhavadi Rangsit Road and Chatuchak District Office.",
          th: "บริการรถรับส่งฟรี เวลา 08.00 ถึง 22.00 น. ทุกวัน แวะจอดที่ซอยวิภาวดีรังสิต 34 เซ็นทรัลลาดพร้าว มหาวิทยาลัยเกษตรศาสตร์ มหาวิทยาลัยศรีปทุม พหลโยธิน 49/1 วัดเสมียนนารี ถนนวิภาวดีรังสิต และสำนักงานเขตจตุจักร",
        },
        source: "https://floodsupport.awarehouse.tech/",
        status: "full",
      },
      {
        name: {
          en: "Vibhavadi Rangsit Soi 34 entrance (ปากซอยวิภาวดีฯ 34)",
          th: "ปากซอยวิภาวดีฯ 34",
        },
        detail: {
          en: "Free shuttle service calling at Vibhavadi Rangsit Soi 34, Central Ladprao, BTS Mo Chit/Chatuchak Park, the PTT Ministry of Energy, Wat Semmanari, the Kasetsart University turning point and Chatuchak District Office.",
          th: "บริการรถรับส่งฟรี แวะจอดที่ซอยวิภาวดีรังสิต 34 เซ็นทรัลลาดพร้าว บีทีเอสหมอชิต/สวนจตุจักร กระทรวงพลังงาน วัดเสมียนนารี จุดกลับรถมหาวิทยาลัยเกษตรศาสตร์ และสำนักงานเขตจตุจักร",
        },
        source: "https://floodsupport.awarehouse.tech/",
        status: "full",
      },
      {
        name: {
          en: "Mixt Chatuchak (ศูนย์กาาค้า มิกซ์ จตุจักร)",
          th: "ศูนย์กาาค้า มิกซ์ จตุจักร",
        },
        detail: {
          en: "Special flood rate of 50 baht a car on weekdays and 150 baht at weekends, with no overnight charge. Call ahead with the driver's name and number plate.",
          th: "อัตราพิเศษกรณีน้ำท่วม 50 บาทต่อคันวันจันทร์ถึงศุกร์ และ 150 บาทต่อคันวันเสาร์อาทิตย์ ไม่มีค่าจอดค้างคืน โปรดแจ้งชื่อผู้ใช้รถและทะเบียนรถล่วงหน้า",
        },
        phone: "090-994-7389",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/25ZSmAcx2oC2dty57?g_st=ic",
      },
      {
        name: {
          en: "Bang Sue Grand Station bus car park, behind the Central Juvenile and Family Court (สถานีกลางบางซื่อ  บริเวณลานจอดรถเมล์ ด้านหลังศาลเยาวชนและครอบครัวกลาง)",
          th: "สถานีกลางบางซื่อ  บริเวณลานจอดรถเมล์ ด้านหลังศาลเยาวชนและครอบครัวกลาง",
        },
        detail: {
          en: "Room for 80 cars.",
          th: "รองรับ 80 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/KcVsxpgsL3pPznp96",
      },
      {
        name: {
          en: "MRT Lat Phrao park and ride (Blue Line) (อาคารจอดรถ MRT สถานีลาดพร้าว (สายเฉลิมรัชมงคล))",
          th: "อาคารจอดรถ MRT สถานีลาดพร้าว (สายเฉลิมรัชมงคล)",
        },
        detail: {
          en: "Free until Friday 2 October. Show the car park staff a photo and proof that you own the car.",
          th: "จอดฟรีถึงวันศุกร์ที่ 2 ตุลาคม แสดงหลักฐานภาพถ่ายและหลักฐานการเป็นเจ้าของรถต่อเจ้าหน้าที่ประจำอาคารจอดรถ",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/7oJ3hABAPVkgZ8eTA?g_st=ic",
      },
      {
        name: {
          en: "Major Cineplex Ratchayothin (เมเจอร์ ซีนีเพล็กซ์ รัชโยธิน)",
          th: "เมเจอร์ ซีนีเพล็กซ์ รัชโยธิน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/iRXhMvUF6mS6VTUq7?g_st=ic",
      },
    ],
  },
  {
    id: "bang-kho-laem",
    name: {
      en: "Bang Kho Laem",
      th: "บางคอแหลม",
    },
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
    shelters: [
      {
        name: {
          en: "Wat Bang Khlo Nok School (โรงเรียนวัดบางโคล่นอก)",
          th: "โรงเรียนวัดบางโคล่นอก",
        },
        detail: {
          en: "Room for 30 people. Prepared but not open yet. Call before you go.",
          th: "รองรับ 30 คน เตรียมไว้แต่ยังไม่เปิด โปรดโทรสอบถามก่อนเดินทาง",
        },
        phone: "086-076-2814",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/BKMuTM76opiNQ9xT6",
      },
      {
        name: {
          en: "Wat Ratchasingkhon School (โรงเรียนวัดราชสิงขร)",
          th: "โรงเรียนวัดราชสิงขร",
        },
        detail: {
          en: "Room for 30 people. Prepared but not open yet. Call before you go.",
          th: "รองรับ 30 คน เตรียมไว้แต่ยังไม่เปิด โปรดโทรสอบถามก่อนเดินทาง",
        },
        phone: "087-559-5661",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/8MYDXsxmTYD5W7aQ8",
      },
      {
        name: {
          en: "Wat Lat Bua Khao School (โรงเรียนวัดลาดบัวขาว)",
          th: "โรงเรียนวัดลาดบัวขาว",
        },
        detail: {
          en: "Room for 20 people. Prepared but not open yet. Call before you go.",
          th: "รองรับ 20 คน เตรียมไว้แต่ยังไม่เปิด โปรดโทรสอบถามก่อนเดินทาง",
        },
        phone: "089-763-5469",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/L8Qb3jKSofWqtdEW7",
      },
      {
        name: {
          en: "Wat Phai Ngoen Chotanaram School (โรงเรียนวัดไผ่เงินโชตนาราม)",
          th: "โรงเรียนวัดไผ่เงินโชตนาราม",
        },
        detail: {
          en: "Room for 100 people. Prepared but not open yet. Call before you go.",
          th: "รองรับ 100 คน เตรียมไว้แต่ยังไม่เปิด โปรดโทรสอบถามก่อนเดินทาง",
        },
        phone: "096-136-5255",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/723UTJHmMcsdKXH88",
      },
    ],
    parking: [
      {
        name: {
          en: "Tree On 3 mall, floor 2B (ศูนย์การค้า TREE ON 3 ชั้น 2B)",
          th: "ศูนย์การค้า TREE ON 3 ชั้น 2B",
        },
        detail: {
          en: "Room for 40 cars.",
          th: "รองรับ 40 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/kxghrPogE9fKBpzPA",
      },
      {
        name: {
          en: "Terminal 21 Mall, floors 3 and 3B (ศูนย์การค้า เทอมินอล 21  ชั้น 3 และชั้น 3B)",
          th: "ศูนย์การค้า เทอมินอล 21  ชั้น 3 และชั้น 3B",
        },
        detail: {
          en: "Room for 200 cars.",
          th: "รองรับ 200 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/NChzuX38EfUki55i6",
      },
    ],
  },
  {
    id: "prawet",
    name: {
      en: "Prawet",
      th: "ประเวศ",
    },
    officePhone: "02-328-7149",
    sandbags: [
      {
        name: {
          en: "Prawet District Office (สำนักงานเขตประเวศ)",
          th: "สำนักงานเขตประเวศ",
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
          en: "Prawet District Office (สำนักงานเขตประเวศ)",
          th: "สำนักงานเขตประเวศ",
        },
        detail: {
          en: "Room for 500 people. At 23:45 on 26 September, 88 people were staying.",
          th: "รองรับ 500 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 88 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "BMA Vocational Training School (Prawet) (โรงเรียนฝึกอาชีพกรุงเทพมหานคร (ประเวศ))",
          th: "โรงเรียนฝึกอาชีพกรุงเทพมหานคร (ประเวศ)",
        },
        detail: {
          en: "Room for 50 people. At 23:45 on 26 September, 10 people were staying.",
          th: "รองรับ 50 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 10 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
    parking: [
      {
        name: {
          en: "New Phatthanakan Road, Soi 100 (พัฒนาการตัดใหม่ ซอย 100)",
          th: "พัฒนาการตัดใหม่ ซอย 100",
        },
        detail: {
          en: "Room for 100 cars. At 23:45 on 26 September, 10 cars were parked.",
          th: "รองรับ 100 คัน เวลา 23.45 น. วันที่ 26 กันยายน มีรถจอด 10 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
  },
  {
    id: "khlong-toei",
    name: {
      en: "Khlong Toei",
      th: "คลองเตย",
    },
    aliases: ["Klong Toey"],
    officePhone: "02-240-2121",
    sandbags: [
      {
        name: {
          en: "Khlong Toei District Office (สำนักงานเขตคลองเตย)",
          th: "สำนักงานเขตคลองเตย",
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
          en: "Chumchon Mu Ban Phatthana School (โรงเรียนชุมชนหมู่บ้านพัฒนา)",
          th: "โรงเรียนชุมชนหมู่บ้านพัฒนา",
        },
        detail: {
          en: "Room for 80 people.",
          th: "รองรับ 80 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/jAyqFyEuV7L5Zxmg8",
      },
      {
        name: {
          en: "Wat Khlong Toei School (โรงเรียนวัดคลองเตย)",
          th: "โรงเรียนวัดคลองเตย",
        },
        detail: {
          en: "Room for 40 people.",
          th: "รองรับ 40 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/jwrVMbihue7cBwyc9",
      },
      {
        name: {
          en: "Wat Saphan School (โรงเรียนวัดสะพาน)",
          th: "โรงเรียนวัดสะพาน",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/tVhTK4ccvJiKbV8E6",
      },
      {
        name: {
          en: "Sun Ruam Namchai School (โรงเรียนศูนย์รวมน้ำใจ)",
          th: "โรงเรียนศูนย์รวมน้ำใจ",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/qoCis2v48PdHkiNc9",
      },
    ],
    parking: [],
  },
  {
    id: "suan-luang",
    name: {
      en: "Suan Luang",
      th: "สวนหลวง",
    },
    officePhone: "02-322-6688",
    sandbags: [
      {
        name: {
          en: "Suan Luang District Office (สำนักงานเขตสวนหลวง)",
          th: "สำนักงานเขตสวนหลวง",
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
          en: "Thammanurak Community Early Childhood Centre (ศูนย์พัฒนาเด็กก่อนวัยเรียนชุมชนธรรมานุรักษ์)",
          th: "ศูนย์พัฒนาเด็กก่อนวัยเรียนชุมชนธรรมานุรักษ์",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Suan Luang meeting room, floor 6, Suan Luang District Office (ห้องประชุมสวนหลวง ชั้น 6 สำนักงานเขตสวนหลวง)",
          th: "ห้องประชุมสวนหลวง ชั้น 6 สำนักงานเขตสวนหลวง",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
    parking: [],
  },
  {
    id: "chom-thong",
    name: {
      en: "Chom Thong",
      th: "จอมทอง",
    },
    aliases: ["Jomtong"],
    officePhone: "02-427-1240",
    sandbags: [
      {
        name: {
          en: "Chom Thong District Office (สำนักงานเขตจอมทอง)",
          th: "สำนักงานเขตจอมทอง",
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
    id: "don-mueang",
    name: {
      en: "Don Mueang",
      th: "ดอนเมือง",
    },
    aliases: ["Don Muang", "Donmuang"],
    officePhone: "02-565-9424",
    sandbags: [
      {
        name: {
          en: "Don Mueang District Office (สำนักงานเขตดอนเมือง)",
          th: "สำนักงานเขตดอนเมือง",
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
          en: "Phahonyothin School (โรงเรียนพหลโยธิน)",
          th: "โรงเรียนพหลโยธิน",
        },
        detail: {
          en: "Room for 60 people. At 23:45 on 26 September, 30 people were staying.",
          th: "รองรับ 60 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Don Mueang School (โรงเรียนวัดดอนเมือง)",
          th: "โรงเรียนวัดดอนเมือง",
        },
        detail: {
          en: "Room for 50 people. At 23:45 on 26 September, 42 people were staying.",
          th: "รองรับ 50 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 42 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
    parking: [
      {
        name: {
          en: "Mitr Market Don Mueang (มิตรมาร์เก็ต ดอนเมือง)",
          th: "มิตรมาร์เก็ต ดอนเมือง",
        },
        detail: {
          en: "Room for 100 cars.",
          th: "รองรับ 100 คัน",
        },
        phone: "085-532-4497",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/ZxD2REDpz4fzVUvv7",
      },
      {
        name: {
          en: "Enco Terminal (เอนโก้ เทอร์มินอล)",
          th: "เอนโก้ เทอร์มินอล",
        },
        detail: {
          en: "Room for 50 cars.",
          th: "รองรับ 50 คัน",
        },
        phone: "02-982-9887",
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/4CC8KpL2w9XmQXnn8",
      },
    ],
  },
  {
    id: "ratchathewi",
    name: {
      en: "Ratchathewi",
      th: "ราชเทวี",
    },
    aliases: ["Rajathevi", "Ratchatewi"],
    officePhone: "02-354-4201",
    sandbags: [
      {
        name: {
          en: "Ratchathewi District Office (สำนักงานเขตราชเทวี)",
          th: "สำนักงานเขตราชเทวี",
        },
        detail: {
          en: "The district office and volunteer soldiers are filling sandbags for residents. If you cannot collect them, get together with neighbours and ask the district office to deliver by truck.",
          th: "สำนักงานเขตราชเทวีและทหารจิตอาสาบรรจุกระสอบทรายแจกประชาชน หากไม่สะดวกมารับ รวมกลุ่มกับเพื่อนบ้านแล้วแจ้งให้สำนักงานเขตนำรถไปส่งได้",
        },
        source: "https://www.realnewsthailand.net/article/73452/",
      },
    ],
    shelters: [
      {
        name: {
          en: "Sri Ayutthaya School (โรงเรียนศรีอยุธยา)",
          th: "โรงเรียนศรีอยุธยา",
        },
        detail: {
          en: "One of five temporary shelters Ratchathewi District Office has prepared, mainly for people living by the canals.",
          th: "หนึ่งในศูนย์พักพิงชั่วคราว 5 แห่งที่สำนักงานเขตราชเทวีเตรียมไว้ โดยเฉพาะสำหรับประชาชนริมคลอง",
        },
        source: "https://www.realnewsthailand.net/article/73452/",
      },
      {
        name: {
          en: "Santirat School (โรงเรียนสันติราษฎร์)",
          th: "โรงเรียนสันติราษฎร์",
        },
        detail: {
          en: "One of five temporary shelters Ratchathewi District Office has prepared, mainly for people living by the canals.",
          th: "หนึ่งในศูนย์พักพิงชั่วคราว 5 แห่งที่สำนักงานเขตราชเทวีเตรียมไว้ โดยเฉพาะสำหรับประชาชนริมคลอง",
        },
        source: "https://www.realnewsthailand.net/article/73452/",
      },
      {
        name: {
          en: "Kingphet School (โรงเรียนกิ่งเพชร)",
          th: "โรงเรียนกิ่งเพชร",
        },
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
    parking: [
      {
        name: {
          en: "Santiphap Park (สวนสันติภาพ)",
          th: "สวนสันติภาพ",
        },
        detail: {
          en: "BMA park. Room for about 20 cars.",
          th: "สวนสาธารณะของ กทม. จอดได้ประมาณ 20 คัน",
        },
      },
    ],
  },
  {
    id: "lat-phrao",
    name: {
      en: "Lat Phrao",
      th: "ลาดพร้าว",
    },
    aliases: ["Ladprao", "Lad Prao"],
    officePhone: "02-530-6641",
    sandbags: [
      {
        name: {
          en: "Lat Phrao District Office (สำนักงานเขตลาดพร้าว)",
          th: "สำนักงานเขตลาดพร้าว",
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
          en: "Wat Lat Pla Khao (วัดลาดปลาเค้า)",
          th: "วัดลาดปลาเค้า",
        },
        detail: {
          en: "Room for 300 people. At 23:45 on 26 September, 6 people were staying.",
          th: "รองรับ 300 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 6 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/qqTw6x5uT1e5mQHC8?g_st=ic",
      },
      {
        name: {
          en: "Lat Phrao District Learning Promotion Centre (ศูนย์ส่งเสริมการเรียนรู้ระดับเขตลาดพร้าว)",
          th: "ศูนย์ส่งเสริมการเรียนรู้ระดับเขตลาดพร้าว",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/ymnZgx6HL271GUmk8?g_st=ic",
      },
      {
        name: {
          en: "Khlong Song Krathiam School (โรงเรียนคลองทรงกระเทียม)",
          th: "โรงเรียนคลองทรงกระเทียม",
        },
        detail: {
          en: "Room for 60 people.",
          th: "รองรับ 60 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/dLXBqTQrZMLGU7Nh8?g_st=ic",
      },
      {
        name: {
          en: "Loi Sai Anuson School (โรงเรียนลอยสายอนุสรณ์)",
          th: "โรงเรียนลอยสายอนุสรณ์",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/Jywq7HkmQXnKJK138?g_st=ic",
      },
      {
        name: {
          en: "Wat Lat Pla Khao School (โรงเรียนวัดลาดปลาเค้า)",
          th: "โรงเรียนวัดลาดปลาเค้า",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/J9amCBHo4EGiZb7D9?g_st=ic",
      },
      {
        name: {
          en: "Wat Lat Phrao School (โรงเรียนวัดลาดพร้าว)",
          th: "โรงเรียนวัดลาดพร้าว",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/JT9g2f4AqSwahrZE6?g_st=ic",
      },
      {
        name: {
          en: "Thep Witthaya School (โรงเรียนเทพวิทยา)",
          th: "โรงเรียนเทพวิทยา",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/t86op6p4kxSo1abb8?g_st=ic",
      },
      {
        name: {
          en: "Phet Thanom School (โรงเรียนเพชรถนอม)",
          th: "โรงเรียนเพชรถนอม",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/nQ2WXTAcZrT6ixTeA?g_st=ic",
      },
    ],
    parking: [],
  },
  {
    id: "watthana",
    name: {
      en: "Watthana",
      th: "วัฒนา",
    },
    aliases: ["Wattana", "Vadhana"],
    officePhone: "02-391-4696",
    sandbags: [
      {
        name: {
          en: "Watthana District Office (สำนักงานเขตวัฒนา)",
          th: "สำนักงานเขตวัฒนา",
        },
        detail: {
          en: "Up to 20 bags per household. Call to ask, or request them through Traffy Fondue on LINE.",
          th: "ครัวเรือนละไม่เกิน 20 กระสอบ โทรติดต่อขอรับ หรือแจ้งผ่าน Traffy Fondue ใน LINE",
        },
        phone: "02-381-3107",
      },
    ],
    shelters: [
      {
        name: {
          en: "Wat That Thong School (Ruean Khiao Sa At) (โรงเรียนวัดธาตุทอง (เรือนเขียวสะอาด))",
          th: "โรงเรียนวัดธาตุทอง (เรือนเขียวสะอาด)",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/dir//%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%98%E0%B8%B2%E0%B8%95%E0%B8%B8%E0%B8%97%E0%B8%AD%E0%B8%87(%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B8%AA%E0%B8%B0%E0%B8%AD%E0%B8%B2%E0%B8%94)+1325+%E0%B8%96.+%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%B8%E0%B8%A1%E0%B8%A7%E0%B8%B4%E0%B8%97+%E0%B9%81%E0%B8%82%E0%B8%A7%E0%B8%87%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B9%82%E0%B8%82%E0%B8%99%E0%B8%87%E0%B9%80%E0%B8%AB%E0%B8%99%E0%B8%B7%E0%B8%AD+%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%A7%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2+%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3+10110/@13.7986048,100.6174208,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x30e29f66e118c887:0x7d668b0b96816377!2m2!1d100.5866626!2d13.7196058?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        name: {
          en: "Sawatdi Witthaya School (โรงเรียนสวัสดีวิทยา)",
          th: "โรงเรียนสวัสดีวิทยา",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/dir//%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%AA%E0%B8%A7%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B5%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2+35%2F10+%E0%B8%8B%E0%B8%AD%E0%B8%A2+%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%B8%E0%B8%A1%E0%B8%A7%E0%B8%B4%E0%B8%97+31+%E0%B9%81%E0%B8%82%E0%B8%A7%E0%B8%87%E0%B8%84%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%95%E0%B8%A2%E0%B9%80%E0%B8%AB%E0%B8%99%E0%B8%B7%E0%B8%AD+%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%A7%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2+%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3+10110/@13.7986048,100.6174208,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x30e29efb9c42273b:0xfc179f752a3d0dff!2m2!1d100.5662747!2d13.7399734?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        name: {
          en: "Surao Bang Makhuea School (โรงเรียนสุเหร่าบางมะเขือ)",
          th: "โรงเรียนสุเหร่าบางมะเขือ",
        },
        detail: {
          en: "Room for 10 people.",
          th: "รองรับ 10 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/dir//%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B9%80%E0%B8%AB%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%A1%E0%B8%B0%E0%B9%80%E0%B8%82%E0%B8%B7%E0%B8%AD+%E0%B8%8B%E0%B8%AD%E0%B8%A2+%E0%B8%9B%E0%B8%A3%E0%B8%B5%E0%B8%94%E0%B8%B5%E0%B8%9E%E0%B8%99%E0%B8%A1%E0%B8%A2%E0%B8%87%E0%B8%84%E0%B9%8C2+%E0%B9%81%E0%B8%A2%E0%B8%81+1+%E0%B8%96.+%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%B8%E0%B8%A1%E0%B8%A7%E0%B8%B4%E0%B8%97+71+%E0%B9%81%E0%B8%82%E0%B8%A7%E0%B8%87%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B9%82%E0%B8%82%E0%B8%99%E0%B8%87+%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%A7%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2+%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3+10110/@13.7986048,100.6174208,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x30e29fb8a71a8a1d:0x655a370f652d2b85!2m2!1d100.5967501!2d13.7153612?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
      },
      {
        name: {
          en: "Surao Ban Don School (โรงเรียนสุเหร่าบ้านดอน)",
          th: "โรงเรียนสุเหร่าบ้านดอน",
        },
        detail: {
          en: "Room for 50 people. At 23:45 on 26 September, 1 person was staying.",
          th: "รองรับ 50 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 1 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/dir//%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B9%80%E0%B8%AB%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%94%E0%B8%AD%E0%B8%99+84+%E0%B8%96.+%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%B8%E0%B8%A1%E0%B8%A7%E0%B8%B4%E0%B8%97+%E0%B9%81%E0%B8%82%E0%B8%A7%E0%B8%87%E0%B8%84%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%95%E0%B8%A2%E0%B9%80%E0%B8%AB%E0%B8%99%E0%B8%B7%E0%B8%AD+%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%A7%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2+%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3+10110/@13.7986048,100.6174208,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x30e2",
      },
      {
        name: {
          en: "Surao Sam In School (โรงเรียนสุเหร่าสามอิน)",
          th: "โรงเรียนสุเหร่าสามอิน",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/dir//%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B9%80%E0%B8%AB%E0%B8%A3%E0%B9%88%E0%B8%B2%E0%B8%AA%E0%B8%B2%E0%B8%A1%E0%B8%AD%E0%B8%B4%E0%B8%99+%E0%B8%8B%E0%B8%AD%E0%B8%A2+%E0%B8%AA%E0%B8%B8%E0%B8%82%E0%B8%B8%E0%B8%A1%E0%B8%A7%E0%B8%B4%E0%B8%97+%E0%B9%81%E0%B8%82%E0%B8%A7%E0%B8%87%E0%B8%84%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B8%95%E0%B8%B1%E0%B8%99%E0%B9%80%E0%B8%AB%E0%B8%99%E0%B8%B7%E0%B8%AD+%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%A7%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2+%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3+10110/@13.7986048,100.6174208,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x30e29fb5941fa4c5:0xccc259cf957db33!2m2!1d100.5962461!2d13.7277882?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D",
      },
      {
        name: {
          en: "Chaem Chan School (โรงเรียนแจ่มจันทร์)",
          th: "โรงเรียนแจ่มจันทร์",
        },
        detail: {
          en: "Room for 20 people. At 23:45 on 26 September, 1 person was staying.",
          th: "รองรับ 20 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 1 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/dir//%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B9%81%E0%B8%88%E0%B9%88%E0%B8%A1%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C+75+%E0%B8%8B.+%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%A1%E0%B8%B1%E0%B8%A2+21+%E0%B9%81%E0%B8%82%E0%B8%A7%E0%B8%87%E0%B8%84%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B8%95%E0%B8%B1%E0%B8%99%E0%B9%80%E0%B8%AB%E0%B8%99%E0%B8%B7%E0%B8%AD+%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%A7%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2+%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3+10110/@13.7986048,100.6174208,12z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x30e29e4e6c24f993:0x5abdc4b2a44257a5!2m2!1d100.587692!2d13.7391174?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D",
      },
    ],
    parking: [
      {
        name: {
          en: "Century Movie Plaza, Sukhumvit (ศูนย์การค้า เซ็นจูรี่ มูฟวี่พลาซ่า สุขุมวิท)",
          th: "ศูนย์การค้า เซ็นจูรี่ มูฟวี่พลาซ่า สุขุมวิท",
        },
        detail: {
          en: "Room for 200 cars.",
          th: "รองรับ 200 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/syuP6C61Z74gxAuNA?g_st=ic",
      },
      {
        name: {
          en: "EmQuartier (เอ็มควอเทียร์)",
          th: "เอ็มควอเทียร์",
        },
        detail: {
          en: "Room for 480 cars.",
          th: "รองรับ 480 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/TYxbNCbLAoksa1837?g_st=ic",
      },
      {
        name: {
          en: "Surao Ban Don School (โรงเรียนสุเหร่าบ้านดอน)",
          th: "โรงเรียนสุเหร่าบ้านดอน",
        },
        detail: {
          en: "Room for 30 cars.",
          th: "รองรับ 30 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
  },
  {
    id: "bang-khae",
    name: {
      en: "Bang Khae",
      th: "บางแค",
    },
    aliases: ["Bangkae", "Bang Kae"],
    officePhone: "02-867-1631",
    sandbags: [
      {
        name: {
          en: "Bang Khae District Office (สำนักงานเขตบางแค)",
          th: "สำนักงานเขตบางแค",
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
          en: "Bang Khae Rueang Son Recreation Centre (ศูนย์นันทนาการบางแคเรืองสอน)",
          th: "ศูนย์นันทนาการบางแคเรืองสอน",
        },
        detail: {
          en: "Room for 80 people.",
          th: "รองรับ 80 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/place/%E0%B8%A8%E0%B8%B9%E0%B8%99%E0%B8%A2%E0%B9%8C%E0%B8%99%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%99%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%84(%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B8%AA%E0%B8%AD%E0%B8%99)/data=!4m2!3m1!1s0x0:0xf4887f097a0f76ea?sa=X&ved=1t:2428&ictx=111",
      },
    ],
    parking: [
      {
        name: {
          en: "Big C Phetkasem (บิ๊กซีเพชรเกษม)",
          th: "บิ๊กซีเพชรเกษม",
        },
        detail: {
          en: "Room for 50 cars.",
          th: "รองรับ 50 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/place/%E0%B8%9A%E0%B8%B4%E0%B9%8A%E0%B8%81%E0%B8%8B%E0%B8%B5+%E0%B9%80%E0%B8%9E%E0%B8%8A%E0%B8%A3%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%A1+%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%81%E0%B8%AA%E0%B8%AD%E0%B8%87/data=!4m2!3m1!1s0x0:0x6cddd2c03240e0a0?sa=X&ved=1t:2428&ictx=111",
      },
      {
        name: {
          en: "Victoria Gardens (วิคตอเรีย การ์เด้น)",
          th: "วิคตอเรีย การ์เด้น",
        },
        detail: {
          en: "Room for 50 cars.",
          th: "รองรับ 50 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/place/%E0%B8%A7%E0%B8%B4%E0%B8%84%E0%B8%95%E0%B8%AD%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2+%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%94%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B9%8C/data=!4m2!3m1!1s0x0:0xcdc71f9a3a34f6d0?sa=X&ved=1t:2428&ictx=111",
      },
      {
        name: {
          en: "MRT Lak Song park and ride (อาคารจอดแล้วจร สถานีหลักสอง)",
          th: "อาคารจอดแล้วจร สถานีหลักสอง",
        },
        detail: {
          en: "Room for 100 cars.",
          th: "รองรับ 100 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps?vet=10CAAQoqAOahcKEwiwuMWE1IuXAxUAAAAAHQAAAAAQKg..i&rlz=1C1YTUH_thTH1034TH1034&fvr=1&pvq=Cg0vZy8xMWgzbm5jZGdo&cs=0&um=1&ie=UTF-8&fb=1&gl=th&sa=X&ftid=0x30e297fcff149505:0x34d70d5b744325d",
      },
      {
        name: {
          en: "The Mall Lifestore Bang Khae (เดอะมอลล์บางแค)",
          th: "เดอะมอลล์บางแค",
        },
        detail: {
          en: "Room for 350 cars. At 23:45 on 26 September, 1 car was parked.",
          th: "รองรับ 350 คัน เวลา 23.45 น. วันที่ 26 กันยายน มีรถจอด 1 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/place/%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%B0%E0%B8%A1%E0%B8%AD%E0%B8%A5%E0%B8%A5%E0%B9%8C%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%82%E0%B8%95%E0%B8%A3%E0%B9%8C+%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%84/data=!4m2!3m1!1s0x0:0xd7393eb1d51cb378?sa=X&ved=1t:2428&ictx=111",
      },
      {
        name: {
          en: "Lotus's Bang Khae (โลตัสบางแค)",
          th: "โลตัสบางแค",
        },
        detail: {
          en: "Room for 20 cars.",
          th: "รองรับ 20 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://www.google.com/maps/place/%E0%B9%82%E0%B8%A5%E0%B8%95%E0%B8%B1%E0%B8%AA+%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%84/data=!4m2!3m1!1s0x0:0xeb3118cea881de5a?sa=X&ved=1t:2428&ictx=111",
      },
    ],
  },
  {
    id: "lak-si",
    name: {
      en: "Lak Si",
      th: "หลักสี่",
    },
    aliases: ["Laksi"],
    officePhone: "02-982-2081",
    sandbags: [
      {
        name: {
          en: "Lak Si District Office (สำนักงานเขตหลักสี่)",
          th: "สำนักงานเขตหลักสี่",
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
          en: "Kan Kheha Tha Sai School (โรงเรียนการเคหะท่าทราย)",
          th: "โรงเรียนการเคหะท่าทราย",
        },
        detail: {
          en: "Room for 200 people. At 23:45 on 26 September, 70 people were staying.",
          th: "รองรับ 200 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 70 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Thung Song Hong School (โรงเรียนทุ่งสองห้อง)",
          th: "โรงเรียนทุ่งสองห้อง",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Bang Khen School (Wai Sali Anuson) (โรงเรียนบางเขน (ไว้สาลีอนุสรณ์))",
          th: "โรงเรียนบางเขน (ไว้สาลีอนุสรณ์)",
        },
        detail: {
          en: "Room for 150 people. At 23:45 on 26 September, 130 people were staying.",
          th: "รองรับ 150 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 130 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Lak Si School (Thongbai Tiwari Witthaya) (โรงเรียนวัดหลักสี่ (ทองใบทิวารีวิทยา))",
          th: "โรงเรียนวัดหลักสี่ (ทองใบทิวารีวิทยา)",
        },
        detail: {
          en: "Room for 40 people.",
          th: "รองรับ 40 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Kheha Thung Song Hong Witthaya School 1 (โรงเรียนเคหะทุ่งสองห้องวิทยา 1)",
          th: "โรงเรียนเคหะทุ่งสองห้องวิทยา 1",
        },
        detail: {
          en: "Room for 100 people.",
          th: "รองรับ 100 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Kheha Thung Song Hong Witthaya School 2 (โรงเรียนเคหะทุ่งสองห้องวิทยา 2)",
          th: "โรงเรียนเคหะทุ่งสองห้องวิทยา 2",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
    parking: [],
  },
  {
    id: "sai-mai",
    name: {
      en: "Sai Mai",
      th: "สายไหม",
    },
    aliases: ["Saimai"],
    officePhone: "02-158-7349",
    sandbags: [
      {
        name: {
          en: "Sai Mai District Office (สำนักงานเขตสายไหม)",
          th: "สำนักงานเขตสายไหม",
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
          en: "Prachanukun School (BMA), Sai Mai Soi 6 (โรงเรียนประชานุกูล (กรุงเทพมหานคร) ซอยสายไหม 6)",
          th: "โรงเรียนประชานุกูล (กรุงเทพมหานคร) ซอยสายไหม 6",
        },
        detail: {
          en: "Room for 100 people. At 23:45 on 26 September, 50 people were staying.",
          th: "รองรับ 100 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/cV3CBGSpRnEy5TVL8",
      },
    ],
    parking: [],
  },
  {
    id: "khan-na-yao",
    name: {
      en: "Khan Na Yao",
      th: "คันนายาว",
    },
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
    shelters: [
      {
        name: {
          en: "Khan Na Yao School (Tharin Charoen Songkhro) (โรงเรียนคันนายาว(ธารินเจริญสงเคราะห์))",
          th: "โรงเรียนคันนายาว(ธารินเจริญสงเคราะห์)",
        },
        detail: {
          en: "Room for 80 people. At 23:45 on 26 September, 5 people were staying.",
          th: "รองรับ 80 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 5 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/Rq9QRAASxyA2kfXn7",
      },
      {
        name: {
          en: "Chinda Bamrung School (โรงเรียนจินดาบำรุง)",
          th: "โรงเรียนจินดาบำรุง",
        },
        detail: {
          en: "Room for 400 people. At 23:45 on 26 September, 154 people were staying.",
          th: "รองรับ 400 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 154 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/wPVxWdJ9mRoZ4SeF7",
      },
    ],
    parking: [],
  },
  {
    id: "saphan-sung",
    name: {
      en: "Saphan Sung",
      th: "สะพานสูง",
    },
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
    name: {
      en: "Wang Thonglang",
      th: "วังทองหลาง",
    },
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
    parking: [
      {
        name: {
          en: "Wang Thonglang Park (สวนวังทองหลาง)",
          th: "สวนวังทองหลาง",
        },
        detail: {
          en: "BMA park. Room for about 100 cars. Parking is arranged with the BMA.",
          th: "สวนสาธารณะของ กทม. จอดได้ประมาณ 100 คัน ประสานการจอดรถกับ กทม.",
        },
      },
    ],
  },
  {
    id: "khlong-sam-wa",
    name: {
      en: "Khlong Sam Wa",
      th: "คลองสามวา",
    },
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
    shelters: [
      {
        name: {
          en: "Rattana Pracharak Hospital (รพ.รัตนประชารักษ์)",
          th: "รพ.รัตนประชารักษ์",
        },
        detail: {
          en: "Room for 450 people. At 23:45 on 26 September, 3 people were staying.",
          th: "รองรับ 450 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 3 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/q6nxvLdC1R2f79RS7",
      },
      {
        name: {
          en: "Wat Phraya Suren (วัดพระยาสุเรนทร์)",
          th: "วัดพระยาสุเรนทร์",
        },
        detail: {
          en: "Room for 60 people. At 23:45 on 26 September, 60 people were staying.",
          th: "รองรับ 60 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 60 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/dHVuNhBCq1myQeyR9",
        status: "full",
      },
      {
        name: {
          en: "Klang Khlong Song School (โรงเรียนกลางคลองสอง)",
          th: "โรงเรียนกลางคลองสอง",
        },
        detail: {
          en: "Room for 30 people. At 23:45 on 26 September, 6 people were staying.",
          th: "รองรับ 30 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 6 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/ZmDA2wLRjmkuhLKa8",
      },
      {
        name: {
          en: "Bang Chan School (โรงเรียนบางชัน)",
          th: "โรงเรียนบางชัน",
        },
        detail: {
          en: "Room for 100 people. At 23:45 on 26 September, 100 people were staying.",
          th: "รองรับ 100 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 100 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/nBCZSBqzt99h7gz78",
        status: "full",
      },
      {
        name: {
          en: "Ban Nong Rahaeng School (โรงเรียนบ้านหนองระแหง)",
          th: "โรงเรียนบ้านหนองระแหง",
        },
        detail: {
          en: "Room for 20 people. At 23:45 on 26 September, 17 people were staying.",
          th: "รองรับ 20 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 17 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/NPNrxXVpuTxvC1Ub7",
      },
      {
        name: {
          en: "Ban Baen Chado School (โรงเรียนบ้านแบนชะโด)",
          th: "โรงเรียนบ้านแบนชะโด",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/e5K8XirFF2VvePLEA",
      },
      {
        name: {
          en: "Pracharat Upatham Witthaya School (โรงเรียนประชาราษฎร์อุปถัมภ์วิทยา)",
          th: "โรงเรียนประชาราษฎร์อุปถัมภ์วิทยา",
        },
        detail: {
          en: "Room for 100 people. At 23:45 on 26 September, 147 people were staying.",
          th: "รองรับ 100 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 147 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/hCw8Ywu1WXDpcfU26",
        status: "full",
      },
      {
        name: {
          en: "Wat Khu Bon School (โรงเรียนวัดคู้บอน)",
          th: "โรงเรียนวัดคู้บอน",
        },
        detail: {
          en: "Room for 50 people. At 23:45 on 26 September, 40 people were staying.",
          th: "รองรับ 50 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 40 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/e5LS7sQ78DfoeJ8h6",
      },
      {
        name: {
          en: "Wat Bua Kaeo School (โรงเรียนวัดบัวแก้ว)",
          th: "โรงเรียนวัดบัวแก้ว",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/xBho3BYpropp2EWB8",
      },
      {
        name: {
          en: "Wat Phraya Suren School (โรงเรียนวัดพระยาสุเรนทร์)",
          th: "โรงเรียนวัดพระยาสุเรนทร์",
        },
        detail: {
          en: "Room for 100 people. At 23:45 on 26 September, 78 people were staying.",
          th: "รองรับ 100 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 78 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/LGP2bB2gYZpDtrXA6",
      },
      {
        name: {
          en: "Wat Lam Kadan School (โรงเรียนวัดลำกะดาน)",
          th: "โรงเรียนวัดลำกะดาน",
        },
        detail: {
          en: "Room for 40 people.",
          th: "รองรับ 40 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/ih9XCP6RpiwQiM4Z8",
      },
      {
        name: {
          en: "Wat Si Suk School (โรงเรียนวัดศรีสุก)",
          th: "โรงเรียนวัดศรีสุก",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/NU3jKUbBVjxgfWW7A",
      },
      {
        name: {
          en: "Wat Sukchai School (โรงเรียนวัดสุขใจ)",
          th: "โรงเรียนวัดสุขใจ",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/ieoU17oAmX71uCeB8",
      },
      {
        name: {
          en: "Wat Sutthi Sa At School (โรงเรียนวัดสุทธิสะอาด)",
          th: "โรงเรียนวัดสุทธิสะอาด",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/1iF1TVgRTYhgp8gL6",
      },
      {
        name: {
          en: "Wat Paen Thong School (โรงเรียนวัดแป้นทอง)",
          th: "โรงเรียนวัดแป้นทอง",
        },
        detail: {
          en: "Room for 50 people. At 23:45 on 26 September, 25 people were staying.",
          th: "รองรับ 50 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 25 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/yMsbGVL2nDX6GMBF6",
      },
      {
        name: {
          en: "Surao Khlong Si School (โรงเรียนสุเหร่าคลองสี่)",
          th: "โรงเรียนสุเหร่าคลองสี่",
        },
        detail: {
          en: "Room for 15 people.",
          th: "รองรับ 15 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/aEduGCLVwzfCwviFA",
      },
      {
        name: {
          en: "Surao Khlong Nueng School (โรงเรียนสุเหร่าคลองหนึ่ง)",
          th: "โรงเรียนสุเหร่าคลองหนึ่ง",
        },
        detail: {
          en: "Room for 30 people. At 23:45 on 26 September, 31 people were staying.",
          th: "รองรับ 30 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 31 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/jk5tBn8iGYDwRL8WA",
        status: "full",
      },
      {
        name: {
          en: "Surao Sam Wa School (โรงเรียนสุเหร่าสามวา)",
          th: "โรงเรียนสุเหร่าสามวา",
        },
        detail: {
          en: "Room for 100 people. At 23:45 on 26 September, 4 people were staying.",
          th: "รองรับ 100 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 4 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/twPo7QmdoBKLcEoA7",
      },
      {
        name: {
          en: "Surao Ko Khun Nen School (โรงเรียนสุเหร่าเกาะขุนเณร)",
          th: "โรงเรียนสุเหร่าเกาะขุนเณร",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/o48wqEwgiNCiHqzR7",
      },
      {
        name: {
          en: "Surao Saen Saep School (โรงเรียนสุเหร่าแสนแสบ)",
          th: "โรงเรียนสุเหร่าแสนแสบ",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/U8DdrE3R6Piw5QpR9",
      },
    ],
    parking: [
      {
        name: {
          en: "Rattana Pracharak Hospital (รพ.รัตนประชารักษ์)",
          th: "รพ.รัตนประชารักษ์",
        },
        detail: {
          en: "Room for 500 cars. At 23:45 on 26 September, 500 cars were parked.",
          th: "รองรับ 500 คัน เวลา 23.45 น. วันที่ 26 กันยายน มีรถจอด 500 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/q6nxvLdC1R2f79RS7",
        status: "full",
      },
    ],
  },
  {
    id: "bang-na",
    name: {
      en: "Bang Na",
      th: "บางนา",
    },
    aliases: ["Bangna"],
    officePhone: "02-397-3705",
    sandbags: [
      {
        name: {
          en: "Bang Na District Office (สำนักงานเขตบางนา)",
          th: "สำนักงานเขตบางนา",
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
          en: "Phongploy Anuson Early Childhood Centre (Likhit 2) (ศูนย์พัฒนาเด็กก่อนวัยเรียน ผ่องพลอยอนุสรณ์ (ลิขิต 2))",
          th: "ศูนย์พัฒนาเด็กก่อนวัยเรียน ผ่องพลอยอนุสรณ์ (ลิขิต 2)",
        },
        detail: {
          en: "Room for 20 people. At 23:45 on 26 September, 7 people were staying.",
          th: "รองรับ 20 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 7 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/NbbULJH65LGg27RcA",
      },
      {
        name: {
          en: "Phongploy Anuson School (โรงเรียนผ่องพลอยอนุสรณ์)",
          th: "โรงเรียนผ่องพลอยอนุสรณ์",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/tXbQsHRTdVj1ivGV6",
      },
      {
        name: {
          en: "Rung Rueang Upatham School (โรงเรียนรุ่งเรืองอุปถัมภ์)",
          th: "โรงเรียนรุ่งเรืองอุปถัมภ์",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/dR9MRoC74BFVyCPVA",
      },
      {
        name: {
          en: "Wat Bang Na Nok School (โรงเรียนวัดบางนานอก)",
          th: "โรงเรียนวัดบางนานอก",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/1QMKk1eZwPpTpFcm6",
      },
      {
        name: {
          en: "Wat Bang Na Nai School (Ruen Sayamanon) (โรงเรียนวัดบางนาใน (รื่น ศยามานนท์))",
          th: "โรงเรียนวัดบางนาใน (รื่น ศยามานนท์)",
        },
        detail: {
          en: "Room for 50 people. At 23:45 on 26 September, 5 people were staying.",
          th: "รองรับ 50 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 5 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/NxFmXudqpDASCYub9",
      },
      {
        name: {
          en: "Si Iam Anuson School (โรงเรียนศรีเอี่ยมอนุสรณ์)",
          th: "โรงเรียนศรีเอี่ยมอนุสรณ์",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/jRgtw1TyWsWEtSRk8",
      },
      {
        name: {
          en: "Amnuai Kanoksiri Anuson School (โรงเรียนอำนวยกนกศิริอนุสรณ์)",
          th: "โรงเรียนอำนวยกนกศิริอนุสรณ์",
        },
        detail: {
          en: "Room for 20 people. At 23:45 on 26 September, 13 people were staying.",
          th: "รองรับ 20 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 13 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/q1Kf8Yqp4BU849BRA",
      },
      {
        name: {
          en: "Phian Phin Anuson School (โรงเรียนเพี้ยนพินอนุสรณ์)",
          th: "โรงเรียนเพี้ยนพินอนุสรณ์",
        },
        detail: {
          en: "Room for 70 people.",
          th: "รองรับ 70 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/s65Kh31qxiYkjTHA7",
      },
    ],
    parking: [
      {
        name: {
          en: "Yellow Line Si Iam station park and ride (YL17) (อาคารจอดแล้วจร รถไฟฟ้าสายสีเหลือง สถานีศรีเอี่ยม (YL17))",
          th: "อาคารจอดแล้วจร รถไฟฟ้าสายสีเหลือง สถานีศรีเอี่ยม (YL17)",
        },
        detail: {
          en: "Free. Get your car in and out by 2 October.",
          th: "ไม่มีค่าใช้จ่าย นำรถเข้าและออกภายในวันที่ 2 ตุลาคม",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/ZMh6QFGn7Zg18cZ37",
      },
      {
        name: {
          en: "Central Bangna (เซ็นทรัลบางนา)",
          th: "เซ็นทรัลบางนา",
        },
        detail: {
          en: "Floor 3 and a half, 25 to 27 September. Register on floor B1.",
          th: "ชั้น 3 ครึ่ง วันที่ 25 ถึง 27 กันยายน ลงทะเบียนที่ชั้น B1",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/BRpTNKHCcoLYBHVj9",
      },
    ],
  },
  {
    id: "thawi-watthana",
    name: {
      en: "Thawi Watthana",
      th: "ทวีวัฒนา",
    },
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
          en: "Khlong Ton Sai School (Suk Lom Uthit) (โรงเรียนคลองต้นไทร(สุขล้อมอุทิศ))",
          th: "โรงเรียนคลองต้นไทร(สุขล้อมอุทิศ)",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/Lvm3q12TxWnA55786",
      },
      {
        name: {
          en: "Khlong Thawi Watthana School (Thong Nuam Anuson) (โรงเรียนคลองทวีวัฒนา(ทองน่วมอนุสรณ์))",
          th: "โรงเรียนคลองทวีวัฒนา(ทองน่วมอนุสรณ์)",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/Jn8GzDEPTb1XWuuLA?g_st=ac",
      },
      {
        name: {
          en: "Khlong Bang Phrom School (โรงเรียนคลองบางพรหม)",
          th: "โรงเรียนคลองบางพรหม",
        },
        detail: {
          en: "Room for 35 people. At 23:45 on 26 September, 3 people were staying.",
          th: "รองรับ 35 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 3 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/LC24wmGu2r73UQJR9?g_st=ac",
      },
      {
        name: {
          en: "Khlong Maha Sawat School (โรงเรียนคลองมหาสวัสดิ์)",
          th: "โรงเรียนคลองมหาสวัสดิ์",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/cu6qooLYkhSspMmNA?g_st=ac",
      },
      {
        name: {
          en: "Tang Phirun Tham School (โรงเรียนตั้งพิรุฬห์ธรรม)",
          th: "โรงเรียนตั้งพิรุฬห์ธรรม",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/tGytJfNkVqnX3QdW8",
      },
      {
        name: {
          en: "Puranawat Secondary School (โรงเรียนมัธยมปุรณาวาส)",
          th: "โรงเรียนมัธยมปุรณาวาส",
        },
        detail: {
          en: "Room for 20 people. At 23:45 on 26 September, 6 people were staying.",
          th: "รองรับ 20 คน เวลา 23.45 น. วันที่ 26 กันยายน มีผู้เข้าพัก 6 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/2SrNrV4o1j3vFM1n9?g_st=ac",
      },
      {
        name: {
          en: "Wat Puranawat School (โรงเรียนวัดปุรณาวาส)",
          th: "โรงเรียนวัดปุรณาวาส",
        },
        detail: {
          en: "Room for 30 people.",
          th: "รองรับ 30 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
        map: "https://maps.app.goo.gl/KQy275Z89uN6XfXz5?g_st=ac",
      },
    ],
    parking: [],
  },
  {
    id: "thung-khru",
    name: {
      en: "Thung Khru",
      th: "ทุ่งครุ",
    },
    aliases: ["Tung Kru"],
    officePhone: "02-464-4385",
    sandbags: [
      {
        name: {
          en: "Thung Khru District Office (สำนักงานเขตทุ่งครุ)",
          th: "สำนักงานเขตทุ่งครุ",
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
          en: "Khlong Rang Chak School (โรงเรียนคลองรางจาก)",
          th: "โรงเรียนคลองรางจาก",
        },
        detail: {
          en: "Room for 20 people.",
          th: "รองรับ 20 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Chusin Thongpradit Anuson School (โรงเรียนชูสินทองประดิษฐ์อนุสรณ์)",
          th: "โรงเรียนชูสินทองประดิษฐ์อนุสรณ์",
        },
        detail: {
          en: "Room for 80 people.",
          th: "รองรับ 80 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Na Luang School (โรงเรียนนาหลวง)",
          th: "โรงเรียนนาหลวง",
        },
        detail: {
          en: "Room for 150 people.",
          th: "รองรับ 150 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Bang Mot School (Tanpao Witthayakhan) (โรงเรียนบางมด (ตันเปาว์วิทยาคาร))",
          th: "โรงเรียนบางมด (ตันเปาว์วิทยาคาร)",
        },
        detail: {
          en: "Room for 80 people.",
          th: "รองรับ 80 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Rang Ratchaphruek Nutchami Uthit School (โรงเรียนรางราชพฤกษ์นุชมีอุทิศ)",
          th: "โรงเรียนรางราชพฤกษ์นุชมีอุทิศ",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Rat Burana School (Muhammad Uthit) (โรงเรียนราษฎร์บูรณะ (มูฮำหมัดอุทิศ))",
          th: "โรงเรียนราษฎร์บูรณะ (มูฮำหมัดอุทิศ)",
        },
        detail: {
          en: "Room for 150 people.",
          th: "รองรับ 150 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Wat Thung Khru School (Phueng Sai Anuson) (โรงเรียนวัดทุ่งครุ (พึ่งสายอนุสรณ์))",
          th: "โรงเรียนวัดทุ่งครุ (พึ่งสายอนุสรณ์)",
        },
        detail: {
          en: "Room for 150 people.",
          th: "รองรับ 150 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
      {
        name: {
          en: "Samakkhi Bamrung School (โรงเรียนสามัคคีบำรุง)",
          th: "โรงเรียนสามัคคีบำรุง",
        },
        detail: {
          en: "Room for 50 people.",
          th: "รองรับ 50 คน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
    parking: [],
  },
  {
    id: "bang-bon",
    name: {
      en: "Bang Bon",
      th: "บางบอน",
    },
    aliases: ["Bangbon"],
    officePhone: "02-450-3201",
    sandbags: [
      {
        name: {
          en: "Bang Bon District Office (สำนักงานเขตบางบอน)",
          th: "สำนักงานเขตบางบอน",
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
          en: "Ratchasittharam Technical College (วิทยาลัยเทคนิคราชสิทธาราม)",
          th: "วิทยาลัยเทคนิคราชสิทธาราม",
        },
        detail: {
          en: "Room for 100 cars. At 23:45 on 26 September, 15 cars were parked.",
          th: "รองรับ 100 คัน เวลา 23.45 น. วันที่ 26 กันยายน มีรถจอด 15 คัน",
        },
        source: "https://floodsupport.awarehouse.tech/",
      },
    ],
  },
];
