/**
 * Copy for the flood claims checker. The logic is in `lib/claims-check.ts`;
 * amounts match `content/emergency/claims/flooding.ts`, so change both together.
 * Every question and option exists in both languages (checked by
 * `tests/unit/claims-check.test.ts`).
 */
import type { Locale } from "@/lib/i18n";
import type { ClaimItem, ClaimNote, QuestionId } from "@/lib/claims-check";

type Option = { label: string; hint?: string };

export type CheckerQuestion = {
  question: string;
  hint?: string;
  /** Keyed by option id from `questionOptions`. */
  options: Record<string, Option>;
  /** Shown in the error summary when nothing is chosen. */
  error: string;
};

export type CheckerCopy = {
  title: string;
  lede: string;
  continueLabel: string;
  back: string;
  /** Between the last checkbox and "None of these". */
  or: string;
  errorTitle: string;
  /** "Question 2 of 6". */
  questionOf: (current: number, total: number) => string;
  questions: Record<QuestionId, CheckerQuestion>;
  resultTitle: string;
  resultLede: string;
  nothingTitle: string;
  fromGovernment: string;
  fromBma: string;
  howToApply: string;
  items: Record<ClaimItem, { title: string; amount: string }>;
  notes: Record<ClaimNote, string>;
  /** Notes shown as warning text rather than inset text. */
  warnings: ClaimNote[];
  applyGovernment: string;
  applyBmaOnline: string;
  applyDistrict: string;
  documents: string;
  yourAnswers: string;
  change: string;
  startAgain: string;
  readGuide: string;
  disclaimer: string;
};

