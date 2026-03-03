# Liga dos Campeões - Frontend E-sports

Sistema de gestão e agendamento automático de campeonatos de e-sports.

## 🚀 Tecnologias

- **React 19** + **TypeScript**  
- **Vite** (Build tool)
- **Tailwind CSS** (Estilização com tema Dark Mode)
- **React Router** (Navegação)

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