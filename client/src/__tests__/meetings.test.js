import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { describe, test, expect } from "vitest";
import "@testing-library/jest-dom";
import MeetingList from "../Components/Student/MeetingList";

const renderWithState = (ui, { preloadedState }) => {
  const store = configureStore({
    reducer: {
      user: () => preloadedState.user,
      meetings: () => preloadedState.meetings,
    },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("MeetingList", () => {
  test("renders meeting list for user", () => {
    renderWithState(<MeetingList />, {
      preloadedState: {
        user: { user: { _id: "u1", userType: "student" } },
        meetings: {
          items: [
            { _id: "m1", meetingType: "Advisor Meeting", status: "scheduled", startTime: "2024-12-01T10:00:00Z", location: "Remote" },
          ],
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText(/Meeting List/i)).toBeInTheDocument();
    expect(screen.getByText(/Advisor Meeting/i)).toBeInTheDocument();
  });
});
