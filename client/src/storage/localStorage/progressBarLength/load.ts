const load = (): string | null => {
  try {
    const progressBarLength = localStorage.getItem('progressBarLength');
    if (progressBarLength) return progressBarLength;
    return null
  } catch (error) {
    console.error('Failed to load progress bar length: ', error);
    return null;
  }
};

export default load;