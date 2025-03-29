import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { contactService } from '../services/api';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setFormStatus('idle');
    
    try {
      await contactService.submitContact(data);
      setFormStatus('success');
      reset(); // Clear form
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset status after 5 seconds
      setTimeout(() => {
        if (formStatus !== 'idle') {
          setFormStatus('idle');
        }
      }, 5000);
    }
  };
  
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
      <div className="border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="text-blue-500" size={24} />
          <h3 className="text-xl font-bold">Get In Touch</h3>
        </div>
        
        {formStatus === 'success' && (
          <div className="flex items-center gap-2 bg-green-900/30 text-green-400 p-4 rounded-lg mb-6">
            <CheckCircle size={20} />
            <p>Your message has been sent! I'll get back to you soon.</p>
          </div>
        )}
        
        {formStatus === 'error' && (
          <div className="flex items-center gap-2 bg-red-900/30 text-red-400 p-4 rounded-lg mb-6">
            <AlertCircle size={20} />
            <p>Something went wrong. Please try again later.</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              id="name"
              type="text"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your Name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              id="email"
              type="email"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email'
                }
              })}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm text-gray-400 mb-1">Subject</label>
            <input
              id="subject"
              type="text"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Subject"
              {...register('subject', { required: 'Subject is required' })}
            />
            {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm text-gray-400 mb-1">Message</label>
            <textarea
              id="message"
              rows={5}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your message..."
              {...register('message', { required: 'Message is required' })}
            ></textarea>
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;