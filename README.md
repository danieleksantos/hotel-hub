<div align="center">
  <img src="https://github.com/user-attachments/assets/3534a77e-fabe-4b4d-bd44-71b44674ef96" alt="Hotel Hub Logo" width="100"/>

  # Hotel Hub - Sistema de Gestão Hoteleira

  <p>
    <strong>Gestão de estadias, hotéis e hóspedes com foco em UX e portabilidade.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Stack-React.js-blue?style=for-the-badge" alt="React">
    <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge" alt="Node">
    <img src="https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge" alt="Postgres">
    <img src="https://img.shields.io/badge/Docker-Ready-lightblue?style=for-the-badge" alt="Docker">
  </p>
</div>

---

## Sobre o Projeto

O **Hotel Hub** é uma plataforma completa para administração de redes hoteleiras. O sistema permite o cadastro de unidades, gerenciamento de disponibilidade e controle de hóspedes, tudo sob uma interface moderna, responsiva e com identidade visual limpa e intuitiva.



## Tecnologias Utilizadas

- **Frontend:** React.js, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express, Querys SQL puras.
- **Infraestrutura:** Docker & Docker Compose.
- **Banco de Dados:** PostgreSQL 15.

---

## Como rodar o projeto 
### Opção 1: Docker

O projeto foi configurado para ser **"Plug and Play"**. Graças aos scripts de inicialização automática (Seed), o banco de dados nascerá com hotéis reais, reservas e hóspedes.

#### Pré-requisitos
- Docker instalado.
- Docker Compose instalado.

#### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/danieleksantos/hotel-hub.git](https://github.com/danieleksantos/hotel-hub.git)
   cd hotel-hub
   ```

2. **Suba os containers:**
   ```bash
   docker-compose up --build
   ```

3. **Acesse as interfaces:**

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Documentação Swagger: http://localhost:3000/api-docs/

### Opção 2: Localmente

Se desejar rodar o projeto sem Docker, siga os passos abaixo:

#### Pré-requisitos

- Node.js (v18+) instalado.
- PostgreSQL instalado e rodando.

1. **Configurar o Banco de Dados**

- Crie um banco de dados chamado hotel_hub.
- Execute o conteúdo dos arquivos /backend/database/init.sql e /backend/database/seed.sql (nesta ordem) no seu cliente Postgres para criar as tabelas e dados iniciais.

2. **Configurar o Backend**
```bash
cd backend
npm install
```

- Crie um arquivo .env na pasta /backend com as seguintes variáveis:
```bash
PORT=3000
DATABASE_URL=postgres://seu_usuario:sua_senha@localhost:5432/hotel_hub
JWT_SECRET=sua_chave_secreta
```

- Inicie o servidor:
```bash
npm run dev
```

3. **Configurar o Frontend**
```bash
cd frontend
npm install
npm run dev
```

- O frontend estará disponível em http://localhost:5173 (ou a porta indicada no terminal).

## Credenciais de Acesso
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

## Estrutura do Banco (Seed)
<p>O banco de dados utiliza <strong>UUID v4</strong> e está estruturado para garantir a integridade referencial total:</p>

<ul>
  <li><strong>Users:</strong> Controle de autenticação e perfis de acesso.</li>
  <li><strong>Hotels:</strong> Registro detalhado das unidades (classificação por estrelas, capacidade e fotos).</li>
  <li><strong>Bookings:</strong> Gerenciamento de períodos de estadia e vínculos entre hotéis e usuários.</li>
  <li><strong>Guests:</strong> Listagem de hóspedes vinculada diretamente a uma reserva ativa.</li>
</ul>

<br />

<hr />

## Preview

<p align="center">
<img src="https://github.com/user-attachments/assets/76dcfd5f-5eb4-4cf3-aa24-03eab690bd52" alt="Desktop Preview" width="700" /></p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/8b73efdb-8774-4e3a-8f62-d51ef688f339" alt="Mobile Login" width="200" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/f7e2a790-16af-4ade-93b4-1eb565034523" alt="Mobile Hotels" width="200" />
</p>

<div align="center">
<p>Desenvolvido por <strong>Daniele Karina dos Santos</strong></p>
</div>
