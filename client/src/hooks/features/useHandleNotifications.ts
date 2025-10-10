import { useEffect, useState } from 'react';
import postgresDB from 'src/storage/postgresDB';
import { Notification } from 'src/types';

interface Props {
  userId: string;
}

interface Return {
  notifications: Notification[] | null;
  isLoading: boolean;
  error: string | null
}

const useHandleNotifications = ({ userId }: Props): Return => {
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError('Missing required fields: userId');
      setIsLoading(false);
      return;
    }

    try {
      const init = async () => {
        const getNotifications = await postgresDB.getNotifications({ userId });
        if (getNotifications) setNotifications(getNotifications);
      };
      init();

      window.addEventListener('notificationUpdated', init as EventListener);
      return () => window.removeEventListener('notificationUpdated', init as EventListener); 
    } catch (err) {
      setError(`Failed to fetch notifications: ${err}`)
    } finally {
      setIsLoading(false);
    }
  },[userId])
  
  return { notifications, isLoading, error };
};

export default useHandleNotifications;