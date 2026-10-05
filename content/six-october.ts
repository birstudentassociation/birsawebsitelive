/**
 * 6 October 1976 commemoration page (`/6-october`).
 *
 * Every fact here comes from Documentation of Oct 6 (บันทึก 6 ตุลา, doct6.com),
 * the online archive of the massacre at Thammasat University, Tha Prachan, and
 * every image is served from that archive with the credit it gives. The archive
 * asks anyone who uses its material to credit it, and to ask permission before
 * any commercial use. Keep both rules if this page changes.
 */
import type { Locale } from "@/lib/i18n";

export const DOCT6 = "https://doct6.com";

export type SixOctoberImage = {
  src: string;
  width: number;
  height: number;
  /** The page on doct6.com where the image is published. */
  source: string;
  alt: Record<Locale, string>;
  caption: Record<Locale, string>;
  credit: Record<Locale, string>;
};

const unknownPhotographer: Record<Locale, string> = {
  en: "Photographer unknown. From the set Pathomporn Srimanta gave to Documentation of Oct 6 in 2017, which the archive says carries no record of photographer or owner.",
  th: "ไม่ทราบผู้ถ่ายภาพ ภาพชุดที่คุณปฐมพร ศรีมันตะ มอบให้โครงการบันทึก 6 ตุลา เมื่อปี 2560 ซึ่งโครงการระบุว่าไม่มีข้อมูลผู้ถ่ายภาพและเจ้าของ",
};

const lombard: Record<Locale, string> = {
  en: "Photograph by Frank Lombard, then a New Zealand radio reporter, who gave his colour film to Documentation of Oct 6.",
  th: "ภาพโดยแฟรงค์ ลอมบาร์ด ผู้สื่อข่าววิทยุชาวนิวซีแลนด์ในขณะนั้น ผู้มอบฟิล์มสีชุดนี้ให้โครงการบันทึก 6 ตุลา",
};

const archiveCredit: Record<Locale, string> = {
  en: "Documentation of Oct 6. The archive does not name the photographer.",
  th: "โครงการบันทึก 6 ตุลา โครงการไม่ได้ระบุชื่อผู้ถ่ายภาพ",
};

export const images = {
  gate: {
    src: "/6-october/tha-phra-chan-gate.webp",
    width: 1600,
    height: 1030,
    source: `${DOCT6}/archives/2235`,
    alt: {
      en: "A crowd stands around a city bus pushed against the Tha Prachan gate of Thammasat University.",
      th: "ฝูงชนยืนล้อมรถเมล์ที่ถูกดันเข้าชนประตูท่าพระจันทร์ มหาวิทยาลัยธรรมศาสตร์",
    },
    caption: {
      en: "The Tha Prachan gate of Thammasat University.",
      th: "บริเวณประตูท่าพระจันทร์ มหาวิทยาลัยธรรมศาสตร์",
    },
    credit: unknownPhotographer,
  },
  football: {
    src: "/6-october/football-field.webp",
    width: 1600,
    height: 977,
    source: `${DOCT6}/archives/2235`,
    alt: {
      en: "Young people walk in a line with their hands on their heads past an armed man on the Thammasat football field.",
      th: "คนหนุ่มสาวเดินเรียงแถวเอามือประสานบนศีรษะ ผ่านชายถืออาวุธในสนามฟุตบอลมหาวิทยาลัยธรรมศาสตร์",
    },
    caption: {
      en: "The football field at Thammasat University.",
      th: "บริเวณสนามฟุตบอล มหาวิทยาลัยธรรมศาสตร์",
    },
    credit: unknownPhotographer,
  },
  detained: {
    src: "/6-october/detained-students.webp",
    width: 1600,
    height: 1044,
    source: `${DOCT6}/archives/8753`,
    alt: {
      en: "Rows of students lie face down on the grass, many stripped to the waist, while police stand over them in front of parked buses.",
      th: "นักศึกษานอนคว่ำเรียงแถวบนสนามหญ้า หลายคนถูกถอดเสื้อ ตำรวจยืนคุมอยู่หน้ารถโดยสารที่จอดเรียงกัน",
    },
    caption: {
      en: "Students forced to lie face down at Thammasat on the morning of 6 October 1976.",
      th: "นักศึกษาถูกบังคับให้นอนคว่ำในมหาวิทยาลัยธรรมศาสตร์ เช้าวันที่ 6 ตุลาคม 2519",
    },
    credit: lombard,
  },
  rally: {
    src: "/6-october/royal-plaza-rally.webp",
    width: 1600,
    height: 1007,
    source: `${DOCT6}/archives/2235`,
    alt: {
      en: "A dense crowd fills the Royal Plaza in front of the Ananta Samakhom Throne Hall.",
      th: "ฝูงชนหนาแน่นเต็มลานพระบรมรูปทรงม้า หน้าพระที่นั่งอนันตสมาคม",
    },
    caption: {
      en: "A rally at the Royal Plaza.",
      th: "การชุมนุมที่ลานพระบรมรูปทรงม้า",
    },
    credit: unknownPhotographer,
  },
  scouts: {
    src: "/6-october/village-scouts.webp",
    width: 1600,
    height: 1032,
    source: `${DOCT6}/archives/2235`,
    alt: {
      en: "Village Scouts in neckerchiefs stand in a long line along a road, some holding flags.",
      th: "ลูกเสือชาวบ้านผูกผ้าพันคอยืนเรียงแถวยาวริมถนน บางคนถือธง",
    },
    caption: {
      en: "A line of Village Scouts at Wat Bowonniwet Vihara.",
      th: "แถวลูกเสือชาวบ้านบริเวณวัดบวรนิเวศวิหาร",
    },
    credit: unknownPhotographer,
  },
} satisfies Record<string, SixOctoberImage>;

