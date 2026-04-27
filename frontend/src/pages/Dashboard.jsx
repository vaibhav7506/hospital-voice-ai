import { useEffect, useMemo, useState } from "react";
import { getCalls, getContacts } from "../api";

function pct(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadDashboardData = async () => {
    try {
      const [contactsData, callsData] = await Promise.all([getContacts(), getCalls()]);
      setContacts(contactsData);
      setCalls(callsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    let timer;
    if (autoRefresh) {
      timer = setInterval(() => {
        loadDashboardData();
      }, 10000); // Refresh every 10 seconds
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoRefresh]);

  const stats = useMemo(() => {
    const totalContacts = contacts.length;
    const totalCalls = calls.length;
    const confirmed = contacts.filter((item) => item.status === "confirmed").length;
    const rescheduled = contacts.filter((item) => item.status === "rescheduled").length;
    const noAnswer = contacts.filter((item) => item.status === "no_answer").length;
    const pending = contacts.filter((item) => item.status === "pending").length;
    const called = contacts.filter((item) => item.status === "called").length;
    
    return {
      totalContacts,
      totalCalls,
      confirmed,
      rescheduled,
      noAnswer,
      pending,
      called,
      confirmedRate: pct(confirmed, totalContacts),
      reachRate: pct(totalCalls, totalContacts)
    };
  }, [contacts, calls]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading dashboard...
      </div>
    );
  }

  return (
    <section>
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h2>Healthcare Communication Dashboard</h2>
            <p className="dashboard-subtitle">Monitor patient appointment confirmations and call analytics</p>
          </div>
          <div className="dashboard-controls">
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`btn-secondary ${autoRefresh ? 'active' : ''}`}
            >
              <span>{autoRefresh ? '🔄' : '⏸️'}</span>
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </button>
            <button onClick={loadDashboardData} className="btn-secondary">
              <span>🔄</span>
              Refresh Now
            </button>
          </div>
        </div>
        <div className="last-updated">
          <small>Last updated: {lastUpdated.toLocaleTimeString()}</small>
        </div>
      </div>

      <div className="cards">
        <article className="card stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <p className="stat-label">Total Patients</p>
            <h3 className="stat-value">{stats.totalContacts}</h3>
            <p className="stat-change">Registered patients</p>
          </div>
        </article>
        
        <article className="card stat-card">
          <div className="stat-icon">📞</div>
          <div className="stat-content">
            <p className="stat-label">Calls Made</p>
            <h3 className="stat-value">{stats.totalCalls}</h3>
            <p className="stat-change">Reach rate: {stats.reachRate}%</p>
          </div>
        </article>
        
        <article className="card stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">Confirmed</p>
            <h3 className="stat-value">{stats.confirmed}</h3>
            <p className="stat-change">Rate: {stats.confirmedRate}%</p>
          </div>
        </article>
        
        <article className="card stat-card warning">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <h3 className="stat-value">{stats.pending}</h3>
            <p className="stat-change">Awaiting contact</p>
          </div>
        </article>
      </div>

      <div className="dashboard-grid">
        <div className="card status-overview">
          <h3>Appointment Status Overview</h3>
          <div className="status-list">
            <div className="status-item">
              <div className="status-info">
                <span className="status-dot confirmed"></span>
                <span className="status-text">Confirmed Appointments</span>
              </div>
              <div className="status-stats">
                <strong>{stats.confirmed}</strong>
                <span className="status-percentage">{pct(stats.confirmed, stats.totalContacts)}%</span>
              </div>
            </div>
            <div className="progress">
              <div 
                className="progress-bar confirmed" 
                style={{ width: `${pct(stats.confirmed, stats.totalContacts)}%` }} 
              />
            </div>

            <div className="status-item">
              <div className="status-info">
                <span className="status-dot rescheduled"></span>
                <span className="status-text">Rescheduled</span>
              </div>
              <div className="status-stats">
                <strong>{stats.rescheduled}</strong>
                <span className="status-percentage">{pct(stats.rescheduled, stats.totalContacts)}%</span>
              </div>
            </div>
            <div className="progress">
              <div 
                className="progress-bar rescheduled" 
                style={{ width: `${pct(stats.rescheduled, stats.totalContacts)}%` }} 
              />
            </div>

            <div className="status-item">
              <div className="status-info">
                <span className="status-dot no-answer"></span>
                <span className="status-text">No Answer</span>
              </div>
              <div className="status-stats">
                <strong>{stats.noAnswer}</strong>
                <span className="status-percentage">{pct(stats.noAnswer, stats.totalContacts)}%</span>
              </div>
            </div>
            <div className="progress">
              <div 
                className="progress-bar no-answer" 
                style={{ width: `${pct(stats.noAnswer, stats.totalContacts)}%` }} 
              />
            </div>

            <div className="status-item">
              <div className="status-info">
                <span className="status-dot pending"></span>
                <span className="status-text">Pending Contact</span>
              </div>
              <div className="status-stats">
                <strong>{stats.pending}</strong>
                <span className="status-percentage">{pct(stats.pending, stats.totalContacts)}%</span>
              </div>
            </div>
            <div className="progress">
              <div 
                className="progress-bar pending" 
                style={{ width: `${pct(stats.pending, stats.totalContacts)}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="card metrics-summary">
          <h3>Key Performance Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-value">{stats.confirmedRate}%</div>
              <div className="metric-label">Confirmation Rate</div>
              <div className="metric-description">Patients who confirmed appointments</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{stats.reachRate}%</div>
              <div className="metric-label">Contact Success Rate</div>
              <div className="metric-description">Patients successfully reached</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{stats.rescheduled}</div>
              <div className="metric-label">Rescheduled</div>
              <div className="metric-description">Patients who rescheduled</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{stats.noAnswer}</div>
              <div className="metric-label">No Answer</div>
              <div className="metric-description">Patients not reached</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
