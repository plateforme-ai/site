// biome-ignore-all lint/correctness/noUnusedVariables: scripts

/** Colors */
COLORS = [
  'black',
  'white',
  'graydark',
  'graylight',
  'primary',
  'secondary',
  'background',
  'foreground',
  'gradient1',
  'gradient2',
  'gradient3',
  'gradient4',
  'gradient5',
  'gradient6',
].reduce((colors, color) => {
  colors[color] = getComputedStyle(document.documentElement).getPropertyValue(`--color-${color}`).trim();
  return colors;
}, {});

/** Gets a RGBA color from an hexadecimal color. */
function hexToRgba(hexColor, alpha = 1) {
  const color = hexColor.replace('#', '');
  const r = Number.parseInt(color.substring(0, 2), 16);
  const g = Number.parseInt(color.substring(2, 4), 16);
  const b = Number.parseInt(color.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}
