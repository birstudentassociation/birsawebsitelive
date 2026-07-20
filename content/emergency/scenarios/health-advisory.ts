import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Contagious illness advisory affecting the faculty. Explains how to
 * protect yourself and others, what to do if unwell or isolating, and
 * when to seek medical care. Based on WHO/CDC public respiratory-illness
 * guidance, adapted with Thai health contacts and the Thammasat Tha
 * Prachan student clinic.
 */
const healthAdvisory: EmergencyScenario = {
  id: "health-advisory",
  severity: "warning",
  en: {
    bannerMessage: "Contagious illness advisory in effect at the faculty. Stay home if you feel unwell and follow the guidance below.",
    title: "Contagious Illness Advisory: What to Do",
    lede: "The faculty is monitoring cases of a contagious illness among students and staff. Most people recover at home with rest and care. This page explains how to protect yourself and others and when to seek medical help.",
    immediateActions: [
      "If you feel unwell, stay home and away from classes, events, and shared spaces.",
      "Wash your hands often with soap and water, or use alcohol-based hand sanitiser.",
      "Wear a mask if you must be around others while unwell or while recovering.",
      "Tell the faculty office if you will miss class due to illness, so lecturers are informed.",
      "Seek medical care if your symptoms are severe, get worse, or you are worried, rather than waiting it out.",
    ],
    sections: [
      {
        heading: "If you feel unwell",
        items: [
          "Rest at home and avoid contact with others as much as you can.",
          "Monitor your symptoms. Common signs of a contagious respiratory illness include fever, cough, sore throat, runny nose, body aches, and fatigue.",
          "Stay hydrated and rest. Most mild respiratory illness can be managed at home.",
          "Contact the Thammasat student health service or a doctor if you are unsure whether you need care, especially if you are an international student unfamiliar with local health services.",
          "Get tested if advised by a doctor or if required by current university or public health guidance, and follow the result and any isolation instructions you are given.",
        ],
      },
      {
        heading: "Protect yourself and others",
        items: [
          "Wash your hands often with soap and water for at least 20 seconds, or use an alcohol-based hand sanitiser when soap is not available.",
          "Cover coughs and sneezes with a tissue or your elbow, not your hands.",
          "Wear a well-fitting mask in crowded or poorly ventilated indoor spaces, and always if you are unwell and cannot avoid being near others.",
          "Improve airflow indoors where you can: open windows, use fans, or hold gatherings outdoors.",
          "Keep your distance from others where practical, particularly from anyone who is coughing or appears unwell.",
          "Stay up to date with vaccines recommended by health authorities for the relevant illness.",
        ],
      },
      {
        heading: "If you test positive or are told to isolate",
        items: [
          "Follow the isolation period and instructions given by your doctor or the relevant public health authority. Guidance can change between illnesses and outbreaks, so follow the current official instruction rather than an old rule of thumb.",
          "As a general principle used in recent public health guidance, you can return to normal activities once your symptoms have been improving and you have been free of fever (without fever-reducing medicine) for at least 24 hours. Confirm this against current official guidance for the specific illness, since requirements can differ.",
          "After returning to normal activities, continue extra precautions for several days: good hygiene, a mask in shared spaces, and keeping some distance from others.",
          "Inform the faculty office and your lecturers that you are isolating, so your absence is recorded and coursework arrangements can be made.",
          "Avoid shared kitchens, common rooms, and close contact with roommates or family while you are infectious, where possible.",
        ],
      },
      {
        heading: "On campus",
        items: [
          "If you are well but a classmate or roommate is unwell, encourage them to stay home and seek care rather than pushing through classes.",
          "Practise good hand hygiene when using shared spaces, equipment, and door handles.",
          "Support good ventilation in shared rooms: open windows where possible.",
          "Follow any specific instructions issued by Thammasat University or the Faculty of Political Science during an active outbreak. Official university and Ministry of Public Health instructions always take priority over general guidance on this page.",
          "This page is written and maintained by students (BIRSA) for general information. It is not a substitute for medical advice or official university and public health instructions.",
        ],
      },
    ],
    extraContacts: [
      { label: "Thai Department of Disease Control hotline (health advice, disease information)", value: "1422", href: "tel:1422" },
      { label: "Medical emergency (EMS / ambulance), for severe symptoms", value: "1669", href: "tel:1669" },
      { label: "Thammasat Tha Prachan campus student clinic (Virtual Clinic, 1st Floor, Student Activities Center, Building 21)", value: "0-2613-3961, Monday to Friday, 8:30 a.m. to 4:30 p.m., closed public holidays", href: "tel:026133961" },
      { label: "TU Well-Being / Viva City Counselling Center (for stress or mental health support during illness or isolation)", value: "See Thammasat Office of International Affairs Well-Being Services page" },
    ],
  },
  th: {
    bannerMessage: "ขณะนี้มีประกาศเฝ้าระวังโรคติดต่อในคณะ หากรู้สึกไม่สบายให้หยุดพักที่บ้านและปฏิบัติตามคำแนะนำด้านล่าง",
    title: "ประกาศเฝ้าระวังโรคติดต่อ: สิ่งที่ควรทำ",
    lede: "ขณะนี้คณะกำลังเฝ้าระวังการแพร่ระบาดของโรคติดต่อในกลุ่มนักศึกษาและบุคลากร ผู้ป่วยส่วนใหญ่หายได้เองด้วยการพักผ่อนที่บ้าน หน้านี้อธิบายวิธีดูแลตัวเองและผู้อื่น รวมถึงเมื่อใดควรไปพบแพทย์",
    immediateActions: [
      "หากรู้สึกไม่สบาย ให้หยุดเรียน งดกิจกรรม และหลีกเลี่ยงพื้นที่ส่วนรวม",
      "ล้างมือบ่อย ๆ ด้วยสบู่และน้ำ หรือใช้เจลแอลกอฮอล์ล้างมือ",
      "สวมหน้ากากอนามัยหากจำเป็นต้องอยู่ใกล้ผู้อื่นขณะป่วยหรือกำลังพักฟื้น",
      "แจ้งสำนักงานคณะหากต้องขาดเรียนเนื่องจากป่วย เพื่อให้อาจารย์ผู้สอนรับทราบ",
      "หากอาการรุนแรง แย่ลง หรือรู้สึกกังวล ให้รีบไปพบแพทย์ ไม่ควรปล่อยไว้เฉย ๆ",
    ],
    sections: [
      {
        heading: "หากรู้สึกไม่สบาย",
        items: [
          "พักผ่อนที่บ้านและหลีกเลี่ยงการใกล้ชิดผู้อื่นให้มากที่สุด",
          "สังเกตอาการของตนเอง อาการที่พบบ่อยของโรคติดต่อทางเดินหายใจ ได้แก่ ไข้ ไอ เจ็บคอ น้ำมูกไหล ปวดเมื่อยตามตัว และอ่อนเพลีย",
          "ดื่มน้ำให้เพียงพอและพักผ่อน อาการป่วยทางเดินหายใจส่วนใหญ่ดูแลที่บ้านได้",
          "หากไม่แน่ใจว่าควรไปพบแพทย์หรือไม่ ติดต่อคลินิกนักศึกษาของมหาวิทยาลัยธรรมศาสตร์หรือแพทย์ โดยเฉพาะนักศึกษาต่างชาติที่อาจยังไม่คุ้นเคยกับระบบสาธารณสุขในประเทศไทย",
          "ตรวจหาเชื้อตามคำแนะนำของแพทย์ หรือหากมหาวิทยาลัยหรือหน่วยงานสาธารณสุขกำหนดไว้ และปฏิบัติตามผลตรวจและคำแนะนำเรื่องการแยกตัวที่ได้รับ",
        ],
      },
      {
        heading: "ปกป้องตัวเองและผู้อื่น",
        items: [
          "ล้างมือด้วยสบู่และน้ำอย่างน้อย 20 วินาที หรือใช้เจลแอลกอฮอล์เมื่อไม่มีสบู่และน้ำ",
          "ใช้กระดาษทิชชูหรือข้อพับแขนปิดปากและจมูกเมื่อไอหรือจาม ไม่ใช้มือปิด",
          "สวมหน้ากากอนามัยที่กระชับพอดีในพื้นที่แออัดหรืออากาศถ่ายเทไม่ดี และควรสวมเสมอหากป่วยและหลีกเลี่ยงการอยู่ใกล้ผู้อื่นไม่ได้",
          "เพิ่มการระบายอากาศในพื้นที่ปิดเท่าที่ทำได้ เช่น เปิดหน้าต่าง ใช้พัดลม หรือจัดกิจกรรมกลางแจ้งแทน",
          "เว้นระยะห่างจากผู้อื่นเท่าที่ทำได้ โดยเฉพาะผู้ที่กำลังไอหรือดูไม่สบาย",
          "รับวัคซีนตามคำแนะนำของหน่วยงานสาธารณสุขสำหรับโรคนั้น ๆ ให้ครบถ้วน",
        ],
      },
      {
        heading: "หากตรวจพบเชื้อหรือได้รับคำแนะนำให้แยกตัว",
        items: [
          "ปฏิบัติตามระยะเวลาและคำแนะนำการแยกตัวที่แพทย์หรือหน่วยงานสาธารณสุขที่เกี่ยวข้องกำหนด คำแนะนำอาจเปลี่ยนแปลงตามชนิดของโรคและสถานการณ์การระบาด จึงควรยึดตามประกาศที่เป็นปัจจุบันมากกว่าจดจำกฎเดิม",
          "หลักการทั่วไปตามแนวทางสาธารณสุขล่าสุด คือสามารถกลับไปใช้ชีวิตตามปกติได้เมื่ออาการดีขึ้นและไม่มีไข้ (โดยไม่ใช้ยาลดไข้) ต่อเนื่องอย่างน้อย 24 ชั่วโมง ควรตรวจสอบกับคำแนะนำทางการล่าสุดสำหรับโรคนั้น ๆ อีกครั้ง เนื่องจากเงื่อนไขอาจแตกต่างกัน",
          "หลังกลับไปใช้ชีวิตตามปกติแล้ว ควรเพิ่มความระมัดระวังต่ออีกสักระยะ เช่น รักษาสุขอนามัย สวมหน้ากากในพื้นที่ส่วนรวม และเว้นระยะห่างจากผู้อื่น",
          "แจ้งสำนักงานคณะและอาจารย์ผู้สอนว่ากำลังแยกตัว เพื่อบันทึกการขาดเรียนและจัดการเรื่องการเรียนให้เหมาะสม",
          "หลีกเลี่ยงการใช้พื้นที่ส่วนกลาง เช่น ครัวรวม ห้องนั่งเล่นรวม และการใกล้ชิดกับเพื่อนร่วมห้องหรือครอบครัวเท่าที่ทำได้ในช่วงที่ยังแพร่เชื้อได้",
        ],
      },
      {
        heading: "ในรั้วมหาวิทยาลัย",
        items: [
          "หากตนเองสบายดีแต่เพื่อนหรือเพื่อนร่วมห้องไม่สบาย ให้สนับสนุนให้เขาหยุดพักและไปพบแพทย์ แทนที่จะฝืนมาเรียน",
          "รักษาสุขอนามัยของมือเมื่อใช้พื้นที่ อุปกรณ์ หรือลูกบิดประตูร่วมกับผู้อื่น",
          "ช่วยกันดูแลการระบายอากาศในห้องที่ใช้ร่วมกัน เช่น เปิดหน้าต่างเมื่อทำได้",
          "ปฏิบัติตามประกาศเฉพาะจากมหาวิทยาลัยธรรมศาสตร์หรือคณะรัฐศาสตร์ในช่วงที่มีการระบาด ประกาศจากมหาวิทยาลัยและกระทรวงสาธารณสุขมีความสำคัญเหนือคำแนะนำทั่วไปในหน้านี้เสมอ",
          "หน้านี้จัดทำและดูแลโดยนักศึกษา (BIRSA) เพื่อให้ข้อมูลทั่วไปเท่านั้น ไม่สามารถใช้แทนคำแนะนำทางการแพทย์หรือประกาศทางการจากมหาวิทยาลัยและหน่วยงานสาธารณสุขได้",
        ],
      },
    ],
    extraContacts: [
      { label: "สายด่วนกรมควบคุมโรค (ข้อมูลและคำแนะนำด้านสุขภาพ)", value: "1422", href: "tel:1422" },
      { label: "การแพทย์ฉุกเฉิน (รถพยาบาล) กรณีอาการรุนแรง", value: "1669", href: "tel:1669" },
      { label: "คลินิกนักศึกษา มธ. ท่าพระจันทร์ (Virtual Clinic ชั้น 1 อาคารกิจกรรมนักศึกษา อาคาร 21)", value: "0-2613-3961 เปิดวันจันทร์ถึงศุกร์ 8.30 ถึง 16.30 น. ปิดวันหยุดนักขัตฤกษ์", href: "tel:026133961" },
      { label: "ศูนย์ให้คำปรึกษา TU Well-Being / Viva City (สำหรับความเครียดหรือสุขภาพจิตระหว่างป่วยหรือแยกตัว)", value: "ดูรายละเอียดที่หน้า Well-Being Services ของสำนักงานการต่างประเทศ มธ." },
    ],
  },
};

export default healthAdvisory;
