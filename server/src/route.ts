import express from "express";
import getAgents from './controllers/getAgents';
import createThread from './controllers/createThread';
import getThread from './controllers/getThread';

const router = express.Router();

router.post("/get-agents", getAgents);
router.post("/get-thread", getThread);
router.post("/create-thread", createThread);

export default router;