import { useEffect, useMemo, useState } from "react";
import { getCalls } from "../api";

export default function CallLogs() {
  const [calls, setCalls] = useState([]);
  const [selectedCallId, setSelectedCallId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadCalls = async () => {
    try {
      const data = await getCalls();
      setCalls(data);
      if (!selectedCallId && data.length > 0) {
        setSelectedCallId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load calls:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadCalls();
      } finally {
        setLoading(false);
      }
    };
    init();

    let timer;
    if (autoRefresh) {
      timer = setInterval(() => {
        loadCalls();
      }, 10000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoRefresh]);

  const selected = useMemo(
    () => calls.find((item) => item.id === selectedCallId) || null,
    [calls, selectedCallId]
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed": return "status-confirmed";
      case "in-progress": return "status-pending";
      case "failed": return "status-no-answer";
      default: return "status-pending";
    }
  };

  const getOutcomeBadgeClass = (outcome) => {
    switch (outcome) {
      case "confirmed": return "status-confirmed";
      case "rescheduled": return "status-rescheduled";
      case "no_answer": return "status-no-answer";
      case "pending": return "status-pending";
      default: return "status-called";
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0s";
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "✅";
      case "in-progress": return "🔄";
      case "failed": return "❌";
      default: return "⏳";
    }
  };

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case "confirmed": return "✅";
      case "rescheduled": return "📅";
      case "no_answer": return "📵";
      case "pending": return "⏳";
      default: return "📞";
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading call logs...
      </div>
    );
  }

  return (
    <section>
      <div className="page-header">
        <h2>Call History & Analytics</h2>
        <p className="page-subtitle">Monitor patient communication outcomes and call recordings</p>
      </div>

      <div className="call-logs-container">
        <div className="card calls-list">
          <div className="list-header">
            <h3>Recent Calls ({calls.length})</h3>
            <div className="refresh-controls">
              <button 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`btn-secondary ${autoRefresh ? 'active' : ''}`}
              >
                <span>{autoRefresh ? '🔄' : '⏸️'}</span>
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
              <button onClick={loadCalls} className="btn-secondary">
                <span>🔄</span>
                Refresh Now
              </button>
            </div>
          </div>

          {calls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📞</div>
              <h4>No Calls Yet</h4>
              <p>Start making calls to patients to see their communication history here.</p>
            </div>
          ) : (
            <div className="calls-list-container">
              {calls.map((call) => (
                <div
                  key={call.id}
                  className={`call-item ${call.id === selectedCallId ? "active" : ""}`}
                  onClick={() => setSelectedCallId(call.id)}
                >
                  <div className="call-header">
                    <div className="call-patient">
                      <span className="patient-name">{call.patient_name}</span>
                      <span className={`status-badge ${getStatusBadgeClass(call.status)}`}>
                        {getStatusIcon(call.status)} {call.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="call-time">
                      {formatDate(call.created_at)}
                    </div>
                  </div>
                  <div className="call-details">
                    <div className="call-info">
                      <span className="phone-number">📱 {call.phone_number}</span>
                      <span className="duration">⏱️ {formatDuration(call.duration_seconds)}</span>
                    </div>
                    <div className="call-outcome">
                      <span className={`outcome-badge ${getOutcomeBadgeClass(call.outcome)}`}>
                        {getOutcomeIcon(call.outcome)} {call.outcome?.replace(/_/g, ' ') || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card call-details">
          <h3>Call Details</h3>
          {selected ? (
            <div className="details-content">
              <div className="detail-section">
                <h4>Patient Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <span>{selected.patient_name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone Number</label>
                    <span>{selected.phone_number}</span>
                  </div>
                  <div className="detail-item">
                    <label>Call Status</label>
                    <span className={`status-badge ${getStatusBadgeClass(selected.status)}`}>
                      {getStatusIcon(selected.status)} {selected.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Outcome</label>
                    <span className={`status-badge ${getOutcomeBadgeClass(selected.outcome)}`}>
                      {getOutcomeIcon(selected.outcome)} {selected.outcome?.replace(/_/g, ' ') || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Call Metrics</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Duration</label>
                    <span>{formatDuration(selected.duration_seconds)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Call Time</label>
                    <span>{formatDate(selected.created_at)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Updated</label>
                    <span>{formatDate(selected.updated_at)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Provider</label>
                    <span>{selected.provider || 'Bolna'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Communication Details</h4>
                <div className="transcript-section">
                  <div className="transcript-header">
                    <label>Transcript</label>
                    {selected.transcript && (
                      <button 
                        onClick={() => navigator.clipboard.writeText(selected.transcript)}
                        className="btn-secondary btn-sm"
                      >
                        📋 Copy
                      </button>
                    )}
                  </div>
                  <div className="transcript-content">
                    {selected.transcript ? (
                      <pre>{selected.transcript}</pre>
                    ) : (
                      <p className="text-gray-500">No transcript available yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {selected.recording_url && (
                <div className="detail-section">
                  <h4>Recording</h4>
                  <a 
                    href={selected.recording_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="recording-link"
                  >
                    <span>🎵</span>
                    Open Call Recording
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-icon">📞</div>
              <h4>Select a Call</h4>
              <p>Choose a call from the list to view detailed information and transcript.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
