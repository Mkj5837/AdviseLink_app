import * as yup from "yup";

export const userSchemaValidation = yup.object().shape({
  idNumber: yup.string().required("Student ID is required"),
  firstName: yup
    .string()
    .required("First name is required")
    .min(3, "First name must be at least 3 characters")
    .max(20, "First name cannot be more than 20 characters."),
  middleName: yup
    .string()
    .nullable()
    .max(20, "Middle name cant be more than 20 characters"),
  lastName: yup
    .string()
    .required("Last name is required.")
    .min(3, "Last name must be at least 3 characters")
    .max(25, "Last name must be at most 25 characters."),
  email: yup
    .string()
    .email("Invalid email format")
    .required()
    .test("emailDomain", "Email must contain 'utas.edu.om'", (value) =>
      value?.endsWith("@utas.edu.om")
    ),
  userType: yup
    .string()
    .oneOf(["advisor", "student"])
    .required("User type is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});
