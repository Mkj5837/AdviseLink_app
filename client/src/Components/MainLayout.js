import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import StudentSideBar from "./Student/StudentSideBar";
import AdvisorSideBar from "./Advisor/AdvisorSideBar";

const MainLayout = () => {
  //get the userType from redux state to decide which sidebar to show
  const userType = useSelector((state) => state.user.user?.userType);

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 70px)",
        overflow: "hidden",
      }}
    >
      {/*dynamic sidebar based on role */}
      {userType === "student" ? <StudentSideBar /> : <AdvisorSideBar />}

      {/*Main content area: "Outlet" renders the child routes defined in App.js*/}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#fff",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
