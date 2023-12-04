import express from 'express';
import {
    createTrialTasks,
    getTrialTasks,
    getTrialtaskId,
    updateTrialTasks,
    deleteTrialTask
} from "../controllers/TrialTasks.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/trial-tasks/:id", verifyUser, getTrialTasks);
router.get('/trial-tasks',verifyUser ,getTrialTasks );
router.get("/trial-tasks-by-uuid/:id", verifyUser, getTrialtaskId);
router.post("/trial-tasks", verifyUser, createTrialTasks);
router.patch("/trial-tasks/:id", verifyUser, updateTrialTasks);
router.delete("/trial-tasks/:id", verifyUser, deleteTrialTask);

export default router;