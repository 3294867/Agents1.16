import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  length: string;
}

const update = ({ length }: Props): void => {
  try {
    localStorage.setItem('progressBarLength', length);
    dispatchEvent.progressBarLengthUpdated({ length });
  } catch (error) {
    console.error('Failed to update progress bar length: ', error);
  }
};

export default update;