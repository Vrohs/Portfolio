import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  repoLink: {
    type: String,
    required: [true, 'Please add repository link']
  },
  demoLink: {
    type: String
  },
  tags: {
    type: [String],
    required: true,
    default: []
  },
  image: {
    type: String,
    default: 'default-project.jpg'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Set updatedAt on save
ProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model('Project', ProjectSchema);
export default Project;