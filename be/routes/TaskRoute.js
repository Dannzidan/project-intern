import express from 'express';
import {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} from "../controllers/Tasks.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/tasks',verifyUser ,getTasks );
router.get('/tasks/:id',verifyUser ,getTaskById);
router.post('/tasks',verifyUser ,createTask);
router.patch('/tasks/:id',verifyUser ,updateTask);
router.delete('/tasks/:id',verifyUser ,deleteTask);

export default router;