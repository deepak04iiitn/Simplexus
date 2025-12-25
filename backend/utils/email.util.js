import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send password reset code email
export const sendResetCodeEmail = async (email, code, username) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: {
                name: 'Simplexus',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Password Reset Code - Simplexus',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                            font-weight: 600;
                        }
                        .content {
                            padding: 40px 30px;
                            color: #333;
                        }
                        .content h2 {
                            color: #1f2937;
                            margin-bottom: 20px;
                        }
                        .code-box {
                            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                            border-left: 4px solid #7c3aed;
                            padding: 20px;
                            margin: 30px 0;
                            border-radius: 4px;
                            text-align: center;
                        }
                        .code {
                            font-size: 36px;
                            font-weight: bold;
                            color: #7c3aed;
                            letter-spacing: 8px;
                            font-family: 'Courier New', monospace;
                        }
                        .info {
                            background: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .footer {
                            background: #f9fafb;
                            padding: 20px 30px;
                            text-align: center;
                            color: #6b7280;
                            font-size: 14px;
                        }
                        .button {
                            display: inline-block;
                            padding: 12px 24px;
                            background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Simplexus</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${username}!</h2>
                            <p>We received a request to reset your password. Use the verification code below to proceed:</p>
                            
                            <div class="code-box">
                                <div style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">Your Verification Code</div>
                                <div class="code">${code}</div>
                            </div>
                            
                            <div class="info">
                                <strong>⏰ Important:</strong> This code will expire in <strong>10 minutes</strong> for security reasons.
                            </div>
                            
                            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                            
                            <p style="margin-top: 30px;">
                                Best regards,<br>
                                <strong>The Simplexus Team</strong>
                            </p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message, please do not reply to this email.</p>
                            <p>&copy; 2025 Simplexus. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

// Send creator invitation email
export const sendCreatorInvitationEmail = async (creatorEmail, creatorUsername, campaignName, brandName, invitationToken) => {
    try {
        const transporter = createTransporter();
        
        // Get frontend URL from environment or use default
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        // Link to private dashboard using invitation token
        const dashboardLink = `${frontendUrl}/invite/${invitationToken}`;

        const mailOptions = {
            from: {
                name: 'Simplexus',
                address: process.env.EMAIL_USER
            },
            to: creatorEmail,
            subject: `Campaign Invitation: ${campaignName} - Simplexus`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                            font-weight: 600;
                        }
                        .content {
                            padding: 40px 30px;
                            color: #333;
                        }
                        .content h2 {
                            color: #1f2937;
                            margin-bottom: 20px;
                        }
                        .campaign-box {
                            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                            border-left: 4px solid #7c3aed;
                            padding: 20px;
                            margin: 30px 0;
                            border-radius: 4px;
                        }
                        .campaign-box h3 {
                            margin: 0 0 10px 0;
                            color: #7c3aed;
                            font-size: 20px;
                        }
                        .info-item {
                            margin: 10px 0;
                            color: #4b5563;
                        }
                        .info-item strong {
                            color: #1f2937;
                        }
                        .button {
                            display: inline-block;
                            padding: 14px 28px;
                            background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                            margin: 20px 0;
                            font-weight: 600;
                            text-align: center;
                        }
                        .button-container {
                            text-align: center;
                            margin: 30px 0;
                        }
                        .highlight {
                            background: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .footer {
                            background: #f9fafb;
                            padding: 20px 30px;
                            text-align: center;
                            color: #6b7280;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎯 Simplexus</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${creatorUsername}!</h2>
                            <p>Great news! You've been invited to participate in a new campaign on Simplexus.</p>
                            
                            <div class="campaign-box">
                                <h3>${campaignName}</h3>
                                <div class="info-item">
                                    <strong>Brand:</strong> ${brandName}
                                </div>
                            </div>
                            
                            <p>You've been selected to collaborate on this campaign. To get started, please review the campaign details and acknowledge the brief.</p>
                            
                            <div class="highlight">
                                <strong>📋 Next Steps:</strong>
                                <ul style="margin: 10px 0; padding-left: 20px;">
                                    <li>Review the campaign brief and requirements</li>
                                    <li>Acknowledge the brief to confirm your participation</li>
                                    <li>Start working on your deliverables</li>
                                </ul>
                            </div>
                            
                            <div class="button-container">
                                <a href="${dashboardLink}" class="button">View Campaign & Accept Invitation</a>
                            </div>
                            
                            <p style="margin-top: 30px;">
                                We're excited to work with you on this campaign!<br>
                                <strong>The Simplexus Team</strong>
                            </p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message, please do not reply to this email.</p>
                            <p>&copy; 2025 Simplexus. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Creator invitation email sent:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending creator invitation email:', error);
        throw new Error('Failed to send invitation email');
    }
};

// Send external creator invitation email (for creators without accounts)
export const sendExternalCreatorInvitationEmail = async (email, campaignName, brandName, invitationToken) => {
    try {
        const transporter = createTransporter();
        
        // Get frontend URL from environment or use default
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        // Link to private dashboard - they can sign up there
        const dashboardLink = `${frontendUrl}/invite/${invitationToken}`;

        const mailOptions = {
            from: {
                name: 'Simplexus',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: `You're Invited to Join ${campaignName} on Simplexus`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: #ffffff;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                            font-weight: 600;
                        }
                        .content {
                            padding: 40px 30px;
                            color: #333;
                        }
                        .content h2 {
                            color: #1f2937;
                            margin-bottom: 20px;
                        }
                        .campaign-box {
                            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                            border-left: 4px solid #7c3aed;
                            padding: 20px;
                            margin: 30px 0;
                            border-radius: 4px;
                        }
                        .campaign-box h3 {
                            margin: 0 0 10px 0;
                            color: #7c3aed;
                            font-size: 20px;
                        }
                        .info-item {
                            margin: 10px 0;
                            color: #4b5563;
                        }
                        .info-item strong {
                            color: #1f2937;
                        }
                        .button {
                            display: inline-block;
                            padding: 14px 28px;
                            background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                            margin: 20px 0;
                            font-weight: 600;
                            text-align: center;
                        }
                        .button-container {
                            text-align: center;
                            margin: 30px 0;
                        }
                        .highlight {
                            background: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .footer {
                            background: #f9fafb;
                            padding: 20px 30px;
                            text-align: center;
                            color: #6b7280;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎯 Simplexus</h1>
                        </div>
                        <div class="content">
                            <h2>You've Been Invited!</h2>
                            <p>Great news! You've been invited to collaborate on a campaign on Simplexus, the leading creator collaboration platform.</p>
                            
                            <div class="campaign-box">
                                <h3>${campaignName}</h3>
                                <div class="info-item">
                                    <strong>Brand:</strong> ${brandName}
                                </div>
                            </div>
                            
                            <p>To get started, you'll need to create a free account on Simplexus. Once you sign up, you'll be automatically assigned to this campaign and can start collaborating right away.</p>
                            
                            <div class="highlight">
                                <strong>📋 What's Next:</strong>
                                <ul style="margin: 10px 0; padding-left: 20px;">
                                    <li>Click the button below to create your account</li>
                                    <li>Complete your creator profile</li>
                                    <li>Review the campaign brief</li>
                                    <li>Start collaborating!</li>
                                </ul>
                            </div>
                            
                            <div class="button-container">
                                <a href="${dashboardLink}" class="button">View Campaign & Create Account</a>
                            </div>
                            
                            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                                This invitation will expire in 30 days. If you didn't expect this invitation, you can safely ignore this email.
                            </p>
                            
                            <p style="margin-top: 30px;">
                                We're excited to work with you!<br>
                                <strong>The Simplexus Team</strong>
                            </p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message, please do not reply to this email.</p>
                            <p>&copy; 2025 Simplexus. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('External creator invitation email sent:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending external creator invitation email:', error);
        throw new Error('Failed to send external invitation email');
    }
};