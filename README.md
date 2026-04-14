# Frequência de Palavras

Aplicação web client-side que analisa a frequência de palavras em um bloco de texto e exibe os resultados em uma tabela ordenada por frequência decrescente. Todo o processamento ocorre no browser — sem servidor, sem chamadas de rede.

---

## O que faz

Cole ou digite qualquer texto, clique em **Translate** e veja instantaneamente quantas vezes cada palavra aparece. A tabela é ordenada da palavra mais frequente para a menos frequente. Empates são resolvidos em ordem alfabética.

Comportamentos notáveis:
- Letras maiúsculas e minúsculas são tratadas como a mesma palavra (`"The"` e `"the"` → `"the"`)
- Pontuação é ignorada (`"olá,"` → `"olá"`)
- Acentos são preservados (`"maçã"` e `"MAÇÃ"` → `"maçã"`)
- Limite de 2048 caracteres por análise

---

## Stack

| Tecnologia | Versão | Por que |
|---|---|---|
| React | 18 | Reatividade declarativa para atualizar a tabela sob demanda |
| TypeScript | 5 | Tipagem dos dados intermediários (`WordEntry[]`) previne bugs silenciosos |
| Vite | 5 | HMR rápido, build estático sem configuração extra |
| CSS Modules | — | Isolamento de estilos sem overhead de biblioteca de UI |
| Vitest | 1 | Mesmo runner do Vite; cobertura 100% nos arquivos testáveis |
| React Testing Library | 14 | Testes orientados ao comportamento do usuário, não à implementação |

Sem bibliotecas de UI (MUI, Chakra, Tailwind, Bootstrap). Sem dependências de runtime além de React e React-DOM.

---

## Modelo de desenvolvimento

O projeto segue um fluxo orientado a tarefas (`T01`–`T10`) documentado no `CLAUDE.md`:

1. **Uma tarefa por commit** — cada commit tem responsabilidade única e mensagem semântica (`feat:`, `fix:`, `test:`, `style:`, `refactor:`, `docs:`, `chore:`)
2. **Lógica de negócio fora dos componentes** — toda análise de texto vive em `src/lib/`, nunca dentro de um componente React
3. **Testes antes de estilização** — cada componente tem testes passando antes de qualquer trabalho visual
4. **TypeScript estrito** — `any` é proibido; o tipo central `WordEntry { word: string; count: number }` é usado em todo o codebase
5. **CSS Modules** — sem estilos inline, sem `!important`, classes em `camelCase`
6. **Acessibilidade desde o início** — `role="alert"`, `aria-label`, contraste WCAG 2.1 AA em todos os elementos

### Arquitetura de componentes

```
App
├── TextInputSection
│   ├── textarea (nativo)
│   ├── CharCounter
│   └── TranslateButton
├── ErrorMessage
└── FrequencyTable
```

`App` orquestra o estado e o fluxo. Cada componente recebe props tipadas e não tem estado próprio além do que é estritamente seu.

### Estrutura de pastas

```
frequencia-palavras/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── TextInputSection/
│   │   ├── CharCounter/
│   │   ├── TranslateButton/
│   │   ├── ErrorMessage/
│   │   └── FrequencyTable/
│   ├── lib/
│   │   └── analyzeFrequency.ts   # lógica pura, sem dependência de UI
│   ├── App.tsx
│   ├── App.module.css
│   └── main.tsx
├── tests/
│   ├── analyzeFrequency.test.ts
│   ├── App.test.tsx
│   ├── FrequencyTable.test.tsx
│   └── ErrorMessage.test.tsx
├── CLAUDE.md   # instruções para o agente de IA
├── PRD.md      # o quê construir (requisitos)
└── SPEC.md     # como construir (arquitetura e edge cases)
```

---

## Como rodar

### Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior

### Instalação

```bash
git clone https://github.com/goperzin/frequencia-palavras.git
cd frequencia-palavras
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`.

### Build de produção

```bash
npm run build
```

O output estático fica em `dist/` e pode ser servido por qualquer CDN ou servidor de arquivos estáticos.

---

## Testes

```bash
# Todos os testes
npm run test

# Watch mode
npm run test -- --watch

# Arquivo específico
npm run test -- tests/analyzeFrequency.test.ts

# Com relatório de cobertura
npm run test -- --coverage
```

O projeto mantém **100% de cobertura** em todos os arquivos testáveis (`analyzeFrequency.ts` e todos os componentes).

---

## Documentação adicional

| Arquivo | Conteúdo |
|---|---|
| [PRD.md](PRD.md) | Requisitos funcionais e não-funcionais, público-alvo, métricas de sucesso, escopo v1 e v2 |
| [SPEC.md](SPEC.md) | Stack, arquitetura de componentes, estrutura de dados, edge cases e o que testar |
| [CLAUDE.md](CLAUDE.md) | Instruções para o agente de IA (convenções, restrições, estado atual do projeto) |
