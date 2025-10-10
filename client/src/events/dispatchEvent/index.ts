import agentAdded from './agentAdded';
import tabsUpdated from './tabsUpdated';
import reqresDeleted from './reqresDeleted';
import reqresUpdated from './reqresUpdated';
import reqresIsNewUpdated from './reqresIsNewUpdated';
import editingQuestion from './editingQuestion';
import responsePaused from './responsePaused';
import threadIsBookmarkedUpdated from './threadIsBookmarkedUpdated';
import threadNameUpdated from './threadNameUpdated';
import reqresAdded from './reqresAdded';
import memberRoleUpdated from './memberRoleUpdated';
import notificationUpdated from './notificationUpdated';

const dispatchEvent = {
  agentAdded,
  threadNameUpdated,
  tabsUpdated,
  reqresAdded,
  reqresDeleted,
  reqresUpdated,
  reqresIsNewUpdated,
  editingQuestion,
  responsePaused,
  threadIsBookmarkedUpdated,
  memberRoleUpdated,
  notificationUpdated
};

export default dispatchEvent;