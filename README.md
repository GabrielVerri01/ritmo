# Ritmo

Protótipo do app de rotina/anti-procrastinação. Roda no navegador (local) por
enquanto — a versão empacotada com Capacitor (Android/iOS) entra depois que a
tela e o fluxo estiverem validados.

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000 — você vai cair na tela de login. Como ainda não
existe backend, o login é simulado: qualquer e-mail entra, os dados ficam
salvos no `localStorage` do navegador.

## Estrutura

```
app/
  login/page.tsx          tela de login
  (app)/layout.tsx        layout com sidebar + topbar (exige login)
  (app)/page.tsx          home — atividades de hoje
  (app)/atividades/       lista completa da rotina
  (app)/atividade/[id]/   edição de uma atividade específica
  (app)/perfil/page.tsx   perfil e logout

components/
  Sidebar.tsx        barra lateral que expande ao clicar
  TopBar.tsx         topo com botão de perfil
  ActivityCard.tsx   card de cada atividade (usado na home e na listagem)
  AuthGuard.tsx       protege as rotas internas

lib/
  types.ts        tipos (Activity, UserProfile...)
  categories.ts   ícone/cor de cada categoria de atividade
  mock-data.ts    rotina de exemplo pré-cadastrada
  storage.ts       leitura/gravação local (localStorage) — trocar por
                    chamadas de API quando o backend existir
```

## O que falta (próximos passos sugeridos)

- Backend real (API routes do Next ou serviço separado) + banco de dados,
  substituindo `lib/storage.ts`
- Autenticação de verdade (NextAuth, por exemplo)
- Tela/fluxo de "criar nova atividade" (hoje só dá pra editar as que já
  existem na rotina seed)
- Empacotar com Capacitor e trocar os avisos visuais por
  `@capacitor/local-notifications`, agendados a partir dos horários salvos
- Onboarding inicial (configurar a rotina pela primeira vez)

## Identidade visual

Preto esverdeado como base (`#0B0F0D`), verde `#6FCF97` como cor de ação,
tipografia Space Grotesk (títulos) + Manrope (texto). Tokens em
`tailwind.config.ts`.
