// Build-time computed data — auto-updates on each deploy
export default function () {
  return {
    year: new Date().getFullYear()
  };
}
