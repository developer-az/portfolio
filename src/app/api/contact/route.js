// src/app/api/contact/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json();
    const { name, email, subject, message } = data;
    
    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }
    
    // In a real application, you would send the email here
    // For example, using a service like Nodemailer, SendGrid, or Resend
    
    // Example for integrating with a service like EmailJS (you would need to set up an account)
    // const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     service_id: process.env.EMAILJS_SERVICE_ID,
    //     template_id: process.env.EMAILJS_TEMPLATE_ID,
    //     user_id: process.env.EMAILJS_USER_ID,
    //     template_params: {
    //       from_name: name,
    //       from_email: email,
    //       subject: subject,
    //       message: message,
    //     },
    //   }),
    // });
    
    // For now, let's just simulate a successful email sent
    console.log('Contact form submission:', { name, email, subject, message });
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully! I will get back to you soon.' 
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}