import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { getUserById, updateUser } from "../services/auth.service.js";

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const user = await getUserById(userId);

    res.json(new ApiResponse(200, "User profile fetched", user.toJSON()));
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const {
      firstName,
      lastName,
      state,
      constituency,
      preferredLanguage,
      preferences,
    } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (state) updateData.state = state;
    if (constituency) updateData.constituency = constituency;
    if (preferredLanguage) updateData.preferredLanguage = preferredLanguage;
    if (preferences) updateData.preferences = preferences;

    const user = await updateUser(userId, updateData);

    res.json(
      new ApiResponse(200, "User profile updated successfully", user.toJSON()),
    );
  } catch (error) {
    next(error);
  }
};

export const getUserNotifications = async (req, res, next) => {
  try {
    // This would fetch from a notifications collection if implemented
    // For now, return empty array
    res.json(new ApiResponse(200, "Notifications fetched", []));
  } catch (error) {
    next(error);
  }
};

export const updateNotificationPreferences = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { enableNotifications, enableReminders } = req.body;

    const updateData = {
      preferences: {
        enableNotifications,
        enableReminders,
      },
    };

    const user = await updateUser(userId, updateData);

    res.json(new ApiResponse(200, "Preferences updated", user.toJSON()));
  } catch (error) {
    next(error);
  }
};
