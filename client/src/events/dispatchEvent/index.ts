import agentAdded from './agentAdded';
import tabsUpdated from './tabsUpdated';
import queryDeleted from './queryDeleted';
import queryUpdated from './queryUpdated';
import queryIsNewUpdated from './queryIsNewUpdated';
import editingQuestion from './editingQuestion';
import responsePaused from './responsePaused';
import progressBarLengthUpdated from './progressBarLengthUpdated';
import threadIsBookmarkedUpdated from './threadIsBookmarkedUpdated';
import threadUpdated from './threadUpdated';
import threadNameUpdated from './threadNameUpdated';
import reqresAdded from './queryAdded';

const dispatchEvent = {
  agentAdded,
  threadNameUpdated,
  tabsUpdated,
  reqresAdded,
  queryDeleted,
  queryUpdated,
  queryIsNewUpdated,
  editingQuestion,
  responsePaused,
  progressBarLengthUpdated,
  threadIsBookmarkedUpdated,
  threadUpdated
};

export default dispatchEvent;