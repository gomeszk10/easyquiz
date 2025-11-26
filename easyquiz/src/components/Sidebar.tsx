'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLoggedUser } from '@/services/api';

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const logged = getLoggedUser();
    setUser(logged);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('easyquiz_user');
    window.location.href = '/auth/sign-in';
  };

  if (!mounted) return null;

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', adminOnly: false },
    { name: 'Gerar Prova', href: '/dashboard/generator', adminOnly: false },
    { name: 'Minhas Questões', href: '/dashboard/questions', adminOnly: false },
    { name: 'Criar Questão', href: '/dashboard/questions/new', adminOnly: false },
    { name: 'Perfil', href: '/dashboard/profile', adminOnly: false },
    
    // Itens restritos
    { name: 'Disciplinas', href: '/dashboard/disciplinas', adminOnly: true },
    { name: 'Cadastrar Novo Usuário', href: '/dashboard/users/new', adminOnly: true },
    { name: 'Gerenciar Usuários', href: '/dashboard/users', adminOnly: true },
    { name: 'Registros', href: '/dashboard/logs', adminOnly: true }
  ];

  // Filtra o menu
  const visibleMenuItems = menuItems.filter(item => {
    if (item.adminOnly) {
      return user && user.tipo === 'ADMIN';
    }
    return true;
  });

  return (
    <nav className="w-64 h-[calc(100vh-5rem)] bg-gray-800 text-white flex-shrink-0 p-4 flex flex-col sticky top-20">
      <h2 className="text-2xl font-semibold mb-6">Meu Painel</h2>
      
      <ul className="space-y-2 overflow-y-auto">
        {visibleMenuItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="block px-4 py-2 rounded-md hover:bg-gray-700"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Botão de Sair na parte inferior (mt-auto empurra para o fundo) */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-md bg-red-600 hover:bg-red-700 focus:outline-none text-white font-bold shadow-md transition-colors"
          aria-label="Sair"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}