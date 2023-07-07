

import { Feedback } from '../../models/users/feedback.js';

const submitFeedback = async (params, callback) => {
    console.log("submitFeedback submitted {0}", params);
    try {
        const { otherUserId, userId, rating, message, like, follow } = params;
        let feedback
        feedback = await Feedback.findOne({ userId: otherUserId })
        if (feedback) {
            feedback.feedbacks.push(params);
            feedback.save();
            console.log("submitFeedback submitted {1}", feedback);
            return callback(null, params);
        }
        feedback = await Feedback({ userId: otherUserId })
        feedback.feedbacks.push(params);
        feedback.save();
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
        message: "No feedback yet given"
    });
}


const feedbackService = { submitFeedback, getFeedbacks }
export { feedbackService }