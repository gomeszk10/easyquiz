'use client';

import { useEffect, useState } from 'react';
import { Edit, Trash2, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { API_URL, getLoggedUser } from '@/services/api';
import { showSuccess, showError, showConfirm } from '@/services/alertService';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipo: string;
};

export default function UsersListPage() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const logged = getLoggedUser();
    setCurrentUser(logged);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios/listar`);
      if (res.ok) setUsers(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async (id: number) => {
    const result = await showConfirm("Tem a certeza que deseja excluir este utilizador?");
    if (!result.isConfirmed) return;

    const logged = getLoggedUser();
    if (!logged) return;

    try {
      const res = await fetch(`${API_URL}/usuarios/delete/${id}/${logged.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        showSuccess("Usuário excluído com sucesso.");
      } else {
        showError("Erro ao excluir usuário.");
      }
    } catch (error) {
      showError("Erro de conexão ao tentar excluir.");
    }
};

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
        <Link href="/dashboard/users/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Novo Usuário
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      {user.tipo === 'ADMIN' ? <Shield size={20} /> : <User size={20} />}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.nome}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.tipo === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {user.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/dashboard/users/edit/${user.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                    <Edit size={18} />
                  </Link>
                  {user.id !== currentUser?.id && (
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}