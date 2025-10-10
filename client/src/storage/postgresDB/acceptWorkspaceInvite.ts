import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  notificationId: string;
}

const acceptWorkspaceInvite = async ({ notificationId }: Props): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/accept-workspace-invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId })
    });

    if (!response.ok) {
      throw new Error(`Failed to accept workspace invite: ${response.text()}`);
    }

    const body: { message: string, data: string } = await response.json();
    if (!body.data) throw new Error(body.message);
    
    dispatchEvent.notificationUpdated();

    return body.data as string;
  } catch (err) {
    throw new Error(`Failed to accept workspace invite: ${err}`);
  }
};

export default acceptWorkspaceInvite;