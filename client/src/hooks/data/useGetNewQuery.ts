import { useEffect, useState } from 'react';
import newQueryStorage from 'src/storage/sessionStorage/newQueryStorage';
import { NewQuery } from 'src/types';

const useGetNewQuery = () => {
  const [ newQuery, setNewQuery ] = useState<NewQuery | null>(null);

  useEffect(() => {
    const newQueryData = newQueryStorage.get();
    if (newQueryData) {
      setNewQuery(newQueryData);
    }
    
    /** Listen for new query updates */
    const handleNewQueryUpdate = () => {
      const newQueryData = newQueryStorage.get();
      if (newQueryData) {
        setNewQuery(newQueryData);
      }
    }
    window.addEventListener('newQueryUpdated', handleNewQueryUpdate as EventListener);

    return () => {
      setNewQuery(null)
      window.removeEventListener('newQueryUpdated', handleNewQueryUpdate as EventListener);
    }
  },[]);

  return newQuery;
};

export default useGetNewQuery;