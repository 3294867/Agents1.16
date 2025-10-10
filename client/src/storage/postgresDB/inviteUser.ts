interface Props {
  userName: string;
  workspaceId: string;
}

const inviteUser = async ({ userName, workspaceId }: Props): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/invite-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, workspaceId })
    });

    if (!response.ok) {
      throw new Error(`Failed to invite user: ${response.text()}`);
    }

    const body: { message: string, data: string } = await response.json();
    if (!body.data) throw new Error(body.message);

    return body.data as string;
  } catch (err) {
    throw new Error(`Failed to invite user: ${err}`);
  }
};

export default inviteUser;