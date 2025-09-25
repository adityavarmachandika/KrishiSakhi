import { get_task_service,fetch_all_tasks,delete_task_service } from "../services/tasks";


// export const  create_tasks= async(req,res)=>{
//     try{
//         const task=req.body;
//         const result = await get_task_service(task);

//         if (result.success) {
//             res.status(200).json({ success: true, data: result.data });
//         } else {
//             res.status(400).json({ success: false, error: result.error });
//         }
//     } 
//     catch(error){
//         console.error("Error creating task:", error);
//         res.status(500).json({ success: false, error: "Database error" });
//     }
// };

export const fetch_all_tasks= async(req,res)=>{
    try {
        const farmer_id=req.params.farmer_id;
        const result=await fetch_all_tasks(farmer_id);
        if(result.success){
            res.status(200).json({ success: true, data: result.data });
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ success: false, error: "Database error" });
    }
}

export const delete_task=async(req,res)=>{
    try {
        const task_id=req.params.task_id;
        const result=await delete_task_service(task_id);
        if(result.success){
            res.status(200).json({ success: true, data: result.data });
        }
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ success: false, error: "Database error" });
    }
}