import User from "../models/user.model.js";
import Campaign from "../models/campaign.model.js";
import Invitation from "../models/invitation.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import { sendResetCodeEmail } from '../utils/email.util.js';

export const signup = async (req , res , next) => {
    
    const { username , email , password, userType } = req.body;

    if(!username || !email || !password || !userType || username === '' || email === '' || password === '' || userType === '')
    {
        return next(errorHandler(400 , 'All fields are required!'));
    }

    // Validate userType
    const validUserTypes = ["Brand", "Agency", "Creator"];
    if (!validUserTypes.includes(userType)) {
        return next(errorHandler(400 , 'Invalid user type! Please select Brand, Agency, or Creator.'));
    }

    const hashedPassword = bcryptjs.hashSync(password , 10);

    const newUser = new User({
        username,
        email,
        password : hashedPassword,
        userType,
    });

    try {
        
        await newUser.save();

        // Don't auto-assign - creator must accept invitation explicitly
        // Just track that they have pending invitations
        const pendingInvitations = await Invitation.find({
            email: email.toLowerCase(),
            status: 'Pending'
        }).populate('campaignId');

        const pendingCampaigns = [];
        for (const invitation of pendingInvitations) {
            if (invitation.isValid() && invitation.campaignId && newUser.userType === 'Creator') {
                pendingCampaigns.push({
                    campaignId: invitation.campaignId._id,
                    campaignName: invitation.campaignId.name,
                    invitationToken: invitation.token
                });
            }
        }

        // Generate JWT token for automatic login
        const token = jwt.sign(
            { 
                id: newUser._id,
                isUserAdmin: newUser.isUserAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: '14d' }
        );

        // Remove password from response
        const { password: pass, ...rest } = newUser._doc;

        // Set cookie and return user data for automatic login
        const response = {
            ...rest,
            ...(pendingCampaigns.length > 0 && { 
                message: `You have ${pendingCampaigns.length} pending invitation(s)`,
                pendingInvitations: pendingCampaigns
            })
        };

        res.status(200)
           .cookie('access_token', token, {
                httpOnly: true,
                maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
           })
           .json(response);

    } catch (error) {
        next(error);
    }

}


export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required!'));
    }

    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(404, 'Invalid credentials!'));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) {
            return next(errorHandler(400, 'Invalid credentials!'));
        }

        const token = jwt.sign(
            { 
                id: validUser._id,
                isUserAdmin: validUser.isUserAdmin  // Include isUserAdmin in the token
            },
            process.env.JWT_SECRET,
            { expiresIn: '14d' }
        );

        const { password: pass, ...rest } = validUser._doc;

        res.status(200)
           .cookie('access_token', token, {
                httpOnly: true,
                maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
           })
           .json(rest);

    } catch (error) {
        next(error);
    }
}


export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token')
           .status(200)
           .json({ success: true, message: 'Signout successful!' });
    } catch (error) {
        next(error);
    }
}


export const requestPasswordReset = async (req, res, next) => {
    const { email } = req.body;

    if (!email || email === '') {
        return next(errorHandler(400, 'Email is required!'));
    }

    try {
        const user = await User.findOne({ email });

        // For security, always return success even if email doesn't exist
        if (!user) {
            return res.status(200).json({ 
                success: true, 
                message: 'If an account exists with this email, a reset code has been sent.' 
            });
        }

        // Generate 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the code before storing
        const hashedCode = bcryptjs.hashSync(resetCode, 10);

        // Set expiry time (10 minutes from now)
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

        // Update user with reset code and expiry
        user.resetPasswordCode = hashedCode;
        user.resetPasswordExpires = expiryTime;
        await user.save();

        // Send email with plain code
        await sendResetCodeEmail(email, resetCode, user.username);

        res.status(200).json({ 
            success: true, 
            message: 'If an account exists with this email, a reset code has been sent.' 
        });

    } catch (error) {
        console.error('Error in requestPasswordReset:', error);
        next(error);
    }
};

export const verifyResetCode = async (req, res, next) => {
    const { email, code } = req.body;

    if (!email || !code || email === '' || code === '') {
        return next(errorHandler(400, 'Email and code are required!'));
    }

    try {
        const user = await User.findOne({ email });

        if (!user || !user.resetPasswordCode || !user.resetPasswordExpires) {
            return next(errorHandler(400, 'Invalid or expired reset code!'));
        }

        // Check if code has expired
        if (new Date() > user.resetPasswordExpires) {
            // Clear expired code
            user.resetPasswordCode = null;
            user.resetPasswordExpires = null;
            await user.save();
            return next(errorHandler(400, 'Reset code has expired! Please request a new one.'));
        }

        // Verify code
        const isCodeValid = bcryptjs.compareSync(code, user.resetPasswordCode);

        if (!isCodeValid) {
            return next(errorHandler(400, 'Invalid reset code!'));
        }

        res.status(200).json({ 
            success: true, 
            message: 'Code verified successfully!' 
        });

    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword || email === '' || code === '' || newPassword === '') {
        return next(errorHandler(400, 'All fields are required!'));
    }

    if (newPassword.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters!'));
    }

    try {
        const user = await User.findOne({ email });

        if (!user || !user.resetPasswordCode || !user.resetPasswordExpires) {
            return next(errorHandler(400, 'Invalid or expired reset code!'));
        }

        // Check if code has expired
        if (new Date() > user.resetPasswordExpires) {
            user.resetPasswordCode = null;
            user.resetPasswordExpires = null;
            await user.save();
            return next(errorHandler(400, 'Reset code has expired! Please request a new one.'));
        }

        // Verify code again
        const isCodeValid = bcryptjs.compareSync(code, user.resetPasswordCode);

        if (!isCodeValid) {
            return next(errorHandler(400, 'Invalid reset code!'));
        }

        // Hash new password
        const hashedPassword = bcryptjs.hashSync(newPassword, 10);

        // Update password and clear reset fields
        user.password = hashedPassword;
        user.resetPasswordCode = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: 'Password reset successful! You can now sign in with your new password.' 
        });

    } catch (error) {
        next(error);
    }
};

