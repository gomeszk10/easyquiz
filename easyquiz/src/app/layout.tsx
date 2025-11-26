import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'; // 1. Importe o Footer

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EasyQuiz - Gerador de Provas',
  description: 'Crie provas e compartilhe questões facilmente.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
        <Navbar />
        
        {/* 2. Faça o 'main' crescer para preencher o espaço */}
        <main className="pt-20 flex-grow"> 
          {children}
        </main>

        <Footer /> {/* 3. Adicione o Footer no final */}
      </body>
    </html>
  );
}