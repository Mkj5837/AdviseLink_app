import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchemaValidation } from "../Validation/UserValidation";
import { updateUserProfile } from "../Features/userSlice";

const Profile = () => {
  // Retrieve user details from Redux store
  const user = useSelector((state) => state.user.value);

  // Initialize state variables with Redux values
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [middleName, setMiddleName] = useState(user?.middleName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [password, setPassword] = useState(user?.password || "");
  const [profilePic, setProfilePic] = useState(null);

  const navigate = useNavigate(); // Create navigate variable
  const dispatch = useDispatch(); // Create dispatch variable
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchemaValidation),
    defaultValues: user,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      reset(user);
      // Update local state if user changes
      setEmail(user.email || "");
      setFirstName(user.firstName || "");
      setMiddleName(user.middleName || "");
      setLastName(user.lastName || "");
      setPassword(user.password || "");
    }
  }, [user, navigate, reset]);

  // Function to handle file selection
  const handleFileChange = (event) => {
    setProfilePic(event.target.files[0]);
  };

  // Function to handle updating the user profile
  const handleUpdate = (event) => {
    event.preventDefault();

    // Prepare the user data object with the current user's email and updated details
    const userData = {
      email, // from state
      firstName, // from state
      middleName, // from state
      lastName, // from state
      password, // from state
      profilePic, // include the selected file
    };

    // Dispatch the updateUserProfile action to update the user profile in the Redux store
    dispatch(updateUserProfile(userData));
    alert("Profile Updated.");

    // Navigate back to the profile page after the update is completed
    setEditMode(false);
    // Optionally: navigate("/profile");
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container">
      <div className="profile-card">
        <Row>
          {/* Left Column: Avatar and Name */}
          <Col md={4} className="profile-left">
            <div className="profile-avatar">
              <span>
                {firstName?.[0]}
                {lastName?.[0]}
              </span>
            </div>
            <h2>
              {firstName} {middleName} {lastName}
            </h2>
            <p className="profile-role">{user?.userType}</p>
          </Col>
          {/* Right Column: Details and Actions */}
          <Col md={8} className="profile-right">
            {!editMode ? (
              <>
                <div className="profile-info">
                  <div className="profile-info-row">
                    <span className="profile-label">Email:</span>
                    <span>{email}</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-label">Password:</span>
                    <span>{password ? "********" : ""}</span>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{ marginLeft: "10px" }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div className="profile-actions">
                  <button
                    className="profile-edit-btn"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                  <button className="profile-logout-btn">Logout</button>
                </div>
                {/* Removed the table of users from here */}
              </>
            ) : (
              <form
                className="profile-edit-form"
                onSubmit={handleSubmit(handleUpdate)}
              >
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <span className="error">{errors.email.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    {...register("firstName")}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  {errors.firstName && (
                    <span className="error">{errors.firstName.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Middle Name</label>
                  <input
                    type="text"
                    {...register("middleName")}
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                  {errors.middleName && (
                    <span className="error">{errors.middleName.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    {...register("lastName")}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  {errors.lastName && (
                    <span className="error">{errors.lastName.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    {...register("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <span className="error">{errors.password.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="profile-actions">
                  <button type="submit" className="profile-edit-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    className="profile-logout-btn"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Profile;
