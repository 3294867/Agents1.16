import { NewQuery } from 'src/types';

const newQueryStorage = {
  add: (id: string, requestId: string, requestBody: string, responseId: string, responseBody: string, isLoading: boolean) => {
    const newQuery: NewQuery = { id, requestId, requestBody, responseId, responseBody, isLoading };
    try {
      sessionStorage.setItem('newQuery', JSON.stringify(newQuery));
    } catch (error) {
      console.error('Failed to add new query: ', error);
    }
  },

  get: () => {
    const noNewQuery: NewQuery = { id: '', requestId: '', requestBody: '', responseId: '', responseBody: '',  isLoading: false };
    try {
      const newQuery = sessionStorage.getItem('newQuery');
      if (newQuery) {
        const parsedNewResponse: NewQuery = JSON.parse(newQuery);
        return parsedNewResponse;
      } else return noNewQuery;
    } catch (error) {
      console.error('Failed to get new query: ', error);
      return noNewQuery;
    }
  },

  update: (id: string, requestId: string, requestBody: string, responseId: string, responseBody: string, isLoading: boolean) => {
    const newQuery: NewQuery = { id, requestId, requestBody, responseId, responseBody, isLoading };
    try {
      sessionStorage.setItem('newQuery', JSON.stringify(newQuery));
      const event = new CustomEvent('newQueryUpdated', {
        detail: { newQueryId: id }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to update new query: ', error);
    }
  },

  remove: () => {
    try {
      sessionStorage.removeItem('newQuery');
    } catch (error) {
      console.error('Failed to remove new query: ', error);
    }
  }
};

export default newQueryStorage;