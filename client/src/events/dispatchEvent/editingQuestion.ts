interface Props {
  requestId: string;
}

const editingQuestion = ({ requestId }: Props) => {
  const event = new CustomEvent('editingQuestion', {
    detail: { requestId }
  });
  window.dispatchEvent(event);
};

export default editingQuestion;