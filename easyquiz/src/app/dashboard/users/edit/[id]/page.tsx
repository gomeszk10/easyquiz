'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield } from 'lucide-react';
import { API_URL, getLoggedUser } from '@/services/api';
import { useRouter, useParams } from 'next/navigation';
import { showSuccess, showError } from '@/services/alertService';

type Disciplina = {
  id: number;
  nome: string;
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userIdToEdit = params.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('PROFESSOR');
  
  const [availableDisciplinas, setAvailableDisciplinas] = useState<Disciplina[]>([]);
  const [selectedDisciplinas, setSelectedDisciplinas] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Carrega usuário
        const resUser = await fetch(`${API_URL}/usuarios/${userIdToEdit}`);
        const userData = await resUser.json();
        setName(userData.nome);
        setEmail(userData.email);
        setUserType(userData.tipo);

        // 2. Carrega todas disciplinas
        const resDisc = await fetch(`${API_URL}/disciplina/listar`);
        setAvailableDisciplinas(await resDisc.json());

        // 3. Se professor, carrega as dele
        if (userData.tipo === 'PROFESSOR') {
          const resProfDisc = await fetch(`${API_URL}/professordisciplina/listarPorIDProfessor/${userIdToEdit}`);
          const profData = await resProfDisc.json();
          setSelectedDisciplinas(profData.map((pd: any) => pd.disciplina.id));
        }
      } catch (err) {
        console.error(err);
        showError("Erro ao carregar dados do usuário.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
}, [userIdToEdit]);

  const handleDisciplinaToggle = (id: number) => {
    setSelectedDisciplinas(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const admin = getLoggedUser();

    const payload = {
        nome: name,
        email: email,
        tipo: userType,
        disciplinaIds: userType === 'PROFESSOR' ? selectedDisciplinas : []
    };

    try {
        const res = await fetch(`${API_URL}/usuarios/admUpdate/${userIdToEdit}/${admin.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            await showSuccess("Usuário atualizado com sucesso!");
            router.push('/dashboard/users');
        } else {
            showError("Erro ao atualizar o usuário.");
        }
    } catch (error) {
        showError("Erro de conexão.");
    } finally {
        setSaving(false);
    }
};

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Editar Usuário</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <div className="relative">
             <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
             <input value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 p-2 border rounded" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
           <div className="relative">
             <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
             <input value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 p-2 border rounded" required />
           </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <div className="flex gap-4">
             <label className="flex items-center gap-2"><input type="radio" checked={userType === 'PROFESSOR'} onChange={() => setUserType('PROFESSOR')} /> Professor</label>
             <label className="flex items-center gap-2"><input type="radio" checked={userType === 'ADMIN'} onChange={() => setUserType('ADMIN')} /> Admin</label>
          </div>
        </div>

        {userType === 'PROFESSOR' && (
           <div className="border rounded p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Disciplinas</h4>
              <div className="grid grid-cols-2 gap-2">
                 {availableDisciplinas.map(d => (
                    <label key={d.id} className="flex items-center gap-2">
                       <input type="checkbox" checked={selectedDisciplinas.includes(d.id)} onChange={() => handleDisciplinaToggle(d.id)} />
                       {d.nome}
                    </label>
                 ))}
              </div>
           </div>
        )}

        <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}