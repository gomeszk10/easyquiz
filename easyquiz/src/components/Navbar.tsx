'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BookMarked, Search } from 'lucide-react';
import { getLoggedUser } from '@/services/api';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const logged = getLoggedUser();
    setUser(logged);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        
        {/* Lado Esquerdo: Logo */}
        <div className="flex-shrink-0">
          <Link 
            href="/" 
            className="flex items-center text-2xl font-bold text-blue-600 hover:opacity-80 transition-opacity"
          >
            <BookMarked className="mr-2" />
            EasyQuiz
          </Link>
        </div>
        
        {/* Lado Direito: Botões */}
        <div className="flex-shrink-0 flex items-center space-x-2">
          {user ? (
            <>
              <span className="text-gray-700 font-medium px-4 mr-2">Olá, {user.nome}</span>
              
              {/* Botão Dashboard: Visível para TODOS os usuários logados */}
              <Link 
                href="/dashboard" 
                className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <Link 
              href="/auth/sign-in" 
              className="text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}