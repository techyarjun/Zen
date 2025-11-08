/**
 * Generate AI-like motivational messages based on goals or history
 * @param {Object} user - currentUser object
 * @returns {Promise<String>} motivational message
 */
export const getAIMotivation = async (user) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const goalsCompleted = user.goals?.filter(g => g.completed).length || 0;
      const recentHistory = user.history?.slice(-3) || [];

      let message = "Keep pushing forward! Every step counts.";
      
      if (goalsCompleted > 0 && recentHistory.length > 0) {
        message = `Fantastic! You've completed ${goalsCompleted} goal(s) and recently engaged in ${recentHistory.length} activities. Keep the momentum going!`;
      } else if (goalsCompleted > 0) {
        message = `Congrats! ${goalsCompleted} goal(s) completed! Your progress is inspiring.`;
      } else if (recentHistory.length > 0) {
        message = `You've been active in ${recentHistory.length} recent activities. Great dedication!`;
      }

      // Random inspirational phrases to vary messages
      const randomExtras = [
        "Remember: Consistency beats intensity.",
        "Small steps every day lead to big changes.",
        "You're building amazing habits. Keep going!",
        "Every effort you make counts!"
      ];

      const randomExtra = randomExtras[Math.floor(Math.random() * randomExtras.length)];
      resolve(`${message} ${randomExtra}`);
    }, 700); // small delay to simulate AI thinking
  });
};
