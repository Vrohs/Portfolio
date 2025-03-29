import { useState } from 'react';
import { Mail, Github, Linkedin, Twitter, ExternalLink, Calendar, FileText, MessageSquare, Link } from 'lucide-react';

const ContactForm = () => {
  return (
    <div className="relative">
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-3xl opacity-30 animate-pulse"></div>
      
      {/* Main container */}
      <div className="relative border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm bg-black/40 p-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="h-16 w-16 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 mx-auto">
            <Link className="text-blue-400" size={28} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Let's Connect</h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            Feel free to reach out for collaborations, questions, or just to say hello! 
            I'm always open to discussing new projects and opportunities.
          </p>
        </div>
        
        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Email */}
          <a 
            href="mailto:vivekrohtasvi2002@gmail.com" 
            className="group flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-blue-900/10 to-blue-800/5 border border-blue-900/20 hover:border-blue-700/30 transition-all duration-300"
          >
            <div className="h-14 w-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Mail className="text-blue-400" size={24} />
            </div>
            <h3 className="font-medium text-white mb-2">Email</h3>
            <p className="text-sm text-gray-400 text-center break-all">vivekrohtasvi2002@gmail.com</p>
          </a>
          
          {/* GitHub */}
          <a 
            href="https://github.com/Vrohs" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-purple-900/10 to-purple-800/5 border border-purple-900/20 hover:border-purple-700/30 transition-all duration-300"
          >
            <div className="h-14 w-14 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Github className="text-purple-400" size={24} />
            </div>
            <h3 className="font-medium text-white mb-2">GitHub</h3>
            <p className="text-sm text-gray-400 text-center">Check out my projects</p>
          </a>
          
          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/vivek-rohtasvi-20897b202/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-cyan-900/10 to-cyan-800/5 border border-cyan-900/20 hover:border-cyan-700/30 transition-all duration-300"
          >
            <div className="h-14 w-14 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Linkedin className="text-cyan-400" size={24} />
            </div>
            <h3 className="font-medium text-white mb-2">LinkedIn</h3>
            <p className="text-sm text-gray-400 text-center">Connect professionally</p>
          </a>
          
          {/* Twitter/X */}
          <a 
            href="https://x.com/rohsfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-pink-900/10 to-pink-800/5 border border-pink-900/20 hover:border-pink-700/30 transition-all duration-300"
          >
            <div className="h-14 w-14 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Twitter className="text-pink-400" size={24} />
            </div>
            <h3 className="font-medium text-white mb-2">Twitter</h3>
            <p className="text-sm text-gray-400 text-center">Follow for updates</p>
          </a>
        </div>
        
        {/* Additional Contact Options */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-medium text-white mb-4 text-center">More Ways to Connect</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Schedule a Call */}
            <a 
              href="https://calendly.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors duration-300"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="text-emerald-400" size={18} />
              </div>
              <div>
                <h4 className="text-white font-medium">Schedule a Call</h4>
                <p className="text-xs text-gray-400">Book a time on my calendar</p>
              </div>
            </a>
            
            {/* Resume/CV */}
            <a 
              href="/resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors duration-300"
            >
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="text-amber-400" size={18} />
              </div>
              <div>
                <h4 className="text-white font-medium">Download CV</h4>
                <p className="text-xs text-gray-400">Get my resume</p>
              </div>
            </a>
            
            {/* Discord */}
            <a 
              href="https://discord.gg/your-discord" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors duration-300"
            >
              <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="text-indigo-400" size={18} />
              </div>
              <div>
                <h4 className="text-white font-medium">Discord</h4>
                <p className="text-xs text-gray-400">Join my community</p>
              </div>
            </a>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-full h-1/2 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
        </div>
      </div>
      
      {/* Footer note */}
      <p className="text-center text-gray-500 text-sm mt-6">
        I'll respond to your message as soon as possible, typically within 24-48 hours.
      </p>
    </div>
  );
};

export default ContactForm;