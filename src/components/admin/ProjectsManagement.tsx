import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Edit, Trash2, Plus, Eye, Star, ChevronUp, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { projectService } from '../../services/api';

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectService.getProjects();
      setProjects(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectService.deleteProject(id);
        setSuccessMessage('Project deleted successfully');
        fetchProjects(); // Refresh the list
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } catch (error) {
        console.error('Error deleting project:', error);
        setError('Failed to delete project');
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    }
  };

  const handleProgressUpdate = async (id, progress, change) => {
    // Ensure progress stays within 0-100 range
    const newProgress = Math.min(Math.max(progress + change, 0), 100);
    
    try {
      await projectService.updateProjectProgress(id, newProgress);
      setSuccessMessage('Project progress updated');
      
      // Update local state to avoid refetch
      setProjects(projects.map(project => 
        project._id === id ? { ...project, progress: newProgress } : project
      ));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating project progress:', error);
      setError('Failed to update progress');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button 
          onClick={() => navigate('/admin/projects/new')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 bg-red-900/30 text-red-400 p-4 rounded-lg">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="flex items-center gap-2 bg-green-900/30 text-green-400 p-4 rounded-lg">
          <CheckCircle size={20} />
          <p>{successMessage}</p>
        </div>
      )}
      
      <div className="relative group">
        <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
        <div className="border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Progress</th>
                  <th className="px-4 py-3 text-left">Tags</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <tr key={project._id} className="border-b border-gray-800 hover:bg-gray-900/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-blue-500/20 flex items-center justify-center">
                            <FolderKanban className="text-blue-400" size={18} />
                          </div>
                          <div>
                            <h4 className="font-medium">{project.title}</h4>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{project.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleProgressUpdate(project._id, project.progress, -5)}
                              className="p-1 rounded bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors duration-200"
                              title="Decrease by 5%"
                            >
                              <ChevronDown size={14} />
                            </button>
                            <button
                              onClick={() => handleProgressUpdate(project._id, project.progress, 5)}
                              className="p-1 rounded bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors duration-200"
                              title="Increase by 5%"
                            >
                              <ChevronUp size={14} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {project.tags && project.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-800 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                          {project.tags && project.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-800 text-xs rounded-full">
                              +{project.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Star className={project.featured ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'} size={18} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => window.open(`/projects/${project._id}`, '_blank')}
                            className="p-1.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors duration-200"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/projects/edit/${project._id}`)}
                            className="p-1.5 rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="p-1.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No projects yet. Click "New Project" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsManagement;