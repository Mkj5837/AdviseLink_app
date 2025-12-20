import { describe, test, expect } from "vitest";
import "@testing-library/jest-dom";
import { userSchemaValidation } from "../Validations/UserValidation";

const baseUser = {
  idNumber: "123456",
  firstName: "John",
  middleName: "",
  lastName: "Doe",
  email: "john@utas.edu.om",
  userType: "student",
  password: "secret123",
  confirmPassword: "secret123",
};

describe("User validation schema", () => {
  test("accepts a valid user payload", async () => {
    await expect(userSchemaValidation.validate(baseUser)).resolves.toBeTruthy();
  });

  test("rejects non-utas email domain", async () => {
    const data = { ...baseUser, email: "john@example.com" };
    await expect(userSchemaValidation.validate(data)).rejects.toThrow(
      /utas\.edu\.om/
    );
  });

  test("requires password", async () => {
    const data = { ...baseUser, password: "", confirmPassword: "" };
    await expect(userSchemaValidation.validate(data)).rejects.toThrow(
      /Password is required/
    );
  });

  test("requires matching passwords", async () => {
    const data = { ...baseUser, confirmPassword: "different" };
    await expect(userSchemaValidation.validate(data)).rejects.toThrow(
      /Passwords must match/
    );
  });
});
