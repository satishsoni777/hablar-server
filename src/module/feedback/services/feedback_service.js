

import { Feedback } from '../models/feedback.js';
import { Users } from '../../users/models/users.js'

const submitFeedback = async (params, callback) => {
    try {
        const { userId, toUser, rating, comment, like, follow } = params;
        let feedback
        feedback = await Feedback.findOne({ userId: toUser })
        if (!feedback) {
            feedback = await Feedback({ userId: toUser })
        }
        const user = await Users.findOne({ userId: userId });
        params.name = user.name ?? "";
        params.image = user.image ?? "";
        const result = await Promise.all([feedback.feedbacks.push(params), feedback.save()]);
        feedback.avgRating = (feedback.avgRating + rating) / feedback.feedbacks.length;
        await feedback.save();
        return callback(null, params);
    } catch (error) {
        return callback(error, null);
    }
}

const getFeedbacks = async (params, callback) => {
    const { userId } = params;
    let feedback
    feedback = await Feedback.findOne({ userId: userId });
    if (feedback)
        return callback(null, feedback.feedbacks);
    else callback(null, {
        message: "No feedback yet given",
    });
}

const getSubmittedFeedback = async (params, callback) => {

}

export const FeedbackService = { submitFeedback, getFeedbacks, getSubmittedFeedback }