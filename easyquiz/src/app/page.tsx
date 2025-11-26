'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { getLoggedUser } from '@/services/api';

export default function HomePage() {
  const router = useRouter();

  // Função para controlar a navegação baseada no login
  const handleNavigation = (path: string) => {
    const user = getLoggedUser();
    
    if (user) {
      router.push(path);
    } else {
      router.push('/auth/sign-in');
    }
  };

  return (
    <>
      {/* 1. Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Crie Provas em Minutos, não em Horas.
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Bem-vindo ao EasyQuiz, a plataforma inteligente para professores. 
            Crie, compartilhe e gere provas personalizadas com facilidade.
          </p>
          <div className="flex justify-center gap-4">
            {/* Botão 1: Gerar Prova */}
            <button 
              onClick={() => handleNavigation('/dashboard/generator')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Gerar Prova Rápida
            </button>
          </div>
        </div>
      </section>

      {/* 2. Seção de Recursos (Features) */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tudo que você precisa em um só lugar
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <CheckCircle className="text-blue-600 mb-3" size={32} />
            <h3 className="text-xl font-semibold mb-2">Geração Inteligente</h3>
            <p className="text-gray-600">
              Filtre por disciplina, nível de dificuldade e muito mais para criar a prova perfeita.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <CheckCircle className="text-blue-600 mb-3" size={32} />
            <h3 className="text-xl font-semibold mb-2">Formatos Variados</h3>
            <p className="text-gray-600">
              Suporte completo para questões de Múltipla Escolha, Dissertativas e Verdadeiro/Falso.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <CheckCircle className="text-blue-600 mb-3" size={32} />
            <h3 className="text-xl font-semibold mb-2">Exporte para PDF</h3>
            <p className="text-gray-600">
              Gere um PDF profissional da sua prova, com ou sem gabarito, pronto para imprimir.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}