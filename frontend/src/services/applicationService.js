import api from "../api/axios";

const applicationService = {
  /**
   * Candidate: Get all applications they submitted
   */
  getApplications: async () => {
    const response = await api.get("/api/candidate/applications");
    return response.data;
  },

  /**
   * Candidate: Apply to a specific job
   * @param {number} jobId
   */
  applyToJob: async (jobId) => {
    const response = await api.post("/api/applications/apply", { jobId });
    return response.data;
  },
};

export default applicationService;
