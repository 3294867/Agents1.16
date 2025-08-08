import express from "express";
import getAgents from "./controllers/getAgents";
import getAgentByName from './controllers/getAgentByName';
import addAgent from './controllers/addAgent';
import getAvailableAgents from './controllers/getAvailableAgents';
import getAvailableAgent from './controllers/getAvailableAgent';
import getThread from "./controllers/getThread";
import addThread from './controllers/addThread';
import deleteThread from './controllers/deleteThread';
import addQuery from './controllers/addQuery';
import deleteQuery from './controllers/deleteQuery';
import updateRequestBody from './controllers/updateRequestBody';
import updateResponseBody from './controllers/updateResponseBody';
import createThreadTitle from "./controllers/createThreadTitle";
import updateThreadTitle from './controllers/updateThreadTitle';
import removeThreadTitle from './controllers/removeThreadTitle';
import updateThreadIsBookmarked from './controllers/updateThreadIsBookmarked';
import createResponse from "./controllers/createResponse";
import inferAgentType from './controllers/inferAgentType';
import getThreadUpdatedAt from './controllers/getThreadUpdatedAt';
import getAgentsUpdatedAt from './controllers/getAgentsUpdatedAt';

const router = express.Router();

router.post("/get-agents", getAgents);
router.post("/get-agent-by-name", getAgentByName);
router.post("/add-agent", addAgent);
router.get("/get-available-agents", getAvailableAgents);
router.post("/get-available-agent", getAvailableAgent)
router.post("/get-thread", getThread);
router.post("/add-thread", addThread);
router.post("/delete-thread", deleteThread);
router.post("/add-query", addQuery);
router.post("/delete-query", deleteQuery);
router.post("/update-request-body", updateRequestBody);
router.post("/update-response-body", updateResponseBody);
router.post("/create-thread-title", createThreadTitle);
router.post("/update-thread-title", updateThreadTitle);
router.post("/remove-thread-title", removeThreadTitle);
router.post("/update-thread-is-bookmarked", updateThreadIsBookmarked);
router.post("/create-response", createResponse);
router.post("/infer-agent-type", inferAgentType);
router.post("/get-thread-updated-at", getThreadUpdatedAt);
router.post("/get-agents-updated-at", getAgentsUpdatedAt);

export default router;