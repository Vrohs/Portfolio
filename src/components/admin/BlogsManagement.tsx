import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Edit, Trash2, Plus, Eye, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { blogService } from '../../services/api';

const BlogsManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'published', 'draft'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ loading: false, error: null });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await blogService.getBlogs(false); // Get all blogs including drafts
      setBlogs(response.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewBlog = () => {
    navigate('/admin/blogs/new');
  };

  const handleEditBlog = (id) => {
    navigate(`/admin/blogs/edit/${id}`);
  };

  const handleViewBlog = (slug) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  const confirmDelete = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;
    
    try {
      setDeleteStatus({ loading: true, error: null });
      await blogService.deleteBlog(blogToDelete._id);
      setBlogs(blogs.filter(blog => blog._id !== blogToDelete._id));
      setShowDeleteModal(false);
      setBlogToDelete(null);
      showToast('Blog deleted successfully');
    } catch (err) {
      console.error('Error deleting blog:', err);
      setDeleteStatus({ 
        loading: false, 
        error: 'Failed to delete. Please try again.' 
      });
    } finally {
      setDeleteStatus({ loading: false, error: null });
    }
  };

  const handlePublishToggle = async (blog) => {
    try {
      const updatedBlog = { ...blog, published: !blog.published };
      await blogService.updateBlog(blog._id, updatedBlog);
      
      // Update local state
      setBlogs(blogs.map(b => 
        b._id === blog._id ? { ...b, published: !b.published } : b
      ));
      
      showToast(`Blog ${updatedBlog.published ? 'published' : 'unpublished'} successfully`);
    } catch (err) {
      console.error('Error updating blog publish status:', err);
      showToast('Failed to update publish status', false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const showToast = (message, success = true) => {
    setToastMessage(message);
    setShowSuccessToast(success);
    setTimeout(() => {
      setShowSuccessToast(false);
      setToastMessage('');
    }, 3000);
  };

  const filteredBlogs = blogs
    .filter(blog => {
      // Apply search term filter
      if (searchTerm && !blog.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Apply published/draft filter
      if (filter === 'published' && !blog.published) return false;
      if (filter === 'draft' && blog.published) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (newest first)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <button
          onClick={handleNewBlog}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={18} />
          New Blog Post
        </button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-purple-600 transition-colors"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-600 transition-colors"
          >
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>
      
      {/* Blog List */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-2 text-red-500">{error}</p>
          <button 
            onClick={fetchBlogs} 
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
          >
            Try Again
          </button>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-800 rounded-lg bg-gray-900/50">
          <FileText className="mx-auto h-12 w-12 text-gray-600" />
          <p className="mt-2 text-gray-500">
            {searchTerm || filter !== 'all' 
              ? 'No blog posts match your filters' 
              : 'No blog posts yet'}
          </p>
          <button 
            onClick={handleNewBlog} 
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 mx-auto"
          >
            <Plus size={18} />
            Create Your First Blog Post
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-800">
                <th className="py-4 px-4 font-medium">Title</th>
                <th className="py-4 px-4 font-medium">Status</th>
                <th className="py-4 px-4 font-medium">Date</th>
                <th className="py-4 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr 
                  key={blog._id} 
                  className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="text-purple-400" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium">{blog.title}</h3>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {blog.summary || 'No summary'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span 
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        blog.published 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {blog.published ? (
                        <>
                          <CheckCircle size={14} />
                          Published
                        </>
                      ) : (
                        <>
                          <Clock size={14} />
                          Draft
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-500" />
                      {formatDate(blog.date)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handlePublishToggle(blog)}
                        className={`p-1.5 rounded-lg ${
                          blog.published 
                            ? 'text-gray-400 hover:text-gray-300 bg-gray-800 hover:bg-gray-700' 
                            : 'text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20'
                        } transition-colors`}
                        title={blog.published ? 'Unpublish' : 'Publish'}
                      >
                        {blog.published ? <Clock size={18} /> : <CheckCircle size={18} />}
                      </button>
                      
                      {blog.published && (
                        <button
                          onClick={() => handleViewBlog(blog.slug)}
                          className="p-1.5 rounded-lg text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                          title="View on site"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleEditBlog(blog._id)}
                        className="p-1.5 rounded-lg text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      
                      <button
                        onClick={() => confirmDelete(blog)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Delete Blog Post</h3>
            <p>
              Are you sure you want to delete "<span className="font-medium">{blogToDelete?.title}</span>"? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                disabled={deleteStatus.loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBlog}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                disabled={deleteStatus.loading}
              >
                {deleteStatus.loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
            {deleteStatus.error && (
              <p className="mt-3 text-sm text-red-500">{deleteStatus.error}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Success/Error Toast */}
      {toastMessage && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg flex items-center gap-2 z-50 transition-all duration-300 ${
          showSuccessToast 
            ? 'bg-green-500/20 text-green-400 border border-green-600/30' 
            : 'bg-red-500/20 text-red-400 border border-red-600/30'
        }`}>
          {showSuccessToast ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default BlogsManagement;