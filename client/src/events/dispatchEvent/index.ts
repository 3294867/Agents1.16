import agentAdded from './agentAdded';
import threadTitleUpdated from './threadTitleUpdated';
import tabsUpdated from './tabsUpdated';
import queryAdded from './queryAdded';
import queryDeleted from './queryDeleted';
import queryUpdated from './queryUpdated';
import queryIsNewUpdated from './queryIsNewUpdated';
import editingQuestion from './editingQuestion';
import responsePaused from './responsePaused';
import progressBarLengthUpdated from './progressBarLengthUpdated';
import threadIsBookmarkedUpdated from './threadIsBookmarkedUpdated';
import threadUpdated from './threadUpdated';

const dispatchEvent = {
  agentAdded,
  threadTitleUpdated,
  tabsUpdated,
  queryAdded,
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