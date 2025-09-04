import { useEffect, useState } from 'react';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import { ReqRes, Thread } from 'src/types';

interface Props {
  threadId: string | undefined;
}

const useHandleThread = ({ threadId }: Props): { thread: Thread | null, error: string | null, isLoading: boolean } => {
  const [ thread, setThread ] = useState<Thread | null>(null);
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ newRequestId, setNewRequestId ] = useState<string | null>(null);
  
  /** Get thread */
  useEffect(() => {
    if (!threadId) {
      setError('Missing thread id');
      return;
    }
    setIsLoading(true);

    const init = async () => {
      try {
        const getThreadIDB = await indexedDB.getThread({ threadId });
        const getThreadPGDBUpdatedAt = await postgresDB.getThreadUpdatedAt({ threadId });
  
        if (!getThreadIDB || new Date(getThreadIDB.updatedAt).getTime() !== new Date(getThreadPGDBUpdatedAt).getTime()) {
          const getThreadPGDB = await postgresDB.getThread({ threadId });
          await indexedDB.updateThread({ thread: getThreadPGDB });
          setThread(getThreadPGDB);
          setIsLoading(false);
          return;
        }
        
        setThread(getThreadIDB);
        setIsLoading(false);
      } catch (error) {
        throw new Error(`Failed to get thread: ${error}`);
      }
    };
    init();

  }, [threadId]);

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
    const handleQueryAdded = (event: CustomEvent) => {
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
    window.addEventListener('queryAdded', handleQueryAdded as EventListener);

    return () => window.removeEventListener('queryAdded', handleQueryAdded as EventListener);
  },[threadId]);

  /** Update thread on queryDeleted event (UI) */
  useEffect(() => {
    const handleQueryDeleted = (event: CustomEvent) => {
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
    window.addEventListener('queryDeleted', handleQueryDeleted as EventListener);

    return () => window.removeEventListener('queryDeleted', handleQueryDeleted as EventListener);
  },[threadId]);

  /** Update thread on queryUpdated event (UI) */
  useEffect(() => {
    const handleQueryUpdated = (event: CustomEvent) => {
      if (threadId && event.detail.threadId === threadId ) {
        setThread(prevThread => {
          if (!prevThread) return null;
          const prevBody = Array.isArray(prevThread.body) ? prevThread.body : [];
          const queryIndex = prevBody.findIndex(q => q.requestId === event.detail.query.requestId);
          const updatedBody: ReqRes[] = prevBody.map((q, idx) =>
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
    window.addEventListener('queryUpdated', handleQueryUpdated as EventListener);
    
    return () => window.removeEventListener('queryUpdated', handleQueryUpdated as EventListener);
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
    const handleQueryIsNewUpdated = (event: CustomEvent) => {
      if (!thread) return;
      if (threadId && event.detail.threadId === threadId) {
        const threadBody = Array.isArray(thread.body) ? thread.body : [];
        const queryIndex = threadBody.findIndex(q => q.responseId === event.detail.responseId);
        if (queryIndex === -1) return;
  
        const isNew: boolean = event.detail.isNew;
        const updatedThreadBody: ReqRes[] = threadBody.map((q, idx) =>
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
    window.addEventListener('queryIsNewUpdated', handleQueryIsNewUpdated as EventListener);

    return () => window.removeEventListener('queryIsNewUpdated', handleQueryIsNewUpdated as EventListener);
  },[thread, threadId]);

  /** Update thread on threadNameUpdated event (UI) */
  useEffect(() => {
    const handleThreadNameUpdated = (event: CustomEvent) => {
      if (!thread) return;
      if (threadId && event.detail.threadId === threadId) {
        setThread(prevThread => {
          if (!prevThread) return null;
          return {
            ...prevThread,
            name: event.detail.threadName
          }
        });
      }
    };
    window.addEventListener('threadNameUpdated', handleThreadNameUpdated as EventListener);

    return () => window.removeEventListener('threadNameUpdated', handleThreadNameUpdated as EventListener);
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
            isBookmarked: !event.detail.isBookmarked
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