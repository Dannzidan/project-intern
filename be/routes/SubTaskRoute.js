import express from "express";
import { createSubTask, getSubTasks, getSubtaskId, updateSubTasks, deleteSubTask } from "../controllers/SubTask.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.post("/subtasks", verifyUser, createSubTask);
router.get("/subtasks/:id", verifyUser, getSubTasks);
router.get("/subtaskbyuuid/:id", verifyUser, getSubtaskId);
router.patch("/subtasks/:id", verifyUser, updateSubTasks);
router.delete("/subtasks/:id", verifyUser, deleteSubTask);

export default router;
