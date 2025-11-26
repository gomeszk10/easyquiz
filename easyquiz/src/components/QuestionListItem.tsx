import { Edit, Trash2, BookOpen } from 'lucide-react';
import Link from 'next/link';

type Props = {
  id: string;
  enunciado: string;
  tipo: 'Multipla Escolha' | 'Dissertativa' | 'Verdadeiro/Falso';
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  disciplina: string;
  opcoes?: string[];
  resposta?: string;
  onDelete: (id: string) => void; // Função obrigatória agora
};

export default function QuestionListItem({ 
  id, 
  enunciado, 
  tipo, 
  dificuldade, 
  disciplina,
  opcoes,
  resposta,
  onDelete
}: Props) {
  
  const dificuldadeColors = {
    'Fácil': 'bg-green-100 text-green-800',
    'Médio': 'bg-yellow-100 text-yellow-800',
    'Difícil': 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg flex items-center justify-between space-x-4">
      
      <div className="flex-1 min-w-0">
        <span className="flex items-center text-sm font-semibold text-blue-600">
          <BookOpen size={16} className="mr-1.5" />
          {disciplina}
        </span>
        <p className="text-md font-semibold text-gray-800 truncate">
          {enunciado}
        </p>

        <div className="mt-2 flex items-center gap-4">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${dificuldadeColors[dificuldade]}`}>
            {dificuldade}
          </span>
          <span className="text-xs text-gray-600 px-2 py-0.5 rounded-full bg-gray-100">
            {tipo}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <Link 
          href={`/dashboard/questions/edit/${id}`}
          className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
          title="Editar"
        >
          <Edit size={22} />
        </Link>
        
        <button
          onClick={() => onDelete(id)}
          className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
          title="Excluir"
        >
          <Trash2 size={22} />
        </button>
      </div>

    </div>
  );
}