# SPRINT 1 — Word Frequency

## Objetivo

Ao final desta sprint, a aplicação estará funcionando end-to-end no browser: o usuário digita um texto, clica em "Translate" e vê a tabela de frequência de palavras ordenada por frequência decrescente, com validação de campo vazio e contador de caracteres.

---

## MVP mínimo aceitável

- [ ] Projeto inicializado e rodando localmente (`npm run dev`)
- [ ] `analyzeFrequency` implementada, testada e cobrindo todos os edge cases do SPEC
- [ ] Todos os componentes renderizando corretamente
- [ ] Fluxo completo funcionando: entrada → análise → tabela
- [ ] Mensagem de erro ao submeter campo vazio
- [ ] Todos os testes passando (`npm run test`)
- [ ] Sem erros de TypeScript (`tsc --noEmit`)

---

## Tarefas

---

### [x] T01 — Inicializar projeto com Vite + React + TypeScript

**O que fazer:**
Executar `npm create vite@latest . -- --template react-ts` na raiz do repositório. Instalar dependências de dev de teste: `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom`. Configurar `vite.config.ts` com o plugin de teste (environment `jsdom`, globals `true`, setupFiles apontando para um `tests/setup.ts` que importa `@testing-library/jest-dom`). Remover arquivos de boilerplate do Vite (`App.css`, `assets/react.svg`, conteúdo padrão de `App.tsx`).

**Critério de aceite:**
- `npm run dev` sobe sem erros
- `npm run test` executa sem erros (zero testes ainda é aceitável)
- `npx tsc --noEmit` retorna sem erros

**Teste esperado:** N/A (setup)

**Estimativa:** M

**Bloqueante:** Sim — todas as demais tarefas dependem desta

---

### [x] T02 — Implementar `analyzeFrequency` (lógica pura)

**O que fazer:**
Criar `src/lib/analyzeFrequency.ts`. Exportar a função `analyzeFrequency(text: string): WordEntry[]` e o tipo `WordEntry { word: string; count: number }`. Pipeline: lowercase → substituir pontuação por espaço (`/[^\p{L}\p{N}\s]/gu`) → split por whitespace → filter tokens vazios → contar via `Map<string, number>` → converter para array → ordenar por count DESC com desempate alfabético ASC.

**Critério de aceite:**
- Todos os testes de `tests/analyzeFrequency.test.ts` passando
- A função não importa nada de React ou do DOM

**Teste esperado:**
- String vazia → `[]`
- String só com espaços → `[]`
- String só com pontuação → `[]`
- `"hello hello world"` → `[{ word: "hello", count: 2 }, { word: "world", count: 1 }]`
- `"Hello HELLO"` → `[{ word: "hello", count: 2 }]`
- `"hi, hi!"` → `[{ word: "hi", count: 2 }]`
- Empate de count → ordem alfabética ASC
- Acentos preservados: `"maçã MAÇÃ"` → `[{ word: "maçã", count: 2 }]`
- Quebras de linha tratadas como separadores

**Estimativa:** M

**Bloqueante:** Sim — `App.tsx` depende desta função

---

### [x] T03 — Criar componente `ErrorMessage`

**O que fazer:**
Criar `src/components/ErrorMessage/ErrorMessage.tsx` e `ErrorMessage.module.css`. Props: `interface ErrorMessageProps { message: string | null }`. Quando `message` é `null`, retornar `null`. Quando há mensagem, renderizar um `<p role="alert">` com o texto. Estilizar com cor de erro (vermelho acessível, contraste WCAG AA).

**Critério de aceite:**
- Testes de `tests/ErrorMessage.test.tsx` passando
- Elemento possui `role="alert"` quando visível
- Retorna `null` quando `message` é `null`

**Teste esperado:**
- `message={null}` → nada renderizado no DOM
- `message="erro"` → elemento com texto "erro" e `role="alert"` presente

**Estimativa:** P

**Bloqueante:** Não

---

### [x] T04 — Criar componente `CharCounter`

**O que fazer:**
Criar `src/components/CharCounter/CharCounter.tsx` e `CharCounter.module.css`. Props: `interface CharCounterProps { current: number; max: number }`. Renderizar `{current} / {max}`. Aplicar classe CSS de aviso quando `current >= max * 0.8` e classe de perigo quando `current >= max * 0.95`. Usar `aria-live="polite"` para acessibilidade.

**Critério de aceite:**
- Renderiza `"0 / 2048"` quando `current=0, max=2048`
- Renderiza `"1024 / 2048"` quando `current=1024`
- Classe CSS muda nos thresholds corretos (80% e 95%)

**Teste esperado:**
- `current=0` → texto "0 / 2048"
- `current=1639` (80% de 2048) → elemento tem classe de aviso
- `current=1946` (95% de 2048) → elemento tem classe de perigo

**Estimativa:** P

**Bloqueante:** Não

---

### [x] T05 — Criar componente `TranslateButton`

**O que fazer:**
Criar `src/components/TranslateButton/TranslateButton.tsx` e `TranslateButton.module.css`. Props: `interface TranslateButtonProps { onClick: () => void }`. Renderizar `<button type="button">` com texto "Translate". Incluir `aria-label="Analisar frequência de palavras"`.

**Critério de aceite:**
- Renderiza um `<button>` com texto "Translate"
- Chama `onClick` ao ser clicado
- Acessível via teclado (Enter e Space)