export type Portrait = {
  name: Record<Locale, string>;
  src: string;
  width: number;
  height: number;
  /** The person's page on doct6.com. */
  href: string;
  about: Record<Locale, string>;
  credit: Record<Locale, string>;
};

export const portraits: Portrait[] = [
  {
    name: { en: "Wichitchai Amornkul", th: "วิชิตชัย อมรกุล" },
    src: "/6-october/wichitchai-amornkul.webp",
    width: 500,
    height: 375,
    href: `${DOCT6}/archives/8737`,
    about: {
      en: "19, a second year Political Science student at Chulalongkorn University, from Ubon Ratchathani.",
      th: "อายุ 19 ปี นิสิตชั้นปีที่ 2 คณะรัฐศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ชาวอุบลราชธานี",
    },
    credit: archiveCredit,
  },
  {
    name: { en: "Jarupong Thongsin", th: "จารุพงษ์ ทองสินธุ์" },
    src: "/6-october/jarupong-thongsin.webp",
    width: 500,
    height: 375,
    href: `${DOCT6}/archives/4102`,
    about: {
      en: "His parents, Jinda and Lim Thongsin, spent years searching for their son.",
      th: "พ่อจินดาและแม่ลิ้ม ทองสินธุ์ ใช้เวลาหลายปีพลิกแผ่นดินตามหาลูกชาย",
    },
    credit: archiveCredit,
  },
  {
    name: { en: "Supol Phan", th: "สุพล พาน" },
    src: "/6-october/supol-phan.webp",
    width: 600,
    height: 717,
    href: `${DOCT6}/archives/4085`,
    about: {
      en: "24. He was shot while trying to drive the wounded out to hospital.",
      th: "อายุ 24 ปี ถูกยิงขณะพยายามขับรถพาคนเจ็บไปส่งโรงพยาบาล",
    },
    credit: archiveCredit,
  },
  {
    name: { en: "Danaisak Iamkhong", th: "ดนัยศักดิ์ เอี่ยมคง" },
    src: "/6-october/danaisak-iamkhong.webp",
    width: 1200,
    height: 675,
    href: `${DOCT6}/archives/2442`,
    about: {
      en: "21, a Political Science student at Ramkhamhaeng University, from Nakhon Si Thammarat.",
      th: "อายุ 21 ปี นักศึกษาคณะรัฐศาสตร์ มหาวิทยาลัยรามคำแหง ชาวนครศรีธรรมราช",
    },
    credit: archiveCredit,
  },
];

/**
 * The dead as Documentation of Oct 6 lists them on its victims page, in Thai,
 * the only form the archive gives. Counted to 40, the archive's own figure.
 */
