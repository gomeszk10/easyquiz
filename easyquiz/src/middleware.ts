import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verifique se existe um cookie ou token de autenticação
  // Supondo que você salve o token como 'auth_token' após o login
  const token = request.cookies.get('auth_token')?.value;

  // Defina as rotas que requerem autenticação
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboardRoute && !token) {
    // Se tentar acessar dashboard sem token, redireciona para login
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  return NextResponse.next();
}

// Configuração para dizer ao Next.js em quais rotas rodar este middleware
export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
}