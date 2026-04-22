import { ACCESS_TOKEN_KEY } from "@/lib/auth-cookies";
import { NextRequest, NextResponse } from "next/server";

// Rotas de autenticação: usuários já logados não devem acessá-las
// (se logado, é redirecionado para a home)
const AUTH_ONLY_PATHS = ["/login", "/register", "/reset-password"];

// Rotas públicas acessíveis por qualquer pessoa (logada ou não)
const PUBLIC_PATHS = ["/privacy", "/terms"];

// Prefixos que devem ser ignorados pelo middleware
const IGNORED_PREFIXES = ["/_next", "/api", "/icons", "/logos", "/favicon"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignora assets, API routes, e arquivos estáticos
  if (IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Ignora arquivos estáticos (imagens, etc.)
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const isAuthenticated = !!accessToken;

  const isAuthOnlyPath = AUTH_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  // Rota pública geral (privacy/terms): libera para todos
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Usuário autenticado tentando acessar login/register → redireciona para home
  if (isAuthenticated && isAuthOnlyPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Usuário não autenticado tentando acessar rota protegida → redireciona para login
  if (!isAuthenticated && !isAuthOnlyPath) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
