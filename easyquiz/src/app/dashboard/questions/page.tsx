'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import QuestionListItem from "@/components/QuestionListItem";
import { API_URL, getLoggedUser } from "@/services/api";

type QuestaoDTO = {
  id: number;
  enunciado: string;
  tipo: 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  disciplina: string;
  opcoes: { id: number; texto: string; correta: boolean }[];
  respostaCorreta: string;
  nomeCriador: string;
};

export default function MyQuestionsPage() {
  const [questions, setQuestions] = useState<QuestaoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarQuestoes();
  }, []);

  const carregarQuestoes = () => {
    const user = getLoggedUser();
    if (!user) return;

    let endpoint = `${API_URL}/questao/browse`; 

    if (user.tipo === 'PROFESSOR') {
        endpoint = `${API_URL}/questao/porCriador/${user.id}`;
    }

    fetch(endpoint)
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta questão?")) return;

    try {
      const res = await fetch(`${API_URL}/questao/delete/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setQuestions(prev => prev.filter(q => q.id.toString() !== id));
        alert("Questão excluída com sucesso.");
      } else {
        alert("Erro ao excluir questão.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Minhas Questões</h1>
        <Link
          href="/dashboard/questions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Criar Nova Questão
        </Link>
      </div>

      {loading && <p className="text-center text-gray-500">Carregando questões...</p>}

      <div className="space-y-4">
        {!loading && questions.map((q) => (
          <QuestionListItem
            key={q.id}
            id={q.id.toString()}
            enunciado={q.enunciado}
            tipo={q.tipo}
            dificuldade={q.dificuldade}
            disciplina={q.disciplina || 'Sem disciplina'}
            opcoes={q.opcoes?.map(o => o.texto)}
            resposta={q.respostaCorreta}
            onDelete={handleDelete}
          />
        ))}

        {!loading && questions.length === 0 && (
          <div className="bg-white p-6 shadow rounded-lg text-center text-gray-500">
            <p>Nenhuma questão encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}