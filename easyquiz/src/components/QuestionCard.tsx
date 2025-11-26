import Link from 'next/link';
import { Star, CheckCircle, BookOpen, Layers, FileText } from 'lucide-react';

type Props = {
  id: string;
  enunciado: string;
  disciplina: string;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipo: string;
  opcoes?: string[];
  resposta?: string;
  criadorId?: string;
  nomeCriador?: string;
};

export default function QuestionCard({ 
  id, 
  enunciado, 
  disciplina, 
  dificuldade, 
  tipo,
  opcoes,
  resposta,
  criadorId,
  nomeCriador
}: Props) {
  
  const dificuldadeColors = {
    'Fácil': 'bg-green-100 text-green-800',
    'Médio': 'bg-yellow-100 text-yellow-800',
    'Difícil': 'bg-red-100 text-red-800',
  };

  const renderAnswerOptions = () => {
    switch (tipo) {
      case 'Múltipla':
      case 'Multipla Escolha':
        return (
          <div className="mt-4 pt-3 border-t">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Opções:</h4>
            <ul className="space-y-1.5 text-sm">
              {opcoes?.map((opcao, index) => {
                const isCorrect = opcao === resposta;
                return (
                  <li
                    key={index}
                    className={`flex items-start gap-2 p-2 rounded ${
                      isCorrect ? 'bg-green-50 text-green-800 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 flex-shrink-0" /> // Placeholder for alignment
                    )}
                    <span>{opcao}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );

      case 'Verdadeiro/Falso':
        return (
          <div className="mt-4 pt-3 border-t">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Resposta Correta:</h4>
            <div className="flex items-center gap-2 p-2 rounded bg-green-50 text-green-800 font-semibold">
              <CheckCircle size={16} />
              <span>{resposta}</span>
            </div>
          </div>
        );

      case 'Dissertativa':
        return (
          <div className="mt-4 pt-3 border-t text-sm text-gray-500 italic">
            Esta é uma questão dissertativa e requer correção manual.
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-5 shadow-lg rounded-lg border border-gray-200 flex flex-col">
      {/* Cabeçalho do Card (Disciplina) */}
      <div className="flex justify-between items-center mb-2">
        <span className="flex items-center text-sm font-semibold text-blue-600">
          <BookOpen size={16} className="mr-1.5" />
          {disciplina}
        </span>
      </div>

      {/* Enunciado */}
      <p className="text-gray-800 font-semibold mb-4 flex-grow">
        {enunciado}
      </p>

      {/* Tags (Dificuldade e Tipo) */}
      <div className="flex items-center gap-2 mb-2">
        <span 
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${dificuldadeColors[dificuldade]}`}
        >
          {dificuldade}
        </span>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
          {tipo}
        </span>
        {nomeCriador && ( // Mostrar apenas se nomeCriador estiver definido
          <span className="ml-auto flex items-center gap-2 text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
            <Star size={14} />
            <span>{nomeCriador}</span>
          </span>
        )}
      </div>

      {/* Opções de Resposta */}
      {renderAnswerOptions()}
    </div>
  );
}