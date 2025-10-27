import nodemailer from 'nodemailer';
import { Observer } from '../patterns/observer.js';

export class EmailObserver extends Observer {
  constructor() {
    super('EmailObserver');
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      // Use fixed Ethereal credentials instead of creating new test accounts
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: process.env.ETHEREAL_USER || 'bxuydshbtaalihcd@ethereal.email',
          pass: process.env.ETHEREAL_PASS || 'DzEqS3badWYsCnzSyM'
        },
        // Add timeout settings
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 10000
      });

      // Verify connection
      await this.transporter.verify();
      console.log('✅ EmailObserver initialized with Ethereal');
      console.log('📧 Using account:', process.env.ETHEREAL_USER || 'bxuydshbtaalihcd@ethereal.email');
      
    } catch (error) {
      console.error('❌ Failed to initialize EmailObserver:', error.message);
      // Don't throw error - app should work without email
    }
  }

  async update(eventType, data) {
    console.log(`📨 EmailObserver handling event: ${eventType}`);
    
    switch (eventType) {
      case 'USER_REGISTERED':
        await this.handleUserRegistration(data);
        break;
      case 'EVENT_CREATED':
        await this.handleEventCreated(data);
        break;
      case 'EVENT_UPDATED':
        await this.handleEventUpdated(data);
        break;
      case 'EVENT_APPROVED':
        await this.handleEventApproved(data);
        break;
      case 'RSVP_CREATED':
        await this.handleRSVPCreated(data);
        break;
      case 'RSVP_UPDATED':
        await this.handleRSVPUpdated(data);
        break;
      default:
        console.log(`ℹ️  EmailObserver: No handler for event type: ${eventType}`);
    }
  }

  async handleUserRegistration(data) {
    const { userEmail, userName } = data;
    
    const mailOptions = {
      from: '"Event Management App" <noreply@eventapp.com>',
      to: userEmail,
      subject: 'Welcome to Event Management App! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h1 style="color: #333; text-align: center;">Welcome, ${userName}! 👋</h1>
          <p style="color: #666; line-height: 1.6;">Thank you for registering with our Event Management Application.</p>
          <p style="color: #666; line-height: 1.6;">You can now:</p>
          <ul style="color: #666;">
            <li>Browse and RSVP to events</li>
            <li>Create and manage your own events</li>
            <li>Receive real-time updates</li>
          </ul>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #495057; font-size: 14px;">
              <strong>Note:</strong> This is a mock email sent via Ethereal Email service for testing purposes.
            </p>
          </div>
        </div>
      `
    };

    await this.sendEmail(mailOptions, 'Welcome Email');
  }

  async handleEventCreated(data) {
    const { userEmail, eventTitle, userName = 'Organizer' } = data;
    
    const mailOptions = {
      from: '"Event Management App" <noreply@eventapp.com>',
      to: userEmail,
      subject: `Event Created: ${eventTitle} 📅`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333;">Event Created Successfully! 🎊</h2>
          <p style="color: #666; line-height: 1.6;">Hello ${userName},</p>
          <p style="color: #666; line-height: 1.6;">Your event "<strong>${eventTitle}</strong>" has been created successfully.</p>
          <p style="color: #666; line-height: 1.6;">It is currently pending approval and will be visible to other users once approved by an administrator.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #495057; font-size: 12px;">
              <strong>Note:</strong> This is a mock notification email.
            </p>
          </div>
        </div>
      `
    };

    await this.sendEmail(mailOptions, 'Event Created Notification');
  }

  async handleEventApproved(data) {
    const { userEmail, eventTitle, userName = 'Organizer' } = data;
    
    const mailOptions = {
      from: '"Event Management App" <noreply@eventapp.com>',
      to: userEmail,
      subject: `Event Approved: ${eventTitle} ✅`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333;">Event Approved! 🎉</h2>
          <p style="color: #666; line-height: 1.6;">Hello ${userName},</p>
          <p style="color: #666; line-height: 1.6;">Great news! Your event "<strong>${eventTitle}</strong>" has been approved by an administrator.</p>
          <p style="color: #666; line-height: 1.6;">It is now visible to all users and they can RSVP to attend.</p>
        </div>
      `
    };

    await this.sendEmail(mailOptions, 'Event Approved Notification');
  }

  async handleRSVPCreated(data) {
    await this.handleRSVPUpdated(data); // Same handling for create/update
  }

  async handleRSVPUpdated(data) {
    const { userEmail, eventTitle, rsvpStatus, userName = 'Attendee' } = data;
    
    const statusEmojis = {
      'GOING': '✅',
      'MAYBE': '🤔',
      'NOT_GOING': '❌'
    };

    const mailOptions = {
      from: '"Event Management App" <noreply@eventapp.com>',
      to: userEmail,
      subject: `RSVP Confirmation: ${eventTitle} ${statusEmojis[rsvpStatus]}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333;">RSVP Confirmation ${statusEmojis[rsvpStatus]}</h2>
          <p style="color: #666; line-height: 1.6;">Hello ${userName},</p>
          <p style="color: #666; line-height: 1.6;">Your RSVP status for "<strong>${eventTitle}</strong>" has been set to: <strong>${rsvpStatus}</strong></p>
          <p style="color: #666; line-height: 1.6;">You can change your RSVP status at any time before the event.</p>
        </div>
      `
    };

    await this.sendEmail(mailOptions, 'RSVP Notification');
  }

  async handleEventUpdated(data) {
    const { userEmail, eventTitle, userName = 'Organizer' } = data;
    
    const mailOptions = {
      from: '"Event Management App" <noreply@eventapp.com>',
      to: userEmail,
      subject: `Event Updated: ${eventTitle} ✏️`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333;">Event Updated</h2>
          <p style="color: #666; line-height: 1.6;">Hello ${userName},</p>
          <p style="color: #666; line-height: 1.6;">Your event "<strong>${eventTitle}</strong>" has been updated successfully.</p>
        </div>
      `
    };

    await this.sendEmail(mailOptions, 'Event Updated Notification');
  }

  async sendEmail(mailOptions, emailType) {
    if (!this.transporter) {
      console.warn('⚠️ Email transporter not ready, skipping email send');
      return { success: false, error: 'Transporter not ready' };
    }

    try {
      // Add timeout to sendMail
      const info = await this.transporter.sendMail(mailOptions);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      
      console.log(`✅ ${emailType} sent successfully!`);
      console.log('📧 Preview URL:', previewUrl);
      
      return {
        success: true,
        messageId: info.messageId,
        previewUrl: previewUrl
      };
    } catch (error) {
      console.error(`❌ Error sending ${emailType}:`, error.message);
      // Return error but don't throw - non-blocking
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create and export singleton instance
export const emailObserver = new EmailObserver();
export default emailObserver;