import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../api/axios";
import "../../css/Dashboard.css";

const UserList = () => {
  const advisor = useSelector((state) => state.user.user);
  const [advisees, setAdvisees] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [filterTerm, setFilterTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const stripUpdatedTag = (value) =>
    typeof value === "string"
      ? value.replace(/-updated/gi, "").trim()
      : value;
  const formatName = (student = {}) =>
    `${stripUpdatedTag(student.firstName || "")} ${stripUpdatedTag(
      student.lastName || ""
    )}`.trim();

  const filteredAdvisees = advisees.filter((student) => {
    if (!filterTerm.trim()) return true;
    const query = filterTerm.trim().toLowerCase();
    const fullName = formatName(student).toLowerCase();
    return (
      student.idNumber?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      fullName.includes(query)
    );
  });

  //get saved advisees on page load
  useEffect(() => {
    const loadAdvisees = async () => {
      try {
        const advisorIdentifier = (
          advisor?.idNumber ||
          advisor?.email ||
          advisor?._id ||
          ""
        ).toString();
        if (!advisorIdentifier) return;

        const response = await api.get(`/myAdvisees/${advisorIdentifier}`);

        //fetch progress for each advisee
        const listWithProgress = await Promise.all(
          response.data.map(async (stud) => {
            try {
              const prog = await api.get(`/adviseeProgress/${stud.idNumber}`);
              return { ...stud, progress: prog.data.progress };
            } catch (err) {
              console.warn("Progress fetch failed for", stud.idNumber, err);
              return { ...stud, progress: 0 };
            }
          })
        );

        setAdvisees(listWithProgress);
      } catch (err) {
        console.error("Error loading advisees:", err);
        setAdvisees([]);
      }
    };
    if (advisor) loadAdvisees();
  }, [advisor]);

  const handleSearch = async () => {
    const trimmedSearchId = searchId.trim();
    if (!trimmedSearchId) {
      setSearchResult(null);
      return;
    }

    const existingAdvisee = advisees.find(
      (std) => std.idNumber === trimmedSearchId
    );
    if (existingAdvisee) {
      setSearchResult(existingAdvisee);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/searchStudent/${trimmedSearchId}`);

      let progressValue = 0;
      try {
        const progressRes = await api.get(
          `/adviseeProgress/${response.data.idNumber}`
        );
        progressValue = progressRes.data?.progress ?? 0;
      } catch (progressErr) {
        console.warn("Could not load progress:", progressErr?.message);
      }

      setSearchResult({
        ...response.data,
        progress: progressValue, //Attach progress to student object (default 0 if not found)
      });
    } catch (err) {
      const message =
        err.response?.data?.error || "Student not found. Please check the ID or email.";
      alert(message);
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdvisee = async () => {
    if (!searchResult) return;

    const alreadyAdded = advisees.some(
      (std) => std.idNumber === searchResult.idNumber
    );
    if (alreadyAdded) {
      alert("This student is already in your advisee list.");
      return;
    }

    try {
      const advisorIdentifier = (
        advisor?.idNumber ||
        advisor?.email ||
        advisor?._id ||
        ""
      ).toString();
      if (!advisorIdentifier) throw new Error("Advisor identifier missing.");

      await api.post("/addAdvisee", {
        advisorIdNumber: advisorIdentifier,
        studentIdNumber: searchResult.idNumber,
      });

      //refresh the list
      setAdvisees((prev) => [...prev, { ...searchResult }]);
      setSearchId("");
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
      const advisorIdentifier = (
        advisor?.idNumber ||
        advisor?.email ||
        advisor?._id ||
        ""
      ).toString();
      if (!advisorIdentifier) throw new Error("Advisor identifier missing.");

      await api.delete("/removeAdvisee", {
        data: {
          advisorIdNumber: advisorIdentifier,
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

  const isExistingSearchResult =
    searchResult &&
    advisees.some((std) => std.idNumber === searchResult.idNumber);

  return (
    <div className="user-list-container">
      <h2>Add New Advisee</h2>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Enter student ID or email..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
              {formatName(searchResult)}
            </h4>
            <p>ID: {searchResult.idNumber}</p>
            <p>Email: {searchResult.email}</p>
            {isExistingSearchResult && (
              <p className="already-added-msg">Already in your advisee list.</p>
            )}
          </div>
          <button
            className="add-btn"
            onClick={handleAddAdvisee}
            disabled={isExistingSearchResult}
          >
            {isExistingSearchResult ? "Added" : "Add Advisee"}
          </button>
        </div>
      )}

      <hr />

      {/* Advisee Table */}
      <h3>My Advisees</h3>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search advisees by name, email, or ID..."
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
        />
        {filterTerm && (
          <button type="button" onClick={() => setFilterTerm("")}>
            Clear
          </button>
        )}
      </div>
      <table className="advisee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Progress (%)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvisees.length > 0 ? (
            filteredAdvisees.map((student) => (
              <tr key={student.idNumber}>
                <td>{student.idNumber}</td>
                <td>
                  {formatName(student)}
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
            ))
          ) : (
            <tr>
              <td colSpan="5">
                {advisees.length
                  ? "No advisees match your search."
                  : "No advisees added yet."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
