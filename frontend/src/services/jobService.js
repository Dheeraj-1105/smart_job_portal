import api from "../api/axios";

const jobService = {
  /**
   * Get all jobs (For candidates browsing jobs)
   */
  getAllJobs: async () => {
    const response = await api.get("/api/jobs");
    return response.data;
  },

  /**
   * Create a new job (For recruiters)
   * @param {Object} jobData - { title, description, company, requiredSkills, minExperience }
   */
  createJob: async (jobData) => {
    const response = await api.post("/api/recruiter/jobs", jobData);
    return response.data;
  },

  /**
   * Get all jobs posted by the currently logged-in recruiter
   */
  getRecruiterJobs: async () => {
    const response = await api.get("/api/recruiter/jobs");
    return response.data;
  },
};

export default jobService;
