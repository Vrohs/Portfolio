import { useState, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';
import Login from './components/admin/Login';
import DashboardLayout from './components/admin/DashboardLayout';
import DashboardHome from './components/admin/DashboardHome';
import BlogsManagement from './components/admin/BlogsManagement';
import ProjectsManagement from './components/admin/ProjectsManagement';
import MessagesManagement from './components/admin/MessagesManagement';
import { Github, Linkedin, Twitter, Mail, Code2, Trophy, BookOpen, ExternalLink, FileText, GitPullRequest, Clock } from 'lucide-react';
import ContactForm from './components/ContactForm';

// Protected route component
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(authService.isAuthenticated());
  
  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
  };
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={
          isAdminLoggedIn ? 
            <Navigate to="/admin" replace /> : 
            <Login onLoginSuccess={handleLoginSuccess} />
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          
          {/* Blog Management Routes */}
          <Route path="blogs" element={<BlogsManagement />} />
          <Route path="blogs/new" element={<div className="p-6 bg-gray-900 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Create New Blog Post</h2>
            {/* Blog creation form will be implemented here */}
            <p className="text-gray-400">Blog creation form will be implemented here</p>
          </div>} />
          <Route path="blogs/edit/:id" element={<div className="p-6 bg-gray-900 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Edit Blog Post</h2>
            {/* Blog edit form will be implemented here */}
            <p className="text-gray-400">Blog edit form will be implemented here</p>
          </div>} />
          
          {/* Project Management Routes */}
          <Route path="projects" element={<ProjectsManagement />} />
          <Route path="projects/new" element={<div className="p-6 bg-gray-900 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
            {/* Project creation form will be implemented here */}
            <p className="text-gray-400">Project creation form will be implemented here</p>
          </div>} />
          <Route path="projects/edit/:id" element={<div className="p-6 bg-gray-900 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Edit Project</h2>
            {/* Project edit form will be implemented here */}
            <p className="text-gray-400">Project edit form will be implemented here</p>
          </div>} />
          
          {/* Messages Management Route */}
          <Route path="messages" element={<MessagesManagement />} />
          
          {/* Settings Route */}
          <Route path="settings" element={<div className="p-6 bg-gray-900 rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>
            {/* Settings form will be implemented here */}
            <p className="text-gray-400">Settings form will be implemented here</p>
          </div>} />
        </Route>
        
        {/* Public Portfolio Route */}
        <Route path="/" element={
          <div className="min-h-screen bg-black text-white">
            
            {/* bg */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10 animate-gradient"></div>
              <header className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col items-start space-y-8">
                    <div className="relative">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <img 
                          src="src/WhatsApp Image 2025-01-20 at 22.07.13.jpeg"
                          alt="Vivekanand Rohtasvi"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                        Vivekanand Rohtasvi
                      </h1>
                      <p className="mt-4 text-xl text-gray-400 max-w-2xl">
                        Building the future of tech, block by block. Computer Science Undergraduate niched in Security and Blockchain.
                      </p>
                    </div>
                    <div className="flex gap-6">
                      <a href="https://github.com/Vrohs" target="_blank" rel="noopener noreferrer" 
                         className="transform hover:scale-110 transition-transform duration-200">
                        <Github size={28} className="text-gray-400 hover:text-white" />
                      </a>
                      <a href="https://www.linkedin.com/in/vivek-rohtasvi-20897b202/" target="_blank" rel="noopener noreferrer"
                         className="transform hover:scale-110 transition-transform duration-200">
                        <Linkedin size={28} className="text-gray-400 hover:text-white" />
                      </a>
                      <a href="https://x.com/gaming_roh" target="_blank" rel="noopener noreferrer"
                         className="transform hover:scale-110 transition-transform duration-200">
                        <Twitter size={28} className="text-gray-400 hover:text-white" />
                      </a>
                      <a href="mailto:vivekrohtasvi2002@gmail.com"
                         className="transform hover:scale-110 transition-transform duration-200">
                        <Mail size={28} className="text-gray-400 hover:text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </header>
            </div>

            <main className="container mx-auto px-6 py-20">

              <section className="mb-32">
                <div className="flex items-center gap-3 mb-12">
                  <Code2 className="text-blue-500" size={32} />
                  <h2 className="text-3xl font-bold">Tech Stack</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: 'Frontend Mastery',
                      skills: ['React.js', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Tailwind CSS'],
                      gradient: 'from-blue-500 to-cyan-500'
                    },
                    {
                      title: 'Backend Excellence',
                      skills: ['Node.js', 'Express.js', 'MongoDB', 'Python', 'Java', 'C++'],
                      gradient: 'from-purple-500 to-pink-500'
                    },
                    {
                      title: 'Blockchain Innovation',
                      skills: ['Solidity', 'Web3.js', 'Smart Contracts', 'DeFi', 'Carbon Credits'],
                      gradient: 'from-orange-500 to-red-500'
                    }
                  ].map((category) => (
                    <div key={category.title} 
                         className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                      <div className="border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors duration-300">
                        <h3 className="text-xl font-semibold mb-6">{category.title}</h3>
                        <div className="flex flex-wrap gap-3">
                          {category.skills.map((skill) => (
                            <span key={skill} 
                                  className="px-4 py-2 bg-gray-900 rounded-full text-sm text-gray-300 hover:text-white transition-colors duration-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Active Projects Section */}
              <section className="mb-32">
                <div className="flex items-center gap-3 mb-12">
                  <Clock className="text-blue-500" size={32} />
                  <h2 className="text-3xl font-bold">Current Projects</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      title: "Blockchain Security Framework",
                      description: "Developing a comprehensive security framework for DeFi applications that focuses on vulnerability assessment and mitigation strategies.",
                      tags: ["Security", "DeFi", "Smart Contracts", "Auditing"],
                      link: "https://github.com/Vrohs/blockchain-security-framework",
                      progress: 65
                    },
                    {
                      title: "Decentralized Identity Solution",
                      description: "Building a self-sovereign identity system using blockchain technology that gives users control over their personal data.",
                      tags: ["Identity", "Blockchain", "Privacy", "Zero-Knowledge Proofs"],
                      link: "https://github.com/Vrohs/decentralized-identity",
                      progress: 40
                    }
                  ].map((project) => (
                    <div key={project.title} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                      <div className="border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold">{project.title}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                            </div>
                            <span>{project.progress}%</span>
                          </div>
                        </div>
                        <p className="text-gray-400 mb-4 text-sm">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-gray-900 text-gray-300 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm"
                        >
                          <Github size={16} />
                          View Repository
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-32">
                <div className="flex items-center gap-3 mb-12">
                  <Trophy className="text-blue-500" size={32} />
                  <h2 className="text-3xl font-bold">Featured Project</h2>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                  <div className="border border-gray-800 rounded-xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                      <div className="space-y-6">
                        <h3 className="text-2xl font-bold">TerraToken.io</h3>
                        <p className="text-gray-400 leading-relaxed">
                          A revolutionary blockchain-based platform for trading carbon credits, 
                          promoting environmental sustainability through decentralized finance. 
                          This project earned recognition as a HackIndia National Finalist.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {['Blockchain', 'DeFi', 'Carbon Credits', 'Smart Contracts'].map((tech) => (
                            <span key={tech} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <a 
                          href="https://github.com/Vrohs/TerraToken.io" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg transition-colors duration-200"
                        >
                          <Github size={20} />
                          View Project
                          <ExternalLink size={16} />
                        </a>
                      </div>
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?auto=format&fit=crop&w=800&q=80"
                          alt="Project Preview"
                          className="rounded-lg w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* GitHub Contributions Section */}
              <section className="mb-32">
                <div className="flex items-center gap-3 mb-12">
                  <GitPullRequest className="text-blue-500" size={32} />
                  <h2 className="text-3xl font-bold">Open Source Contributions</h2>
                </div>
                <div className="space-y-6">
                  {[
                    {
                      repo: "ethereum/solidity",
                      title: "Improved Gas Optimization in the Smart Contract Compiler",
                      description: "Implemented a new optimization pass in the Solidity compiler that reduces gas consumption by up to 12% for complex contract deployments.",
                      prLink: "https://github.com/ethereum/solidity/pull/15230",
                      status: "Merged",
                      statusColor: "green"
                    },
                    {
                      repo: "ipfs/go-ipfs",
                      title: "Enhanced Security in Content Addressing",
                      description: "Added improved validation checks for content identifiers to prevent potential hash collision attacks in distributed storage networks.",
                      prLink: "https://github.com/ipfs/go-ipfs/pull/9432",
                      status: "In Review",
                      statusColor: "yellow"
                    },
                    {
                      repo: "OpenZeppelin/openzeppelin-contracts",
                      title: "Bug Fix in ERC20 Token Implementation",
                      description: "Fixed a critical vulnerability in the standard ERC20 implementation that could lead to potential reentrancy attacks under specific conditions.",
                      prLink: "https://github.com/OpenZeppelin/openzeppelin-contracts/pull/3587",
                      status: "Merged",
                      statusColor: "green"
                    }
                  ].map((contribution, index) => (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
                      <div className="border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Contribution to <span className="text-blue-400">{contribution.repo}</span></div>
                            <h3 className="text-lg font-semibold">{contribution.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-xs rounded-full bg-${contribution.statusColor}-500/20 text-${contribution.statusColor}-400`}>
                              {contribution.status}
                            </span>
                            <a 
                              href={contribution.prLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors duration-200"
                            >
                              View PR <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">{contribution.description}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center mt-8">
                    <a 
                      href="https://github.com/Vrohs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 border border-blue-800 hover:border-blue-700 px-6 py-3 rounded-lg transition-all duration-200"
                    >
                      <Github size={20} />
                      View All Contributions
                    </a>
                  </div>
                </div>
              </section>

              {/* Technical Blogs Section */}
              <section className="mb-32">
                <div className="flex items-center gap-3 mb-12">
                  <FileText className="text-blue-500" size={32} />
                  <h2 className="text-3xl font-bold">Technical Blog</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Demystifying Zero-Knowledge Proofs",
                      date: "March 15, 2025",
                      description: "An in-depth exploration of ZK-proofs and their applications in blockchain privacy and scalability solutions.",
                      link: "#",
                      tags: ["Cryptography", "Privacy", "Blockchain"],
                      image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=800&q=80"
                    },
                    {
                      title: "The Future of Smart Contract Security",
                      date: "February 28, 2025",
                      description: "Analyzing emerging patterns in smart contract vulnerabilities and innovative approaches to secure decentralized applications.",
                      link: "#",
                      tags: ["Security", "Smart Contracts", "Auditing"],
                      image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?auto=format&fit=crop&w=800&q=80"
                    },
                    {
                      title: "Building Scalable dApps with Layer 2 Solutions",
                      date: "January 22, 2025",
                      description: "A technical comparison of different Layer 2 scaling solutions for Ethereum and how to implement them in your applications.",
                      link: "#",
                      tags: ["Scaling", "Ethereum", "Development"],
                      image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=800&q=80"
                    }
                  ].map((blog, index) => (
                    <div key={index} className="relative group h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                      <div className="border border-gray-800 rounded-xl overflow-hidden h-full flex flex-col hover:border-gray-700 transition-colors duration-300">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="text-xs text-gray-500 mb-2">{blog.date}</div>
                          <h3 className="text-lg font-bold mb-3">{blog.title}</h3>
                          <p className="text-gray-400 text-sm mb-4 flex-grow">{blog.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-gray-900 text-gray-300 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <a 
                            href={blog.link} 
                            className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 mt-auto"
                          >
                            Read Article <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-12">
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 border border-purple-900 hover:border-purple-800 px-6 py-3 rounded-lg transition-all duration-200"
                  >
                    View All Articles
                    <ExternalLink size={16} />
                  </a>
                </div>
              </section>

              {/* Contact Form Section */}
              <section className="mb-32">
                <div className="flex items-center gap-3 mb-12">
                  <Mail className="text-blue-500" size={32} />
                  <h2 className="text-3xl font-bold">Contact Me</h2>
                </div>
                <ContactForm />
              </section>

              {/* Education */}
              <section>
                <div className="flex items-center gap-3 mb-12">
                  <BookOpen className="text-blue-500" size={32} />
                  <h2 className="text-3xl font-bold">Education</h2>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
                  <div className="border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors duration-300">
                    <h3 className="text-2xl font-bold mb-2">Bachelor of Technology</h3>
                    <p className="text-gray-400">Computer Science | Final Year Undergraduate</p>
                    <div className="mt-4 bg-gray-900/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-300">Specialization in <span className="text-blue-400">Cybersecurity</span> and <span className="text-purple-400">Blockchain Technology</span></p>
                      <p className="text-sm text-gray-400 mt-2">Thesis Project: "Secure Cross-Chain Communication Protocols for Interoperable Blockchains"</p>
                    </div>
                  </div>
                </div>
              </section>
            </main>

            <footer className="container mx-auto px-6 py-12 text-center text-gray-500 border-t border-gray-800">
              <div className="flex justify-center gap-8 mb-8">
                <a href="https://github.com/Vrohs" target="_blank" rel="noopener noreferrer" 
                   className="transform hover:scale-110 transition-transform duration-200">
                  <Github size={24} className="text-gray-600 hover:text-gray-400" />
                </a>
                <a href="https://www.linkedin.com/in/vivek-rohtasvi-20897b202/" target="_blank" rel="noopener noreferrer"
                   className="transform hover:scale-110 transition-transform duration-200">
                  <Linkedin size={24} className="text-gray-600 hover:text-gray-400" />
                </a>
                <a href="https://x.com/gaming_roh" target="_blank" rel="noopener noreferrer"
                   className="transform hover:scale-110 transition-transform duration-200">
                  <Twitter size={24} className="text-gray-600 hover:text-gray-400" />
                </a>
                <a href="mailto:vivekrohtasvi2002@gmail.com"
                   className="transform hover:scale-110 transition-transform duration-200">
                  <Mail size={24} className="text-gray-600 hover:text-gray-400" />
                </a>
              </div>
              <p className="text-sm">© {new Date().getFullYear()} Vivekanand Rohtasvi. All rights reserved.</p>
              <p className="text-xs mt-2 text-gray-600">Crafted with precision and passion</p>
            </footer>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;