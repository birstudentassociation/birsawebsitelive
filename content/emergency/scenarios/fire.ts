import type { EmergencyScenario } from "@/content/emergency/types";

/**
 * Fire in a campus building. Follows DDPM's fire survival advice (stay calm,
 * never use lifts, stay low under smoke, avoid dead ends) and standard fire
 * service practice (close doors, get out and stay out).
 */
const fire: EmergencyScenario = {
  id: "fire",
  severity: "critical",
  hero: "red",
  group: "life",
  keyContacts: ["fire", "ambulance", "police"],
  moreContacts: ["ddpm", "erawan", "tuClinic", "facultyOffice", "mentalHealth"],
  sources: [
    {
      label: {
        en: "DDPM, how to survive a building fire (via MGR Online)",
        th: "ปภ. แนะวิธีเอาตัวรอดจากเหตุเพลิงไหม้ (ผู้จัดการออนไลน์)",
      },
      href: "https://mgronline.com/uptodate/detail/9680000103627",
    },
    {
      label: {
        en: "DDPM, fire evacuation manual 2022",
        th: "ปภ. คู่มืออพยพหนีไฟ พ.ศ. 2565",
      },
      href: "https://www.disaster.go.th/apiv1/clickdownload/download/1606",
    },
  ],
  reviewed: "2026-09-25",
  en: {
    title: "Fire on campus",
    summary:
      "What to do if you see fire or smoke, or hear a fire alarm, in a campus building. Getting out fast matters more than anything else.",
    banner:
      "There is a fire on campus. Keep away from the affected building and follow staff instructions.",
    now: [
      "Leave the building by the nearest safe stairs. Do not stop for your things.",
      "Never use a lift.",
      "If there is smoke, get down low and cover your nose and mouth with a cloth, wet if you can.",
      "Close doors behind you to slow the fire.",
      "Once outside, call 199 and move well away. Do not go back in for any reason.",
    ],
    sections: [
      {
        id: "if-you-find-a-fire",
        heading: "If you find a fire",
        steps: [
          'Shout "fire" to warn people nearby and set off the nearest fire alarm.',
          "Only use a fire extinguisher on a small fire, and only if you have a clear way out behind you.",
          "If the fire is bigger than a waste bin, or the room is filling with smoke, leave straight away.",
          "Call 199 once you are safe. Give the building, the floor and what is burning.",
        ],
      },
      {
        id: "getting-out",
        heading: "Getting out",
        items: [
          "Before opening a closed door, touch it and the handle with the back of your hand. If it is hot, do not open it. Use another way out.",
          "Smoke kills more people than flames. The cleanest air is near the floor, so crawl if you need to.",
          "Keep away from dead ends such as toilets, basements and storerooms. You can become trapped there.",
          "Help anyone who needs it, including people who find stairs difficult, but do not put yourself in serious danger. Tell firefighters where they are.",
          "Walk quickly. Do not run or push on the stairs.",
        ],
      },
      {
        id: "if-you-are-trapped",
        heading: "If you are trapped",
        steps: [
          "Go into a room with a window and close the door.",
          "Block the gap under the door with clothes or a towel, wet if possible, to keep smoke out.",
          "Call 199 and give your exact location, including the building, floor and room.",
          "Open the window if smoke is not coming in from outside, and signal with a light, bright cloth or by shouting.",
          "Do not jump unless the fire is about to reach you.",
        ],
      },
      {
        id: "if-your-clothes-catch-fire",
        heading: "If your clothes catch fire",
        body: [
          "Do not run. Running feeds the flames. Stop, drop to the ground, cover your face with your hands and roll until the flames are out. Cool the burn under cool running water for 20 minutes and get medical help.",
        ],
      },
      {
        id: "outside",
        heading: "Once you are outside",
        items: [
          "Go to the assembly point that staff direct you to, so they can check who is missing.",
          "Tell staff or firefighters at once if you think anyone is still inside.",
          "Stay out until the fire service or university staff say the building is safe.",
          "Anyone who breathed in a lot of smoke should be checked by a doctor, even if they feel fine. Call 1669.",
        ],
      },
      {
        id: "before",
        heading: "Be ready before it happens",
        items: [
          "In every building you use, find two ways out. Fire exits are marked with green signs.",
          "Save 199 in your phone.",
          "Report blocked fire exits, missing extinguishers or broken alarms to faculty staff.",
        ],
      },
    ],
  },
  th: {
    title: "เพลิงไหม้ในมหาวิทยาลัย",
    summary:
      "สิ่งที่ต้องทำเมื่อเห็นไฟหรือควัน หรือได้ยินสัญญาณเตือนไฟไหม้ในอาคารของมหาวิทยาลัย การออกจากอาคารให้เร็วที่สุดสำคัญกว่าทุกอย่าง",
    banner: "เกิดเพลิงไหม้ในมหาวิทยาลัย ออกห่างจากอาคารที่เกิดเหตุ และทำตามคำแนะนำของเจ้าหน้าที่",
    now: [
      "ออกจากอาคารทางบันไดที่ใกล้และปลอดภัยที่สุด ไม่ต้องห่วงเก็บของ",
      "ห้ามใช้ลิฟต์เด็ดขาด",
      "ถ้ามีควัน ให้ก้มตัวต่ำ ใช้ผ้าปิดจมูกและปาก ถ้าชุบน้ำได้ยิ่งดี",
      "ปิดประตูตามหลังเพื่อชะลอไฟ",
      "เมื่อออกมาแล้ว ให้โทร 199 และออกห่างจากอาคาร ห้ามกลับเข้าไปไม่ว่าด้วยเหตุผลใด",
    ],
    sections: [
      {
        id: "if-you-find-a-fire",
        heading: "ถ้าคุณเป็นคนแรกที่พบไฟ",
        steps: [
          'ตะโกน "ไฟไหม้" ให้คนรอบข้างได้ยิน และกดสัญญาณแจ้งเหตุเพลิงไหม้ที่ใกล้ที่สุด',
          "ใช้ถังดับเพลิงเฉพาะกับไฟขนาดเล็ก และต้องมีทางหนีอยู่ด้านหลังคุณเสมอ",
          "ถ้าไฟใหญ่กว่าถังขยะ หรือควันเริ่มเต็มห้อง ให้ออกทันที",
          "โทร 199 เมื่อปลอดภัยแล้ว บอกชื่ออาคาร ชั้น และสิ่งที่กำลังไหม้",
        ],
      },
      {
        id: "getting-out",
        heading: "การหนีออกจากอาคาร",
        items: [
          "ก่อนเปิดประตูที่ปิดอยู่ ให้ใช้หลังมือแตะประตูและลูกบิด ถ้าร้อนอย่าเปิด ให้ใช้ทางอื่น",
          "ควันไฟคร่าชีวิตคนมากกว่าเปลวไฟ อากาศที่ดีที่สุดอยู่ใกล้พื้น คลานต่ำถ้าจำเป็น",
          "อย่าหลบเข้าจุดอับ เช่น ห้องน้ำ ชั้นใต้ดิน หรือห้องเก็บของ เพราะอาจติดอยู่ข้างใน",
          "ช่วยคนที่ต้องการความช่วยเหลือ รวมถึงคนที่ขึ้นลงบันไดลำบาก แต่อย่าเอาตัวเองไปเสี่ยงอันตรายร้ายแรง แจ้งนักดับเพลิงว่าเขาอยู่ตรงไหน",
          "เดินเร็ว ๆ อย่าวิ่งหรือเบียดกันบนบันได",
        ],
      },
      {
        id: "if-you-are-trapped",
        heading: "ถ้าติดอยู่ในอาคาร",
        steps: [
          "เข้าห้องที่มีหน้าต่างแล้วปิดประตู",
          "อุดช่องใต้ประตูด้วยเสื้อผ้าหรือผ้าขนหนู ชุบน้ำถ้าทำได้ เพื่อกันควัน",
          "โทร 199 บอกตำแหน่งให้ชัดเจน ทั้งอาคาร ชั้น และห้อง",
          "เปิดหน้าต่างถ้าควันไม่ได้ลอยมาจากด้านนอก แล้วส่งสัญญาณด้วยไฟฉาย ผ้าสีสด หรือตะโกน",
          "อย่ากระโดดลงมา เว้นแต่ไฟกำลังจะลามถึงตัว",
        ],
      },
      {
        id: "if-your-clothes-catch-fire",
        heading: "ถ้าไฟติดเสื้อผ้า",
        body: [
          "อย่าวิ่ง เพราะลมจะทำให้ไฟลุกมากขึ้น ให้หยุด ล้มตัวลงกับพื้น ใช้มือปิดหน้า แล้วกลิ้งไปมาจนไฟดับ จากนั้นเปิดน้ำสะอาดไหลผ่านแผลนาน 20 นาที และไปพบแพทย์",
        ],
      },
      {
        id: "outside",
        heading: "เมื่อออกมาถึงข้างนอกแล้ว",
        items: [
          "ไปที่จุดรวมพลตามที่เจ้าหน้าที่บอก เพื่อให้ตรวจนับได้ว่าใครยังไม่ออกมา",
          "ถ้าคิดว่ายังมีคนติดอยู่ข้างใน ให้แจ้งเจ้าหน้าที่หรือนักดับเพลิงทันที",
          "รอจนกว่าหน่วยดับเพลิงหรือเจ้าหน้าที่มหาวิทยาลัยยืนยันว่าอาคารปลอดภัย",
          "คนที่สูดควันเข้าไปมาก ควรให้แพทย์ตรวจแม้จะรู้สึกปกติ โทร 1669",
        ],
      },
      {
        id: "before",
        heading: "เตรียมพร้อมไว้ก่อน",
        items: [
          "ทุกอาคารที่คุณใช้เป็นประจำ ให้จำทางออกไว้อย่างน้อยสองทาง ทางหนีไฟมีป้ายสีเขียว",
          "บันทึกเบอร์ 199 ไว้ในโทรศัพท์",
          "ถ้าพบทางหนีไฟถูกปิดกั้น ถังดับเพลิงหาย หรือสัญญาณเตือนเสีย ให้แจ้งเจ้าหน้าที่คณะ",
        ],
      },
    ],
  },
};

export default fire;
