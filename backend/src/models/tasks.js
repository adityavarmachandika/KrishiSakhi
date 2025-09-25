import mongoose from 'mongoose';
import zod from 'zod';
import { z } from 'zod';
import { farmer } from './farmer';



const taskSchema = new mongoose.Schema({
    crop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
    farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'farmer_details', required: true },
    task: { type: String, required: true },
    date: { type: Date, required: true },
    statuss: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    notes: { type: String },
})


//--for zod validation
export const task_schema = z.object({
    crop_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    farmer_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    task: z.string().min(1, "Task is required"),
    statuss: z.enum(['pending', 'completed']).optional(),
    notes: z.string().optional(),
});


