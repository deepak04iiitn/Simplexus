import nodemailer from 'nodemailer';

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