export const victims: string[] = [
  "วิชิตชัย อมรกุล",
  "อรุณี ขำบุญเกิด",
  "ปรีชา แซ่เฮีย",
  "วิมลวรรณ รุ่งทองใบสุรีย์",
  "เนาวรัตน์ ศิริรังษี",
  "ภูมิศักดิ์ ศิระศุภฤกษ์ชัย",
  "จารุพงษ์ ทองสินธุ์",
  "มนัส เศียรสิงห์",
  "สุพล พาน",
  "ดนัยศักดิ์ เอี่ยมคง",
  "อภิสิทธิ์ ไทยนิยม",
  "พงษ์พันธ์ เพรามธุรส",
  "อับดุลรอเฮง สาตา",
  "ไพบูลย์ เลาหจิรพันธ์",
  "อนุวัตร อ่างแก้ว",
  "บุนนาค สมัครสมาน",
  "อัจฉริยะ ศรีสวาท",
  "สุรสิทธิ์ สุภาภา",
  "ยุทธนา บูรศิริรักษ์",
  "กมล แก้วไกรไทย",
  "มนู วิทยาภรณ์",
  "สัมพันธ์ เจริญสุข",
  "สุวิทย์ ทองประหลาด",
  "วีระพล โอภาสวิไล",
  "สุพจน์ พันธุ์กาฬสินธุ์",
  "ภรณี จุลละครินทร์",
  "วัชรี เพชรสุ่น",
  "ชัยพร อมรโรจนาวงศ์",
  "สงวนพันธุ์ ซุ่นเซ้ง",
  "สมชาย ปิยะสกุลศักดิ์",
  "วิสุทธิ์ พงษ์พานิช",
  "ศิริพงษ์ มัณตะเสถียร",
  "วสันต์ บุญรักษ์",
];

export type Moment = { time: string; text: string };
export type Day = { heading: string; moments: Moment[] };

export type SixOctoberCopy = {
  title: string;
  lede: string;
  metaDescription: string;
  breadcrumb: string;
  contentNote: string;
  remembranceHeading: string;
  remembrance: string[];
  backgroundHeading: string;
  background: string[];
  timelineHeading: string;
  timelineIntro: string;
  timeCol: string;
  eventCol: string;
  days: Day[];
  afterHeading: string;
  after: string[];
  deadHeading: string;
  deadIntro: string;
  figures: { value: string; label: string }[];
  figuresNote: string;
  portraitsHeading: string;
  readMoreAbout: string;
  namesHeading: string;
  namesIntro: string;
  unnamed: string[];
  namesSource: string;
  learnHeading: string;
  learnIntro: string;
  learnLinks: { label: string; href: string }[];
  creditsHeading: string;
  creditsIntro: string;
  creditsTerms: string;
  photoSource: string;
};

