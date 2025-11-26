'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, FileText, CheckSquare, BarChart2, User, BookOpen, UserRoundPlus, History, Loader2 } from 'lucide-react';
import { API_URL, getLoggedUser } from '@/services/api';

const atalhos = [
  {
    nome: 'Criar Nova Questão',
    href: '/dashboard/questions/new',
    icone: <Plus size={20} className="mr-2" />,
    descricao: 'Adicionar uma nova questão ao seu banco pessoal.',
    adminOnly: false
  },
  {
    nome: 'Gerar Nova Prova',
    href: '/dashboard/generator',
    icone: <FileText size={20} className="mr-2" />,
    descricao: 'Criar uma prova customizada usando filtros.',
    adminOnly: false
  },
  {
    nome: 'Editar Perfil',
    href: '/dashboard/profile',
    icone: <User size={20} className="mr-2" />,
    descricao: 'Editar as informações do seu perfil.',
    adminOnly: false
  },
  {
    nome: 'Cadastrar Disciplinas',
    href: '/dashboard/disciplinas',
    icone: <BookOpen size={20} className="mr-2" />,
    descricao: 'Cadastrar novas opções de disciplinas.',
    adminOnly: true
  },
  {
    nome: 'Cadastrar Novo Usuário',
    href: '/dashboard/users/new',
    icone: <UserRoundPlus size={20} className="mr-2" />,
    descricao: 'Cadastrar um novo usuário no sistema.',
    adminOnly: true
  },
  {
    nome: 'Ver Registros',
    href: '/dashboard/logs',
    icone: <History size={20} className="mr-2" />,
    descricao: 'Visualizar logs e registros do sistema.',
    adminOnly: true
  }
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [counts, setCounts] = useState({
    total: 0,
    multipla: 0,
    vf: 0,
    dissertativa: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logged = getLoggedUser();
    setUser(logged);

    if (logged) {
        let url = `${API_URL}/questao/stats`; 

        if (logged.tipo === 'PROFESSOR') {
            url = `${API_URL}/questao/stats/personal/${logged.id}`;
        }

        fetch(url)
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Erro ao buscar estatísticas');
        })
        .then(data => {
            setCounts(data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, []);

  const statsCards = [
    {
      nome: 'Questões Criadas', 
      valor: counts.total,
      icone: <CheckSquare size={24} className="text-blue-600" />,
    },
    {
      nome: 'Múltipla Escolha',
      valor: counts.multipla,
      icone: <FileText size={24} className="text-green-600" />,
    },
    {
      nome: 'Verdadeiro ou Falso',
      valor: counts.vf,
      icone: <BarChart2 size={24} className="text-yellow-600" />,
    },
    {
      nome: 'Dissertativa',
      valor: counts.dissertativa,
      icone: <BarChart2 size={24} className="text-purple-600" />,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
         Painel - {user?.tipo === 'ADMIN' ? 'Visão Geral (Admin)' : 'Minhas Estatísticas'}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Bem-vindo, {user?.nome}. Aqui está o resumo das suas atividades.
      </p>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => (
          <div 
            key={stat.nome} 
            className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 flex items-center transition-transform hover:scale-105"
          >
            <div className="mr-4 p-3 bg-gray-100 rounded-full">
              {stat.icone}
            </div>
            <div>
              {loading ? (
                <Loader2 className="animate-spin text-gray-400" size={24} />
              ) : (
                <p className="text-3xl font-bold text-gray-800">{stat.valor}</p>
              )}
              <p className="text-sm font-semibold text-gray-500">{stat.nome}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Atalhos Rápidos (Filtrados por permissão) */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {atalhos
            .filter(item => !item.adminOnly || (user && user.tipo === 'ADMIN'))
            .map((atalho) => (
            <Link 
              key={atalho.nome}
              href={atalho.href}
              className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all flex items-start"
            >
              <div className="flex-shrink-0 mt-1 p-2 bg-blue-50 rounded-md text-blue-600 mr-4">
                {atalho.icone}
              </div>
              <div>
                <div className="text-xl font-semibold text-gray-800 mb-1">
                  {atalho.nome}
                </div>
                <p className="text-gray-600 text-sm">{atalho.descricao}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}