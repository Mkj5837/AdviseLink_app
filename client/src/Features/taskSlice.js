import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTasksApi,
  createTaskApi,
  updateTaskStatusApi,
} from "../api/tasks";

const initialState = {
  items: [],
  loading: false,
  error: null,
  metrics: {
    currentProgress: 0,
    completedCount: 0,
    totalCount: 0,
    penalties: 0,
  },
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await fetchTasksApi(studentId);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to load tasks."
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await createTaskApi(taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create task."
      );
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ taskId, studentId, isCompleted }, { rejectWithValue }) => {
    try {
      const response = await updateTaskStatusApi(taskId, {
        studentId,
        isCompleted,
      });
      return { ...response.data, taskId, isCompleted };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update task."
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;

        const { taskId, isCompleted } = action.payload || {};
        if (taskId) {
          const task = state.items.find((t) => t._id === taskId);
          if (task) {
            task.isCompleted = isCompleted;
          }
        }

        state.metrics = {
          currentProgress:
            action.payload?.currentProgress ?? state.metrics.currentProgress,
          completedCount:
            action.payload?.completedCount ?? state.metrics.completedCount,
          totalCount:
            action.payload?.totalCount ?? state.metrics.totalCount,
          penalties: action.payload?.penalties ?? state.metrics.penalties,
        };
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
