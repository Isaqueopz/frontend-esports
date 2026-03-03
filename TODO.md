# 📋 TODO - Liga dos Campeões Frontend

## ⚠️ PRIORIDADE ALTA - Integração Spring Boot

### 1. Substituir Mock Data por APIs Reais
Todos os pontos marcados com ⚠️ nos seguintes arquivos:

- **src/pages/HomePage.tsx**
  - [ ] `loadData()` → `/api/championships/active` + `/api/matches/upcoming`
  
- **src/pages/RankingPage.tsx**  
  - [ ] `loadData()` → `/api/championships?type=PONTOS_CORRIDOS&active=true`
  - [ ] `loadRanking()` → `/api/championships/{id}/rankings`
  
- **src/pages/BracketPage.tsx**
  - [ ] `loadData()` → `/api/championships?type=MATA_MATA`
  - [ ] `loadBracket()` → `/api/championships/{id}/bracket`
  
- **src/pages/ResultsPage.tsx**
  - [ ] `loadData()` → `/api/championships` + `/api/teams`
  - [ ] `loadFilteredResults()` → `/api/matches/completed`
  
- **src/pages/TeamProfilePage.tsx**
  - [ ] `loadTeamData()` → `/api/teams/{id}` + `/api/teams/{id}/matches/*`

### 2. Configurar Ambiente de Desenvolvimento
- [ ] Configurar CORS no Spring Boot para permitir `http://localhost:5173`
- [ ] Criar arquivo `.env.local` baseado em `.env.example`
- [ ] Testar conectividade entre frontend e backend

## 🚀 FEATURES FALTANTES

### 3. Sala de Partida (Match Room)
- [ ] Criar `src/pages/MatchRoomPage.tsx`
- [ ] Implementar WebSocket para updates em tempo real
- [ ] Interface para acompanhar partida ao vivo
- [ ] Chat da partida (opcional)

### 4. Sistema de Autenticação
- [ ] Login/Logout
- [ ] Proteção de rotas
- [ ] Perfis de usuário (Admin, Player, Viewer)
- [ ] Context de autenticação

### 5. Painel Administrativo
- [ ] CRUD de campeonatos
- [ ] CRUD de times
- [ ] CRUD de jogadores
- [ ] CRUD de locais
- [ ] Agendamento manual de partidas

### 6. Features de UX
- [ ] Upload de imagens (logos dos times)
- [ ] Sistema de notificações
- [ ] Tema claro/escuro toggle
- [ ] Modo offline básico
- [ ] Loading states mais elaborados

## 🔧 MELHORIAS TÉCNICAS

### 7. Performance
- [ ] Implementar React Query ou SWR para cache
- [ ] Lazy loading de páginas
- [ ] Otimização de imagens
- [ ] Code splitting

### 8. Error Handling
- [ ] Error boundaries
- [ ] Toast notifications para erros
- [ ] Retry automático para APIs
- [ ] Fallbacks para dados offline

### 9. Testing
- [ ] Setup do Vitest
- [ ] Testes unitários dos componentes
- [ ] Testes de integração das páginas
- [ ] E2E com Playwright

### 10. DevOps
- [ ] Dockerfile para produção
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Deploy automatizado
- [ ] Monitoramento de performance

## 🎯 ROADMAP DE DESENVOLVIMENTO

### Fase 1: Core Integration (1-2 semanas)
1. ✅ Setup do projeto e estrutura
2. ⚠️ **Integração das APIs REST** 
3. ⚠️ **Configuração de ambiente**

### Fase 2: Real-time Features (1 semana)  
4. [ ] WebSocket para partidas ao vivo
5. [ ] Match Room page
6. [ ] Notificações push

### Fase 3: Admin Features (2 semanas)
7. [ ] Sistema de autenticação
8. [ ] Painel administrativo
9. [ ] Upload de arquivos

### Fase 4: Polish & Deploy (1 semana)
10. [ ] Testes automatizados
11. [ ] Performance optimization  
12. [ ] Deploy em produção

## ⚡ QUICK WINS (Fáceis de implementar)

- [ ] Adicionar favicon personalizado
- [ ] Melhorar mensagens de loading
- [ ] Adicionar animações de transição
- [ ] Implementar breadcrumbs
- [ ] Adicionar meta tags para SEO
- [ ] Configurar PWA básico

## 🐛 BUGS CONHECIDOS

- [ ] Nenhum bug crítico identificado no momento
- [x] ~~Imports não utilizados~~ - ✅ Corrigido
- [x] ~~Erro de TypeScript no process.env~~ - ✅ Corrigido

## 📊 MÉTRICAS DE SUCESSO

- [ ] Tempo de carregamento < 3s
- [ ] Score Lighthouse > 90
- [ ] Teste em todos os breakpoints responsivos
- [ ] Compatibilidade com navegadores modernos
- [ ] Zero erros de console em produção