export const copy: Record<Locale, SixOctoberCopy> = {
  en: {
    title: "6 October 1976",
    lede: "On the morning of 6 October 1976, police and armed civilians attacked students and members of the public at Thammasat University, Tha Prachan. We remember the people they killed.",
    metaDescription:
      "Remembering the 6 October 1976 massacre at Thammasat University, Tha Prachan, with what happened, who died and where to learn more.",
    breadcrumb: "6 October 1976",
    contentNote:
      "This page describes killing and violence against students. It contains historical photographs of the morning, but none that show the dead.",
    remembranceHeading: "Fifty years on",
    remembrance: [
      "Thousands of students and members of the public had gathered on our campus to protest the return of a former dictator. Before dawn, police surrounded the university and opened fire. By the end of the morning dozens were dead and more than 3,000 had been arrested. That evening the military seized power.",
      "No one has ever been prosecuted for the killings. For decades many of the dead were remembered only as a number, and some still have no name. Tha Prachan is where we study now. It is also where this happened.",
    ],
    backgroundHeading: "How it came to this",
    background: [
      "The student uprising of 14 October 1973 forced Field Marshal Thanom Kittikachorn and his allies out of power and began three years of open, democratic politics. Right wing groups grew in response. They included the Village Scouts, the Red Gaurs and Nawaphon, and they were backed by parts of the state.",
      "On 19 September 1976 Thanom returned to Thailand as a novice monk and was ordained at Wat Bowonniwet. Students and workers protested. On 24 September two electricity workers putting up posters against his return were beaten to death and hanged in Nakhon Pathom.",
      "On 4 October students at Thammasat staged a play at Lan Pho that re-enacted the Nakhon Pathom hanging. The next day the Dao Siam newspaper printed a photograph of the play and accused the students of insulting the monarchy. Yan Kreua army radio and the Free Radio Association repeated the accusation through the night and called on people to gather.",
    ],
    timelineHeading: "What happened",
    timelineIntro:
      "These times come from the timeline that Documentation of Oct 6 compiled from records of the day.",
    timeCol: "Time",
    eventCol: "What happened",
    days: [
      {
        heading: "Tuesday 5 October",
        moments: [
          {
            time: "10.00",
            text: "Yan Kreua radio tells listeners the protest at Thammasat is no longer about Thanom but an insult to the monarchy.",
          },
          {
            time: "13.30",
            text: "Ramkhamhaeng University students set out for Thammasat in 25 vehicles.",
          },
          {
            time: "Evening",
            text: "Tens of thousands rally on the Thammasat football field.",
          },
          {
            time: "20.35",
            text: "The Free Radio Association calls the people at Thammasat troublemakers and warns there may be bloodshed.",
          },
          {
            time: "21.30",
            text: "The National Student Centre of Thailand presents the two actors to the press and explains the play.",
          },
          {
            time: "Night",
            text: "The radio stations broadcast all night, calling Village Scouts and others to gather at the Royal Plaza.",
          },
        ],
      },
      {
        heading: "Wednesday 6 October",
        moments: [
          {
            time: "01.40",
            text: "About 100 people burn posters at the Sanam Luang gate. The first shot is fired.",
          },
          {
            time: "04.00",
            text: "Border Patrol Police arrive from Hua Hin and surround the university from the Sanam Luang side.",
          },
          {
            time: "05.30",
            text: "An M79 grenade fired from outside lands in the crowd on the football field and kills four people.",
          },
          {
            time: "07.00",
            text: "Police pour heavy fire into the university from the Great Hall and the National Museum. Outside, a crowd rams the gate with two buses.",
          },
          {
            time: "08.25",
            text: "Border Patrol Police enter the university. Some of those who run out are attacked by the crowd outside.",
          },
          {
            time: "10.30",
            text: "Police force students to lie face down, strip many of them, and take more than 3,000 away by bus and truck.",
          },
          {
            time: "12.30",
            text: "Tens of thousands of Village Scouts and others rally at the Royal Plaza and demand the removal of four ministers.",
          },
          {
            time: "18.00",
            text: "Admiral Sangad Chaloryu announces that the National Administrative Reform Council has seized power.",
          },
        ],
      },
    ],
    afterHeading: "What came after",
    after: [
      "Police arrested 3,094 people on 6 October, 2,432 men and 662 women. A military court later charged 18 of them. They spent almost two years in custody before an amnesty freed them on 16 September 1978.",
      "The coup group installed Thanin Kraivichien as prime minister. His government banned books, and many students fled to the jungle. No one who took part in the killings was ever arrested. Some were praised as defenders of the nation.",
    ],
    deadHeading: "The people who died",
    deadIntro:
      "Nobody knows exactly how many people died. The figures do not agree, and Documentation of Oct 6 explains why.",
    figures: [
      { value: "39", label: "dead in the government's official figures" },
      { value: "46", label: "dead at least, in the police autopsy reports" },
      { value: "40", label: "dead in the count kept by Documentation of Oct 6" },
      { value: "3,094", label: "people arrested that day" },
    ],
    figuresNote:
      "The autopsy reports include five officials and one man who died in prison in January 1977. The archive leaves him out of its own count of 40, and includes a student who died of her wounds in December 1976. Others estimate the dead in the hundreds.",
    portraitsHeading: "Some of those we remember",
    readMoreAbout: "Read about",
    namesHeading: "Their names",
    namesIntro: "Documentation of Oct 6 gives these names in Thai.",
    unnamed: [
      "Three men whose names are still unknown",
      "Four people whose burned bodies were never identified",
    ],
    namesSource: "Names from the victims page of Documentation of Oct 6",
    learnHeading: "Learn more",
    learnIntro:
      "Documentation of Oct 6 collects the evidence of the massacre so that it cannot be forgotten. Most of its material is in Thai.",
    learnLinks: [
      { label: "The full timeline", href: `${DOCT6}/learn-about/timeline` },
      { label: "How 6 October happened", href: `${DOCT6}/learn-about/how` },
      { label: "The victims of the violence", href: `${DOCT6}/remember/victims` },
      { label: "The evidence archive", href: `${DOCT6}/documents` },
      { label: "Share a document or memory", href: `${DOCT6}/contribute` },
    ],
    creditsHeading: "Sources and credits",
    creditsIntro:
      "Every fact and photograph on this page comes from Documentation of Oct 6 (บันทึก 6 ตุลา, doct6.com). Each photograph links to the page where the archive publishes it.",
    creditsTerms:
      "The archive shares its material for education and the public interest and asks that it be credited. Ask the archive, or the families of the dead, before any commercial use.",
    photoSource: "View on doct6.com",
  },
  th: {
    title: "6 ตุลา 2519",
    lede: "เช้าวันที่ 6 ตุลาคม 2519 ตำรวจและกลุ่มพลเรือนติดอาวุธเข้าทำร้ายนักศึกษาและประชาชนในมหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ เราระลึกถึงทุกชีวิตที่สูญเสียไป",
    metaDescription:
      "ระลึกถึงเหตุการณ์ล้อมปราบและสังหารหมู่ 6 ตุลา 2519 ที่มหาวิทยาลัยธรรมศาสตร์ ท่าพระจันทร์ ว่าเกิดอะไรขึ้น ใครเสียชีวิต และอ่านต่อได้ที่ไหน",
    breadcrumb: "6 ตุลา 2519",
    contentNote:
      "หน้านี้กล่าวถึงการสังหารและความรุนแรงต่อนักศึกษา มีภาพถ่ายทางประวัติศาสตร์ของเช้าวันนั้น แต่ไม่มีภาพผู้เสียชีวิต",
    remembranceHeading: "ครบ 50 ปี",
    remembrance: [
      "นักศึกษาและประชาชนนับหมื่นคนชุมนุมในรั้วธรรมศาสตร์เพื่อคัดค้านการกลับเข้าประเทศของอดีตผู้นำเผด็จการ ก่อนฟ้าสาง ตำรวจเข้าล้อมมหาวิทยาลัยและยิงเข้าใส่ ถึงสิ้นเช้าวันนั้นมีผู้เสียชีวิตหลายสิบคน และมีผู้ถูกจับกุมกว่า 3,000 คน ค่ำวันเดียวกัน ทหารยึดอำนาจ",
      "ยังไม่มีผู้ใดถูกดำเนินคดีจากการสังหารครั้งนั้น หลายสิบปีที่ผ่านมา ผู้เสียชีวิตจำนวนมากถูกจดจำเป็นเพียงตัวเลข และบางคนยังไม่มีใครรู้ชื่อ ท่าพระจันทร์คือที่เรียนของเราในวันนี้ และเป็นสถานที่เกิดเหตุครั้งนั้นด้วย",
    ],
    backgroundHeading: "ย้อนดูที่มา",
    background: [
      "การลุกฮือของนักศึกษาประชาชนเมื่อ 14 ตุลาคม 2516 ทำให้จอมพลถนอม กิตติขจรและพวกพ้องหมดอำนาจ และเปิดทางให้การเมืองแบบประชาธิปไตยดำเนินมาสามปี ขณะเดียวกันกลุ่มฝ่ายขวาก็เติบโตขึ้น ทั้งลูกเสือชาวบ้าน กระทิงแดง และนวพล โดยมีหน่วยงานรัฐบางส่วนหนุนหลัง",
      "วันที่ 19 กันยายน 2519 จอมพลถนอมเดินทางกลับประเทศในฐานะสามเณร และบวชที่วัดบวรนิเวศวิหาร นักศึกษาและกรรมกรออกมาคัดค้าน วันที่ 24 กันยายน พนักงานการไฟฟ้าสองคนที่ติดโปสเตอร์ต่อต้านการกลับมาของเขาที่จังหวัดนครปฐมถูกทุบตีจนเสียชีวิตและถูกแขวนคอ",
      "วันที่ 4 ตุลาคม นักศึกษาธรรมศาสตร์แสดงละครแขวนคอที่ลานโพธิ์ เพื่อสะท้อนเหตุการณ์ที่นครปฐม วันรุ่งขึ้นหนังสือพิมพ์ดาวสยามตีพิมพ์ภาพการแสดงและกล่าวหาว่านักศึกษาหมิ่นพระบรมเดชานุภาพ วิทยุยานเกราะและชมรมวิทยุเสรีออกอากาศซ้ำข้อกล่าวหานี้ตลอดคืน พร้อมเรียกร้องให้ประชาชนมารวมตัวกัน",
    ],
    timelineHeading: "เหตุการณ์ในวันนั้น",
    timelineIntro:
      "เวลาเหล่านี้มาจากลำดับเหตุการณ์ที่โครงการบันทึก 6 ตุลา รวบรวมจากบันทึกของวันนั้น",
    timeCol: "เวลา",
    eventCol: "เหตุการณ์",
    days: [
      {
        heading: "วันอังคารที่ 5 ตุลาคม",
        moments: [
          {
            time: "10.00 น.",
            text: "วิทยุยานเกราะแถลงว่าการชุมนุมที่ธรรมศาสตร์ไม่ใช่เรื่องจอมพลถนอมอีกต่อไป แต่เป็นการหมิ่นพระบรมเดชานุภาพ",
          },
          {
            time: "13.30 น.",
            text: "นักศึกษามหาวิทยาลัยรามคำแหงออกเดินทางไปธรรมศาสตร์ด้วยรถ 25 คัน",
          },
          {
            time: "ช่วงค่ำ",
            text: "ประชาชนหลายหมื่นคนชุมนุมกันที่สนามฟุตบอลธรรมศาสตร์",
          },
          {
            time: "20.35 น.",
            text: "ชมรมวิทยุเสรีเรียกผู้ชุมนุมที่ธรรมศาสตร์ว่าผู้ก่อความไม่สงบ และเตือนว่าอาจมีการนองเลือด",
          },
          {
            time: "21.30 น.",
            text: "ศูนย์กลางนิสิตนักศึกษาแห่งประเทศไทย (ศนท.) พานักแสดงทั้งสองคนพบสื่อมวลชนและชี้แจงเรื่องละคร",
          },
          {
            time: "ตลอดคืน",
            text: "สถานีวิทยุออกอากาศตลอดคืน เรียกลูกเสือชาวบ้านและประชาชนให้ไปรวมตัวกันที่ลานพระบรมรูปทรงม้า",
          },
        ],
      },
      {
        heading: "วันพุธที่ 6 ตุลาคม",
        moments: [
          {
            time: "01.40 น.",
            text: "ราว 100 คนเผาโปสเตอร์ที่หน้าประตูฝั่งสนามหลวง มีการยิงปืนนัดแรก",
          },
          {
            time: "04.00 น.",
            text: "ตำรวจตระเวนชายแดน (ตชด.) จากหัวหินมาถึงและวางกำลังล้อมมหาวิทยาลัยจากฝั่งสนามหลวง",
          },
          {
            time: "05.30 น.",
            text: "ระเบิด M79 ที่ยิงมาจากนอกมหาวิทยาลัยตกกลางกลุ่มคนที่สนามฟุตบอล มีผู้เสียชีวิต 4 คน",
          },
          {
            time: "07.00 น.",
            text: "ตำรวจระดมยิงเข้าไปในมหาวิทยาลัยจากหอประชุมใหญ่และพิพิธภัณฑสถานแห่งชาติ ส่วนฝูงชนด้านนอกใช้รถเมล์สองคันพุ่งชนประตู",
          },
          {
            time: "08.25 น.",
            text: "ตชด. บุกเข้าไปในมหาวิทยาลัย ผู้ที่วิ่งหนีออกมาบางส่วนถูกฝูงชนด้านนอกทำร้าย",
          },
          {
            time: "10.30 น.",
            text: "ตำรวจบังคับนักศึกษาให้นอนคว่ำ ถอดเสื้อผ้าหลายคน แล้วนำตัวกว่า 3,000 คนไปด้วยรถบัสและรถบรรทุก",
          },
          {
            time: "12.30 น.",
            text: "ลูกเสือชาวบ้านและประชาชนหลายหมื่นคนชุมนุมที่ลานพระบรมรูปทรงม้า เรียกร้องให้ปลดรัฐมนตรี 4 คน",
          },
          {
            time: "18.00 น.",
            text: "พลเรือเอกสงัด ชลออยู่ ประกาศว่าคณะปฏิรูปการปกครองแผ่นดินยึดอำนาจแล้ว",
          },
        ],
      },
    ],
    afterHeading: "หลังเหตุการณ์",
    after: [
      "ตำรวจจับกุมผู้ชุมนุมได้ 3,094 คนในวันที่ 6 ตุลาคม เป็นชาย 2,432 คน หญิง 662 คน ต่อมาศาลทหารตั้งข้อหากับ 18 คนในจำนวนนั้น พวกเขาถูกคุมขังเกือบสองปี จนได้รับการนิรโทษกรรมเมื่อ 16 กันยายน 2521",
      "คณะผู้ยึดอำนาจตั้งธานินทร์ กรัยวิเชียรเป็นนายกรัฐมนตรี รัฐบาลของเขาสั่งห้ามหนังสือหลายเล่ม นักศึกษาจำนวนมากหนีเข้าป่า ไม่มีผู้ร่วมสังหารคนใดถูกจับกุม และบางคนได้รับการยกย่องว่าเป็นผู้พิทักษ์ชาติ",
    ],
    deadHeading: "ผู้เสียชีวิต",
    deadIntro:
      "ไม่มีใครทราบจำนวนผู้เสียชีวิตที่แน่นอน ตัวเลขจากแต่ละแหล่งไม่ตรงกัน และโครงการบันทึก 6 ตุลา อธิบายสาเหตุไว้แล้ว",
    figures: [
      { value: "39", label: "ผู้เสียชีวิตตามตัวเลขทางการของรัฐบาล" },
      { value: "46", label: "ผู้เสียชีวิตเป็นอย่างน้อย ตามรายงานชันสูตรศพของตำรวจ" },
      { value: "40", label: "ผู้เสียชีวิตตามการนับของโครงการบันทึก 6 ตุลา" },
      { value: "3,094", label: "ผู้ถูกจับกุมในวันนั้น" },
    ],
    figuresNote:
      "รายงานชันสูตรรวมเจ้าหน้าที่ 5 นาย และชายอีก 1 คนที่เสียชีวิตในเรือนจำเมื่อเดือนมกราคม 2520 โครงการไม่นับชายคนนี้ในตัวเลข 40 แต่นับนักศึกษาหญิงที่เสียชีวิตจากบาดแผลเมื่อเดือนธันวาคม 2519 ขณะที่บางฝ่ายประเมินว่าผู้เสียชีวิตมีหลายร้อยคน",
    portraitsHeading: "ส่วนหนึ่งของผู้ที่เราระลึกถึง",
    readMoreAbout: "อ่านเรื่องของ",
    namesHeading: "รายชื่อ",
    namesIntro: "รายชื่อตามที่โครงการบันทึก 6 ตุลา บันทึกไว้",
    unnamed: ["ชาย 3 คนที่ยังไม่ทราบชื่อ", "ผู้เสียชีวิต 4 คนที่ร่างถูกเผา และยังระบุตัวตนไม่ได้"],
    namesSource: "รายชื่อจากหน้าผู้เสียชีวิตของโครงการบันทึก 6 ตุลา",
    learnHeading: "ศึกษาเพิ่มเติม",
    learnIntro:
      "โครงการบันทึก 6 ตุลา รวบรวมหลักฐานของการสังหารหมู่ครั้งนี้ไว้ เพื่อไม่ให้เรื่องนี้ถูกลืม",
    learnLinks: [
      { label: "ลำดับเหตุการณ์ฉบับเต็ม", href: `${DOCT6}/learn-about/timeline` },
      { label: "เหตุการณ์ 6 ตุลาเกิดขึ้นได้อย่างไร", href: `${DOCT6}/learn-about/how` },
      { label: "ผู้เสียชีวิตจากความรุนแรง", href: `${DOCT6}/remember/victims` },
      { label: "คลังเอกสารหลักฐาน", href: `${DOCT6}/documents` },
      { label: "ส่งเอกสารหรือความทรงจำ", href: `${DOCT6}/contribute` },
    ],
    creditsHeading: "แหล่งที่มาและเครดิต",
    creditsIntro:
      "ข้อเท็จจริงและภาพถ่ายทุกภาพในหน้านี้มาจากโครงการบันทึก 6 ตุลา (Documentation of Oct 6, doct6.com) ภาพแต่ละภาพมีลิงก์ไปยังหน้าที่โครงการเผยแพร่ภาพนั้น",
    creditsTerms:
      "โครงการเผยแพร่ข้อมูลเพื่อการศึกษาและประโยชน์สาธารณะ และขอให้อ้างอิงแหล่งที่มา หากจะนำไปใช้เชิงพาณิชย์ ต้องขออนุญาตโครงการหรือครอบครัวผู้เสียชีวิตก่อน",
    photoSource: "ดูที่ doct6.com",
  },
};
