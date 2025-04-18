import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  image: String,
  role: {
    type: String,
    enum: ['user', 'editor'],
    default: 'user',
  },
  editorRequest: {
    type: Boolean,
    default: false,
  },
  authProviders: [{
    type: String,
    enum: ['google', 'linkedin', 'credentials'],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema); 