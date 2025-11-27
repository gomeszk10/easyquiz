'use client';

import { useEffect, useState } from 'react';
import { FileText, Search, BookCheck, Trash2, X, Loader2 } from 'lucide-react';
import QuestionForExame from '../../../components/QuestionForExame'; 
import { API_URL, getLoggedUser } from '@/services/api';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// @ts-ignore
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

// Tipos
type Disciplina = {
  id: number;
  nome: string;
};

type QuestaoAPI = {
  id: number;
  enunciado: string;
  disciplina: string; 
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
  tipo: string;
  nomeCriador: string;
  opcoes?: { texto: string; correta: boolean }[];
};

export default function TestGeneratorPage() {
  // Meta da prova (Campos manuais)
  const [tituloProva, setTituloProva] = useState('');
  const [universidade, setUniversidade] = useState('');
  const [curso, setCurso] = useState('');
  const [disciplinaNome, setDisciplinaNome] = useState('');
  const [professor, setProfessor] = useState('');

  // Dados
  const [allQuestions, setAllQuestions] = useState<QuestaoAPI[]>([]);
  const [disciplinasOptions, setDisciplinasOptions] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchText, setSearchText] = useState('');
  const [filterCriador, setFilterCriador] = useState('Todos');
  const [filterDisciplina, setFilterDisciplina] = useState('Todos');
  const [filterDificuldade, setFilterDificuldade] = useState('Todos');
  const [filterTipo, setFilterTipo] = useState('Todos');

  // Seleção (Questões escolhidas para a prova)
  const [selectedQuestions, setSelectedQuestions] = useState<QuestaoAPI[]>([]);

  // 1. Carregar Dados ao iniciar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = getLoggedUser();
      if (!user) return;

      try {
        // Busca todas as questões disponíveis
        const resQ = await fetch(`${API_URL}/questao/browse`);
        
        // Lógica de Disciplinas: Professor vê apenas as suas, Admin vê todas
        let urlDisc = `${API_URL}/disciplina/listar`;
        if (user.tipo === 'PROFESSOR') {
             urlDisc = `${API_URL}/professordisciplina/listarPorIDProfessor/${user.id}`;
        }

        const [resDataQ, resDataD] = await Promise.all([
            resQ.json(),
            fetch(urlDisc).then(r => r.json())
        ]);

        setAllQuestions(resDataQ);

        if (user.tipo === 'PROFESSOR') {
            setDisciplinasOptions(resDataD.map((pd: any) => pd.disciplina));
        } else {
            setDisciplinasOptions(resDataD);
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Lógica de Filtragem
  const visibleQuestions = allQuestions.filter(q => {
    const term = searchText.toLowerCase().trim();
    let matchesSearch = true;

    if (term) {
        const inEnunciado = q.enunciado ? q.enunciado.toLowerCase().includes(term) : false;
        const inDisciplina = q.disciplina ? q.disciplina.toLowerCase().includes(term) : false;
        const inCriador = q.nomeCriador ? q.nomeCriador.toLowerCase().includes(term) : false;
        matchesSearch = inEnunciado || inDisciplina || inCriador;
    }

    const matchesDisciplina = filterDisciplina === 'Todos' || q.disciplina === filterDisciplina;
    const matchesDificuldade = filterDificuldade === 'Todos' || q.dificuldade === filterDificuldade;
    const matchesTipo = filterTipo === 'Todos' || q.tipo === filterTipo;
    const matchesCriador = filterCriador === 'Todos' || q.nomeCriador === filterCriador;

    return matchesSearch && matchesDisciplina && matchesDificuldade && matchesTipo && matchesCriador;
  });

  const criadoresUnicos = Array.from(new Set(allQuestions.map(q => q.nomeCriador).filter(Boolean)));
  const tiposUnicos = Array.from(new Set(allQuestions.map(q => q.tipo).filter(Boolean)));
  const dificuldadesUnicas = Array.from(new Set(allQuestions.map(q => q.dificuldade).filter(Boolean)));

  // 3. Ações de Seleção
  const toggleQuestion = (idStr: string) => {
    const id = Number(idStr);
    const exists = selectedQuestions.find(s => s.id === id);
    if (exists) {
      setSelectedQuestions(prev => prev.filter(p => p.id !== id));
    } else {
      const q = allQuestions.find(x => x.id === id);
      if (q) setSelectedQuestions(prev => [...prev, q!]);
    }
  };

  const removeSelected = (id: number) => {
    setSelectedQuestions(prev => prev.filter(p => p.id !== id));
  };

  const handleViewQuestion = (idStr: string) => {
    window.open(`/dashboard/questions/edit/${idStr}`, '_blank');
  };

// --- LÓGICA DE GERAÇÃO DO PDF ---

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedQuestions.length === 0) {
      alert('Selecione ao menos uma questão para gerar a prova.');
      return;
    }

    // Definição do documento
    const docDefinition: any = {
      content: [
        // Cabeçalho
        {
          text: universidade || 'Universidade não informada',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        {
          text: curso || 'Curso não informado',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'Disciplina: ', bold: true },
                disciplinaNome || '___________________' // Usa apenas o input manual
              ]
            },
            {
              width: '*',
              text: [
                { text: 'Professor(a): ', bold: true },
                professor || '___________________' // Usa apenas o input manual
              ],
              alignment: 'right'
            }
          ],
          margin: [0, 0, 0, 5]
        },
        {
          columns: [
            {
              width: '*',
              text: [
                { text: 'Aluno(a): ', bold: true },
                '___________________________________________________'
              ]
            },
            {
              width: 'auto',
              text: [
                { text: 'Data: ', bold: true },
                '___/___/_____'
              ]
            }
          ],
          margin: [0, 0, 0, 20]
        },
        {
          text: tituloProva || 'Avaliação',
          style: 'title',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        // ...existing code...
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true
        },
        subheader: {
          fontSize: 14,
          bold: true
        },
        title: {
          fontSize: 18,
          bold: true,
          decoration: 'underline'
        },
        questionHeader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        questionBody: {
          fontSize: 12,
          margin: [0, 0, 0, 10]
        },
        option: {
          fontSize: 12,
          margin: [10, 2, 0, 2]
        }
      }
    };

    // Adiciona as questões selecionadas ao PDF
    selectedQuestions.forEach((q, index) => {
      // Número e Enunciado
      docDefinition.content.push({
        text: `Questão ${index + 1}) ${q.enunciado}`,
        style: 'questionHeader'
      });

      // Se tiver opções (múltipla escolha)
      if (q.opcoes && q.opcoes.length > 0) {
        q.opcoes.forEach((opt, i) => {
          const letter = String.fromCharCode(97 + i); // a, b, c...
          docDefinition.content.push({
            text: `${letter}) ${opt.texto}`,
            style: 'option'
          });
        });
      } else {
        // Se for dissertativa, deixa espaço para resposta
        docDefinition.content.push({
          text: '\n\n__________________________________________________________________________________\n\n__________________________________________________________________________________\n',
          style: 'questionBody'
        });
      }
    });

    pdfMake.createPdf(docDefinition).open();
  };

  return (
    
    <div className="flex flex-col w-full max-w-[1600px] mx-auto p-4 min-h-[calc(100vh-7rem)] lg:h-[calc(100vh-7rem)]">
     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-full">    
        
        {/* COLUNA ESQUERDA (BANCO DE QUESTÕES) */}
     <div className="lg:col-span-7 flex flex-col h-auto lg:h-full bg-white rounded-lg shadow-lg border border-gray-200 lg:overflow-hidden">
          
          {/* Cabeçalho da Coluna Esquerda */}
          <div className="p-4 border-b border-gray-200 bg-white z-10 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-800">
                <Search size={20} className="text-blue-600" />
                <h2 className="text-lg font-bold">Banco de Questões</h2>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {visibleQuestions.length} encontradas
              </span>
            </div>

            {/* Barra de Pesquisa e Filtros */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar por enunciado, disciplina ou criador..."
                className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button 
                 onClick={() => {
                    setSearchText('');
                    setFilterDisciplina('Todos');
                    setFilterDificuldade('Todos');
                    setFilterTipo('Todos');
                    setFilterCriador('Todos');
                 }}
                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 cursor-pointer text-xs font-medium"
              >
                Limpar Filtros
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <select 
                value={filterDisciplina}
                onChange={(e) => setFilterDisciplina(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm bg-white hover:border-blue-400 focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="Todos">Todas as Disciplinas</option>
                {disciplinasOptions.map(d => <option key={d.id} value={d.nome}>{d.nome}</option>)}
              </select>
              
              <select
                value={filterDificuldade}
                onChange={(e) => setFilterDificuldade(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm bg-white hover:border-blue-400 focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="Todos">Todas Dificuldades</option>
                {dificuldadesUnicas.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm bg-white hover:border-blue-400 focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="Todos">Todos Tipos</option>
                {tiposUnicos.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <select
                value={filterCriador}
                onChange={(e) => setFilterCriador(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm bg-white hover:border-blue-400 focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="Todos">Todos Criadores</option>
                {criadoresUnicos.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Área de Scroll das Questões */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 custom-scrollbar">
            {loading && (
                <div className="flex justify-center items-center py-10 text-gray-500">
                    <Loader2 className="animate-spin mr-2" /> Carregando banco de questões...
                </div>
            )}

            {!loading && visibleQuestions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <Search size={48} className="text-gray-300 mb-3" />
                    <p className="font-medium">Nenhuma questão encontrada.</p>
                    <p className="text-sm text-gray-400">Tente buscar por outro termo ou limpar os filtros.</p>
                </div>
            )}

      {visibleQuestions.map(q => {
        const isSelected = selectedQuestions.some(s => s.id === q.id);
        return (
          <div key={q.id} className="transition-opacity duration-200 opacity-100">
            <QuestionForExame
              id={q.id.toString()}
              enunciado={q.enunciado}
              disciplina={q.disciplina || 'Geral'}
              dificuldade={q.dificuldade as any}
              tipo={q.tipo}
              criador={q.nomeCriador || 'Unknown'}
              opcoes={q.opcoes}
              onInclude={toggleQuestion}
              isIncluded={isSelected}
            />
          </div>
        );
      })}
          </div>
        </div>

        {/* COLUNA DIREITA (CONFIGURAÇÃO DA PROVA) */}
        <div className="lg:col-span-5 flex flex-col h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden relative">
          
          {/* Cabeçalho da Prova */}
          <div className="p-5 border-b border-gray-200 bg-white z-10">
            <div className="flex items-center gap-2 mb-4 text-blue-700">
              <FileText size={24} />
              <h2 className="text-xl font-bold">Configurar Prova</h2>
            </div>

            <div className="space-y-3">
                {/* LINHA 1 */}
                <div className="grid grid-cols-2 gap-2">
                    <input 
                        value={tituloProva}
                        onChange={e => setTituloProva(e.target.value)}
                        placeholder="Título (Ex: Av. Bimestral)"
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input 
                        value={professor}
                        onChange={e => setProfessor(e.target.value)}
                        placeholder="Nome do Professor"
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* LINHA 2 */}
                <div className="grid grid-cols-2 gap-2">
                    <input 
                        value={curso}
                        onChange={e => setCurso(e.target.value)}
                        placeholder="Curso"
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input 
                    value={disciplinaNome}
                    onChange={e => setDisciplinaNome(e.target.value)}
                    placeholder="Nome da Disciplina na Prova"
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                </div>
            </div>
          </div>

          {/* Lista de Questões Selecionadas */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <BookCheck size={18} />
                    Questões Selecionadas
                </h3>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    {selectedQuestions.length} questões
                </span>
            </div>

            {selectedQuestions.length === 0 ? (
               <div className="h-40 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-white">
                  <p className="text-sm">Nenhuma questão selecionada.</p>
                  <p className="text-xs mt-1">Adicione questões do painel ao lado.</p>
               </div>
            ) : (
               <ul className="space-y-2">
                 {selectedQuestions.map((q, idx) => (
                   <li key={q.id} className="group bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex justify-between items-start gap-2">
                     <div className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex-shrink-0">
                            {idx + 1}
                        </span>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">
                                {q.disciplina} • {q.dificuldade}
                            </p>
                            <p className="text-sm text-gray-800 line-clamp-2 group-hover:line-clamp-none transition-all duration-200">
                                {q.enunciado}
                            </p>
                        </div>
                     </div>
                     <button 
                        onClick={() => removeSelected(q.id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                        title="Remover questão"
                     >
                       <Trash2 size={16} />
                     </button>
                   </li>
                 ))}
               </ul>
            )}
          </div>

          {/* Rodapé com Botão de Ação - FIXO */}
          <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
             <button
               onClick={handleGenerate}
               disabled={selectedQuestions.length === 0}
               className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2
                 ${selectedQuestions.length === 0 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                 }`}
             >
               <FileText size={20} />
               Gerar Prova em PDF
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}