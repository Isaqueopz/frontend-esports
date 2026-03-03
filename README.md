# Liga dos Campeões - Frontend E-sports

Sistema de gestão e agendamento automático de campeonatos de e-sports.

## 🚀 Tecnologias

- **React 19** + **TypeScript**  
- **Vite** (Build tool)
- **Tailwind CSS** (Design system dark mode)
- **React Router** (Navegação SPA)
- **Lucide React** (Ícones modernos)
- **clsx** (Utility para classes CSS)

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Layout.tsx       # Layout principal da aplicação
│   ├── MatchCard.tsx    # Card de partida
│   └── MatchStatusBadge.tsx # Badge de status da partida
├── pages/               # Páginas da aplicação
│   ├── HomePage.tsx     # Dashboard principal
│   ├── RankingPage.tsx  # Ranking dos times  
│   ├── BracketPage.tsx  # Brackets/Chaves
│   ├── ResultsPage.tsx  # Resultados das partidas
│   └── TeamProfilePage.tsx # Perfil detalhado do time
├── services/            # Serviços de API
│   └── api.ts          # Centralizador das chamadas para Spring Boot
├── types/              # Definições TypeScript
│   └── index.ts        # Todas as interfaces e tipos
├── utils/              # Utilitários
│   └── dateUtils.ts    # Formatação de datas
├── App.tsx             # Componente raiz
├── main.tsx            # Entry point
└── index.css           # Estilos globais + Tailwind
```

## ⚠️ PONTOS DE INTEGRAÇÃO COM SPRING BOOT

### 🔄 APIs que precisam ser implementadas:

#### **Championships Service** (`/api/championships`)
- `GET /api/championships` - Listar todos os campeonatos
- `GET /api/championships?type=PONTOS_CORRIDOS&active=true` - Filtrar por tipo
- `GET /api/championships/{id}` - Buscar campeonato por ID
- `GET /api/championships/{id}/rankings` - Ranking do campeonato
- `GET /api/championships/{id}/bracket` - Bracket do campeonato  
- `POST /api/championships` - Criar novo campeonato
- `PUT /api/championships/{id}` - Atualizar campeonato
- `DELETE /api/championships/{id}` - Deletar campeonato

#### **Teams Service** (`/api/teams`)
- `GET /api/teams` - Listar todos os times
- `GET /api/teams/{id}` - Buscar time por ID
- `GET /api/teams/{id}/matches/recent` - Partidas recentes do time
- `GET /api/teams/{id}/matches/upcoming` - Próximas partidas do time
- `POST /api/teams` - Criar novo time
- `PUT /api/teams/{id}` - Atualizar time
- `DELETE /api/teams/{id}` - Deletar time

#### **Matches Service** (`/api/matches`)
- `GET /api/matches/upcoming` - Próximas partidas
- `GET /api/matches/completed` - Partidas finalizadas (com filtros)
- `GET /api/matches/{id}` - Buscar partida por ID
- `POST /api/matches` - Criar nova partida
- `PUT /api/matches/{id}` - Atualizar partida
- `PUT /api/matches/{id}/score` - Atualizar placar
- `DELETE /api/matches/{id}` - Deletar partida

#### **Locations Service** (`/api/locations`)
- `GET /api/locations` - Listar todos os locais
- `GET /api/locations/available?date=` - Locais disponíveis por data
- `POST /api/locations` - Criar novo local

#### **Players Service** (`/api/players`)
- `GET /api/players` - Listar todos os jogadores
- `GET /api/players/team/{teamId}` - Jogadores de um time

### 🔗 WebSocket para Updates em Tempo Real
- `ws://localhost:8080/ws` - Conexão WebSocket para:
  - Atualizações de placar em tempo real
  - Notificações de status das partidas
  - Updates de ranking ao vivo

## 🎯 Arquivos com Mock Data (Para Substituir)

Todos os arquivos listados abaixo contêm dados mockados marcados com **⚠️** que devem ser substituídos por chamadas para Spring Boot:

1. **src/pages/HomePage.tsx**
   - `loadData()` - Carregar campeonatos ativos e próximas partidas
   
2. **src/pages/RankingPage.tsx**  
   - `loadData()` - Carregar campeonatos de pontos corridos
   - `loadRanking()` - Carregar ranking do campeonato
   
3. **src/pages/BracketPage.tsx**
   - `loadData()` - Carregar campeonatos mata-mata
   - `loadBracket()` - Carregar estrutura do bracket
   
4. **src/pages/ResultsPage.tsx**
   - `loadData()` - Carregar campeonatos e times
   - `loadFilteredResults()` - Carregar resultados com filtros
   
5. **src/pages/TeamProfilePage.tsx**
   - `loadTeamData()` - Carregar dados completos do time

## 🚦 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento  
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🔧 Configuração