**Teste esperado:**
- Click → `onClick` chamado exatamente 1 vez
- Sem click → `onClick` não chamado

**Estimativa:** P

**Bloqueante:** Não

---

### [x] T06 — Criar componente `TextInputSection`

**O que fazer:**
Criar `src/components/TextInputSection/TextInputSection.tsx` e `TextInputSection.module.css`. Props: `interface TextInputSectionProps { value: string; onChange: (text: string) => void; onSubmit: () => void; maxLength: number }`. Renderizar: `<label>` + `<textarea>` com `maxLength`, `aria-label="Texto para análise"`, `rows={10}`; `<CharCounter current={value.length} max={maxLength} />`; `<TranslateButton onClick={onSubmit} />`.

**Critério de aceite:**
- Textarea tem `maxLength={2048}` aplicado
- Digitação chama `onChange` com o novo valor
- CharCounter exibe contagem atual
- Botão presente e funcional

**Teste esperado:**
- Digitar texto → `onChange` chamado com valor atualizado
- `value.length` refletido no CharCounter
- Clicar "Translate" → `onSubmit` chamado

**Estimativa:** M

**Bloqueante:** Sim — `App.tsx` monta este componente

---

### [x] T07 — Criar componente `FrequencyTable`

**O que fazer:**
Criar `src/components/FrequencyTable/FrequencyTable.tsx` e `FrequencyTable.module.css`. Props: `interface FrequencyTableProps { entries: WordEntry[] | null }`. Quando `entries` é `null`, retornar `null`. Quando `entries` é array (mesmo vazio), renderizar `<table>` com `<thead>` (colunas: "Palavra", "Frequência") e `<tbody>` com uma `<tr>` por entry. Envolver em `<div>` com `overflow-x: auto` para responsividade.

**Critério de aceite:**
- Testes de `tests/FrequencyTable.test.tsx` passando
- `entries={null}` → nada no DOM
- `entries={[]}` → tabela com cabeçalho e tbody vazio
- Cada entry gera uma `<tr>` com `<td>` de word e count

**Teste esperado:**
- `entries={null}` → tabela ausente
- `entries={[{ word: "hello", count: 3 }]}` → linha com "hello" e "3"
- Ordem das linhas respeita a ordem do array recebido

**Estimativa:** M

**Bloqueante:** Não

---

### T08 — Montar `App.tsx` com estado e fluxo completo

**O que fazer:**
Implementar `App.tsx` com os estados: `inputText: string`, `entries: WordEntry[] | null`, `error: string | null`. Implementar `handleAnalyze`: se `inputText.trim()` vazio → `setError("Digite um texto para analisar.")` e retornar; executar `analyzeFrequency(inputText)`; se resultado for array vazio → `setError("Nenhuma palavra encontrada no texto.")` e retornar; caso contrário `setEntries(resultado)` e `setError(null)`. Montar os componentes: `<TextInputSection>`, `<ErrorMessage>`, `<FrequencyTable>`. Importar e aplicar `App.module.css` com layout centralizado responsivo (max-width 800px, padding lateral).

**Critério de aceite:**
- Testes de `tests/App.test.tsx` passando
- Fluxo completo funcionando no browser
- Erro exibido ao submeter vazio
- Tabela exibida ao submeter texto válido
- Re-análise substitui resultado anterior

**Teste esperado:**
- Carregamento → tabela ausente, erro ausente
- Submit vazio → erro "Digite um texto para analisar." com `role="alert"`
- Submit com texto válido → tabela visível, erro ausente
- Submit com só pontuação → erro "Nenhuma palavra encontrada no texto."
- Submit com novo texto após resultado → tabela atualizada

**Estimativa:** G

**Bloqueante:** Sim — é a integração final

---

### T09 — Estilização responsiva e acessibilidade

**O que fazer:**
Revisar todos os CSS Modules e garantir: layout funcional em 320px (mobile); tabela com scroll horizontal (`overflow-x: auto` no wrapper); foco visível em todos os elementos interativos (`:focus-visible` com outline); contraste de texto ≥ 4.5:1 em todos os elementos de texto; `<label>` associado ao textarea via `htmlFor`/`id`. Testar redimensionando a janela do browser.

**Critério de aceite:**
- Layout utilizável em viewport de 320px sem overflow horizontal na página
- Elementos focáveis têm indicador de foco visível
- Nenhum texto com contraste abaixo de 4.5:1

**Teste esperado:** Verificação visual + inspeção manual com DevTools (Accessibility panel)

**Estimativa:** M

**Bloqueante:** Não

---

### T10 — Revisão final: TypeScript e testes

**O que fazer:**
Executar `npx tsc --noEmit` e corrigir todos os erros. Executar `npm run test` e garantir que todos os testes passam. Verificar cobertura mínima: `analyzeFrequency` 100%, componentes principais ≥ 80%.

**Critério de aceite:**
- `npx tsc --noEmit` retorna código 0
- `npm run test` retorna verde com zero falhas
- Nenhum `any` no codebase

**Teste esperado:** N/A (validação)

**Estimativa:** P

**Bloqueante:** Não

---

## Ordem de execução recomendada

```
T01 → T02 → T03
           → T04
           → T05
           → T06 (depende de T04, T05)
           → T07
           → T08 (depende de T02, T03, T06, T07)
           → T09
           → T10
```

## Atualizar estado no CLAUDE.md

Após concluir cada tarefa, atualizar a seção "Estado atual" do `CLAUDE.md` com a última tarefa concluída.
