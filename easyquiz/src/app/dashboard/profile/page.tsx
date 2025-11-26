'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { API_URL, getLoggedUser } from '@/services/api';
import { useRouter } from 'next/navigation';
import { showSuccess, showError } from '@/services/alertService';

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [isProfessor, setIsProfessor] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const user = getLoggedUser();
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }
    setUserId(user.id);

    if (user.tipo === 'PROFESSOR' || user.tipo === 'Professor') {
      setIsProfessor(true);
    }

    fetch(`${API_URL}/usuarios/${user.id}`)
      .then(async (res) => {
        if (res.ok) return res.json();
        throw new Error('Falha ao carregar dados');
      })
      .then((data) => {
        setName(data.nome);
        setEmail(data.email);
        
        if (data.tipo === 'PROFESSOR' || data.tipo === 'Professor') {
            setIsProfessor(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setName(user.nome);
        setEmail(user.email);
      })
      .finally(() => setLoadingData(false));
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    // REMOVIDO: O bloco que impedia professores de salvar
    // Como o input de nome está desabilitado, o estado 'name' manterá o valor original,
    // garantindo que o nome não mude, mas o email sim.

    if (!name.trim() || !email.trim()) {
      showError('Nome e email são obrigatórios.');
      return;
    }

    setSavingProfile(true);

    try {
      const response = await fetch(`${API_URL}/usuarios/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: name, email: email })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        showSuccess('Informações atualizadas com sucesso!');
        
        const oldLocal = getLoggedUser();
        if (oldLocal) {
            localStorage.setItem('easyquiz_user', JSON.stringify({ ...oldLocal, nome: updatedUser.nome, email: updatedUser.email }));
        }
      } else {
        showError('Erro ao atualizar perfil.');
      }
    } catch (error) {
      showError('Erro de conexão.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (!currentPassword) {
      showError('Por favor, digite sua senha atual.');
      return;
    }
    if (!newPassword || !confirmPassword) {
      showError('Preencha a nova senha.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('A nova senha e a confirmação não coincidem.');
      return;
    }
    
    setSavingPassword(true);

    try {
      const payload = {
        senhaAtual: currentPassword,
        novaSenha: newPassword
      };

      const response = await fetch(`${API_URL}/usuarios/mudarSenha/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showSuccess('Senha alterada com sucesso!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const errorText = await response.text();
        showError(errorText || 'Erro ao alterar senha.');
      }
    } catch (error) {
      showError('Erro de conexão.');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loadingData) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );
  }

  return (
    <div className="mx-auto px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Editar Perfil</h1>

      <form onSubmit={handleProfileUpdate} className="bg-white p-8 shadow-md rounded-lg mb-8 border border-gray-200">
        <div className="flex justify-between items-center pb-4 border-b mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Informações Pessoais</h2>
            {/* REMOVIDO: Span de aviso "Edição restrita" */}
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isProfessor} // MANTIDO: Bloqueia apenas o nome se for professor
                className={`w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${isProfessor ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // REMOVIDO: disabled={isProfessor} (Agora todos podem editar email)
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* REINSERIDO: Botão agora visível para todos */}
        <div className="mt-6 text-right">
        <button type="submit" disabled={savingProfile} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 ml-auto">
            {savingProfile && <Loader2 className="animate-spin" size={16} />}
            Salvar Informações
        </button>
        </div>
      </form>

      {/* Formulário de Senha permanece igual */}
      <form onSubmit={handlePasswordChange} className="bg-white p-8 shadow-md rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold pb-4 border-b mb-6 text-gray-800">Alterar Senha</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite sua senha atual"
              />
              <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button type="submit" disabled={savingPassword} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 ml-auto">
            {savingPassword && <Loader2 className="animate-spin" size={16} />}
            Alterar Senha
          </button>
        </div>
      </form>
    </div>
  );
}