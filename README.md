<div align="center">
  <img src="https://github.com/user-attachments/assets/3534a77e-fabe-4b4d-bd44-71b44674ef96" alt="Hotel Hub Logo" width="100"/>

  # Hotel Hub - Sistema de Gestão Hoteleira

  <p>
    <strong>Gestão de estadias, hotéis e hóspedes com foco em UX, portabilidade e design 100% responsivo.</strong>
  </p>

<p>
    <img src="https://img.shields.io/badge/React.js-blue?style=for-the-badge" alt="React">
    <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge" alt="Node">
    <img src="https://img.shields.io/badge/Cloud_Database-Neon_PostgreSQL-00e599?style=for-the-badge&logo=postgresql&logoColor=white" alt="Neon">
    <img src="https://img.shields.io/badge/Infrastructure-Docker-lightblue?style=for-the-badge&logo=docker" alt="Docker">
</p>
</div>

---
## 🚀 Deploy (Acesse Agora)

O projeto está publicado e pode ser testado nos links abaixo:

- **Frontend (Vercel):** [https://hotel-hub-seven.vercel.app](https://hotel-hub-seven.vercel.app)
- **Backend API (Render):** [https://hotel-hub-r5r8.onrender.com](https://hotel-hub-r5r8.onrender.com)
- **Banco de Dados:** PostgreSQL Gerenciado (Neon Cloud).

---

## Sobre o Projeto

O Hotel Hub é uma plataforma robusta para administração de redes hoteleiras, focada em adaptabilidade total e performance.

- **Experiência Desktop:** Alta produtividade com tabelas detalhadas e navegação lateral.
- **Experiência Mobile (Mobile-First):** Gestão completa da rede hoteleira diretamente do mobile, com touch targets otimizados.
- **Segurança:** Autenticação via JWT (JSON Web Token) com middlewares de proteção e política de CORS rigorosa.
- **Identidade Visual Premium:** Design moderno utilizando as cores institucional (Verde Escuro e Dourado).

## Tecnologias Utilizadas

- **Frontend:** React.js, Tailwind CSS, Lucide Icons, Axios.
- **Backend:** Node.js, Express, JWT, Querys SQL puras (foco em performance).
- **Banco de Dados:** PostgreSQL 15 (Neon Cloud em produção / Docker local).
- **DevOps:** Docker, Docker Compose, CI/CD via Render e Vercel.

---

## Como rodar o projeto 
### Opção 1: Docker (Recomendado para Desenvolvimento)

Esta opção sobe o frontend e o backend em containers, enquanto se conecta ao banco de dados configurado no seu `.env`.
#### 1. Configure as Variáveis de Ambiente
Crie um arquivo `.env` na **raiz** do projeto:

 ```bash
env
# Configurações do Banco (Ex: Neon ou Local)
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=hotel_hub
DATABASE_URL=postgres://user:pass@host:5432/dbname

# Segurança
JWT_SECRET=sua_chave_secreta_aqui
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5173,http://localhost:3000

#### 2. Suba os containers
```bash
docker-compose up --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Documentação Swagger: http://localhost:3000/api-docs/

### Opção 2: Localmente (Manual - Node.js)

Se desejar rodar o projeto sem Docker, siga os passos abaixo:

#### 1. **Backend:**
```bash
cd backend
npm install
npm run dev
```

#### 2. **Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Credenciais de Acesso (teste)
<p>Ao rodar pela primeira vez, o banco é populado automaticamente com um usuário administrador para testes:</p>

<table>
  <thead>
    <tr>
      <th>Usuário</th>
      <th>Senha</th>
      <th>Nível</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>admin</code></td>
      <td><code>admin123</code></td>
      <td><strong>Administrador</strong></td>
    </tr>
  </tbody>
</table>

<br />

## Arquitetura e Boas Práticas

Este projeto foi desenvolvido aplicando fundamentos sólidos de engenharia de software:

- Clean Code: Código legível e de fácil manutenção.
- SOLID: Princípios de responsabilidade única nos middlewares e serviços.
- A11y: Preocupação com acessibilidade e feedback visual (Toastify).
- Estrutura de Dados: Utilização de UUID v4 para IDs e relacionamentos otimizados em SQL puro.

<br />

<hr />

## Preview
<p align="center">Desktop Experience</p>
<p align="center"> 
<img src="https://github.com/user-attachments/assets/76dcfd5f-5eb4-4cf3-aa24-03eab690bd52" alt="Desktop Preview" width="700" /></p>
<p align="center">Mobile Experience (Responsive Design)
<p align="center">
  <img src="https://github.com/user-attachments/assets/8b73efdb-8774-4e3a-8f62-d51ef688f339" alt="Mobile Login" width="200" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/f7e2a790-16af-4ade-93b4-1eb565034523" alt="Mobile Hotels" width="200" />
</p>
<br>
<br>
<br>
<div align="center">
<p>Desenvolvido por <strong>Daniele Karina dos Santos</strong></p>
</div>
