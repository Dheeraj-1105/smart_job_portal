import api from "../api/axios";

const matchingService = {
  /**
   * Recruiter: Run the AI matching engine to rank candidates for a job
   * @param {number} jobId
   */
  runMatching: async (jobId) => {
    const response = await api.post(`/api/match/run/${jobId}`);
    return response.data;
  },
};

export default matchingService;
