# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

Aplicação web client-side que analisa a frequência de palavras em um bloco de texto e exibe os resultados em uma tabela ordenada por frequência decrescente. Todo o processamento ocorre no browser, sem chamadas de rede. Projeto Tier 1 (beginner), escopo intencionalmente pequeno.

---

## Stack e versões

| Tecnologia | Versão |
|---|---|
| React | 18 |
| TypeScript | 5 |
| Vite | 5 |
| Vitest | 1 |
| React Testing Library | 14 |
| @testing-library/user-event | 14 |
| @testing-library/jest-dom | 6 |
| jsdom | 24 |

Sem bibliotecas de UI (MUI, Chakra, etc.). Estilização via CSS Modules exclusivamente.

---

## Estrutura de pastas

```
frequencia-palavras/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── TextInputSection/
│   │   │   ├── TextInputSection.tsx
│   │   │   └── TextInputSection.module.css
│   │   ├── CharCounter/
│   │   │   ├── CharCounter.tsx
│   │   │   └── CharCounter.module.css
│   │   ├── TranslateButton/
│   │   │   ├── TranslateButton.tsx
│   │   │   └── TranslateButton.module.css
│   │   ├── ErrorMessage/
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── ErrorMessage.module.css
│   │   └── FrequencyTable/
│   │       ├── FrequencyTable.tsx
│   │       └── FrequencyTable.module.css
│   ├── lib/
│   │   └── analyzeFrequency.ts
│   ├── App.tsx
│   ├── App.module.css
│   └── main.tsx
├── tests/
│   ├── analyzeFrequency.test.ts
│   ├── App.test.tsx
│   ├── FrequencyTable.test.tsx
│   └── ErrorMessage.test.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

Cada componente vive em sua própria pasta com arquivo `.tsx` e `.module.css` de mesmo nome. Nunca coloque lógica de negócio dentro de componentes — ela pertence a `src/lib/`.

---

## Convenções de código

### Arquivos e pastas
- Componentes React: `PascalCase` (ex: `FrequencyTable.tsx`)
- Arquivos de lógica pura: `camelCase` (ex: `analyzeFrequency.ts`)
- CSS Modules: mesmo nome do componente com sufixo `.module.css`
- Testes: mesmo nome do arquivo testado com sufixo `.test.ts` ou `.test.tsx`

### Componentes
- Um componente por arquivo.
- Sempre exportar como `export function NomeDoComponente` (named export, não default).
- Props tipadas com `interface` local no mesmo arquivo, nomeada `NomeDoComponenteProps`.

### Variáveis e funções
- `camelCase` para variáveis e funções.
- `UPPER_SNAKE_CASE` para constantes de módulo (ex: `MAX_CHARS = 2048`).
- O tipo central do domínio é `WordEntry { word: string; count: number }` — use este nome em todo o codebase.

### CSS
- Classes em `camelCase` dentro dos CSS Modules (ex: `styles.tableWrapper`).
- Sem estilos inline. Sem `!important`.

---

## Convenção de commits

```
feat:   nova funcionalidade
fix:    correção de bug
test:   adição ou correção de testes
style:  mudança visual sem alteração de lógica
refactor: mudança de código sem alterar comportamento externo
docs:   alteração em arquivos .md
chore:  configuração de tooling, dependências
```

Exemplos:
```
feat: add FrequencyTable component
test: add edge cases for empty punctuation-only input
fix: normalize accented characters to lowercase correctly
```

---

## O que o agente NUNCA deve fazer

- Instalar bibliotecas de UI (MUI, Chakra, Tailwind, Bootstrap, etc.).
- Adicionar dependências de runtime que não sejam React e React-DOM.
- Colocar lógica de análise de texto dentro de componentes React.
- Usar `default export` em componentes.
- Criar arquivos fora da estrutura de pastas definida acima.
- Implementar qualquer feature listada em "Fora do escopo da v1" no PRD.md (análise de URL, gráficos, exportação, autenticação).
- Modificar `PRD.md`, `SPEC.md` ou `CLAUDE.md` durante o desenvolvimento.
- Usar `any` em TypeScript — sempre tipar explicitamente.
- Adicionar comentários óbvios ou docstrings em código autoexplicativo.
- Fazer commits com múltiplas responsabilidades — um commit por mudança coesa.

---

## Como rodar o projeto localmente

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Como rodar os testes

```bash
# Todos os testes
npm run test

# Com watch mode
npm run test -- --watch

# Teste único por nome de arquivo
npm run test -- tests/analyzeFrequency.test.ts

# Com cobertura
npm run test -- --coverage
```

---

## Documentos de referência

| Arquivo | Conteúdo |
|---|---|
| [PRD.md](PRD.md) | Requisitos funcionais e não-funcionais, público-alvo, métricas de sucesso, escopo da v1 e v2 |
| [SPEC.md](SPEC.md) | Stack, arquitetura de componentes, estrutura de dados, edge cases e o que testar |

Leia o PRD.md para entender **o quê** construir. Leia o SPEC.md para entender **como** construir.

---

## Estado atual

### Tarefas concluídas
- [x] **T01** — Projeto inicializado, dependências instaladas, Vitest configurado com jsdom
- [x] **T02** — `analyzeFrequency` implementada com 13 testes passando (todos os edge cases do SPEC cobertos)
- [x] **T03** — Componente `ErrorMessage` criado com 3 testes passando

### Tarefas pendentes (por ordem de execução)
- [ ] T04 — Criar componente `CharCounter`
- [ ] T04 — Criar componente `CharCounter`
- [ ] T05 — Criar componente `TranslateButton`
- [ ] T06 — Criar componente `TextInputSection` *(depende de T04, T05)*
- [ ] T07 — Criar componente `FrequencyTable`
- [ ] T08 — Montar `App.tsx` com estado e fluxo completo *(depende de T03, T06, T07)*
- [ ] T09 — Estilização responsiva e acessibilidade
- [ ] T10 — Revisão final: TypeScript e testes

### Decisões técnicas tomadas (não previstas no SPEC)

**Scaffolding manual em vez de `npm create vite`**
O diretório já continha arquivos `.md`, o que faz o CLI cancelar interativamente sem aceitar stdin. A estrutura foi criada arquivo a arquivo seguindo o SPEC.

**Flag `--passWithNoTests` no script `test`**
`vitest run` retorna código 1 quando não encontra arquivos de teste. A flag foi adicionada para que o CI não falhe durante a sprint enquanto os arquivos de teste são criados tarefa a tarefa.

**Triple-slash reference `/// <reference types="vitest" />` no `vite.config.ts`**
Em vez de adicionar `"types": ["vitest/globals"]` ao `tsconfig.node.json` (que causou erro de diagnóstico antes da instalação), a referência foi colocada diretamente no arquivo de config — abordagem recomendada pela documentação do Vitest com Vite 5.

**Regex Unicode `\p{L}\p{N}` em vez da lista de caracteres do SPEC**
O SPEC sugeria `/[^a-záàâãéèêíïóôõúüçñ\s]/gi`. Substituído por `/[^\p{L}\p{N}\s]/gu` para cobrir qualquer caractere Unicode de letra ou número sem enumerar manualmente — mais robusto e sem risco de omitir acentos.

**Cálculo do teste de limite de 2048 caracteres corrigido**
O SPRINT estimava 512 repetições de `"word "`, mas `5 × 512 = 2559 > 2048`. Corrigido para 409 repetições (`5 × 409 = 2045`, trimEnd → 2044 chars).
