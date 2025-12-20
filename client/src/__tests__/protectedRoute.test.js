import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, test } from "vitest";
import "@testing-library/jest-dom";
import ProtectedRoute from "../Components/ProtectedRoute";

const renderWithStore = (ui, { preloadedState } = {}) => {
  const store = configureStore({
    reducer: { user: (state = preloadedState?.user || {}) => state },
  });
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("ProtectedRoute", () => {
  test("redirects to /login when user is not authenticated", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
      { preloadedState: { user: { user: null } } }
    );

    expect(screen.queryByText(/Protected Content/i)).not.toBeInTheDocument();
  });
});
