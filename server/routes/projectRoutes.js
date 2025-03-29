import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject,
  updateProgress, 
  deleteProject 
} from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/projects/'));
  },
  filename: function(req, file, cb) {
    cb(null, `project-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB max file size
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// Check file type helper function
function checkFileType(file, cb) {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|webp/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes
router.post('/', protect, admin, upload.single('image'), createProject);
router.put('/:id', protect, admin, upload.single('image'), updateProject);
router.patch('/:id/progress', protect, admin, updateProgress);
router.delete('/:id', protect, admin, deleteProject);

export default router;