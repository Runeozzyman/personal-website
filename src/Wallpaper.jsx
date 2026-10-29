function Cloud({ x, y }) {
  const blocks = [
    [1, 0],
    [2, 0],
    [3, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [1, 2],
    [2, 2],
    [3, 2],
  ];

  return (
    <g>
      {blocks.map(([col, row]) => (
        <rect
          key={`s-${col}-${row}`}
          x={x + col * 10 + 2}
          y={y + row * 10 + 2}
          width="10"
          height="10"
          fill="#6ea4d4"
        />
      ))}
      {blocks.map(([col, row]) => (
        <rect
          key={`${col}-${row}`}
          x={x + col * 10}
          y={y + row * 10}
          width="10"
          height="10"
          fill={row === 2 ? "#d7eefb" : "#f7fbff"}
        />
      ))}
    </g>
  );
}

function Sun() {
  const rows = ["...yyyy...", ".yyyyyyyy.", "yyyyyyyyyy", "yywwyyyyyy", "yyyyyyyyyy", ".yyyyyyyy.", "...yyyy..."];
  const cells = [];
  rows.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell === ".") return;
      cells.push(
        <rect key={`${x}-${y}`} x={236 + x * 6} y={10 + y * 6} width="6" height="6" fill={cell === "w" ? "#fff4b0" : "#ffe56a"} />
      );
    });
  });
  return cells;
}

export function Wallpaper() {
  return (
    <svg className="wallpaper" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="320" height="180" fill="#3d7ec4" />
      <rect y="28" width="320" height="28" fill="#4e92d4" />
      <rect y="56" width="320" height="24" fill="#6aaddf" />
      <rect y="80" width="320" height="20" fill="#8ec4ea" />

      <Sun />
      <Cloud x={18} y={14} />
      <Cloud x={96} y={36} />
      <Cloud x={168} y={10} />

      <rect y="128" width="320" height="52" fill="#3f8f45" />
      <rect y="120" width="70" height="12" fill="#4ea354" />
      <rect x="40" y="112" width="90" height="16" fill="#57b15c" />
      <rect x="100" y="120" width="80" height="12" fill="#4ea354" />
      <rect x="168" y="108" width="100" height="20" fill="#67c06a" />
      <rect x="240" y="118" width="80" height="14" fill="#4ea354" />
      <rect y="148" width="320" height="32" fill="#2f7a38" />
      <rect y="164" width="320" height="16" fill="#246430" />
    </svg>
  );
}
