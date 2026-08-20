import { useState, useEffect } from 'react';
import api from '../../api/axiosClient';
import { ShieldAlert, UserX, UserCheck, Shield } from 'lucide-react';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  authProvider: string;
  isDeleted: boolean;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id: number) => {
    try {
      await api.patch(`/admin/users/${id}/status`);
      fetchUsers();
    } catch (err) {
      console.error('Error toggling status', err);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando usuarios...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert size={32} className="text-blue-600" />
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">ID</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Usuario</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Rol</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500">Estado</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">#{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{user.fullName || 'Sin nombre'}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800' : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800'}`}>
                      {user.role === 'ADMIN' && <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${!user.isDeleted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
                      {!user.isDeleted ? 'Activo' : 'Desactivado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${!user.isDeleted ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
                        title={!user.isDeleted ? 'Desactivar Cuenta' : 'Activar Cuenta'}
                      >
                        {!user.isDeleted ? <UserX size={20} /> : <UserCheck size={20} />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
