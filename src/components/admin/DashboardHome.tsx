import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FolderKanban, MessageSquare, Users, ArrowRight, Clock, Plus, Star } from 'lucide-react';
import { blogService, projectService, contactService } from '../../services/api';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    draftBlogs: 0,
    totalProjects: 0,
    featuredProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch stats
        const [blogsResponse, projectsResponse, messagesResponse] = await Promise.all([
          blogService.getBlogs(false), // Get all blogs including drafts
          projectService.getProjects(),
          contactService.getContacts()
        ]);
        
        // Calculate stats
        const blogs = blogsResponse.data;
        const projects = projectsResponse.data;
        const messages = messagesResponse.data;
        
        setStats({
          totalBlogs: blogs.length,
          draftBlogs: blogs.filter(blog => !blog.published).length,
          totalProjects: projects.length,
          featuredProjects: projects.filter(project => project.featured).length,
          totalMessages: messages.length,
          unreadMessages: messages.filter(message => !message.read).length,
        });
        
        // Set recent blogs and messages (latest 5)
        setRecentBlogs(blogs.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));
        setRecentMessages(messages.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Stat card component
  const StatCard = ({ icon, title, value, color, onClick }) => (
    <div 
      onClick={onClick}
      className={`relative group overflow-hidden cursor-pointer`}
    >
      <div className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
      <div className="border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-lg ${color.replace('bg-', 'bg-')}/20 flex items-center justify-center`}>
            {icon}
          </div>
          <ArrowRight size={20} className="text-gray-600 group-hover:text-gray-400 transition-colors duration-200" />
        </div>
        <h3 className="mt-4 text-2xl font-bold">{value}</h3>
        <p className="text-gray-500">{title}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<FileText size={24} className="text-purple-400" />}
          title="Total Blog Posts"
          value={stats.totalBlogs}
          color="bg-purple-500"
          onClick={() => navigate('/admin/blogs')}
        />
        <StatCard 
          icon={<FileText size={24} className="text-gray-400" />}
          title="Draft Posts"
          value={stats.draftBlogs}
          color="bg-gray-500"
          onClick={() => navigate('/admin/blogs')}
        />
        <StatCard 
          icon={<FolderKanban size={24} className="text-blue-400" />}
          title="Total Projects"
          value={stats.totalProjects}
          color="bg-blue-500"
          onClick={() => navigate('/admin/projects')}
        />
        <StatCard 
          icon={<Star size={24} className="text-yellow-400" />}
          title="Featured Projects"
          value={stats.featuredProjects}
          color="bg-yellow-500"
          onClick={() => navigate('/admin/projects')}
        />
        <StatCard 
          icon={<MessageSquare size={24} className="text-green-400" />}
          title="Total Messages"
          value={stats.totalMessages}
          color="bg-green-500"
          onClick={() => navigate('/admin/messages')}
        />
        <StatCard 
          icon={<MessageSquare size={24} className="text-red-400" />}
          title="Unread Messages"
          value={stats.unreadMessages}
          color="bg-red-500"
          onClick={() => navigate('/admin/messages')}
        />
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <div className="relative group">
          <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
          <div className="border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText size={20} className="text-purple-400" />
                Recent Blog Posts
              </h2>
              <button 
                onClick={() => navigate('/admin/blogs/new')}
                className="p-1.5 rounded-full bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors duration-200"
                title="New Blog Post"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {recentBlogs.length > 0 ? (
              <div className="space-y-4">
                {recentBlogs.map(blog => (
                  <div 
                    key={blog._id}
                    onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-900 cursor-pointer transition-colors duration-200"
                  >
                    <div className="w-10 h-10 rounded bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="text-purple-400" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">{blog.title}</h3>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${blog.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        {formatDate(blog.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No blog posts yet
              </div>
            )}
            
            {recentBlogs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <button
                  onClick={() => navigate('/admin/blogs')}
                  className="flex items-center justify-center w-full gap-1 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  View all blog posts
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Messages */}
        <div className="relative group">
          <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
          <div className="border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare size={20} className="text-green-400" />
                Recent Messages
              </h2>
            </div>
            
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map(message => (
                  <div 
                    key={message._id}
                    onClick={() => navigate('/admin/messages')}
                    className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-900 cursor-pointer transition-colors duration-200 ${!message.read ? 'border-l-2 border-green-500' : ''}`}
                  >
                    <div className="w-10 h-10 rounded bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Users className="text-green-400" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium truncate ${!message.read ? 'text-white' : 'text-gray-300'}`}>
                          {message.name}
                        </h3>
                        {!message.read && (
                          <span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">{message.subject}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        {formatDate(message.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No messages yet
              </div>
            )}
            
            {recentMessages.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <button
                  onClick={() => navigate('/admin/messages')}
                  className="flex items-center justify-center w-full gap-1 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  View all messages
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;