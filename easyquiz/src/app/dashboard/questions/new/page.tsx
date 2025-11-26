'use client';

import { useState, useEffect } from 'react';
import { API_URL, getLoggedUser } from '@/services/api';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { showSuccess, showError } from '@/services/alertService';

type TipoPergunta = 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';

type OpcaoState = {
  texto: string;
  correta: boolean;
}

type Disciplina = {
  id: number;
  nome: string;
}

export default function NewQuestionPage() {
  const router = useRouter();
  const [tipoPergunta, setTipoPergunta] = useState<TipoPergunta>('Multipla Escolha');
  const [enunciado, setEnunciado] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [disciplinaId, setDisciplinaId] = useState<number | ''>('');

  const [opcoes, setOpcoes] = useState<OpcaoState[]>([
    { texto: '', correta: false },
    { texto: '', correta: false },
    { texto: '', correta: false },
    { texto: '', correta: false }
  ]);

  const [listaDisciplinas, setListaDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar Disciplinas com base no usuário
  useEffect(() => {
    const user = getLoggedUser();
    if (!user) return;

    const fetchDisciplinas = async () => {
      try {
        let url = `${API_URL}/disciplina/listar`;

        if (user.tipo === 'PROFESSOR') {
          url = `${API_URL}/professordisciplina/listarPorIDProfessor/${user.id}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (user.tipo === 'PROFESSOR') {
          const disciplinasMapeadas = data.map((pd: any) => pd.disciplina);
          setListaDisciplinas(disciplinasMapeadas);
          if (disciplinasMapeadas.length > 0) setDisciplinaId(disciplinasMapeadas[0].id);
        } else {
          setListaDisciplinas(data);
          if (data.length > 0) setDisciplinaId(data[0].id);
        }

      } catch (err) {
        console.error("Erro ao carregar disciplinas:", err);
      }
    };

    fetchDisciplinas();
  }, []);

  const handleOptionTextChange = (index: number, text: string) => {
    const novas = opcoes.map((op, i) =>
      i === index ? { ...op, texto: text } : op
    );
    setOpcoes(novas);
  };

  const handleOptionCorrectChange = (index: number) => {
    const novas = opcoes.map((op, i) => ({
      ...op,
      correta: i === index
    }));
    setOpcoes(novas);
  };

  const handleVFChange = (valorCorreto: 'Verdadeiro' | 'Falso') => {
    setOpcoes([
      { texto: 'Verdadeiro', correta: valorCorreto === 'Verdadeiro' },
      { texto: 'Falso', correta: valorCorreto === 'Falso' }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = getLoggedUser();
    if (!user) {
      showError('Você precisa estar logado.');
      router.push('/auth/sign-in');
      return;
    }

    // Validações com SweetAlert
    if (tipoPergunta === 'Multipla Escolha') {
        if (opcoes.some(o => o.texto.trim() === '')) {
            showError('Preencha todas as opções.');
            setLoading(false);
            return;
        }
        if (!opcoes.some(o => o.correta)) {
            showError('Selecione qual opção é a correta.');
            setLoading(false);
            return;
        }
    }

    if (tipoPergunta === 'Verdadeiro/Falso' && !opcoes.length) {
        showError('Selecione se a afirmação é Verdadeira ou Falsa.');
        setLoading(false);
        return;
    }

    if (!disciplinaId) {
        showError('Selecione uma disciplina.');
        setLoading(false);
        return;
    }

    const payload = {
      enunciado: enunciado,
      dificuldade: dificuldade,
      tipo: tipoPergunta,
      disciplinaId: Number(disciplinaId),
      criadorId: user.id,
      opcoes: tipoPergunta === 'Dissertativa' ? [] : opcoes
    };

try {
      const response = await fetch(`${API_URL}/questao/cadastrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        await showSuccess('Questão criada com sucesso!');
        router.push('/dashboard/questions'); 
      } else {
        const errorData = await response.text();
        showError('Erro ao criar questão: ' + errorData);
      }
    } catch (error) {
      console.error(error);
      showError('Erro de conexão.');
    } finally {
      setLoading(false);
    }
};

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Criar Nova Questão</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-700">Enunciado</label>
          <textarea
            rows={4}
            className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Digite o enunciado aqui..."
            value={enunciado}
            onChange={e => setEnunciado(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Disciplina</label>
            <select
              className="w-full mt-1 p-2 border rounded-md"
              value={disciplinaId}
              onChange={e => setDisciplinaId(Number(e.target.value))}
              required
            >
              {listaDisciplinas.length === 0 && <option value="">Nenhuma disciplina disponível</option>}
              {listaDisciplinas.map(d => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dificuldade</label>
            <select
              className="w-full mt-1 p-2 border rounded-md"
              value={dificuldade}
              onChange={e => setDificuldade(e.target.value)}
            >
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Pergunta</label>
          <div className="flex space-x-4 mt-2">
            {(['Multipla Escolha', 'Dissertativa', 'Verdadeiro/Falso'] as const).map(t => (
              <label key={t} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="tipo_pergunta"
                  value={t}
                  checked={tipoPergunta === t}
                  onChange={() => {
                    setTipoPergunta(t);
                    if (t === 'Multipla Escolha') {
                      setOpcoes(Array(4).fill({ texto: '', correta: false }).map(o => ({ ...o })));
                    } else {
                      setOpcoes([]);
                    }
                  }}
                  className="mr-2"
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          {tipoPergunta === 'Multipla Escolha' && (
            <div className="bg-gray-50 p-4 rounded-md border space-y-3">
              <div className="flex justify-between text-sm text-gray-600 font-semibold">
                <span>Texto da Opção</span>
                <span>Correta?</span>
              </div>
              {opcoes.map((op, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-md focus:outline-none focus:border-blue-500"
                    placeholder={`Opção ${i + 1}`}
                    value={op.texto}
                    onChange={(e) => handleOptionTextChange(i, e.target.value)}
                    required
                  />
                  <input
                    type="radio"
                    name="opcao_correta_multipla"
                    className="w-5 h-5 cursor-pointer"
                    checked={op.correta}
                    onChange={() => handleOptionCorrectChange(i)}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {tipoPergunta === 'Verdadeiro/Falso' && (
            <div className="bg-gray-50 p-4 rounded-md border space-y-3">
              <p className="text-sm text-gray-600 font-semibold">A afirmação do enunciado é:</p>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="vf_group"
                    className="w-4 h-4"
                    checked={opcoes.length > 0 && opcoes[0].texto === 'Verdadeiro' && opcoes[0].correta}
                    onChange={() => handleVFChange('Verdadeiro')}
                  />
                  Verdadeiro
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="vf_group"
                    className="w-4 h-4"
                    checked={opcoes.length > 0 && opcoes[1].texto === 'Falso' && opcoes[1].correta}
                    onChange={() => handleVFChange('Falso')}
                  />
                  Falso
                </label>
              </div>
            </div>
          )}

          {tipoPergunta === 'Dissertativa' && (
            <p className="text-gray-500 text-sm italic bg-gray-50 p-4 rounded border">
              Questões dissertativas não exigem cadastro de alternativas. O aluno responderá com texto livre.
            </p>
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Salvando...' : 'Salvar Questão'}
          </button>
        </div>

      </form>
    </div>
  );
}