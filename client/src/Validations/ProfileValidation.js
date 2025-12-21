import * as yup from "yup";

export const profileSchemaValidation = yup.object().shape({
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
});

export default profileSchemaValidation;
