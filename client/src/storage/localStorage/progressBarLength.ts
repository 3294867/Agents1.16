import dispatchEvent from 'src/events/dispatchEvent';

const progressBarLength = {
  load: (): string | null => {
    try {
      const progressBarLength = localStorage.getItem('progressBarLength');
      if (progressBarLength) return progressBarLength;
      return null
    } catch (error) {
      console.error('Failed to load progress bar length: ', error);
      return null;
    }
  },
  update: (length: string): void => {
    try {
      localStorage.setItem('progressBarLength', length);
      dispatchEvent.progressBarLengthUpdated(length);
    } catch (error) {
      console.error('Failed to update progress bar length: ', error);
    }
  },
};

export default progressBarLength;