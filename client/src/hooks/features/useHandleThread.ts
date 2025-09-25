import { useEffect, useState } from 'react';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import { ReqRes, Thread } from 'src/types';

interface Props {
  workspaceId: string;
  workspaceName: string;
  agentId: string;
  agentName: string;
  threadId: string | undefined;
}

interface Return {
  thread: Thread | null;
  error: string | null;
  isLoading: boolean;
}

const useHandleThread = ({ workspaceId, workspaceName, agentId, agentName, threadId }: Props): Return => {
  const [thread, setThread] = useState<Thread | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newRequestId, setNewRequestId] = useState<string | null>(null);
  
  /** Get thread */
  useEffect(() => {
    if (!workspaceId || !workspaceName || !agentId || !agentName || !threadId) {
      setError('All props are required: workspaceId, workspaceName, agentId, agentName, threadId');
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        const getThreadIDB = await indexedDB.getThread({ threadId });
        const getThreadPGDBUpdatedAt = await postgresDB.getThreadUpdatedAt({ threadId });
  
        if (!getThreadIDB || new Date(getThreadIDB.updatedAt).getTime() !== new Date(getThreadPGDBUpdatedAt).getTime()) {
          const getThreadPGDB = await postgresDB.getThread({ threadId });
          await indexedDB.addThread({ thread: getThreadPGDB });
          setThread(getThreadPGDB);
          return;
        }
        setThread(getThreadIDB);
      } catch (err) {
        setError(`Failed to get thread: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [workspaceId, workspaceName, agentId, agentName, threadId]);

  /** Scroll to saved 'positionY' value of the thread (UI) */
  useEffect(() => {
    if (thread) {
      scrollTo({
        top: thread.positionY,
        behavior: 'smooth'
      });
    }
  },[thread]);
  
  /** Update thread on reqresAdded event (UI) */
  useEffect(() => {
    const handleReqResAdded = (event: CustomEvent) => {
      if (threadId && event.detail.threadId === threadId) {
        setThread(prevThread => {
          if (!prevThread) return null;
          const prevBody = Array.isArray(prevThread.body) ? prevThread.body : [];
          return {
            ...prevThread,
            body: [...prevBody, event.detail.reqres]
          };
        });
  
        setNewRequestId(event.detail.reqres.requestId);
      }
    };
    window.addEventListener('reqresAdded', handleReqResAdded as EventListener);

    return () => window.removeEventListener('reqresAdded', handleReqResAdded as EventListener);
  },[threadId]);

  /** Update thread on reqresDeleted event (UI) */
  useEffect(() => {
    const handleReqResDeleted = (event: CustomEvent) => {
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
    window.addEventListener('reqresDeleted', handleReqResDeleted as EventListener);

    return () => window.removeEventListener('reqresDeleted', handleReqResDeleted as EventListener);
  },[threadId]);

  /** Update thread on reqresUpdated event (UI) */
  useEffect(() => {
    const handleReqResUpdated = (event: CustomEvent) => {
      if (threadId && event.detail.threadId === threadId ) {
        setThread(prevThread => {
          if (!prevThread) return null;
          const prevBody = Array.isArray(prevThread.body) ? prevThread.body : [];
          const reqresIndex = prevBody.findIndex(i => i.requestId === event.detail.reqres.requestId);
          const updatedBody: ReqRes[] = prevBody.map((item, idx) =>
            idx === reqresIndex ? event.detail.reqres : item
          );
          return {
            ...prevThread,
            body: [...updatedBody]
          };
        });

        setNewRequestId(event.detail.reqres.requestId);
      }
    };
    window.addEventListener('reqresUpdated', handleReqResUpdated as EventListener);
    
    return () => window.removeEventListener('reqresUpdated', handleReqResUpdated as EventListener);
  },[threadId]);
  

  /** Scroll to the new reqres (UI) */
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


  /** Update thread on reqresIsNewUpdated event (UI) */
  useEffect(() => {
    const handleReqResIsNewUpdated = (event: CustomEvent) => {
      if (!thread) return;
      if (threadId && event.detail.threadId === threadId) {
        const threadBody = Array.isArray(thread.body) ? thread.body : [];
        const reqresIndex = threadBody.findIndex(i => i.responseId === event.detail.responseId);
        if (reqresIndex === -1) return;
  
        const isNew: boolean = event.detail.isNew;
        const updatedThreadBody: ReqRes[] = threadBody.map((item, idx) =>
          idx === reqresIndex ? { ...item, isNew } : item
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
    window.addEventListener('reqresIsNewUpdated', handleReqResIsNewUpdated as EventListener);

    return () => window.removeEventListener('reqresIsNewUpdated', handleReqResIsNewUpdated as EventListener);
  },[thread, threadId]);

  /** Update thread on threadNameUpdated event (UI) */
  useEffect(() => {
    const handleThreadNameUpdated = (event: CustomEvent) => {
      if (!thread) return;
      setThread(prevThread => {
        if (!prevThread) return null;
        return {
          ...prevThread,
          name: event.detail.threadName
        }
      });
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