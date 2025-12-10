import * as yup from "yup";

export const userSchemaValidation = yup.object().shape({
  idNumber: yup.string().required("ID is required"),
  firstName: yup.string().required("First name is required"),
  middleName: yup.string().nullable(),
  lastName: yup.string().required("Last name is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required")
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  gender: yup.string().required("Gender is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  userType: yup.string().required("User type is required"),
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
