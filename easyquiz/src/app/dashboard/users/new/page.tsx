'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield } from 'lucide-react';
import { API_URL, getLoggedUser } from '@/services/api';
import { showSuccess, showError } from '@/services/alertService';

type UserType = 'Professor' | 'Admin';

type Disciplina = {
  id: number;
  nome: string;
};

export default function NewUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('Professor'); 
  
  // Estados para disciplinas
  const [availableDisciplinas, setAvailableDisciplinas] = useState<Disciplina[]>([]);
  const [selectedDisciplinas, setSelectedDisciplinas] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);

  // Carregar disciplinas ao iniciar
  useEffect(() => {
    fetch(`${API_URL}/disciplina/listar`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Falha ao carregar disciplinas");
      })
      .then(data => setAvailableDisciplinas(data))
      .catch(err => console.error(err));
  }, []);

  const handleDisciplinaToggle = (id: number) => {
    setSelectedDisciplinas(prev => {
      if (prev.includes(id)) {
        return prev.filter(dId => dId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const currentUser = getLoggedUser();
    if (!currentUser) {
        showError('Você precisa estar logado como Admin.');
        setLoading(false);
        return;
    }

    const typeToSend = userType.toUpperCase(); 

    // Payload correspondente ao DTO do backend
    const payload = {
        nome: name,
        email: email,
        tipo: typeToSend,
        // Envia a lista de disciplinas apenas se for professor, senão lista vazia
        disciplinaIds: typeToSend === 'PROFESSOR' ? selectedDisciplinas : []
    };

    try {
        const res = await fetch(`${API_URL}/usuarios/cadastrar/${currentUser.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showSuccess(`Usuário cadastrado com sucesso! A senha foi enviada para o email.`);
            setName('');
            setEmail('');
            setSelectedDisciplinas([]);
        } else {
            const errorText = await res.text();
            showError(`Erro: ${errorText || 'Falha ao cadastrar.'}`);
        }
    } catch (error) {
        console.error(error);
        showError('Falha na conexão com o servidor.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Cadastrar Novo Usuário</h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg space-y-6">
        {/* Campo Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 p-2 border rounded-md"
              placeholder="Ex: João da Silva"
              required
            />
          </div>
        </div>

        {/* Campo Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-2 border rounded-md"
              placeholder="Ex: joao.silva@email.com"
              required
            />
          </div>
        </div>

        {/* Campo Tipo de Perfil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Perfil</label>
          <div className="flex items-center gap-6 p-3 bg-gray-50 border rounded-md">
            <Shield className="text-gray-500" size={20} />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="Professor"
                  checked={userType === 'Professor'}
                  onChange={() => setUserType('Professor')}
                  className="h-4 w-4"
                />
                Professor
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="userType"
                  value="Admin"
                  checked={userType === 'Admin'}
                  onChange={() => setUserType('Admin')}
                  className="h-4 w-4"
                />
                Admin
              </label>
            </div>
          </div>
        </div>

        {/* Seleção de Disciplinas (Apenas para Professores) */}
        {userType === 'Professor' && (
          <div className="animate-fade-in">
             <label className="block text-sm font-medium text-gray-700 mb-2">Disciplinas Lecionadas</label>
             <div className="border rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableDisciplinas.length === 0 && <p className="text-gray-400 text-sm">Nenhuma disciplina cadastrada.</p>}
                
                {availableDisciplinas.map((d) => (
                  <label key={d.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                    <input 
                      type="checkbox" 
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                      checked={selectedDisciplinas.includes(d.id)}
                      onChange={() => handleDisciplinaToggle(d.id)}
                    />
                    <span className="text-sm text-gray-700">{d.nome}</span>
                  </label>
                ))}
             </div>
             <p className="text-xs text-gray-500 mt-1">Selecione uma ou mais disciplinas que este professor poderá gerenciar.</p>
          </div>
        )}

        {/* Botão de Salvar */}
        <div className="text-right pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
          </button>
        </div>
      </form>
    </div>
  );
}