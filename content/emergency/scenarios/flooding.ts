import type { EmergencyScenario } from "@/content/emergency/types";

const flooding: EmergencyScenario = {
  id: "flooding",
  severity: "warning",
  en: {
    bannerMessage:
      "Severe flooding is affecting the Tha Prachan area. Move to higher ground and avoid floodwater.",
    title: "Severe Flooding",
    lede: "Tha Prachan campus sits on the bank of the Chao Phraya River, so heavy monsoon rain and high river tides can flood roads and low-lying areas with little warning.",
    immediateActions: [
      "Move yourself and your belongings to higher ground or an upper floor immediately, especially electronics, documents, and anything that cannot get wet.",
      "Do not walk, cycle, or drive through moving floodwater. Just 15 cm of moving water can knock you off your feet, and 30 cm can sweep away a car.",
      "Stay away from electrical outlets, switches, and appliances that are wet or standing in water.",
      "Check official channels (Thammasat University announcements, BMA, Thai Meteorological Department) before heading to or leaving campus.",
      "If you are told to evacuate by university staff or emergency officials, follow their instructions right away.",
    ],
    sections: [
      {
        heading: "If you are inside a building",
        items: [
          "Move to an upper floor if water is rising. Unplug electrical equipment before it comes into contact with water, but do not touch switches or sockets if you are standing in water or the equipment is already wet.",
          "Keep drinking water and a charged phone with you.",
          "Avoid lifts. If the power is cut, use stairs.",
        ],
      },
      {
        heading: "If you are outside or travelling to campus",
        items: [
          "Turn back if a road, underpass, or path is flooded. Floodwater hides open drains, sharp debris, and displaced manhole covers, and it may be contaminated with sewage.",
          "Avoid riverbanks and low-lying streets near Tha Prachan, Tha Chang, and Sanam Luang during high tide periods or heavy rain, as these are known to flood first.",
          "If your vehicle stalls in water, leave it and move to higher ground rather than staying inside.",
        ],
      },
      {
        heading: "Evacuating safely",
        items: [
          "Take only essential items: phone, charger, ID, medication, some cash.",
          "Use stairs, not lifts.",
          "Follow marshals or university staff to the designated safe area. If none has been announced, move to the highest accessible floor of a sturdy building and wait for instructions.",
          "Help classmates who need assistance, including those with mobility needs.",
        ],
      },
      {
        heading: "Before it worsens",
        items: [
          "Follow official flood warnings from the Bangkok Metropolitan Administration (BMA) and the Thai Meteorological Department. The BMA real-time flood monitoring map (weather.bangkok.go.th/Flood) and the ThaiWater app (thaiwater.net) show current water levels and rain forecasts.",
          "Charge your phone and power bank in advance of forecast heavy rain or high tides.",
          "Keep valuables and electronics off the floor, especially in ground-floor rooms.",
        ],
      },
      {
        heading: "After it passes",
        items: [
          "Do not enter floodwater to retrieve belongings. It can be contaminated with sewage and carries a real risk of diseases such as diarrhoeal illness and skin infections.",
          "Wash your hands thoroughly and avoid touching your face after any contact with floodwater. Clean any wounds that touched floodwater and watch for signs of infection.",
          "Do not drink or prepare food with water that may have been contaminated. Use bottled or boiled water until authorities confirm tap water is safe.",
          "Check university announcements before returning to campus, since classes and building access may be suspended or changed.",
        ],
      },
      {
        heading: "For international students",
        items: [
          "Save the BMA hotline (1555) and Thai emergency numbers in your phone now, before an emergency happens.",
          "If you do not read Thai, follow the English-language Thammasat University announcements and ask a Thai-speaking classmate or the BIRSA group chat to help interpret local news and warnings.",
          "Embassies sometimes issue their own flood advisories. Know how to contact your embassy in Bangkok.",
        ],
      },
    ],
    extraContacts: [
      { label: "BMA flood and drainage hotline", value: "1555 (24 hours)", href: "tel:1555" },
      {
        label: "BMA flood control centre (Bangkok's main flood prevention centre)",
        value: "02-248-5115",
        href: "tel:0224851115",
      },
      { label: "BMA real-time flood monitoring map", value: "weather.bangkok.go.th/Flood" },
      { label: "ThaiWater water-level and rain forecast app", value: "thaiwater.net" },
    ],
  },
  th: {
    bannerMessage: "ขณะนี้เกิดน้ำท่วมหนักบริเวณท่าพระจันทร์ ให้รีบขึ้นที่สูงและหลีกเลี่ยงน้ำท่วม",
    title: "น้ำท่วมรุนแรง",
    lede: "มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ ตั้งอยู่ริมแม่น้ำเจ้าพระยา ฝนตกหนักช่วงมรสุมและน้ำขึ้นสูงจึงอาจทำให้ถนนและพื้นที่ลุ่มต่ำเกิดน้ำท่วมได้อย่างรวดเร็ว นี่คือสิ่งที่ควรทำเพื่อความปลอดภัย",
    immediateActions: [
      "ขนย้ายตัวเองและสิ่งของขึ้นที่สูงหรือชั้นบนทันที โดยเฉพาะอุปกรณ์อิเล็กทรอนิกส์ เอกสารสำคัญ และของที่โดนน้ำไม่ได้",
      "ห้ามเดิน ปั่นจักรยาน หรือขับรถผ่านน้ำที่ไหลแรง น้ำสูงเพียง 15 เซนติเมตรที่ไหลแรงก็สามารถทำให้คนล้มได้ และน้ำสูง 30 เซนติเมตรสามารถพัดรถยนต์ลอยได้",
      "อย่าเข้าใกล้ปลั๊กไฟ สวิตช์ไฟ หรือเครื่องใช้ไฟฟ้าที่เปียกหรือแช่น้ำอยู่",
      "ติดตามประกาศจากมหาวิทยาลัยธรรมศาสตร์ กรุงเทพมหานคร (กทม.) และกรมอุตุนิยมวิทยา ก่อนเดินทางมาหรือออกจากมหาวิทยาลัย",
      "หากเจ้าหน้าที่มหาวิทยาลัยหรือหน่วยงานที่เกี่ยวข้องสั่งอพยพ ให้ปฏิบัติตามทันที",
    ],
    sections: [
      {
        heading: "หากอยู่ในอาคาร",
        items: [
          "ให้ขึ้นไปชั้นบนหากระดับน้ำกำลังสูงขึ้น ถอดปลั๊กเครื่องใช้ไฟฟ้าก่อนที่น้ำจะท่วมถึง แต่ห้ามแตะสวิตช์หรือปลั๊กไฟหากกำลังยืนแช่น้ำอยู่หรืออุปกรณ์เปียกแล้ว",
          "เตรียมน้ำดื่มและโทรศัพท์ที่ชาร์จแบตเต็มติดตัวไว้",
          "หลีกเลี่ยงการใช้ลิฟต์ หากไฟดับให้ใช้บันได",
        ],
      },
      {
        heading: "หากอยู่นอกอาคารหรือกำลังเดินทางมามหาวิทยาลัย",
        items: [
          "หากพบว่าถนน ทางลอด หรือเส้นทางมีน้ำท่วม ให้กลับรถหรือเลี่ยงเส้นทางทันที เพราะน้ำท่วมอาจซ่อนท่อระบายน้ำที่เปิดอยู่ เศษวัสดุมีคม หรือฝาท่อที่หลุด และอาจปนเปื้อนสิ่งปฏิกูล",
          "หลีกเลี่ยงริมแม่น้ำและถนนที่ลุ่มต่ำบริเวณท่าพระจันทร์ ท่าช้าง และสนามหลวง ในช่วงน้ำขึ้นสูงหรือฝนตกหนัก เพราะเป็นจุดที่มักท่วมก่อนพื้นที่อื่น",
          "หากรถดับขณะอยู่ในน้ำ ให้ทิ้งรถแล้วรีบขึ้นที่สูง อย่านั่งอยู่ในรถ",
        ],
      },
      {
        heading: "การอพยพอย่างปลอดภัย",
        items: [
          "พกเฉพาะของจำเป็น เช่น โทรศัพท์ สายชาร์จ บัตรประจำตัว ยาประจำตัว และเงินสดจำนวนหนึ่ง",
          "ใช้บันได ห้ามใช้ลิฟต์",
          "ปฏิบัติตามเจ้าหน้าที่หรืออาสาสมัครไปยังจุดปลอดภัยที่กำหนด หากยังไม่มีการประกาศจุดรวมพล ให้ขึ้นไปยังชั้นที่สูงที่สุดที่เข้าถึงได้ของอาคารที่แข็งแรง แล้วรอฟังคำแนะนำ",
          "ช่วยเหลือเพื่อนที่ต้องการความช่วยเหลือ รวมถึงผู้ที่เคลื่อนไหวลำบาก",
        ],
      },
      {
        heading: "ก่อนสถานการณ์จะเลวร้ายลง",
        items: [
          "ติดตามประกาศเตือนภัยน้ำท่วมอย่างเป็นทางการจากกรุงเทพมหานครและกรมอุตุนิยมวิทยา แผนที่ติดตามน้ำท่วมแบบเรียลไทม์ของ กทม. (weather.bangkok.go.th/Flood) และแอปพลิเคชัน ThaiWater (thaiwater.net) แสดงระดับน้ำและพยากรณ์ฝนปัจจุบัน",
          "ชาร์จโทรศัพท์และพาวเวอร์แบงก์ให้เต็มล่วงหน้า เมื่อมีพยากรณ์ฝนตกหนักหรือน้ำขึ้นสูง",
          "เก็บของมีค่าและอุปกรณ์อิเล็กทรอนิกส์ให้พ้นจากพื้น โดยเฉพาะห้องที่อยู่ชั้นล่าง",
        ],
      },
      {
        heading: "หลังน้ำลด",
        items: [
          "อย่าลงไปในน้ำท่วมเพื่อเก็บของ เพราะน้ำอาจปนเปื้อนสิ่งปฏิกูลและมีความเสี่ยงต่อโรคจริง เช่น โรคท้องร่วงและการติดเชื้อทางผิวหนัง",
          "ล้างมือให้สะอาดและหลีกเลี่ยงการสัมผัสใบหน้าหลังสัมผัสน้ำท่วม หากมีบาดแผลที่โดนน้ำท่วม ให้ทำความสะอาดแผลและสังเกตอาการติดเชื้อ",
          "อย่าดื่มหรือใช้น้ำที่อาจปนเปื้อนในการประกอบอาหาร ใช้น้ำดื่มบรรจุขวดหรือน้ำต้มสุกจนกว่าหน่วยงานจะยืนยันว่าน้ำประปาปลอดภัย",
          "ตรวจสอบประกาศของมหาวิทยาลัยก่อนกลับเข้ามหาวิทยาลัย เนื่องจากการเรียนการสอนและการเข้าใช้อาคารอาจถูกระงับหรือเปลี่ยนแปลง",
        ],
      },
      {
        heading: "สำหรับนักศึกษาต่างชาติ",
        items: [
          "บันทึกเบอร์สายด่วน กทม. (1555) และเบอร์ฉุกเฉินของไทยไว้ในโทรศัพท์ตั้งแต่วันนี้ ก่อนเกิดเหตุฉุกเฉิน",
          "หากอ่านภาษาไทยไม่ได้ ให้ติดตามประกาศภาษาอังกฤษของมหาวิทยาลัยธรรมศาสตร์ และขอให้เพื่อนที่พูดไทยได้หรือกลุ่มแชทของ BIRSA ช่วยแปลข่าวสารและคำเตือนในพื้นที่",
          "บางครั้งสถานทูตจะออกประกาศเตือนภัยน้ำท่วมของตนเอง ควรทราบวิธีติดต่อสถานทูตของท่านในกรุงเทพฯ ไว้ล่วงหน้า",
        ],
      },
    ],
    extraContacts: [
      {
        label: "สายด่วนน้ำท่วมและระบายน้ำ กทม.",
        value: "1555 (ตลอด 24 ชั่วโมง)",
        href: "tel:1555",
      },
      {
        label: "ศูนย์ควบคุมระบบป้องกันน้ำท่วมหลัก กทม.",
        value: "02-248-5115",
        href: "tel:0224851115",
      },
      { label: "แผนที่ติดตามน้ำท่วมแบบเรียลไทม์ของ กทม.", value: "weather.bangkok.go.th/Flood" },
      { label: "แอปพลิเคชันติดตามระดับน้ำและพยากรณ์ฝน ThaiWater", value: "thaiwater.net" },
    ],
  },
};

export default flooding;
