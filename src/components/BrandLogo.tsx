import logo from "@/assets/dgp-logo.png";

type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, string> = {
  sm: "h-7",
  md: "h-8",
  lg: "h-10",
};

interface BrandLogoProps {
  size?: Size;
  className?: string;
}

export function BrandLogo({ size = "md", className = "" }: BrandLogoProps) {
  return (
    <img
      src={logo}
      alt="Don't Get Pickled — Warm Up App"
      className={`${sizeMap[size]} w-auto select-none ${className}`}
      draggable={false}
    />
  );
}

export default BrandLogo;
