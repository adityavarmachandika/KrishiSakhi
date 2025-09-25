import express from 'express';


const task_router = express.Router();



task_router.get('/fetch_tasks/:farmer_id', async (req, res) => {
    try {
        const farmer_id = req.params.farmer_id;
        const result = await fetch_all_tasks(farmer_id);
        if (result.success) {
            res.status(200).json({ success: true, data: result.data });
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ success: false, error: "Database error" });
    }
});

task_router.delete('/delete_task/:task_id', async (req, res) => {
    try {
        const task_id = req.params.task_id;
        const result = await delete_task_service(task_id);
        if (result.success) {
            res.status(200).json({ success: true, data: result.data });
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ success: false, error: "Database error" });
    }
});

export default task_router;