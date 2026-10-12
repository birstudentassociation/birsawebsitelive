import Image from "next/image";
import type { Locale } from "@/lib/i18n";

type ThaiQrPaymentProps = {
  src: string;
  name: string;
  bank: string;
  locale: Locale;
};

const copy = {
  en: { alt: (name: string) => `Thai QR PromptPay code that pays ${name}` },
  th: { alt: (name: string) => `คิวอาร์โค้ดพร้อมเพย์สำหรับโอนเงินให้ ${name}` },
} as const;

export default function ThaiQrPayment({ src, name, bank, locale }: ThaiQrPaymentProps) {
  return (
    <figure className="mx-auto my-6 w-full max-w-[16rem] overflow-hidden rounded-lg border border-line-strong bg-white text-[#113566] shadow-sm">
      <div className="flex items-center justify-center gap-2 bg-[#113566] px-4 py-2 text-white">
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none">
          <rect x="1" y="1" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
          <path d="M6 10h8M10 6v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-xs leading-tight font-bold tracking-wide">
          THAI QR
          <br />
          PAYMENT
        </span>
      </div>
      <div className="flex flex-col items-center gap-3 px-6 pt-4 pb-5">
        <span className="rounded border-2 border-[#113566] px-2 text-sm font-bold">PromptPay</span>
        <Image
          unoptimized
          src={src}
          alt={copy[locale].alt(name)}
          width={180}
          height={180}
          style={{ border: 0, borderRadius: 0 }}
        />
        <figcaption className="text-center text-sm font-semibold text-[#211c19]">{name}</figcaption>
      </div>
      <div className="border-t border-[#e6dccb] bg-[#f5f5f5] px-4 py-2 text-xs font-semibold text-[#1e4598]">
        {bank}
      </div>
    </figure>
  );
}
