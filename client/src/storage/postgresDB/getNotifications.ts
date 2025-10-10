import { Notification } from 'src/types';

interface Props {
  userId: string;
}

const getNotifications = async ({ userId }: Props): Promise<Notification[] | null> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/get-notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.text()}`);
  }

  const body: { message: string, data: Notification[] | null } = await response.json();
  if (!body.data) throw new Error(`Failed to fetch notifications: ${body.message}`);

  return body.data as Notification[];
};

export default getNotifications;