import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect } from "vitest";
import "@testing-library/jest-dom";
import Login from "../Components/Login";

describe("Login Page", () => {
  test("renders email, password fields, and login button", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign-in/i })).toBeInTheDocument();
  });
});
