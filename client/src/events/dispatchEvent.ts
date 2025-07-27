import { Query } from 'src/types';

const dispatchEvent = {
  threadTitleUpdated: (threadId: string, threadTitle: string) => {
    const event = new CustomEvent('threadTitleUpdated', {
      detail: { threadId, threadTitle }
    });
    window.dispatchEvent(event);
  },
  tabsUpdated: (agentName: string) => {
    const event = new CustomEvent('tabsUpdated', {
      detail: { agentName }
    });
    window.dispatchEvent(event);
  },
  queryAdded: (threadId: string, query: Query) => {
    const event = new CustomEvent('queryAdded', {
      detail: { threadId, query }
    });
    window.dispatchEvent(event);
  },
  queryDeleted: (threadId: string, requestId: string) => {
    const event = new CustomEvent('queryDeleted', {
      detail: { threadId, requestId }
    });
    window.dispatchEvent(event);
  },
  queryUpdated: (threadId: string, query: Query) => {
    const event = new CustomEvent('queryUpdated', {
      detail: { threadId, query }
    });
    window.dispatchEvent(event);
  },
  queryIsNewUpdated: (threadId: string, responseId: string, isNew: boolean) => {
    const event = new CustomEvent('queryIsNewUpdated', {
      detail: { threadId, responseId, isNew }
    });
    window.dispatchEvent(event);
  },
  editingQuestion: (requestId: string) => {
    const event = new CustomEvent('editingQuestion', {
      detail: { requestId }
    });
    window.dispatchEvent(event);
  },
  responsePaused: (requestId: string) => {
    const event = new CustomEvent('responsePaused', {
      detail: { requestId }
    })
    window.dispatchEvent(event);
  },
  progressBarLengthUpdated: (length: string) => {
    const event = new CustomEvent('progressBarLengthUpdated', {
      detail: { length }});
    window.dispatchEvent(event);
  }
};

export default dispatchEvent;