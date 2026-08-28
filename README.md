# Henrique Erdei — portfólio

Site pessoal de engenheiro full-stack sênior (web e mobile). Uma página, três
idiomas (PT / EN / ES), tema escuro e claro, cena 3D opcional atrás do conteúdo.

O posicionamento é software: TypeScript, React, React Native, Node.js e
PostgreSQL. Data Science e BI entram como repertório, não como cargo.

---

## Rodando

Precisa de **Node 20.19+ ou 22.12+** (mínimo do Vite 7). Este repo tem `.nvmrc`
com `22`.

```bash
nvm use
npm install
npm run dev
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Vite, em geral `http://localhost:5173`) |
| `npm run build` | Typecheck + build em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | ESLint, inclusive regras de acessibilidade |
| `npm run typecheck` | Só a checagem de tipos |
| `npm test` | Testes com Vitest |
| `npm run test:coverage` | Testes com relatório de cobertura |

---

## O que editar (conteúdo)

Nada de CMS. O que o visitante lê está em `content/`, tipado. Muda o arquivo e
o site atualiza.

| Arquivo | O que tem |
| --- | --- |
| `content/profile.ts` | Nome, cargo, headline, bio, stack do hero, e-mail, redes, disponibilidade |
| `content/trajectory.ts` | Cargos (`kind: "work"`) e formação (`kind: "education"`) |
| `content/subsystems.ts` | Skills, nível 1–5, agrupadas por função |
| `content/missions.ts` | Cases / projetos (hoje vazio — a UI mostra o empty state) |
| `content/site.ts` | URL pública (SEO, Open Graph, sitemap) |
| `content/snake.ts` | Easter egg (Snake) |

Currículo em `public/curriculo.pdf`. Logo e OG em `public/logo.svg` e
`public/og-image.png` (OG 1200×630). Título, description e JSON-LD ficam em
`index.html` — o placeholder `__SITE_URL__` é trocado no build.

### Experiência vs formação

A seção `#path` **não** é uma linha do tempo misturada. A UI parte o array:

1. **Trajetória profissional** — só `kind: "work"` (Sondotécnica, SBA, S.P.A)
2. **Formação** — só `kind: "education"` (MBA + Gestão TI)

Cursos avulsos (Alura, AWS, etc.) não viram card. Há uma linha apontando para o
LinkedIn. Helpdesk, CFTV e papéis só de BI ficam no LinkedIn/currículo — não
aqui. Recrutador lê cargo primeiro.

Período: `2025 —` se está em curso, `2024 – 2025` se fechou.

### Traduções

Texto de conteúdo é `{ pt, en, es }`. Esquecer um idioma **quebra o build**.

Copy de UI (nav, botões, empty states) vive em `src/i18n/pt.ts` — esse objeto é
a fonte do tipo `Dict`. Inglês e espanhol têm que ter as **mesmas chaves**.
Testes em `src/i18n/dict.test.ts` ainda pegam string vazia e PT colado nos
outros idiomas.

Para adicionar seção no menu, edite `src/app/stages.ts` **e** `t.nav` nos três
dicionários. O `id` vira âncora (`#path`, `#work`) — trate como URL estável.

---

## Seções

| Id | Na página |
| --- | --- |
| `#intro` | Hero: cargo, headline, stack, CTAs |
| `#about` | Bio + ficha (local, fuso, disponibilidade) |
| `#path` | Experiência, depois formação |
| `#work` | Projetos (cases) |
| `#stack` | Skills |
| `#contact` | E-mail, telefone, redes, currículo |

Navegação, scroll spy e barra de progresso saem de `src/app/stages.ts`.

---

## Decisões que valem conhecer

**A rolagem não é estado do React.** O progresso 0→1 vive em `src/lib/scroll.ts`.
A cena 3D lê o valor no frame; o CSS usa `--scroll-progress`. Publicação
agrupada em `requestAnimationFrame`.

**A cena 3D é opcional.** Só monta depois do primeiro paint, e só se passar em
`prefers-reduced-motion`, `prefers-reduced-data`, potência do aparelho e WebGL
de verdade. Se falhar, um error boundary derruba só a cena. `three` vai num
chunk separado.

**Dois temas, não um dark mode genérico.** `console` é o workspace escuro;
`daylight` é a mesma paleta no papel. Tokens em `src/app/styles/tokens.css`.

**Acessibilidade não é camada extra.** Progresso real num `progressbar`, níveis
da stack em `meter`, status com texto além da cor, painéis com `aria-expanded`.
O skip link move o foco de verdade.

---

## Testes e CI

Vitest + jsdom. O que tipo não cobre: dicionários alinhados, copy vazia,
tradução esquecida em PT, probes da cena.

GitHub Actions (`.github/workflows/ci.yml`) em cada push/PR na `main`:
typecheck, lint, testes com cobertura e build. Node 22.

---

## Publicando

**Netlify** (`netlify.toml`): `npm run build` → `dist/`, Node 22, fallback SPA,
cache imutável em `/assets/*`.

URL do site: `VITE_SITE_URL` no build (veja `.env.example`). Sem ela, vale o
default em `content/site.ts`. Sitemap e `robots.txt` são gerados no build.

Vercel ou Cloudflare Pages: mesmo comando e mesma pasta de saída.
