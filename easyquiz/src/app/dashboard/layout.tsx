import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      {/* AJUSTES FEITOS:
        1. 'md:ml-64': A margem esquerda de 256px só aplica em telas médias ou maiores (Desktop).
           No mobile, a margem será 0 (padrão).
        
        2. 'p-4 md:p-8': Padding menor no mobile (4) e maior no desktop (8).

        3. 'pt-16 md:pt-8': No mobile, aumentamos o padding superior (16) para o 
           conteúdo não ficar atrás do botão de menu fixo.
      */}
      <main className="flex-1 w-full p-4 pt-16 md:p-8 md:ml-64">
        {children}
      </main>
    </div>
  );
}