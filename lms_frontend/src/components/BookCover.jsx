const COVER_PALETTE = [
  { from: '#6b1d1d', to: '#3d1010' }, // burgundy
  { from: '#1f3d4d', to: '#0f1f28' }, // navy slate
  { from: '#2d4a2d', to: '#152515' }, // forest
  { from: '#7a4a1f', to: '#3d2410' }, // warm bronze
  { from: '#4a2d4a', to: '#251525' }, // plum
  { from: '#5a4a1d', to: '#2d2510' }, // antique gold
  { from: '#1f3d3d', to: '#0f2828' }, // teal ink
  { from: '#4a1f3d', to: '#2a0f20' }, // wine
  { from: '#3d3d5a', to: '#1f1f30' }, // dusk blue
  { from: '#5a3d1f', to: '#2a1d10' }, // saddle
];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function pickCoverColors(seed = '') {
  const idx = hashString(seed || 'untitled') % COVER_PALETTE.length;
  return COVER_PALETTE[idx];
}

export default function BookCover({
  title = 'Untitled',
  author = '',
  detail = false,
  className = '',
}) {
  const colors = pickCoverColors(`${title}|${author}`);
  const cls = `book-cover${detail ? ' book-cover--detail' : ''}${className ? ` ${className}` : ''}`;

  return (
    <div
      className={cls}
      style={{
        backgroundImage: `linear-gradient(160deg, ${colors.from} 0%, ${colors.to} 100%)`,
      }}
      aria-hidden="true"
    >
      <div className="book-cover__spine" />
      <div className="book-cover__texture" />
      <h3 className="book-cover__title">{title}</h3>
      <p className="book-cover__author">{author || 'Unknown author'}</p>
    </div>
  );
}
