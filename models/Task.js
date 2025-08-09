import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['À faire', 'En cours', 'En révision', 'Terminé'], default: 'À faire' },
  priority: { type: String, enum: ['Basse', 'Moyenne', 'Haute'], default: 'Moyenne' },
  dueDate: Date,
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
