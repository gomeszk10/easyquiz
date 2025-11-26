'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_URL, getLoggedUser } from '@/services/api';

type TipoPergunta = 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';

type OpcaoState = {
  texto: string;
  correta: boolean;
}

type Disciplina = {
  id: number;
  nome: string;
}

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams(); 
  const questionId = params.questionId;

  const [tipoPergunta, setTipoPergunta] = useState<TipoPergunta>('Multipla Escolha');
  const [enunciado, setEnunciado] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [disciplinaId, setDisciplinaId] = useState<number | ''>('');
  
  const [opcoes, setOpcoes] = useState<OpcaoState[]>([
    { texto: '', correta: false }, { texto: '', correta: false },
    { texto: '', correta: false }, { texto: '', correta: false }
  ]);

  const [listaDisciplinas, setListaDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDisc = await fetch(`${API_URL}/disciplina/listar`);
        const disciplinasData = await resDisc.json();
        setListaDisciplinas(disciplinasData);

        if (questionId) {
          const resQuestao = await fetch(`${API_URL}/questao/${questionId}`);
          if (!resQuestao.ok) throw new Error('Questão não encontrada');
          
          const qData = await resQuestao.json();
          
          setEnunciado(qData.enunciado);
          setTipoPergunta(qData.tipo);
          setDificuldade(qData.dificuldade);
          setDisciplinaId(qData.disciplinaId || (disciplinasData.length > 0 ? disciplinasData[0].id : ''));

          if (qData.opcoes && qData.opcoes.length > 0) {
            const mappedOpcoes = qData.opcoes.map((o: any) => ({
                texto: o.texto,
                correta: o.correta
            }));
            
            if (qData.tipo === 'Multipla Escolha') {
               while(mappedOpcoes.length < 4) mappedOpcoes.push({ texto: '', correta: false });
            }
            setOpcoes(mappedOpcoes);
          } else if (qData.tipo === 'Multipla Escolha') {
             setOpcoes(Array(4).fill({ texto: '', correta: false }));
          }
        }
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionId]);

  const handleOptionTextChange = (index: number, text: string) => {
    const novas = opcoes.map((op, i) => i === index ? { ...op, texto: text } : op);
    setOpcoes(novas);
  };

  const handleOptionCorrectChange = (index: number) => {
    const novas = opcoes.map((op, i) => ({ ...op, correta: i === index }));
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
    setSaving(true);

    const user = getLoggedUser();
    if (!user) return;

    const payload = {
      id: Number(questionId),
      enunciado,
      dificuldade,
      tipo: tipoPergunta,
      disciplinaId: Number(disciplinaId),
      criadorId: user.id,
      opcoes: tipoPergunta === 'Dissertativa' ? [] : opcoes
    };

    try {
      const response = await fetch(`${API_URL}/questao/update/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Questão atualizada com sucesso!');
        router.push('/dashboard/questions'); 
      } else {
        const errorText = await response.text();
        alert('Erro ao atualizar: ' + errorText);
      }
    } catch (error) {
      console.error(error);
      alert('Erro de conexão.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Questão #{questionId}</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Enunciado</label>
          <textarea
            rows={4}
            className="w-full mt-1 p-2 border rounded-md"
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
            >
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
          <div className="flex space-x-4 mt-2 p-2 bg-gray-100 rounded text-gray-500 cursor-not-allowed">
             <span>{tipoPergunta} (Não editável)</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">* Para mudar o tipo, crie uma nova questão.</p>
        </div>

        <div className="border-t pt-4">
          {tipoPergunta === 'Multipla Escolha' && (
            <div className="bg-gray-50 p-4 rounded-md border space-y-3">
                {opcoes.map((op, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      type="text"
                      className="flex-1 p-2 border rounded-md"
                      value={op.texto}
                      onChange={(e) => handleOptionTextChange(i, e.target.value)}
                      required
                    />
                    <input
                      type="radio"
                      name="opcao_correta_edit"
                      className="w-5 h-5"
                      checked={op.correta}
                      onChange={() => handleOptionCorrectChange(i)}
                    />
                  </div>
                ))}
            </div>
          )}

          {tipoPergunta === 'Verdadeiro/Falso' && (
            <div className="bg-gray-50 p-4 rounded-md border space-y-3">
               <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="vf_group_edit"
                      checked={opcoes.find(o => o.texto === 'Verdadeiro')?.correta}
                      onChange={() => handleVFChange('Verdadeiro')}
                    /> 
                    Verdadeiro
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="vf_group_edit"
                      checked={opcoes.find(o => o.texto === 'Falso')?.correta}
                      onChange={() => handleVFChange('Falso')}
                    /> 
                    Falso
                  </label>
               </div>
            </div>
          )}
        </div>

        <div className="text-right gap-2 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

      </form>
    </div>
  );
}