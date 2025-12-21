import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import "../../css/Dashboard.css";

const UserList = () => {
  const advisor = useSelector((state) => state.user.user);
  const [advisees, setAdvisees] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  //get saved advisees on page load
  useEffect(() => {
    const loadAdvisees = async () => {
      try {
        const response = await api.get(`/myAdvisees/${advisor.idNumber}`);

        //fetch progress for each advisee
        const listWithProgress = await Promise.all(
          response.data.map(async (stud) => {
            const prog = await api.get(`/adviseeProgress/${stud.idNumber}`);
            return { ...stud, progress: prog.data.progress };
          })
        );

        setAdvisees(listWithProgress);
      } catch (err) {
        console.error("Error loading advisees:", err);
      }
    };
    if (advisor?.idNumber) loadAdvisees();
  }, [advisor]);

  const handleSearch = async () => {
    if (!searchId) return;
    setLoading(true);
    try {
      const response = await api.get(`/searchStudent/${searchId}`);
      //get the progress separately
      const progressRes = await api.get(`/adviseeProgress/${searchId}`);

      setSearchResult({
        ...response.data,
        progress: progressRes.data.progress, //Attach progress to student object
      });
    } catch (err) {
      alert("Student not found.");
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdvisee = async () => {
    try {
      await api.post("/addAdvisee", {
        advisorIdNumber: advisor.idNumber,
        studentIdNumber: searchResult.idNumber,
      });

      //refresh the list
      setAdvisees([...advisees, { ...searchResult }]);
      setSearchResult(null);
    } catch (err) {
      alert(err.response?.data?.error || "Error adding student.");
    }
  };

  const handleRemoveAdvisee = async (studentIdNumber) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this student from your list?"
      )
    )
      return;

    try {
      await api.delete("/removeAdvisee", {
        data: {
          advisorIdNumber: advisor.idNumber,
          studentIdNumber: studentIdNumber,
        },
      });

      //update local state to remove the student from the table immediately
      setAdvisees(advisees.filter((std) => std.idNumber !== studentIdNumber));
      alert("Student removed from your list.");
    } catch (err) {
      console.error("Error removing advisee:", err);
      alert("Failed to remove student.");
    }
  };

  return (
    <div className="user-list-container">
      <h2>Add New Advisee</h2>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Student ID Number..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Search Result Card */}
      {searchResult && (
        <div className="search-result-card">
          <div className="result-info">
            <h4>
              {searchResult.firstName} {searchResult.lastName}
            </h4>
            <p>ID: {searchResult.idNumber}</p>
            <p>Email: {searchResult.email}</p>
          </div>
          <button className="add-btn" onClick={handleAddAdvisee}>
            Add Advisee
          </button>
        </div>
      )}

      <hr />

      {/* Advisee Table */}
      <h3>My Advisees</h3>
      <table className="advisee-table">
        <thead>
          <tr>
            <th>ID Number</th>
            <th>Name</th>
            <th>Email</th>
            <th>Progress (%)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {advisees.map((student, index) => (
            <tr key={index}>
              <td>{student.idNumber}</td>
              <td>
                {student.firstName} {student.lastName}
              </td>
              <td>{student.email}</td>
              <td>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                  <span>{student.progress}%</span>
                </div>
              </td>
              <td>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveAdvisee(student.idNumber)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
