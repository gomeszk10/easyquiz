# EasyQuiz

**EasyQuiz** é uma plataforma web desenvolvida para facilitar o gerenciamento de bancos de questões e a geração automatizada de provas e avaliações. O sistema permite que professores e administradores cadastrem disciplinas, criem questões de diversos tipos (Múltipla Escolha, Verdadeiro/Falso, Dissertativa) e montem exames personalizados selecionando questões específicas de um repositório.

## 🚀 Funcionalidades

O projeto conta com as seguintes funcionalidades principais:

*   **Gerenciamento de Usuários:** Autenticação e perfis diferenciados (Professor e Admin).
*   **Banco de Questões:**
    *   Criação, edição e remoção de questões.
    *   Suporte a tipos variados: Múltipla Escolha, Verdadeiro/Falso e Dissertativa.
    *   Classificação por Dificuldade (Fácil, Médio, Difícil) e Disciplina.
*   **Gerenciamento de Disciplinas:** Cadastro e organização de matérias.
*   **Gerador de Provas:**
    *   Busca avançada de questões com filtros.
    *   Seleção manual de questões para compor a prova.
    *   Definição de pesos para cada questão.
    *   Exportação/Visualização da prova gerada.
*   **Navegação Pública:** Área para visualizar questões públicas disponíveis no banco.

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando uma arquitetura moderna, separando o Frontend do Backend.

### Frontend (Pasta `easyquiz`)
A interface do usuário foi construída com foco em performance e experiência do usuário (UX).
*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
*   **Ícones:** [Lucide React](https://lucide.dev/)
*   **Gerenciamento de Pacotes:** NPM

### Backend
A API que sustenta a aplicação foi desenvolvida para ser robusta e escalável.
*   **Linguagem:** Java
*   **Framework:** Spring Boot
*   **Persistência de Dados:** Spring Data JPA / Hibernate
*   **Banco de Dados:** (MySQL/PostgreSQL - *Configurado via JPA*)


## 📦 Como Rodar o Projeto

### Pré-requisitos
*   Node.js (v18 ou superior)
*   Java JDK (v17 ou superior)
*   Maven

### Passos para o Frontend

1.  Acesse a pasta do frontend:
    ```bash
    cd easyquiz
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  Acesse `http://localhost:3000` no seu navegador.

### Passos para o Backend

1.  Acesse a pasta do projeto Java Spring.
2.  Configure o arquivo `application.properties` com as credenciais do seu banco de dados.
3.  Execute a aplicação via sua IDE (IntelliJ/Eclipse/VS Code) ou via terminal com Maven:
    ```bash
    ./mvnw spring-boot:run
    ```

### Pré-requisitos
*   Node.js (v18 ou superior)
*   Java JDK (v17 ou superior)
*   Maven

### Passos para o Frontend

1.  Acesse a pasta do frontend:
    ```bash
    cd easyquiz
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  Acesse `http://localhost:3000` no seu navegador.

### Passos para o Backend

1.  Acesse a pasta do projeto Java Spring.
2.  Configure o arquivo `application.properties` com as credenciais do seu banco de dados.
3.  Execute a aplicação via sua IDE (IntelliJ/Eclipse/VS Code) ou via terminal com Maven:
    ```bash
    ./mvnw spring-boot:run
    ```