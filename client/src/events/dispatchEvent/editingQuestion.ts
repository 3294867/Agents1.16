const editingQuestion = (requestId: string) => {
  const event = new CustomEvent('editingQuestion', {
    detail: { requestId }
  });
  window.dispatchEvent(event);
};

export default editingQuestion;