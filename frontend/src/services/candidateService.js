import api from "../api/axios";

const candidateService = {
  /**
   * Get the current logged-in candidate's profile
   */
  getProfile: async () => {
    const response = await api.get("/api/candidate/profile");
    return response.data;
  },

  /**
   * Upload a resume file for the current candidate
   * @param {File} file - The resume PDF/DOCX file object
   */
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/candidate/upload-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Recruiter: Get candidates who applied for a specific job
   * @param {number} jobId
   */
  getApplicantsForJob: async (jobId) => {
    const response = await api.get(`/api/applications/job/${jobId}`);
    return response.data;
  },

  /**
   * Recruiter: Get ranked candidates for a specific job
   * @param {number} jobId
   */
  getRankedCandidates: async (jobId) => {
    const response = await api.get(`/api/recruiter/rank/${jobId}`);
    return response.data;
  },
};

export default candidateService;
