'use client';

import { useState, useEffect } from 'react';
import { Book, Plus, Edit, Trash2, Save, X, Loader2 } from 'lucide-react';
import { API_URL } from '@/services/api';
import { showSuccess, showError, showConfirm } from '@/services/alertService';

type Disciplina = {
  id: number;
  nome: string;
};

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [newDisciplinaName, setNewDisciplinaName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Estados para controlar a edição inline
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  // 1. Carregar disciplinas do Backend ao abrir a página
  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const fetchDisciplinas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/disciplina/listar`);
      if (response.ok) {
        const data = await response.json();
        setDisciplinas(data);
      } else {
        console.error('Erro ao buscar disciplinas');
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Cadastrar Nova Disciplina
const handleAddDisciplina = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisciplinaName.trim()) {
      showError('O nome da disciplina não pode ser vazio.');
      return;
    }
    
    if (disciplinas.some(d => d.nome.toLowerCase() === newDisciplinaName.trim().toLowerCase())) {
      showError('Esta disciplina já existe na lista.');
      return;
    }

    setSaving(true);
    // setError(null); // REMOVER

    try {
      const response = await fetch(`${API_URL}/disciplina/cadastrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: newDisciplinaName.trim() })
      });

      if (response.ok) {
        const novaDisciplina = await response.json();
        setDisciplinas([...disciplinas, novaDisciplina]);
        setNewDisciplinaName('');
        showSuccess('Disciplina cadastrada!');
      } else {
        showError('Erro ao salvar disciplina no servidor.');
      }
    } catch (err) {
      showError('Erro de conexão ao salvar.');
    } finally {
      setSaving(false);
    }
};

  // 3. Excluir Disciplina
const handleDelete = async (id: number) => {
    const result = await showConfirm('Tem certeza que deseja excluir esta disciplina?');
    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${API_URL}/disciplina/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDisciplinas(disciplinas.filter(d => d.id !== id));
        showSuccess('Disciplina excluída.');
      } else {
        showError('Erro ao excluir. Verifique se não há questões vinculadas.');
      }
    } catch (err) {
      showError('Erro de conexão ao excluir.');
    }
};

  // 4. Edição (Funções Auxiliares)
  const handleStartEditing = (disciplina: Disciplina) => {
    setEditingId(disciplina.id);
    setEditingName(disciplina.nome);
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  // 5. Salvar Edição (PUT)
const handleSaveEditing = async () => {
    if (!editingName.trim()) {
      showError('O nome não pode ser vazio.');
      return;
    }
    if (editingId === null) return;

    try {
      const response = await fetch(`${API_URL}/disciplina/update/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: editingName.trim() })
      });

      if (response.ok) {
        const atualizada = await response.json();
        setDisciplinas(
          disciplinas.map(d => (d.id === editingId ? atualizada : d))
        );
        handleCancelEditing();
        showSuccess('Atualizado com sucesso!');
      } else {
        showError('Erro ao atualizar disciplina.');
      }
    } catch (err) {
      showError('Erro de conexão ao atualizar.');
    }
};

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Disciplinas</h1>

      {/* Formulário para adicionar nova disciplina */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Cadastrar Nova Disciplina</h2>
        <form onSubmit={handleAddDisciplina} className="flex items-start gap-4">
          <div className="flex-grow">
            <label htmlFor="disciplina-name" className="sr-only">
              Nome da Disciplina
            </label>
            <input
              id="disciplina-name"
              type="text"
              value={newDisciplinaName}
              onChange={(e) => {
                setNewDisciplinaName(e.target.value);
              }}
              className="w-full p-2 border rounded-md"
              placeholder="Ex: Programação Orientada a Objetos"
              disabled={saving}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            {saving ? 'Salvando...' : 'Cadastrar'}
          </button>
        </form>
      </div>

      {/* Lista de disciplinas cadastradas */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold pb-4 border-b mb-4">Disciplinas Cadastradas</h2>
        
        {loading ? (
          <div className="text-center py-4 text-gray-500 flex justify-center items-center gap-2">
            <Loader2 size={20} className="animate-spin" /> Carregando disciplinas...
          </div>
        ) : (
          <div className="space-y-3">
            {disciplinas.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma disciplina cadastrada ainda.</p>
            ) : (
              disciplinas.map(disciplina => (
                <div
                  key={disciplina.id}
                  className="flex items-center justify-between p-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {editingId === disciplina.id ? (
                    // --- MODO DE EDIÇÃO ---
                    <>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-grow p-1 border rounded-md mr-4"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveEditing}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                          title="Salvar"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={handleCancelEditing}
                          className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"
                          title="Cancelar"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </>
                  ) : (
                    // --- MODO DE VISUALIZAÇÃO ---
                    <>
                      <div className="flex items-center gap-3">
                        <Book size={18} className="text-gray-600" />
                        <span className="font-medium text-gray-800">{disciplina.nome}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEditing(disciplina)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(disciplina.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}