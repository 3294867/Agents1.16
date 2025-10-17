import express from "express";
import controllers from './controllers';

const router = express.Router();

router.post("/sign-up", controllers.signUp);
router.post("/log-in", controllers.login);
router.post("/logout", controllers.logout);
router.get("/get-current-user", controllers.getCurrentUser);
router.post("/get-workspaces", controllers.getWorkspaces),
router.post("/get-workspace-id", controllers.getWorkspaceId)
router.post("/get-agent", controllers.getAgent);
router.post("/get-agent-id", controllers.getAgentId);
router.post("/get-agent-names", controllers.getAgentNames);
router.post("/get-agent-updated-at", controllers.getAgentUpdatedAt);
router.post("/get-agent-by-type", controllers.getAgentByType);
router.post("/add-agent", controllers.addAgent);
router.get("/get-available-agents", controllers.getAvailableAgents);
router.post("/get-available-agent-by-type", controllers.getAvailableAgentByType)
router.post("/get-thread", controllers.getThread);
router.post("/add-thread", controllers.addThread);
router.post("/add-public-thread", controllers.addPublicThread);
router.post("/duplicate-thread", controllers.duplicateThread);
router.post("/delete-thread", controllers.deleteThread);
router.post("/add-reqres", controllers.addReqRes);
router.post("/delete-reqres", controllers.deleteReqRes);
router.post("/update-request-body", controllers.updateRequestBody);
router.post("/update-response-body", controllers.updateResponseBody);
router.post("/create-thread-name", controllers.createThreadName);
router.post("/update-thread-name", controllers.updateThreadName);
router.post("/remove-thread-name", controllers.removeThreadName);
router.post("/update-thread-is-bookmarked", controllers.updateThreadIsBookmarked);
router.post("/create-response", controllers.createResponse);
router.post("/infer-agent-type", controllers.inferAgentType);
router.post("/get-thread-updated-at", controllers.getThreadUpdatedAt);
router.post("/get-workspaces-updated-at", controllers.getWorkspacesUpdatedAt);
router.post("/get-workspace-members", controllers.getWorkspaceMembers);
router.post("/update-member-role", controllers.updateMemberRole);
router.post("/get-users", controllers.getUsers);
router.post("/invite-user", controllers.inviteUser);
router.post("/get-notifications", controllers.getNotifications);
router.post("/accept-workspace-invite", controllers.acceptWorkspaceInvite);
router.post("/decline-workspace-invite", controllers.declineWorkspaceInvite);
router.post("/dismiss-workspace-invite", controllers.dismissWorkspaceInvite);

export default router;