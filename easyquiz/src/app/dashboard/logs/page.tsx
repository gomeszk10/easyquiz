'use client';

import { History, UserCheck, UserPlus, UserX, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { API_URL } from '@/services/api';

// Definição dos tipos vindos do Backend
type Usuario = {
  id: number;
  nome: string;
  email: string;
  tipo: string;
};

type LogEntryBackend = {
  id: number;
  admin: Usuario | null; // Pode ser null se deletado
  professor: Usuario | null; // Pode ser null se deletado
  dataHora: string;
  acao: 'CADASTRO' | 'ALTERACAO' | 'EXCLUSAO';
};

// CORREÇÃO 1: Retorno consistente (sempre objeto)
const formatDate = (isoString: string) => {
  if (!isoString) return { date: '-', time: '-' };
  try {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  } catch (e) {
    return { date: '-', time: '-' };
  }
};

const getActionDetails = (acao: string) => {
  switch (acao) {
    case 'CADASTRO':
      return { label: 'Cadastro', color: 'text-green-600 bg-green-100', icon: UserPlus };
    case 'ALTERACAO':
      return { label: 'Alteração', color: 'text-blue-600 bg-blue-100', icon: UserCheck };
    case 'EXCLUSAO':
      return { label: 'Exclusão', color: 'text-red-600 bg-red-100', icon: UserX };
    default:
      return { label: acao, color: 'text-gray-600 bg-gray-100', icon: History };
  }
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntryBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/logcadastro/listar`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.sort((a: LogEntryBackend, b: LogEntryBackend) => b.id - a.id));
      } else {
        setError('Erro ao carregar registros.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <History size={30} />
        Log de Auditoria (Administrativo)
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-md text-center">
          {error}
        </div>
      ) : (
        <div className="bg-white p-6 shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário Alvo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data / Hora</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => {
                const details = getActionDetails(log.acao);
                const { date, time } = formatDate(log.dataHora);
                
                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.id}
                    </td>
                    
                    {/* CORREÇÃO 2: Lógica Simplificada para evitar erro de 'never' */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.admin ? (
                        <>
                          <div className="text-sm font-medium text-gray-900">{log.admin.nome}</div>
                          <div className="text-xs text-gray-500">{log.admin.email}</div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Admin Removido</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold leading-5 rounded-full ${details.color}`}>
                        <details.icon size={14} className="mr-1" />
                        {details.label}
                      </span>
                    </td>
                    
                    {/* CORREÇÃO 3: Se professor for null, mostramos apenas o texto fixo */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.professor ? (
                        <>
                          <div className="text-sm font-medium text-gray-900">{log.professor.nome}</div>
                          <div className="text-xs text-gray-500">{log.professor.email}</div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Usuário Removido</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{date}</div>
                      <div className="text-xs text-gray-500">{time}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {logs.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Nenhum registro de auditoria encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
}