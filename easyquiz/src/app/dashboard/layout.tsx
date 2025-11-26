import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex"> {/* Layout flexível: Sidebar + Conteúdo */}
      <Sidebar />
      <div className="flex-1 p-8"> {/* Área de conteúdo principal */}
        {children}
      </div>
    </div>
  );
}