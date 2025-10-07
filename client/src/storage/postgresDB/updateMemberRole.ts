import dispatchEvent from 'src/events/dispatchEvent';

interface Props {
  workspaceId: string;
  userId: string;
  role: string;
}

const updateMemberRole = async ({ workspaceId, userId, role }: Props): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/update-member-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId, userId, role })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update member role(PostgresDB): ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: { message: string } = await response.json();
    if (data.message !== 'Member role updated') throw new Error(data.message);
    dispatchEvent.memberRoleUpdated();
  } catch (error) {
    throw new Error(`Failed to update member role (PostgresDB): ${error}`);
  }
};

export default updateMemberRole;