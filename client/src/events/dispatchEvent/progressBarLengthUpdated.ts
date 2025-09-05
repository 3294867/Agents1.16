interface Props {
  length: string;
}

const progressBarLengthUpdated = ({ length }: Props) => {
  const event = new CustomEvent('progressBarLengthUpdated', {
    detail: { length }
  });
  window.dispatchEvent(event);
};

export default progressBarLengthUpdated;