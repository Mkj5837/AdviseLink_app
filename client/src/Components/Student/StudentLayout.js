import React from "react";
import { Outlet } from "react-router-dom";
import StudentSideBar from "./StudentSideBar";
import Header from "../Header";
import { useSelector } from "react-redux";

const StudentLayout = () => {
  const email = useSelector((state) => state.user.user?.email);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {email && <Header />}

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/*sidebar, fixed on the left under the header */}
        <StudentSideBar />

        {/* Dynamic child component*/}
        <main
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            backgroundColor: "#ffffff",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
