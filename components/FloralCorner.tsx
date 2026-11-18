import type { CSSProperties } from "react";

export function FloralCorner({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={`floral-corner ${className}`} style={style} viewBox="0 0 290 290" fill="none" aria-hidden="true">
      <g stroke="#6b735d" strokeWidth="1.55" strokeLinecap="round" opacity=".86">
        <path d="M12 256C60 203 48 125 102 75 140 37 198 47 272 19"/>
        <path d="M16 277C84 216 69 159 141 116 191 86 231 101 281 66"/>
        <path d="M53 220c-12-34-32-40-41-40M80 159c-24-22-30-45-26-67M127 100c-5-28 4-45 20-60M173 56c18 2 32-9 41-24"/>
        <path d="M45 217c-3-21 7-35 26-39 1 19-8 33-26 39ZM74 171c-26-3-38-17-39-37 22 2 33 14 39 37ZM108 111c-20-20-19-38-11-55 18 14 22 31 11 55ZM153 70c5-24 19-34 38-37-2 21-15 34-38 37ZM211 45c13 4 30-1 45-14-18-8-34-4-45 14Z" fill="#8b9179" fillOpacity=".46"/>
        <path d="M29 253c18-7 36-7 51 1-13 14-34 15-51-1ZM90 156c18-3 34 4 45 20-19 6-37-2-45-20ZM158 109c19-6 37-1 51 13-18 9-36 4-51-13ZM222 75c12-12 29-16 44-9-10 16-24 19-44 9Z" fill="#7f8972" fillOpacity=".4"/>
      </g>
      <g transform="translate(63 62)" stroke="#8c7860" strokeWidth="1.35">
        <g fill="#e9e0d5">
          <ellipse cx="0" cy="-33" rx="18" ry="33" transform="rotate(-5)"/>
          <ellipse cx="0" cy="-33" rx="18" ry="33" transform="rotate(60)"/>
          <ellipse cx="0" cy="-33" rx="18" ry="33" transform="rotate(120)"/>
          <ellipse cx="0" cy="-33" rx="18" ry="33" transform="rotate(180)"/>
          <ellipse cx="0" cy="-33" rx="18" ry="33" transform="rotate(240)"/>
          <ellipse cx="0" cy="-33" rx="18" ry="33" transform="rotate(300)"/>
        </g>
        <circle r="22" fill="#d7c3b1"/><circle r="14" fill="#eadbd0"/><circle r="6" fill="#b6a18e"/>
      </g>
      <g transform="translate(190 39) scale(.64)" stroke="#8c7860" strokeWidth="1.5" fill="#eee7da">
        <ellipse cy="-25" rx="15" ry="28"/><ellipse cy="-25" rx="15" ry="28" transform="rotate(72)"/><ellipse cy="-25" rx="15" ry="28" transform="rotate(144)"/><ellipse cy="-25" rx="15" ry="28" transform="rotate(216)"/><ellipse cy="-25" rx="15" ry="28" transform="rotate(288)"/><circle r="13" fill="#d7c3b1"/>
      </g>
      <g transform="translate(34 169) scale(.52)" stroke="#8c7860" strokeWidth="1.6" fill="#e8ddd0">
        <ellipse cy="-25" rx="15" ry="28"/><ellipse cy="-25" rx="15" ry="28" transform="rotate(72)"/><ellipse cy="-25" rx="15" ry="28" transform="rotate(144)"/><ellipse cy="-25" rx="15" ry="28" transform="rotate(216)"/><ellipse cy="-25" rx="15" ry="28" transform="rotate(288)"/><circle r="12" fill="#c9ac98"/>
      </g>
    </svg>
  );
}
