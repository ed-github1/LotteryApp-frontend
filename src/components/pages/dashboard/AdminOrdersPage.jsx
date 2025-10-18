import OrdersAdmin from '../../features/admin/OrdersAdmin';
import { useAuth } from '../../../context/AuthContext';

const AdminOrdersPage = () => {
  const { user } = useAuth();

  return (<OrdersAdmin />)
}

export default AdminOrdersPage;