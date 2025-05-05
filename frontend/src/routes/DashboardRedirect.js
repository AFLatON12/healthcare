import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user.normalizedId || user.id || user.ID || user._id || user.userId;
      switch (user.role) {
        case 'patient':
          navigate(`/dashboard/patient/${userId}`);
          break;
        case 'doctor':
          navigate('/dashboard/doctor');
          break;
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'super_admin':
          navigate('/dashboard/superadmin');
          break;
        default:
          navigate('/login');
      }
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  return null;
}
