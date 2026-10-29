const palette = {
  k: "#1a1a1a",
  w: "#f7f4ec",
  b: "#245edb",
  y: "#f0c24a",
  o: "#d89a2b",
  e: "#fff6c8",
  g: "#3c9a3c",
  r: "#d6453d",
  m: "#8d8d8d",
  p: "#3a6ea5",
  h: "#6b4428",
  t: "#f0c7a4",
};

const art = {
  about: [
    "................",
    "................",
    "...wwwwwwwwwk...",
    "...wbbbbbbbbk...",
    "...wwwwwwwwwk...",
    "...wmmmmmmmwk...",
    "...wwwwwwwwwk...",
    "...wmmmmmmmwk...",
    "...wwwwwwwwwk...",
    "...wmmmmmmmwk...",
    "...wwwwwwwwwk...",
    "...kkkkkkkkkk...",
    "................",
    "................",
    "................",
    "................",
  ],
  skills: [
    "................",
    "................",
    "...kkkkkkkkkk...",
    "...kggggggggk...",
    "...kgkgkgkgkk...",
    "...kggggggggk...",
    "...kwwwwwwwwk...",
    "...kggggggggk...",
    "...kkkkkkkkkk...",
    "....k.k..k.k....",
    "....k.k..k.k....",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  work: [
    "................",
    "................",
    "...yyyyy........",
    "..yyyyyyyyyyyy..",
    "..yeeeeeeeeeyk..",
    "..yeeeeeeeeeyk..",
    "..yeeeeeeeeeyk..",
    "..yoooooooooyk..",
    "..kkkkkkkkkkkk..",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  contact: [
    "................",
    "................",
    "..kkkkkkkkkkkk..",
    "..kwwwwwwwwwwk..",
    "..kwrwwwwwwwrk..",
    "..kwrrwwwwrrwk..",
    "..kwwrrwwrrwwk..",
    "..kwwwrrrrwwwk..",
    "..kwwwwwwwwwwk..",
    "..kkkkkkkkkkkk..",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  bin: [
    "................",
    ".....kkkk.......",
    "....kkkkkkkk....",
    "...kbbbbbbbbk...",
    "...kbkkkkkkbk...",
    "...kbbbbbbbbk...",
    "...kbkkkkkkbk...",
    "...kbbbbbbbbk...",
    "...kbkkkkkkbk...",
    "...kkkkkkkkkk...",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
  user: [
    "................",
    "....hhhhhh......",
    "...htttttttth...",
    "...htkkttkkth...",
    "...htttttttth...",
    "...htttkkttth...",
    "....tttttt......",
    "...pppppppp.....",
    "....pppppp......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
};

export function PixelIcon({ id, small = false }) {
  const rows = art[id];
  const cells = [];

  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === "." || !palette[ch]) return;
      cells.push(
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={palette[ch]} />
      );
    });
  });

  return (
    <svg
      className={small ? "pixel-icon small" : "pixel-icon"}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {cells}
    </svg>
  );
}
