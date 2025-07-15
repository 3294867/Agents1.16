import { NewResponse } from 'src/types';

const newResponseStorage = {
  add: (responseId: string, isLoading: boolean) => {
    const newResponse: NewResponse = { responseId, isLoading };
    try {
      sessionStorage.setItem('newResponse', JSON.stringify(newResponse));
    } catch (error) {
      console.error('Failed to update new response: ', error);
    }
  },

  get: () => {
    const noNewResponse: NewResponse = { responseId: '', isLoading: false };
    try {
      const newResponse = sessionStorage.getItem('newResponse');
      if (newResponse) {
        const parsedNewResponse: NewResponse = JSON.parse(newResponse);
        return parsedNewResponse;
      } else return noNewResponse;
    } catch (error) {
      console.error('Failed to add new response: ', error);
      return noNewResponse;
    }
  },

  remove: () => {
    try {
      sessionStorage.removeItem('newResponse');
    } catch (error) {
      console.error('Failed to remove new response: ', error);
    }
  }
};

export default newResponseStorage;