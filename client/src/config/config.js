export const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export default {
  apiUrl: SERVER_URL,
  env: process.env.REACT_APP_ENV || 'development',
  title: process.env.REACT_APP_TITLE || 'AdviseLink',
  description: process.env.REACT_APP_DESCRIPTION || 'Connect with advisors and get expert guidance'
};