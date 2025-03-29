import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderKanban, MessageSquare, LogOut, Menu, X, Settings, User } from 'lucide-react';
import { authService } from '../../services/api';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };
  
  const navigationItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin" },
    { icon: <FileText size={20} />, label: "Blogs", path: "/admin/blogs" },
    { icon: <FolderKanban size={20} />, label: "Projects", path: "/admin/projects" },
    { icon: <MessageSquare size={20} />, label: "Messages", path: "/admin/messages" },
    { icon: <Settings size={20} />, label: "Settings", path: "/admin/settings" },
  ];
  
  // Check if current path matches navigation item
  const isActivePath = (path) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-gray-950 border-r border-gray-800 transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="px-4 py-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="font-bold text-lg">Admin Portal</span>
              </Link>
              <button 
                className="lg:hidden p-1 rounded-md hover:bg-gray-800"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigationItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActivePath(item.path)
                        ? 'bg-blue-600/10 text-blue-500'
                        : 'hover:bg-gray-900 text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sidebar footer */}
          <div className="px-4 py-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-gray-950 border-b border-gray-800 py-4 px-6 flex items-center justify-between">
          <button 
            className="lg:hidden p-2 rounded-md hover:bg-gray-800"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <h1 className="text-xl font-semibold lg:hidden">Admin Portal</h1>
          
          <div className="flex items-center gap-4">
            {/* Optional: Add profile, notifications, etc. */}
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;