1. Copie `.env.example` para `.env.local`
2. Configure a URL da API Spring Boot:
   ```
   VITE_API_URL=http://localhost:8080/api
   VITE_WS_URL=ws://localhost:8080/ws
   ```

## 📋 Próximos Passos para Integração

### 1. **Backend Integration**
- [ ] Implementar todas as APIs REST no Spring Boot
- [ ] Configurar CORS para permitir requisições do frontend
- [ ] Implementar WebSocket para updates em tempo real
- [ ] Substituir todos os mock data por chamadas reais da API

### 2. **Features Adicionais**
- [ ] Sistema de autenticação/autorização
- [ ] Painel administrativo
- [ ] Sala de partida em tempo real (Match Room)
- [ ] Sistema de notificações
- [ ] Upload de imagens (logos dos times)

### 3. **Performance & UX**
- [ ] Implementar cache de dados
- [ ] Loading states mais elaborados  
- [ ] Error handling robusto
- [ ] Offline support básico
- [ ] Animações de transição entre páginas

### 4. **Deploy**
- [ ] Configurar CI/CD
- [ ] Docker para containerização
- [ ] Deploy da aplicação React
- [ ] Configuração de proxy reverso

## 🎮 Design System

O projeto utiliza um design system gaming-oriented com:
- **Tema escuro** por padrão
- **Cores primárias:** Azuis (#0ea5e9, #3b82f6) 
- **Tipografia:** Font gaming customizada (Orbitron)
- **Animações:** Smooth e modernas usando Tailwind
- **Ícones:** Lucide React para consistência visual

## 📞 Suporte

Para dúvidas sobre integração com Spring Boot ou implementação de features, consulte os comentários **⚠️** no código que indicam exatamente onde e como fazer a integração.

## 📱 Telas Implementadas

### 🏠 **Home** (`/`)
- Dashboard principal com campeonatos ativos
- Listagem de próximas partidas **AGENDADAS**
- Cards diferenciados para Pontos Corridos vs Mata-Mata
- Hero section com call-to-actions

### 🏆 **Ranking** (`/ranking`)
- Tabela classificatória para campeonatos **Pontos Corridos**
- Sistema de pontuação (3 pontos por vitória)
- Badges especiais para top 3 (🥇🥈🥉)
- Saldo de gols e critérios de desempate
- Filtros por campeonato

### 🌳 **Bracket** (`/bracket`)
- Árvore interativa para torneios **Mata-Mata**
- Visualização por rodadas: Quartas → Semifinais → Final
- Status em tempo real das partidas
- Regras e premiação do torneio

### 📊 **Resultados** (`/results`)
- Histórico de partidas **CONCLUÍDAS**
- Filtros por campeonato, time e período
- Estatísticas detalhadas por jogo
- Informações de vencedor e placar

### 👥 **Team Profile** (`/team/:id`)
- Dashboard completo do time
- Elenco com jogadores e Steam IDs
- Histórico de performance e win rate
- Próximas partidas e conquistas

## ⚡ Componentes Principais

### `MatchCard`
- Exibe partidas com placares CS2 (CT/TR)
- Status badges diferenciados por cor
- Suporte a onClick para navegação

### `MatchStatusBadge`
- Badge visual para status das partidas
- Estados: `AGENDADA`, `EM_ANDAMENTO`, `CONCLUIDA`

### `Layout`
- Header com navegação responsiva
- Mobile-first design
- Sistema de rotas integrado

## 🎮 Funcionalidades

- **Polimorfismo visual**: Diferenciação entre tipos de campeonato
- **Status em tempo real**: Enums para estados das partidas  
- **Responsivo**: Design adaptativo mobile/desktop
- **Dark Mode**: Tema completo focado em gaming
- **Mock Data**: Estrutura preparada para API Spring Boot

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 📡 Integração com Backend

O frontend está preparado para consumir a API Spring Boot através de:

- Endpoints estruturados (`/api/teams`, `/api/rankings`, etc.)
- Tipagem TypeScript espelhando entities Java
- Loading states e error handling
- Funções async/await prontas para fetch

## 🎯 Próximos Passos

1. **Match Room**: Lobby da partida com detalhes em tempo real
2. **Integração API**: Conectar com endpoints Spring Boot
3. **WebSocket**: Updates em tempo real de placares
4. **Admin Panel**: Gestão de campeonatos e times
5. **Notificações**: Sistema de alertas para matches

## 🐛 Resolução de Problemas

### Tela Branca
Se a aplicação carregar com tela branca, verifique:

1. **PostCSS Config**: Certifique-se de que `postcss.config.js` usa `tailwindcss` (não `@tailwindcss/postcss`)
2. **Reinicie o servidor**: `npm run dev` após mudanças na configuração
3. **TypeScript**: Verifique se não há erros de compilação

### Servidor Local
- **URL**: http://localhost:5173
- **Hot Reload**: Habilitado automaticamente
- **Network**: Use `--host` para expor na rede local