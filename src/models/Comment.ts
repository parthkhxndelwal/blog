import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  blog: mongoose.Types.ObjectId;
  name: string;
  email: string;
  content: string;
  createdAt: Date;
  approved: boolean;
}

const CommentSchema: Schema = new Schema({
  blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }
});

// Ensure model is not redefined during hot reloading
const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment; 