import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return <Image src="/images/logo-white.png" alt="" width={143} height={105} className={className} />;
}
