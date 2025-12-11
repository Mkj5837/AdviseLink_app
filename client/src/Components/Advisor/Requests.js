import React from 'react';

const RequestsSection = () => {
  return (
    <div className="requests-section">
      <div className="section-header">
        <h2>Requests</h2>
        <div className="completion-chart">
          <div className="chart-circle">
            <span className="percentage">55%</span>
            <span className="label">Finished</span>
          </div>
          <div className="chart-stats">
            <span>10/12</span>
          </div>
        </div>
      </div>

      <div className="request-items">
        <div className="request-item">
          <i className="fas fa-calendar-plus"></i>
          <div className="request-info">
            <h3>Schedule Meeting with Advisee</h3>
          </div>
        </div>

        <div className="request-item">
          <i className="fas fa-users"></i>
          <div className="request-info">
            <h3>Manage Advisees</h3>
            <p>List of Students</p>
          </div>
        </div>

        <div className="request-item">
          <i className="fas fa-file-alt"></i>
          <div className="request-info">
            <h3>Student Academic Plans</h3>
            <p>Student info</p>
          </div>
        </div>
      </div>

      <div className="request-stats">
        <div className="stat">
          <span className="stat-number">10</span>
          <span className="stat-label">Signed</span>
        </div>
        <div className="stat">
          <span className="stat-number">2</span>
          <span className="stat-label">Remaining</span>
        </div>
      </div>
    </div>
  );
};

export default RequestsSection;