export const checkerCopy: Record<Locale, CheckerCopy> = {
  en: {
    title: "Check what flood money you can claim",
    lede: "Answer up to 6 questions to find out which money you may be able to get after the Bangkok floods. It takes about 2 minutes.",
    continueLabel: "Continue",
    back: "Back",
    or: "or",
    errorTitle: "There is a problem",
    questionOf: (current, total) => `Question ${current} of ${total}`,
    questions: {
      home: {
        question: "Where is the home that was flooded?",
        hint: "This must be the place you usually live, including a rented room, flat or dormitory.",
        options: {
          bangkok: { label: "In Bangkok" },
          elsewhere: { label: "In another province" },
          no: { label: "The place I usually live was not flooded" },
        },
        error: "Select where the home that was flooded is",
      },
      flood: {
        question: "What happened to your home?",
        hint: "Choose the one that fits best, for any time between 15 May and 30 September 2026.",
        options: {
          over7: { label: "It was flooded for more than 7 days in a row" },
          damaged: { label: "It was flooded for 7 days or fewer, and my belongings were damaged" },
          cutoff: {
            label: "It was cut off by water for more than 7 days",
            hint: "You could not live there normally, even if water did not come in.",
          },
          highrise: {
            label:
              "I live in a high rise above the water, and could not live normally for more than 7 days",
          },
          brief: { label: "Water came in for a short time, and nothing was damaged" },
        },
        error: "Select what happened to your home",
      },
      tenure: {
        question: "Do you own or rent your home?",
        options: {
          owner: { label: "I own it, or I am the head of the household" },
          rent: {
            label: "I rent it",
            hint: "Including a room, flat, condo or dormitory you pay for.",
          },
          other: {
            label: "Neither",
            hint: "For example, you live with family or in housing your employer provides.",
          },
        },
        error: "Select whether you own or rent your home",
      },
      damage: {
        question: "How badly was the building damaged?",
        options: {
          whole: { label: "The whole home was damaged" },
          part: { label: "Part of the home was damaged" },
          none: { label: "Water came in, but the building was not damaged" },
        },
        error: "Select how badly the building was damaged",
      },
      costs: {
        question: "Did any of these happen because of the floods?",
        hint: "Select all that apply.",
        options: {
          stay: { label: "I had to pay for somewhere else to stay, or rent" },
          tools: { label: "I lost tools or stock I need for my work" },
          treatment: { label: "Someone in my household needed medical treatment" },
          injury: { label: "Someone in my household was injured" },
          death: { label: "Someone in my household died" },
          none: { label: "None of these" },
        },
        error: "Select what happened, or select none of these",
      },
      id: {
        question: "Do you have a Thai ID card?",
        options: {
          thai: { label: "Yes" },
          other: { label: "No" },
        },
        error: "Select whether you have a Thai ID card",
      },
    },
    resultTitle: "What you may be able to claim",
    resultLede:
      "Based on your answers, you may be able to get the money below. These are the most you can get. The district office decides what you get.",
    nothingTitle: "You may not be able to claim",
    fromGovernment: "From the government",
    fromBma: "From the BMA",
    howToApply: "How to apply",
    items: {
      government: { title: "Government payment", amount: "9,000 baht per household, once" },
      repairs: { title: "Repairs to your home", amount: "Up to 88,600 baht" },
      stayWhole: {
        title: "Temporary accommodation or rent",
        amount: "Up to 3,000 baht a month, for up to 2 months",
      },
      stayPart: { title: "Temporary accommodation or rent", amount: "Up to 3,000 baht" },
      livingWhole: { title: "Basic living costs", amount: "3,800 baht" },
      livingPart: { title: "Basic living costs", amount: "1,900 baht" },
      tools: { title: "Tools and stock for your work", amount: "Up to 13,500 baht" },
      treatment: {
        title: "Medical treatment",
        amount: "Up to 2,000 baht per outpatient or 4,000 baht per inpatient",
      },
      injury: { title: "Injury", amount: "A further 2,300 baht per person" },
      death: {
        title: "Funeral",
        amount:
          "Up to 35,700 baht per person, and a further 35,700 baht if they supported the household",
      },
    },
    notes: {
      bangkokArea:
        "In Bangkok the government payment covers 118 subdistricts in 38 districts. Phra Nakhon is not one of them. Ask your district office if you are not sure.",
      outsideBangkok:
        "Outside Bangkok, register for the government payment in the Tang Rat app or at your local administrative office. BMA compensation is only for Bangkok.",
      tenantPaid: "If you rent, the government payment is paid to you, not to your landlord.",
      household:
        "The government pays once per household, so only one person in your household should apply.",
      repairsLandlord:
        "Repairs to a rented home are not covered. They are normally your landlord's responsibility.",
      waterCameIn:
        "If water came into the rooms you live in, ask your district office whether the BMA can still help you.",
      bmaDeadline: "You must claim BMA compensation within 30 days of the flood.",
      notThai:
        "Neither scheme says whether people who are not Thai can claim. Take your passport, proof of where you live and photographs of the damage to your district office and ask.",
      nothingFound:
        "From your answers, you may not qualify for either scheme. If you think you do, ask your district office or call 1555.",
      notYourHome:
        "Both schemes are only for the place you usually live. If someone in your household was injured or died in the floods, ask your district office.",
    },
    warnings: ["bmaDeadline"],
    applyGovernment: "Apply for the 9,000 baht",
    applyBmaOnline: "Claim BMA compensation online",
    applyDistrict: "Apply at your district office",
    documents: "Documents you need",
    yourAnswers: "Your answers",
    change: "Change",
    startAgain: "Start again",
    readGuide: "Read the full guide to claiming",
    disclaimer:
      "This is guidance from BIRSA, a student association. It is not a decision. DDPM and the BMA decide who gets what.",
  },
  th: {
    title: "ตรวจสอบว่าขอรับเงินช่วยเหลือน้ำท่วมอะไรได้บ้าง",
    lede: "ตอบคำถามไม่เกิน 6 ข้อ เพื่อดูว่าคุณอาจขอรับเงินช่วยเหลือหลังน้ำท่วมกรุงเทพฯ ประเภทใดได้บ้าง ใช้เวลาราว 2 นาที",
    continueLabel: "ถัดไป",
    back: "ย้อนกลับ",
    or: "หรือ",
    errorTitle: "มีข้อมูลที่ต้องแก้ไข",
    questionOf: (current, total) => `คำถามที่ ${current} จาก ${total}`,
    questions: {
      home: {
        question: "บ้านที่ถูกน้ำท่วมอยู่ที่ไหน",
        hint: "ต้องเป็นที่อยู่อาศัยประจำ รวมถึงห้องเช่า คอนโด หรือหอพัก",
        options: {
          bangkok: { label: "ในกรุงเทพฯ" },
          elsewhere: { label: "ในจังหวัดอื่น" },
          no: { label: "ที่อยู่อาศัยประจำไม่ได้ถูกน้ำท่วม" },
        },
        error: "เลือกว่าบ้านที่ถูกน้ำท่วมอยู่ที่ไหน",
      },
      flood: {
        question: "บ้านของคุณได้รับผลกระทบอย่างไร",
        hint: "เลือกข้อที่ตรงที่สุด ในช่วงวันที่ 15 พฤษภาคม ถึงวันที่ 30 กันยายน 2569",
        options: {
          over7: { label: "ถูกน้ำท่วมขังติดต่อกันเกิน 7 วัน" },
          damaged: { label: "ถูกน้ำท่วมไม่เกิน 7 วัน และทรัพย์สินได้รับความเสียหาย" },
          cutoff: {
            label: "ถูกน้ำล้อมเกิน 7 วัน",
            hint: "ใช้ชีวิตตามปกติไม่ได้ แม้น้ำไม่ได้เข้าบ้าน",
          },
          highrise: {
            label: "อยู่อาคารสูงที่น้ำท่วมไม่ถึงห้อง แต่ใช้ชีวิตตามปกติไม่ได้เกิน 7 วัน",
          },
          brief: { label: "น้ำเข้าบ้านช่วงสั้น ๆ และไม่มีอะไรเสียหาย" },
        },
        error: "เลือกว่าบ้านของคุณได้รับผลกระทบอย่างไร",
      },
      tenure: {
        question: "คุณเป็นเจ้าของบ้านหรือเช่าอยู่",
        options: {
          owner: { label: "เป็นเจ้าของบ้าน หรือเป็นเจ้าบ้าน" },
          rent: {
            label: "เช่าอยู่",
            hint: "รวมถึงห้องเช่า คอนโด หรือหอพักที่จ่ายค่าเช่า",
          },
          other: {
            label: "ไม่ใช่ทั้งสองอย่าง",
            hint: "เช่น อาศัยอยู่กับครอบครัว หรืออยู่บ้านพักที่นายจ้างจัดให้",
          },
        },
        error: "เลือกว่าคุณเป็นเจ้าของบ้านหรือเช่าอยู่",
      },
      damage: {
        question: "ตัวบ้านเสียหายมากแค่ไหน",
        options: {
          whole: { label: "เสียหายทั้งหลัง" },
          part: { label: "เสียหายบางส่วน" },
          none: { label: "น้ำเข้าบ้าน แต่ตัวบ้านไม่เสียหาย" },
        },
        error: "เลือกว่าตัวบ้านเสียหายมากแค่ไหน",
      },
      costs: {
        question: "เกิดเหตุการณ์ใดต่อไปนี้เพราะน้ำท่วมหรือไม่",
        hint: "เลือกได้มากกว่า 1 ข้อ",
        options: {
          stay: { label: "ต้องจ่ายค่าที่พักที่อื่นหรือค่าเช่าบ้าน" },
          tools: { label: "เครื่องมือหรือสินค้าที่ใช้ประกอบอาชีพเสียหาย" },
          treatment: { label: "มีคนในครอบครัวต้องเข้ารับการรักษาพยาบาล" },
          injury: { label: "มีคนในครอบครัวได้รับบาดเจ็บ" },
          death: { label: "มีคนในครอบครัวเสียชีวิต" },
          none: { label: "ไม่มีข้อใดเลย" },
        },
        error: "เลือกเหตุการณ์ที่เกิดขึ้น หรือเลือกไม่มีข้อใดเลย",
      },
      id: {
        question: "คุณมีบัตรประจำตัวประชาชนไทยหรือไม่",
        options: {
          thai: { label: "มี" },
          other: { label: "ไม่มี" },
        },
        error: "เลือกว่าคุณมีบัตรประจำตัวประชาชนไทยหรือไม่",
      },
    },
    resultTitle: "เงินช่วยเหลือที่คุณอาจขอรับได้",
    resultLede:
      "จากคำตอบของคุณ คุณอาจขอรับเงินด้านล่างได้ จำนวนเงินเป็นอัตราสูงสุด สำนักงานเขตเป็นผู้พิจารณาว่าจะได้รับเท่าไร",
    nothingTitle: "คุณอาจขอรับเงินช่วยเหลือไม่ได้",
    fromGovernment: "จากรัฐบาล",
    fromBma: "จาก กทม.",
    howToApply: "วิธียื่น",
    items: {
      government: { title: "เงินช่วยเหลือจากรัฐบาล", amount: "ครัวเรือนละ 9,000 บาท ครั้งเดียว" },
      repairs: { title: "ค่าซ่อมแซมบ้าน", amount: "ไม่เกิน 88,600 บาท" },
      stayWhole: {
        title: "ค่าที่พักชั่วคราวหรือค่าเช่าบ้าน",
        amount: "ไม่เกินเดือนละ 3,000 บาท ไม่เกิน 2 เดือน",
      },
      stayPart: { title: "ค่าที่พักชั่วคราวหรือค่าเช่าบ้าน", amount: "ไม่เกิน 3,000 บาท" },
      livingWhole: { title: "ค่าดำรงชีพเบื้องต้น", amount: "3,800 บาท" },
      livingPart: { title: "ค่าดำรงชีพเบื้องต้น", amount: "1,900 บาท" },
      tools: { title: "ค่าเครื่องมือประกอบอาชีพและเงินทุน", amount: "ไม่เกิน 13,500 บาท" },
      treatment: {
        title: "ค่ารักษาพยาบาล",
        amount: "ผู้ป่วยนอกไม่เกิน 2,000 บาท ผู้ป่วยในไม่เกิน 4,000 บาทต่อราย",
      },
      injury: { title: "เงินปลอบขวัญผู้บาดเจ็บ", amount: "เพิ่มอีก 2,300 บาทต่อราย" },
      death: {
        title: "ค่าจัดการศพ",
        amount:
          "ไม่เกิน 35,700 บาทต่อราย และเพิ่มอีกไม่เกิน 35,700 บาทหากผู้เสียชีวิตเป็นผู้หารายได้",
      },
    },
    notes: {
      bangkokArea:
        "ในกรุงเทพฯ เงินของรัฐบาลครอบคลุม 38 เขต 118 แขวง ไม่รวมเขตพระนคร หากไม่แน่ใจให้สอบถามสำนักงานเขต",
      outsideBangkok:
        "นอกกรุงเทพฯ ลงทะเบียนขอเงินของรัฐบาลผ่านแอปทางรัฐหรือที่องค์กรปกครองส่วนท้องถิ่น ส่วนเงินช่วยเหลือของ กทม. ให้เฉพาะในกรุงเทพฯ",
      tenantPaid: "กรณีเช่าบ้าน ผู้เช่าเป็นผู้รับเงินของรัฐบาล ไม่ใช่เจ้าของบ้าน",
      household: "รัฐบาลจ่ายครัวเรือนละครั้งเดียว จึงควรมีผู้ยื่นเพียงคนเดียวในครัวเรือน",
      repairsLandlord: "ค่าซ่อมแซมบ้านไม่รวมบ้านเช่า การซ่อมแซมโดยปกติเป็นหน้าที่ของผู้ให้เช่า",
      waterCameIn:
        "หากน้ำท่วมถึงพื้นที่พักอาศัย ให้สอบถามสำนักงานเขตว่า กทม. ยังช่วยเหลือได้หรือไม่",
      bmaDeadline: "ต้องยื่นขอเงินช่วยเหลือของ กทม. ภายใน 30 วันนับแต่วันที่ประสบภัย",
      notThai:
        "ทั้งสองโครงการไม่ได้ระบุว่าผู้ที่ไม่มีสัญชาติไทยยื่นได้หรือไม่ ให้นำหนังสือเดินทาง หลักฐานที่อยู่ และภาพถ่ายความเสียหายไปสอบถามที่สำนักงานเขต",
      nothingFound:
        "จากคำตอบของคุณ คุณอาจไม่เข้าเกณฑ์ทั้งสองโครงการ หากคิดว่าเข้าเกณฑ์ ให้สอบถามสำนักงานเขตหรือโทร 1555",
      notYourHome:
        "ทั้งสองโครงการให้เฉพาะที่อยู่อาศัยประจำ หากมีคนในครอบครัวบาดเจ็บหรือเสียชีวิตจากน้ำท่วม ให้สอบถามสำนักงานเขต",
    },
    warnings: ["bmaDeadline"],
    applyGovernment: "วิธียื่นขอเงิน 9,000 บาท",
    applyBmaOnline: "ยื่นขอเงินช่วยเหลือของ กทม. ทางออนไลน์",
    applyDistrict: "ยื่นที่สำนักงานเขต",
    documents: "เอกสารที่ต้องใช้",
    yourAnswers: "คำตอบของคุณ",
    change: "แก้ไข",
    startAgain: "เริ่มใหม่",
    readGuide: "อ่านคู่มือการขอรับเงินช่วยเหลือทั้งหมด",
    disclaimer:
      "นี่เป็นคำแนะนำจาก BIRSA ซึ่งเป็นองค์กรนักศึกษา ไม่ใช่คำตัดสิน ปภ. และ กทม. เป็นผู้พิจารณาว่าใครได้รับอะไร",
  },
};
