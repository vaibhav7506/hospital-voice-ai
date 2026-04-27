import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>MediCall CRM</h1>
        <p className="sidebar-subtitle">Healthcare Communication System</p>
      </div>
      <nav>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/contacts" className={({ isActive }) => (isActive ? "active" : "")}>
          <span className="nav-icon">👥</span>
          <span>Patients</span>
        </NavLink>
        <NavLink to="/calls" className={({ isActive }) => (isActive ? "active" : "")}>
          <span className="nav-icon">📞</span>
          <span>Call Logs</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <div className="footer-info">
          <p className="version">v1.0.0</p>
          <p className="powered-by">Powered by Bolna AI</p>
        </div>
      </div>
    </aside>
  );
}
