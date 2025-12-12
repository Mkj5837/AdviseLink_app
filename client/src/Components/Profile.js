import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Container } from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchemaValidation } from "../Validations/UserValidation";
import { updateUserProfile } from "../Features/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { DEFAULT_AVATAR_URLS } from "../avatars";
import "../css/Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //access the current user object
  const {
    user: currentUser,
    isLoading,
    error,
  } = useSelector((state) => state.user);

  //state for component logic
  const [editMode, setEditMode] = useState(false);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(
    currentUser?.profilePic
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
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
      setSelectedAvatarUrl(currentUser.profilePic);
    }
  }, [editMode, currentUser, reset]);

  //redirect if user is somehow null (should be protected by ProtectedRoute)
  if (!currentUser) return <div>Loading...</div>;

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
      console.log("Profile updated successfully.");
    } catch (rejectedValueOrError) {
      console.error("Update FAILED:", rejectedValueOrError);
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
              src={currentUser.profilePic}
              alt="Profile"
              className="profile-pic"
            />
            <h2>
              {currentUser.firstName} {currentUser.lastName}
            </h2>
            <p className="user-type">({currentUser.userType})</p>
          </div>

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
                <strong>ID Number:</strong> {currentUser.idNumber}
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
