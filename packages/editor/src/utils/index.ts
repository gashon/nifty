export function generateBrightColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  // Generate a random color component between 8 and F (50% to 100% brightness)
  for (let i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * 8) + 8];
  }

  return color;
}
