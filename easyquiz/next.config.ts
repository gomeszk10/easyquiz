import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora erros do ESLint (como variáveis não usadas ou 'any') durante o build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de tipagem do TypeScript durante o build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;