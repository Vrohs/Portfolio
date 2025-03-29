import { useState } from 'react';
import { Mail, Github, Linkedin, Twitter, ExternalLink, Calendar, FileText, MessageSquare, Link } from 'lucide-react';

// Define types for our data structures
interface ContactMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  color: string;
}

interface AdditionalContact {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  color: string;
}

// Extract component for contact method cards
const ContactMethodCard: React.FC<ContactMethod> = ({ 
  title, 
  description, 
  icon, 
  url, 
  color 
}) => (
  <a 
    href={url} 
    target={url.startsWith('mailto:') ? '_self' : '_blank'} 
    rel="noopener noreferrer"
    className={`group flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-${color}-900/10 to-${color}-800/5 border border-${color}-900/20 hover:border-${color}-700/30 transition-all duration-300`}
  >
    <div className={`h-14 w-14 rounded-full bg-${color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="font-medium text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400 text-center break-all">{description}</p>
  </a>
);

// Extract component for additional contact option cards
const AdditionalContactCard: React.FC<AdditionalContact> = ({
  title,
  description,
  icon,
  url,
  color
}) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors duration-300"
  >
    <div className={`h-10 w-10 rounded-full bg-${color}-500/10 flex items-center justify-center flex-shrink-0`}>
      {icon}
    </div>
    <div>
      <h4 className="text-white font-medium">{title}</h4>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  </a>
);

const ContactForm: React.FC = () => {
  // Define contact methods data
  const contactMethods: ContactMethod[] = [
    {
      id: 'email',
      title: 'Email',
      description: 'vivekrohtasvi2002@gmail.com',
      icon: <Mail className="text-blue-400" size={24} />,
      url: 'mailto:vivekrohtasvi2002@gmail.com',
      color: 'blue'
    },
    {
      id: 'github',
      title: 'GitHub',
      description: 'Check out my projects',
      icon: <Github className="text-purple-400" size={24} />,
      url: 'https://github.com/Vrohs',
      color: 'purple'
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      description: 'Connect professionally',
      icon: <Linkedin className="text-cyan-400" size={24} />,
      url: 'https://www.linkedin.com/in/vivek-rohtasvi-20897b202/',
      color: 'cyan'
    },
    {
      id: 'twitter',
      title: 'Twitter',
      description: 'Follow for updates',
      icon: <Twitter className="text-pink-400" size={24} />,
      url: 'https://x.com/rohsfr',
      color: 'pink'
    }
  ];

  // Define additional contact options data
  const additionalContacts: AdditionalContact[] = [
    {
      id: 'calendly',
      title: 'Schedule a Call',
      description: 'Book a time on my calendar',
      icon: <Calendar className="text-emerald-400" size={18} />,
      url: 'https://calendly.com',
      color: 'emerald'
    },
    {
      id: 'resume',
      title: 'Download CV',
      description: 'Get my resume',
      icon: <FileText className="text-amber-400" size={18} />,
      url: '/resume.pdf',
      color: 'amber'
    },
    {
      id: 'discord',
      title: 'Discord',
      description: 'Join my community',
      icon: <MessageSquare className="text-indigo-400" size={18} />,
      url: 'https://discord.gg/your-discord',
      color: 'indigo'
    }
  ];

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
          {contactMethods.map(method => (
            <ContactMethodCard key={method.id} {...method} />
          ))}
        </div>
        
        {/* Additional Contact Options */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-medium text-white mb-4 text-center">More Ways to Connect</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalContacts.map(contact => (
              <AdditionalContactCard key={contact.id} {...contact} />
            ))}
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