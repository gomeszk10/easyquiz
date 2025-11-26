import Link from 'next/link';
import { BookOpen, Layers } from 'lucide-react';
import { useState } from 'react';

type Opcao = {
  texto: string;
  correta: boolean;
};

type Props = {
  id: string;
  enunciado: string;
  disciplina: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipo: string;
  criador: string;
  opcoes?: Opcao[];
  onInclude?: (id: string) => void;
  isIncluded?: boolean;
};

export default function QuestionForExame({
  id,
  enunciado,
  disciplina,
  dificuldade,
  tipo,
  criador,
  opcoes = [],
  onInclude,
  isIncluded = false,
}: Props) {
  const [showAnswer, setShowAnswer] = useState(false);

  const dificuldadeColors = {
    'Fácil': 'bg-green-100 text-green-800',
    'Médio': 'bg-yellow-100 text-yellow-800',
    'Difícil': 'bg-red-100 text-red-800',
  };

  const tipoNormalized = tipo?.toLowerCase() ?? '';
  const isDissertativa = tipoNormalized.includes('dissertativa');

  const renderOptions = () => {
    if (tipoNormalized.includes('multip') || tipoNormalized.includes('múltip')) {
      const letters = ['a)', 'b)', 'c)', 'd)', 'e)'];
      return (
        <ul className="flex flex-col gap-2">
          {opcoes.map((opcao, idx) => {
            const label = letters[idx] || `${idx + 1})`;
            const isCorrect = showAnswer && opcao.correta;
            
            const styleClass = `text-sm text-gray-800 border px-3 py-2 rounded-md w-full transition-colors ${
              isCorrect ? 'bg-green-200 border-green-400' : 'bg-gray-50 border-gray-100'
            }`;

            return (
              <li key={idx} className={styleClass}>
                <span className="font-medium mr-2">{label}</span>
                <span>{opcao.texto}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    if (tipoNormalized.includes('verdadeiro') || tipoNormalized.includes('falso')) {
      if (opcoes.length > 0) {
        return (
          <ul className="flex flex-col gap-2">
            {opcoes.map((opcao, idx) => {
              const isCorrect = showAnswer && opcao.correta;
              const styleClass = `text-sm text-gray-800 border px-3 py-2 rounded-md w-full transition-colors ${
                isCorrect ? 'bg-green-200 border-green-400' : 'bg-gray-50 border-gray-100'
              }`;
              return (
                <li key={idx} className={styleClass}>
                  <span>{opcao.texto}</span>
                </li>
              );
            })}
          </ul>
        );
      }
      return (
        <ul className="flex flex-col gap-2">
          <li className="text-sm text-gray-800 bg-gray-50 border border-gray-100 px-3 py-2 rounded-md w-full">Verdadeiro</li>
          <li className="text-sm text-gray-800 bg-gray-50 border border-gray-100 px-3 py-2 rounded-md w-full">Falso</li>
        </ul>
      );
    }

    return null;
  };

  return (
    <div className={`bg-white p-5 shadow-lg rounded-lg border ${isIncluded ? 'border-blue-300 ring-1 ring-blue-300' : 'border-gray-200'} flex flex-col transition-all`}>
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-2">
        <span className="flex items-center text-sm font-semibold text-blue-600">
          <BookOpen size={16} className="mr-1.5" />
          {disciplina}
        </span>
        <span className="flex items-center text-sm font-medium text-gray-600">
          <Layers size={16} className="mr-1.5" />
          {criador}
        </span>
      </div>

      {/* Enunciado */}
      <p
        className="text-gray-800 font-semibold mb-4 flex-grow"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '4.5rem',
        }}
      >
        {enunciado}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${dificuldadeColors[dificuldade]}`}>
          {dificuldade}
        </span>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
          {tipo}
        </span>
      </div>

      {/* Opções */}
      <div className="mb-4">
        {renderOptions()}
      </div>

      {/* Rodapé */}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isDissertativa}
          onClick={() => setShowAnswer(!showAnswer)}
          className={`flex-1 text-center font-semibold py-2 rounded-md transition-colors text-white 
            ${isDissertativa 
                ? 'bg-blue-500 opacity-50 cursor-not-allowed' // Botão meio apagado e desabilitado
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
        >
          {showAnswer ? 'Ocultar Resposta' : 'Ver Resposta'}
        </button>

        <button
          type="button"
          onClick={() => onInclude && onInclude(id)}
          className={`flex-1 font-semibold py-2 rounded-md transition-colors text-white ${
            isIncluded 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isIncluded ? 'Excluir questão da prova' : 'Incluir questão na prova'}
        </button>
      </div>
    </div>
  );
}