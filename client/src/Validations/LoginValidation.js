import * as yup from "yup";

export const loginSchemaValidation = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required()
    .test("emailDomain", "Email must contain 'utas.edu.om'", (value) =>
      value?.endsWith("@utas.edu.om")
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
});
