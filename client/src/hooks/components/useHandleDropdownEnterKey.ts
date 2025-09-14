import { RefObject, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postgresDB from 'src/storage/postgresDB';
import indexedDB from 'src/storage/indexedDB';
import dispatchEvent from 'src/events/dispatchEvent';
import tabsStorage from 'src/storage/localStorage/tabsStorage';

interface Props {
  dropdownRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const useHandleDropdownEnterKey = ({ dropdownRef, isOpen, setIsOpen }: Props): void => {
  const navigate = useNavigate();
  
  const handleBookmarkThread = async ({ threadId, isBookmarked} : { threadId: string; isBookmarked: boolean }) => {
    await postgresDB.updateThreadIsBookmarked({ threadId, isBookmarked });
    await indexedDB.updateThreadIsBookmarked({ threadId, isBookmarked});
    dispatchEvent.threadIsBookmarkedUpdated({ threadId, isBookmarked });
  };

  const handleDeleteThread = async ({ workspaceName, threadId, agentName }: { workspaceName: string, threadId: string, agentName: string}) => {
    await postgresDB.deleteThread({ threadId });
    await indexedDB.deleteThread({ threadId });
    tabsStorage.remove({ workspaceName, agentName, tabId: threadId });
    
    navigate(`/${workspaceName}/${agentName}`);
  };
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isOpen && dropdownRef.current && event.key == 'Enter') {
      const activeElement = document.activeElement as HTMLElement | null;

      const focusedElement = activeElement && dropdownRef.current.contains(activeElement)
        ? activeElement
        : null;
        
      if (focusedElement) {
        if (focusedElement.id.startsWith('bookmark_thread_button')) {
        const button = focusedElement.closest<HTMLButtonElement>('button[id^="bookmark_thread_button"]');
        if (button) {
          const threadId = button.dataset.threadId || '';
          const isBookmarked = button.dataset.isBookmarked === 'true';
          handleBookmarkThread({threadId, isBookmarked});
        }
        } else if (focusedElement.id.startsWith('delete_thread_button')) {
          const button = focusedElement.closest<HTMLButtonElement>('button[id^="delete_thread_button"]');
          if (button) {
            const workspaceName = button.dataset.workspaceName || '';
            const agentName = button.dataset.agentName || '';
            const threadId = button.dataset.threadId || '';
            handleDeleteThread({ workspaceName, agentName, threadId, });
          }
        }
      }

      setIsOpen(false);
    }
  },[dropdownRef, isOpen, handleDeleteThread]);
  
  useEffect(() => {
    if (dropdownRef.current && isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  },[dropdownRef, isOpen]);
};

export default useHandleDropdownEnterKey;