import { Link, useLocation, Outlet } from 'react-router-dom';
import './AdminLayout.scss';

const AdminLayout = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentSection = pathSegments[1] || 'dashboard';

  return (
    <div className="admin-layout">
      <nav className="admin-breadcrumb">
        <Link to="/admin">Admin</Link>
        {pathSegments.length > 1 && (
          <>
            <span> / </span>
            <Link to={`/admin/${currentSection}`}>
              {currentSection.replace(/-/g, ' ')}
            </Link>
          </>
        )}
      </nav>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
