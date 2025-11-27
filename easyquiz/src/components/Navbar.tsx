'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BookMarked, Menu, X } from 'lucide-react'; // Adicionado Menu e X
import { getLoggedUser } from '@/services/api';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Novo estado

  useEffect(() => {
    setMounted(true);
    const logged = getLoggedUser();
    setUser(logged);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-300 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- LOGO --- */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              href="/" 
              className="flex items-center text-xl md:text-2xl font-bold text-blue-600 hover:opacity-80 transition-opacity"
            >
              <BookMarked className="mr-2 w-6 h-6" />
              EasyQuiz
            </Link>
          </div>
          
          {/* --- MENU DESKTOP (Visível apenas em md ou maior) --- */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">Olá, {user.nome}</span>
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

          {/* --- BOTÃO MOBILE TOGGLE (Visível apenas em mobile) --- */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {/* Alterna entre ícone de Menu e X */}
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MENU MOBILE (Dropdown) --- */}
      {/* Renderiza condicionalmente baseado no estado */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white" id="mobile-menu">
          <div className="px-4 pt-2 pb-4 space-y-3 shadow-lg">
            {user ? (
              <>
                <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 bg-gray-50">
                  Logado como: <span className="text-gray-900">{user.nome}</span>
                </div>
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)} // Fecha ao clicar
                  className="block w-full text-center bg-blue-600 text-white font-medium px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ir para Dashboard
                </Link>
              </>
            ) : (
              <Link 
                href="/auth/sign-in" 
                onClick={() => setIsMobileMenuOpen(false)} // Fecha ao clicar
                className="block w-full text-center bg-gray-100 text-gray-700 font-medium px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Fazer Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}