'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLoggedUser } from '@/services/api';

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  
  // Novo estado para controlar o menu no mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const logged = getLoggedUser();
    setUser(logged);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('easyquiz_user');
    window.location.href = '/auth/sign-in';
  };

  // Fecha o menu automaticamente ao clicar em um link (UX mobile)
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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

  const visibleMenuItems = menuItems.filter(item => {
    if (item.adminOnly) {
      return user && user.tipo === 'ADMIN';
    }
    return true;
  });

  return (
    <>
      {/* --- BOTÃO HAMBÚRGUER (Aparece apenas no Mobile) --- */}
      {/* Fica fixo no canto superior esquerdo. Ajuste z-50 para ficar acima de tudo */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-lg hover:bg-gray-700 transition-colors"
        aria-label="Abrir menu"
      >
        {isMobileMenuOpen ? (
          // Ícone de X (Fechar)
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Ícone de Menu (Hambúrguer)
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* --- OVERLAY (Fundo escuro no mobile quando aberto) --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white p-4 flex flex-col shadow-xl z-40
          transition-transform duration-300 ease-in-out  
          ${/* Lógica de visibilidade: */ ''}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        
        {/* Título com margem extra no topo para não ficar atrás do botão X no mobile */}
        <div className="flex justify-between items-center mb-6 mt-14  px-2">
            <h2 className="text-2xl font-semibold md:mt-0 mt-8">Meu Painel</h2>
        </div>
        
        <ul className="space-y-2 overflow-y-auto flex-1 custom-scrollbar">
          {visibleMenuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={closeMobileMenu} // Fecha o menu ao clicar
                className="block px-4 py-2.5 rounded-md transition-colors duration-200 hover:bg-gray-700 hover:text-blue-400"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="mb-4 px-2 text-sm text-gray-400">
            <p>Logado como: <br/><span className="text-white font-medium">{user?.nome || 'Usuário'}</span></p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}