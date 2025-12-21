import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchemaValidation } from "../Validations/ProfileValidation";
import { updateUserProfile } from "../Features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { DEFAULT_AVATAR_URLS } from "../avatars";
import "../css/Profile.css";


const Profile = () => {
  const dispatch = useDispatch();

  //access the current user object
  const {
    user: currentUser,
    isLoading,
    error,
  } = useSelector((state) => state.user);

  //state for component logic
  const [editMode, setEditMode] = useState(false);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    currentUser?.profilePic || DEFAULT_AVATAR_URLS[0]
  );
  // toast state for lightweight feedback messages
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), duration);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchemaValidation),
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      middleName: currentUser?.middleName || "",
    },
  });

  //reset form values when edit mode is toggled or user data updates.
  useEffect(() => {
    if (editMode && currentUser) {
      reset({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        middleName: currentUser.middleName || "",
      });
      setSelectedAvatarUrl(currentUser.profilePic || DEFAULT_AVATAR_URLS[0]);
    }
  }, [editMode, currentUser, reset]);

  //redirect if user is somehow null (should be protected by ProtectedRoute)
  if (!currentUser) return <div>Loading...</div>;

  const avatarSrc =
    currentUser.profilePic &&
    !currentUser.profilePic.includes("pfpDefault") &&
    !currentUser.profilePic.startsWith("./pfpDefault")
      ? currentUser.profilePic
      : selectedAvatarUrl || DEFAULT_AVATAR_URLS[0];

  const onSubmit = async (data) => {
    //only update name fields if they are different.
    const dataToSend = {
      //send the identifying email
      email: currentUser.email,
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      //send the selected URL to the server api.
      profilePicUrl: selectedAvatarUrl,
    };
    try {
      const result = await dispatch(updateUserProfile(dataToSend));
      unwrapResult(result);
      setEditMode(false); //on successful update, exit edit mode.
      showToast("Profile updated successfully.", "success");
    } catch (rejectedValueOrError) {
      console.error("Update FAILED:", rejectedValueOrError);
      showToast(rejectedValueOrError || "Failed to update profile", "error");
    }
  };

  return (
    <Container className="profile-container">
      <Row>
        <Col md="12" className="profile-header">
          <h1>My Profile</h1>
        </Col>
      </Row>
      <Row className="profile-content">
        <Col md="4" className="profile-sidebar">
          <div className="profile-pic-area">
            {/* Display current profile picture */}
            <img
              src={avatarSrc}
              alt="Profile"
              className="profile-pic"
            />
            <h2>
              {currentUser.firstName} {currentUser.lastName}
            </h2>
            <p className="user-type">({currentUser.userType})</p>
          </div>

          {/* Toast message */}
          {toast.message && (
            <div
              className={`profile-toast ${
                toast.type === "error" ? "error" : "success"
              }`}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                color: toast.type === "error" ? "#721c24" : "#155724",
                background: toast.type === "error" ? "#f8d7da" : "#d4edda",
                border:
                  toast.type === "error"
                    ? "1px solid #f5c6cb"
                    : "1px solid #c3e6cb",
              }}
            >
              {toast.message}
            </div>
          )}

          {/* server error message */}
          {error && <div className="error-message">{error}</div>}
          {isLoading && (
            <div className="loading-message">Saving changes...</div>
          )}

          <button
            className="profile-edit-btn"
            onClick={() => setEditMode(true)}
            disabled={editMode}
          >
            Edit Profile
          </button>
        </Col>

        <Col md="8" className="profile-details-area">
          <h3>Personal Details</h3>

          {!editMode && (
            <div className="details-view">
              <p>
                <strong>ID:</strong> {currentUser.idNumber}
              </p>
              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>
              <p>
                <strong>First Name:</strong> {currentUser.firstName}
              </p>
              <p>
                <strong>Middle Name:</strong> {currentUser.middleName}
              </p>
              <p>
                <strong>Last Name:</strong> {currentUser.lastName}
              </p>
            </div>
          )}

          {editMode && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="profile-edit-form"
            >
              <Row>
                <Col md="6">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" {...register("firstName")} />
                    {errors.firstName && (
                      <span className="error">{errors.firstName.message}</span>
                    )}
                  </div>
                </Col>
                <Col md="6">
                  <div className="form-group">
                    <label>Middle Name</label>
                    <input type="text" {...register("middleName")} />
                    {errors.middleName && (
                      <span className="error">{errors.middleName.message}</span>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" {...register("lastName")} />
                    {errors.lastName && (
                      <span className="error">{errors.lastName.message}</span>
                    )}
                  </div>
                </Col>
              </Row>

              {/*avatar selection grid (Replacing file upload) */}
              <div className="avatar-selection-group">
                <label>Select New Avatar</label>
                <div className="avatar-grid">
                  {DEFAULT_AVATAR_URLS.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt="Avatar option"
                      className={`avatar-option ${
                        selectedAvatarUrl === url ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAvatarUrl(url)}
                    />
                  ))}
                </div>
              </div>

              <div className="profile-actions">
                <button
                  type="submit"
                  className="profile-edit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="profile-logout-btn"
                  onClick={() => setEditMode(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
