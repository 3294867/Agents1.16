import express from "express";
import getAgents from "./controllers/getAgents";
import getAgent from './controllers/getAgent';
import getThread from "./controllers/getThread";
import createThread from "./controllers/createThread";
import addQuery from './controllers/addQuery';
import deleteQuery from './controllers/deleteQuery';
import updateRequestBody from './controllers/updateRequestBody';
import updateResponseBody from './controllers/updateResponseBody';
import createThreadTitle from "./controllers/createThreadTitle";
import updateThreadTitle from './controllers/updateThreadTitle';
import removeThreadTitle from './controllers/removeThreadTitle';
import updateThreadIsBookmarked from './controllers/updateThreadIsBookmarked';
import createResponse from "./controllers/createResponse";

const router = express.Router();

router.post("/get-agents", getAgents);
router.post("/get-agent", getAgent);
router.post("/get-thread", getThread);
router.post("/create-thread", createThread);
router.post("/add-query", addQuery);
router.post("/delete-query", deleteQuery);
router.post("/update-request-body", updateRequestBody);
router.post("/update-response-body", updateResponseBody);
router.post("/create-thread-title", createThreadTitle);
router.post("/update-thread-title", updateThreadTitle);
router.post("/remove-thread-title", removeThreadTitle);
router.post("/update-thread-is-bookmarked", updateThreadIsBookmarked);
router.post("/create-response", createResponse);

export default router;