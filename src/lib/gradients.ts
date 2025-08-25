const GRADIENT_BACKGROUNDS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)',
  'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
];

export const getGradientForRecipe = (title: string): string => {
  if (!title) return GRADIENT_BACKGROUNDS[0];
  
  // Simple hash function to get consistent gradient for same title
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const index = Math.abs(hash) % GRADIENT_BACKGROUNDS.length;
  return GRADIENT_BACKGROUNDS[index];
};