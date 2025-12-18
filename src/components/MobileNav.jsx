import { NavLink } from 'react-router-dom'

function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Primary">
      <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-label">Dashboard</span>
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-label">History</span>
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-label">Settings</span>
      </NavLink>
    </nav>
  )
}

export default MobileNav