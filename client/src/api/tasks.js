import api from "./axios";

// Task-related API calls
export const fetchTasksApi = (studentId) =>
  api.get(`/tasks/${studentId}`);

export const createTaskApi = (taskData) =>
  api.post("/tasks", taskData);

export const updateTaskStatusApi = (taskId, payload) =>
  api.put(`/updateTaskStatus/${taskId}`, payload);

export default {
  fetchTasksApi,
  createTaskApi,
  updateTaskStatusApi,
};
