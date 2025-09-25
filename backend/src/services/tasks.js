    import { date } from "zod";
    import { task_schema } from "../models/tasks";

    export const get_task_service = async (task) => {
        try {
            const datee = new date();
            datee.setDate(datee.getDate() + 2);

            const new_task = new task_schema({
                crop_id: task.crop_id,
                farmer_id: task.farmer_id,
                task: task.task,
                date: datee,
                notes: task.notes,
            });
            const saved_task = await new_task.save();
            return { success: true, data: saved_task };
        } catch (error) {
            console.error("Error saving task:", error);
            return { success: false, error: "Failed to save task" };
        }
    }

    export const fetch_all_tasks=async (farmer_id)=>{
        try {
            const tasks = await task_schema.find({ farmer_id: farmer_id });
            return { success: true, data: tasks };
        } catch (error) {
            console.error("Error fetching tasks:", error);
            return { success: false, error: "Failed to fetch tasks" };
        }
    }


    export const delete_task_service=async (task_id)=>{
        try {
            const deleted_task = await task_schema.findByIdAndDelete(task_id);
            if (!deleted_task) {
                return { success: false, error: "Task not found" };
            }
            return { success: true, data: deleted_task };
        }
        catch (error) {
            console.error("Error deleting task:", error);
            return { success: false, error: "Failed to delete task" };
        }
}