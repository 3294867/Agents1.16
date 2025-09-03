import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import indexedDB from 'src/storage/indexedDB';
import postgresDB from 'src/storage/postgresDB';
import { Query, Thread } from 'src/types';
import tabsStorage from 'src/storage/localStorage/tabsStorage';

interface Props {
  userId: string;
  workspaceName: string;
  agentName: string;
  threadId: string;
}

const useHandleThread = ({ userId, workspaceName, agentName, threadId }: Props): { thread: Thread | null, error: string | null, isLoading: boolean } => {
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();
  const [ thread, setThread ] = useState<Thread | null>(null);
  const [ error, setError ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ newRequestId, setNewRequestId ] = useState<string | null>(null);
  
  /** Redirect on shared thread or get thread (IndexedDB, PostgresDB) */
  useEffect(() => {
    if (!threadId) {
      setError('Missing thread id');
      return;
    }
    const isShared = searchParams.get('share');
    if (!isShared) {
      const getThread = async () => {
        try {
          setIsLoading(true);
          setError(null);
    
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
      getThread();
      return;
    }

    const addSharedThread = async () => {
      if (isShared === 'true') {
        setIsLoading(true);        
        const id = uuidV4();
        const duplicateThreadPGDB = await postgresDB.duplicateThread({
          publicThreadId: threadId,
          newThreadId: id,
          userId,
          agentId
        });
        
        const getThreadPGDB = await postgresDB.getThread({ threadId: duplicateThreadPGDB.id });
        await indexedDB.addThread({ thread: getThreadPGDB }).then(() => {
          const tab = {
            id: getThreadPGDB.id,
            teamId,
            agentId,
            title: getThreadPGDB.title,
            isActive: true
          };
          tabsStorage.addTab(teamName, agentName, tab);
          navigate(`/${teamName}/${agentName}/${id}`);
        });
      }
    };
    addSharedThread();
  },[userId, teamId, teamName, agentId, agentName, threadId, searchParams]);

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
    window.addEventListener('queryIsNewUpdated', handleQueryIsNewUpdated as EventListener);

    return () => window.removeEventListener('queryIsNewUpdated', handleQueryIsNewUpdated as EventListener);
  },[thread, threadId]);

  /** Update thread on threadTitleUpdated event (UI) */
  useEffect(() => {
    const handleThreadTitleUpdated = (event: CustomEvent) => {
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
    window.addEventListener('threadTitleUpdated', handleThreadTitleUpdated as EventListener);

    return () => window.removeEventListener('threadTitleUpdated', handleThreadTitleUpdated as EventListener);
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