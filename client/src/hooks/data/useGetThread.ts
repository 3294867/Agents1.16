import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import { Query, Thread } from 'src/types';

const useGetThread = (threadId: string | undefined) => {
  const [ thread, setThread ] = useState<Thread | null>(null);
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ newRequestId, setNewRequestId ] = useState<string | null>(null);

  /** Scroll to saved 'positionY' value of the thread */
  useEffect(() => {
    if (thread) {
      scrollTo({
        top: thread.positionY,
        behavior: 'smooth'
      });
    }
  },[thread]);
  
  /** Scroll to the new query */
  useEffect(() => {
    if (thread && newRequestId) {
      const question = document.getElementById(`question_${newRequestId}`);
      if (!question) return;
      const rect = question.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const offsetPositionY = rect.top + scrollTop - 8;

      scrollTo({
        top: offsetPositionY,
        behavior: 'smooth'
      });
    }
  },[thread, newRequestId]);
  
  /** Fetch thread */
  useEffect(() => {
    const fetchThread = async () => {
      if (!threadId) {
        setError('Missing thread id.');
        return;
      }
  
      setIsLoading(true);
      setError(null);
  
      const threadData = await indexedDB.getThread({ threadId, setError });
      if (!threadData) setError('Incorrect thread id.')
      setThread(threadData);
      setIsLoading(false);
    };
    fetchThread();

    /** Listen for query added events */
    const handleAddQuery = (event: CustomEvent) => {
      if (event.detail.threadId === threadId) {
        /** Add new query to the thread body */
        const newQuery: Query = event.detail.newQuery;
        setThread(prevThread => {
          if (!prevThread) return null;
          const prevBody = Array.isArray(prevThread.body) ? prevThread.body : [];
          return {
            ...prevThread,
            body: [...prevBody, newQuery]
          };
        });

        setNewRequestId(newQuery.requestId);
      }
    };
    window.addEventListener('queryAdded', handleAddQuery as EventListener);

    /** Listen for updates of the 'isNew' property of the query */
    const handleUpdateQueryIsNewFlag = (event: CustomEvent) => {
      if (event.detail.threadId === threadId) {
        if (!thread) return null;
        const threadBody = Array.isArray(thread.body) ? thread.body : [];
        const queryIndex = threadBody.findIndex(q => q.responseId === event.detail.responseId);
        if (queryIndex === -1) return;

        const isNew: boolean = event.detail.isNew;
        const updatedThreadBody: Query[] = threadBody.map((q, idx) =>
          idx === queryIndex ? { ...q, isNew } : q
        );

        setThread(prevThread => {
          if (!prevThread) return null;
          return {
            ...prevThread,
            body: updatedThreadBody
          };
        });
      }
    };
    window.addEventListener('queryIsNewFlagUpdated', handleUpdateQueryIsNewFlag as EventListener);

    /** Listen for updates of the 'title' property of the thread */
    const handleUpdateThreadTitle = (event: CustomEvent) => {
      const threadTitle: string = event.detail.threadTitle;
      if (event.detail.threadId === threadId) {
        if (!thread) return;
        setThread(prevThread => {
          if (!prevThread) return null;
          return {
            ...prevThread,
            title: threadTitle
          }
        });
      }
    };
    window.addEventListener('threadTitleUpdated', handleUpdateThreadTitle as EventListener);

    return () => {
      window.removeEventListener('queryAdded', handleAddQuery as EventListener);
      window.removeEventListener('queryIsNewFlagUpdated', handleUpdateQueryIsNewFlag as EventListener);
      window.removeEventListener('threadTitleUpdated', handleUpdateThreadTitle as EventListener);
      setThread(null);
      setError(null);
      setIsLoading(false);
    }
  },[threadId, error]);

  return { thread, error, isLoading };
};

export default useGetThread;