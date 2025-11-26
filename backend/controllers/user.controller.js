import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

// Update currently authenticated user's profile
export const updateUser = async (req, res, next) => {
  const userId = req.params.id;

  if (!req.user || req.user.id !== userId) {
    return next(errorHandler(403, 'You can only update your own account.'));
  }

  const allowedFields = ['username', 'email', 'profilePicture'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found.'));
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    // Handle duplicate key errors for email/username
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return next(errorHandler(400, `This ${field} is already in use.`));
    }
    next(error);
  }
};

// Delete currently authenticated user's account
export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  if (!req.user || req.user.id !== userId) {
    return next(errorHandler(403, 'You can only delete your own account.'));
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return next(errorHandler(404, 'User not found.'));
    }

    // Also clear auth cookie if present
    res
      .clearCookie('access_token')
      .status(200)
      .json({ success: true, message: 'Account deleted successfully.' });
  } catch (error) {
    next(error);
  }
};


