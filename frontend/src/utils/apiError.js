export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  if (error?.response) {
    const { data, status } = error.response;
    if (typeof data === 'string' && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (status === 401) return 'Unauthorized. Please login again.';
    if (status === 403) return 'Unauthorized.';
    if (status >= 500) return 'Server error. Please try again.';
  }
  return error?.message || fallback;
};
