import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, CheckCircle, AlertCircle, Mail, Clock, Check } from 'lucide-react';
import { contactService, Contact } from '../../services/api';

// Using the Contact interface from api.ts instead of defining a separate Message interface

const MessagesManagement = () => {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeMessage, setActiveMessage] = useState<Contact | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await contactService.getContacts();
      setMessages(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      try {
        await contactService.deleteContact(id);
        setSuccessMessage('Message deleted successfully');
        fetchMessages(); // Refresh the list
        
        // If the active message was deleted, clear it
        if (activeMessage && activeMessage._id === id) {
          setActiveMessage(null);
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } catch (error) {
        console.error('Error deleting message:', error);
        setError('Failed to delete message');
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await contactService.markAsRead(id);
      
      // Update local state
      setMessages(messages.map(message => 
        message._id === id ? { ...message, read: true } : message
      ));
      
      // Update active message if it's the one being marked
      if (activeMessage && activeMessage._id === id) {
        setActiveMessage({ ...activeMessage, read: true });
      }
      
      setSuccessMessage('Message marked as read');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error marking message as read:', error);
      setError('Failed to mark message as read');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const openMessage = async (message: Contact) => {
    setActiveMessage(message);
    
    // If message is unread, mark it as read
    if (!message.read) {
      handleMarkAsRead(message._id);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <h1 className="text-3xl font-bold">Messages</h1>
      
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="relative group lg:col-span-1">
          <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
          <div className="border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors duration-300 h-[600px]">
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-medium flex items-center gap-2">
                <MessageSquare size={18} className="text-green-400" />
                Contact Messages 
                <span className="ml-2 px-2 py-1 text-xs bg-gray-800 rounded-full">{messages.length}</span>
              </h2>
            </div>
            
            <div className="overflow-y-auto h-[544px]">
              {messages.length > 0 ? (
                <div className="divide-y divide-gray-800">
                  {messages.map((message) => (
                    <div 
                      key={message._id} 
                      className={`p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-900 ${activeMessage && activeMessage._id === message._id ? 'bg-gray-900' : ''} ${!message.read ? 'border-l-4 border-green-500' : ''}`}
                      onClick={() => openMessage(message)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-medium ${!message.read ? 'text-white' : 'text-gray-300'}`}>
                          {message.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {!message.read && (
                            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(message.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-1">{message.subject}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{message.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageSquare size={48} className="mb-3 opacity-20" />
                  <p>No messages yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Message View */}
        <div className="relative group lg:col-span-2">
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
          <div className="border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors duration-300 h-[600px]">
            {activeMessage ? (
              <>
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                  <h2 className="font-medium flex items-center gap-2">
                    <Mail size={18} className="text-blue-400" />
                    Message Details
                  </h2>
                  <div className="flex gap-2">
                    {!activeMessage.read && (
                      <button
                        onClick={() => handleMarkAsRead(activeMessage._id)}
                        className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors duration-200"
                        title="Mark as Read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(activeMessage._id)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto h-[528px]">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-xl font-bold mb-2">{activeMessage.subject}</h1>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock size={14} />
                        {formatDate(activeMessage.date)}
                      </div>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">From</p>
                          <p className="text-sm">{activeMessage.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="text-sm">{activeMessage.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-2">Message</p>
                      <div className="text-sm whitespace-pre-wrap">{activeMessage.message}</div>
                    </div>
                    
                    <div className="pt-4">
                      <a 
                        href={`mailto:${activeMessage.email}?subject=Re: ${activeMessage.subject}`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        <Mail size={16} />
                        Reply via Email
                      </a>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Mail size={48} className="mb-3 opacity-20" />
                <p>Select a message to view its contents</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesManagement;