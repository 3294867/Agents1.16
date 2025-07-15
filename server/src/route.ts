import express from "express";
import getAgents from "./controllers/getAgents";
import getThread from "./controllers/getThread";
import createThread from "./controllers/createThread";
import updateThreadBody from './controllers/updateThreadBody';
import createThreadTitle from "./controllers/createThreadTitle";
import createResponse from "./controllers/createResponse";
import updateThreadTitle from './controllers/updateThreadTitle';

const router = express.Router();

router.post("/get-agents", getAgents);
router.post("/get-thread", getThread);
router.post("/create-thread", createThread);
router.post("/update-thread-body", updateThreadBody);
router.post("/create-thread-title", createThreadTitle);
router.post("/update-thread-title", updateThreadTitle);
router.post("/create-response", createResponse);

export default router;