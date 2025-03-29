import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    // Optional: Send email notification
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      sendEmailNotification(contact);
    }

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Mark contact as read
// @route   PUT /api/contact/:id
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id, 
      { read: true }, 
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Helper function to send email notification
const sendEmailNotification = async (contact) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Set up email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `New Contact Form Submission: ${contact.subject}`,
      text: `
        Name: ${contact.name}
        Email: ${contact.email}
        Subject: ${contact.subject}
        
        Message:
        ${contact.message}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email notification failed:', error);
  }
};