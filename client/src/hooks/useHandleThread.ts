import { useEffect, useState } from 'react';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import { Query, Thread } from 'src/types';

interface Props {
  threadId: string | undefined;
};

/** Handles thread */
const useHandleThread = ({ threadId }: Props): { thread: Thread | null, error: string | null, isLoading: boolean } => {
  const [ thread, setThread ] = useState<Thread | null>(null);
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ newRequestId, setNewRequestId ] = useState<string | null>(null);
  
  /** Get thread (IndexedDB) */
  useEffect(() => {
    const fetchThread = async () => {
      if (!threadId) {
        setError('Missing thread id.');
        return;
      }
      setIsLoading(true);
      setError(null);
      const threadIDB = await indexedDB.getThread({ threadId });
      if (!threadIDB) setError('Incorrect thread id.');

      const threadUpdatedAt = await postgresDB.getThreadUpdatedAt({ threadId });
      if (new Date(threadIDB.updatedAt).getTime() === new Date(threadUpdatedAt).getTime()) {
        setThread(threadIDB);
      } else {
        const threadPostgres = await postgresDB.getThread({ threadId });
        await indexedDB.updateThread({ thread: threadPostgres });
        setThread(threadPostgres);
      }
      setIsLoading(false);
    };
    fetchThread();
  },[threadId]);

  /** Scroll to saved 'positionY' value of the thread (UI) */
  useEffect(() => {
    if (thread) {
      scrollTo({
        top: thread.positionY,
        behavior: 'smooth'
      });
    }
  },[thread]);
  
  /** Update thread on queryAdded event (UI) */
  useEffect(() => {
    const handleAddQuery = (event: CustomEvent) => {
      if (threadId && event.detail.threadId === threadId) {
        setThread(prevThread => {
          if (!prevThread) return null;
          const prevBody = Array.isArray(prevThread.body) ? prevThread.body : [];
          return {
            ...prevThread,
            body: [...prevBody, event.detail.query]
          };
        });
  
        setNewRequestId(event.detail.query.requestId);
      }
    };
    window.addEventListener('queryAdded', handleAddQuery as EventListener);

    return () => window.removeEventListener('queryAdded', handleAddQuery as EventListener);
  },[threadId]);

  /** Update thread on queryDeleted event (UI) */
  useEffect(() => {
    const handleDeleteQuery = (event: CustomEvent) => {
      if (threadId && event.detail.threadId === threadId) {
        setThread(prevThread => {
          if (!prevThread) return null;
          const prevBody = Array.isArray(prevThread.body) ? prevThread.body : [];
          const updatedBody = prevBody.filter(q => q.requestId !== event.detail.requestId);
          return {
            ...prevThread,
            body: [...updatedBody]
          };
        });
      }
    };
    window.addEventListener('queryDeleted', handleDeleteQuery as EventListener);

    return () => window.removeEventListener('queryDeleted', handleDeleteQuery as EventListener);
  },[threadId]);

  /** Update thread on queryUpdated event (UI) */
  useEffect(() => {
    const handleUpdateQuery = (event: CustomEvent) => {
      if (threadId && event.detail.threadId === threadId ) {
        setThread(prevThread => {
          if (!prevThread) return null;
          const prevBody = Array.isArray(prevThread.body) ? prevThread.body : [];
          /** Create a new array with the updated query, preserving order */
          const queryIndex = prevBody.findIndex(q => q.requestId === event.detail.query.requestId);
          const updatedBody: Query[] = prevBody.map((q, idx) =>
            idx === queryIndex ? event.detail.query : q
          );
          return {
            ...prevThread,
            body: [...updatedBody]
          };
        });

        setNewRequestId(event.detail.query.requestId);
      }
    };
    window.addEventListener('queryUpdated', handleUpdateQuery as EventListener);
    
    return () => window.removeEventListener('queryUpdated', handleUpdateQuery as EventListener);
  },[threadId]);
  

  /** Scroll to the new query (UI) */
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


  /** Update thread on queryIsNewUpdated event (UI) */
  useEffect(() => {
    const handleUpdateQueryIsNewProperty = (event: CustomEvent) => {
      if (!thread) return;
      if (threadId && event.detail.threadId === threadId) {
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
    window.addEventListener('queryIsNewUpdated', handleUpdateQueryIsNewProperty as EventListener);

    return () => window.removeEventListener('queryIsNewUpdated', handleUpdateQueryIsNewProperty as EventListener);
  },[thread, threadId]);

  /** Update thread on threadTitleUpdated event (UI) */
  useEffect(() => {
    const handleUpdateThreadTitle = (event: CustomEvent) => {
      if (!thread) return;
      if (threadId && event.detail.threadId === threadId) {
        setThread(prevThread => {
          if (!prevThread) return null;
          return {
            ...prevThread,
            title: event.detail.threadTitle
          }
        });
      }
    };
    window.addEventListener('threadTitleUpdated', handleUpdateThreadTitle as EventListener);

    return () => window.removeEventListener('threadTitleUpdated', handleUpdateThreadTitle as EventListener);
  },[thread, threadId]);

  /** Update thread on threadIsBookmarkedUpdated event (UI)*/
  useEffect(() => {
    const handleThreadIsBookmarkedUpdated = (event: CustomEvent) => {
      if (!thread) return;
      if (threadId && event.detail.threadId === threadId) {
        setThread(prevThread => {
          if (!prevThread) return null;
          return {
            ...prevThread,
            isBookmarked: event.detail.isBookmarked
          }
        })
      }
    };
    window.addEventListener('threadIsBookmarkedUpdated', handleThreadIsBookmarkedUpdated as EventListener);

    return () => window.removeEventListener('threadIsBookmarkedUpdated', handleThreadIsBookmarkedUpdated as EventListener);
  },[thread, threadId]);

  /** Update thread on threadUpdated event (UI) */
  useEffect(() => {
    const handleThreadUpdated = (event: CustomEvent) => {
      if (!thread) return;
      if (threadId && event.detail.threadId === threadId) {
        setThread(prevThread => {
          if (!prevThread) return null;
          return {
            ...event.detail.thread
          }
        })
      }
    };
    window.addEventListener('threadUpdated', handleThreadUpdated as EventListener);

    return () => window.removeEventListener('threadUpdated', handleThreadUpdated as EventListener);
  },[thread, threadId]);

  return { thread, error, isLoading };
};

export default useHandleThread;