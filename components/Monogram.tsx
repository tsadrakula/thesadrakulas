type MonogramProps = {
  size?: number;
  color?: string;
};

export function Monogram({ size = 80, color = "currentColor" }: MonogramProps) {
  const w = size * 2.4;
  const h = size * 0.95;
  const displayFont = "var(--ff-display)";

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 460 180"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      aria-label="The Sadrakulas"
    >
      <text
        x="230"
        y="62"
        fontSize="40"
        textAnchor="middle"
        fontFamily={displayFont}
        fontStyle="italic"
        fontWeight="400"
        style={{ fontVariationSettings: '"opsz" 96' }}
      >
        the
      </text>
      <line x1="80" y1="86" x2="170" y2="86" stroke={color} strokeWidth="0.6" />
      <line x1="290" y1="86" x2="380" y2="86" stroke={color} strokeWidth="0.6" />
      <text
        x="230"
        y="138"
        fontSize="46"
        textAnchor="middle"
        fontFamily={displayFont}
        fontWeight="500"
        letterSpacing="6"
        style={{ fontVariationSettings: '"opsz" 96' }}
      >
        SADRAKULAS
      </text>
    </svg>
  );
}
