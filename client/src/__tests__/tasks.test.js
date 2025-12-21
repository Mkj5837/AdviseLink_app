import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { describe, test, expect } from "vitest";
import "@testing-library/jest-dom";
import StudentDashboard from "../Components/Student/StudentDashboard";

const renderWithState = (ui, { preloadedState }) => {
  const store = configureStore({
    reducer: {
      user: () => preloadedState.user,
      tasks: () => preloadedState.tasks,
    },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("StudentDashboard tasks", () => {
  test("renders task table for authenticated user", () => {
    renderWithState(<StudentDashboard />, {
      preloadedState: {
        user: { user: { _id: "1", firstName: "Jane", lastName: "Doe", idNumber: "123" } },
        tasks: {
          items: [
            { _id: "t1", title: "Task One", weight: 10, deadline: "2024-12-31T00:00:00Z", isCompleted: false },
          ],
          loading: false,
          error: null,
          metrics: {},
        },
      },
    });

    expect(screen.getByText(/Academic Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Task One/i)).toBeInTheDocument();
  });
});
