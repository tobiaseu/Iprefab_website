import Image from "next/image";

export default function Logo({ className, tone = "white" }: { className?: string; tone?: "white" | "navy" }) {
  return <Image src={`/images/logo-${tone}.png`} alt="" width={143} height={105} className={className} />;
}
