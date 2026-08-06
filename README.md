# Mission Control — portfólio

Um portfólio que não é uma lista: é um **console de lançamento**. Cada seção é um
estágio da sequência, a barra do topo mostra telemetria ao vivo derivada da sua
rolagem, e uma cena WebGL sobe da plataforma até a órbita enquanto você desce a
página. Quando você chega no contato, o veículo está em órbita.

---

## Rodando

Precisa de **Node 20.19+ ou 22.12+** (mínimo do Vite 7).

```bash
npm install
npm run dev
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Checa tipos e gera o `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | ESLint, incluindo regras de acessibilidade |
| `npm run typecheck` | Só a checagem de tipos |
| `npm test` | Testes com Vitest |
| `npm run test:coverage` | Testes com relatório de cobertura |

---

## Preenchendo com o seu conteúdo

Nada de CMS e nada de mexer em componente. Tudo que um visitante lê está em
`content/`, tipado:

| Arquivo | O que colocar |
| --- | --- |
| `content/profile.ts` | **Comece por aqui.** Nome, cargo, bio, e-mail, redes, disponibilidade |
| `content/missions.ts` | Seus projetos, um por objeto |
| `content/subsystems.ts` | Sua stack, com nível de 1 a 5 |
| `content/trajectory.ts` | Trabalho, formação e certificados na mesma linha do tempo |
| `content/posts/*.mdx` | Notas do diário de bordo (opcional) |

Procure por `TODO` — é tudo que precisa ser trocado. Depois disso, ainda troque:

- `index.html`: título, descrição, `canonical`, URL da imagem OG e o JSON-LD
- `public/robots.txt`: a URL do sitemap
- `public/logo.svg` e `public/og-image.png`: crie os dois (1200×630 na OG)

### Sobre as traduções

Cada texto é um objeto `{ pt, en, es }`. Se você esquecer um idioma, **o build
falha** — é de propósito. Se quiser rodar só em português, o caminho honesto é
remover `"en"` e `"es"` de `LOCALES` em `content/types.ts` e apagar os
dicionários correspondentes, não deixar texto pela metade.

---

## A sequência

| Código | Estágio | O que tem nele |
| --- | --- | --- |
| `T-00` | Pré-voo | A capa: nome, o que você faz, disponibilidade |
| `S-01` | Carga útil | Quem está a bordo — a bio |
| `S-02` | Trajetória | Trabalho, formação e certificados |
| `S-03` | Missões | Projetos, cada um com relatório que abre |
| `S-04` | Subsistemas | A stack, agrupada por função no veículo |
| `S-05` | Diário de bordo | Notas técnicas em MDX |
| `S-06` | Comunicações | Contato e rodapé |

Para adicionar ou reordenar estágios, edite `src/app/stages.ts`. Navegação,
scroll spy e a barra de progresso saem todos daquele array.

---

## Decisões que valem conhecer

**A rolagem não é estado do React.** A posição vive num store de módulo
(`src/lib/launch.ts`) com três saídas: a variável CSS `--launch-progress`, uma
inscrição imperativa para a cena 3D, e um hook que quantiza o valor para o React
só re-renderizar quando um dígito visível mudaria. Publicação agrupada em
`requestAnimationFrame`. É a diferença entre 60 renderizações por segundo e umas
poucas centenas na página inteira.

**A cena 3D é opcional por projeto.** Ela só monta depois do primeiro paint, e
só se o aparelho passar por quatro perguntas: `prefers-reduced-motion`,
`prefers-reduced-data`, memória/núcleos disponíveis e WebGL de fato funcionando.
Se falhar em qualquer uma, ou se algum shader morrer num driver específico, um
error boundary derruba só a cena. O `three` também vai num chunk separado, então
nada acima da dobra espera por ele.

**Os shaders são escritos à mão.** Três programas pequenos em
`src/three/shaders.ts`: campo de estrelas com cintilação por semente, limbo
atmosférico por Fresnel que afina conforme você sobe, e a pluma do motor com
oscilação por batimento de senoides. Todos leem o progresso e o tema, então
trocar de tema não recria material nenhum.

**Dois temas, não um toggle de dark mode.** `console` é a sala escura de voo,
`daylight` é o plano impresso na mesa. Ambos são condições reais de iluminação
operacional, definidas em `src/app/styles/tokens.css`.

**Acessibilidade não é uma camada por cima.** A telemetria é `aria-hidden` porque
é decorativa, e o progresso real é exposto uma única vez num `progressbar`. Os
níveis da stack são `meter` com valor de verdade, não caixinhas acesas. Cada
lâmpada de status tem o texto ao lado, porque cor sozinha não é sinal. Os painéis
que abrem são `aria-expanded` + região controlada. O link de pular conteúdo move
o foco de verdade.

---

## Testes

Vitest com jsdom. Os testes cobrem o que tipo não cobre: a telemetria nunca lê
como descida, os três dicionários têm exatamente as mesmas chaves, nenhum texto
ficou vazio, e nada em inglês ou espanhol ficou com a frase em português. O CI no
GitHub Actions roda typecheck, lint, testes com cobertura e build em cada push.

---

## Publicando

Já vem configurado para **Netlify** (`netlify.toml`): build `npm run build`,
publica `dist/`, com fallback de SPA e cache imutável nos assets versionados.
Conecte o repositório e cada push na `main` publica sozinho. Para Vercel ou
Cloudflare Pages, o comando e a pasta de saída são os mesmos.
