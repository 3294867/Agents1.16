import express from "express";
import getAgents from "./controllers/getAgents";
import createThread from "./controllers/createThread";
import getThread from "./controllers/getThread";
import createResponse from "./controllers/createResponse";

const router = express.Router();

router.post("/get-agents", getAgents);
router.post("/get-thread", getThread);
router.post("/create-thread", createThread);
router.post("/create-response", createResponse)

export default router;