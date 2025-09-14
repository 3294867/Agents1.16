import agentAdded from './agentAdded';
import tabsUpdated from './tabsUpdated';
import reqresDeleted from './reqresDeleted';
import reqresUpdated from './reqresUpdated';
import reqresIsNewUpdated from './reqresIsNewUpdated';
import editingQuestion from './editingQuestion';
import responsePaused from './responsePaused';
import progressBarLengthUpdated from './progressBarLengthUpdated';
import threadIsBookmarkedUpdated from './threadIsBookmarkedUpdated';
import threadNameUpdated from './threadNameUpdated';
import reqresAdded from './reqresAdded';

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
  progressBarLengthUpdated,
  threadIsBookmarkedUpdated
};

export default dispatchEvent;