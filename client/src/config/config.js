const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  env: process.env.REACT_APP_ENV || 'development',
  title: process.env.REACT_APP_TITLE || 'AdviseLink',
  description: process.env.REACT_APP_DESCRIPTION || 'Connect with advisors and get expert guidance'
};

export default config;