# SPEC — Word Frequency

## Stack recomendada

| Camada | Escolha | Justificativa |
|---|---|---|
| Framework UI | **React 18** (Vite) | Reatividade declarativa adequada para atualizar tabela sob demanda; Vite entrega HMR rápido e build otimizado sem configuração extra |
| Linguagem | **TypeScript** | Tipagem dos dados intermediários (`WordEntry[]`) previne bugs silenciosos na lógica de contagem |
| Estilização | **CSS Modules** | Isolamento de estilos sem overhead de biblioteca; suficiente para a escala do projeto |
| Testes | **Vitest + React Testing Library** | Mesmo runner do Vite; RTL garante testes orientados ao comportamento do usuário, não à implementação |
| Build / tooling | **Vite** | Zero-config, compatível com TypeScript + React, saída estática sem servidor |

Sem dependências de UI externa (ex: MUI, Chakra) — o projeto é pequeno o suficiente para CSS próprio e evita bundle desnecessário.

---

## Arquitetura de componentes

```
App
├── TextInputSection
│   ├── textarea (nativo)
│   ├── CharCounter
│   └── TranslateButton
├── ErrorMessage
└── FrequencyTable
```

### `App`
**Responsabilidade:** Orquestra estado global e fluxo de dados entre input e output.

| | Tipo | Descrição |
|---|---|---|
| Estado `inputText` | `string` | Texto digitado pelo usuário |
| Estado `entries` | `WordEntry[] \| null` | Resultado da análise; `null` = análise ainda não executada |
| Estado `error` | `string \| null` | Mensagem de erro atual |
| Função `handleAnalyze` | `() => void` | Valida input, executa `analyzeFrequency`, atualiza `entries` ou `error` |

---

### `TextInputSection`
**Responsabilidade:** Captura o texto do usuário e dispara a análise.

| Input (props) | Tipo | Descrição |
|---|---|---|
| `value` | `string` | Valor atual do textarea |
| `maxLength` | `number` | Constante `2048` |
| `onChange` | `(text: string) => void` | Atualiza `inputText` no `App` |
| `onSubmit` | `() => void` | Chama `handleAnalyze` no `App` |

---

### `CharCounter`
**Responsabilidade:** Exibe `{atual} / {máximo}` e sinaliza visualmente quando próximo do limite.

| Input (props) | Tipo | Descrição |
|---|---|---|
| `current` | `number` | `inputText.length` |
| `max` | `number` | `2048` |

Regra visual: cor muda para amarelo em ≥ 80% (`1639`) e vermelho em ≥ 95% (`1946`).

---

### `TranslateButton`
**Responsabilidade:** Botão de submit; sem estado próprio.

| Input (props) | Tipo | Descrição |
|---|---|---|
| `onClick` | `() => void` | Chama `onSubmit` do pai |
| `disabled` | `boolean` | `false` na v1 (validação ocorre no `App`) |

---

### `ErrorMessage`
**Responsabilidade:** Renderiza mensagem de erro acessível; retorna `null` quando `error` é `null`.

| Input (props) | Tipo | Descrição |
|---|---|---|
| `message` | `string \| null` | Texto do erro |

Deve renderizar com `role="alert"` para anúncio automático por leitores de tela.

---

### `FrequencyTable`
**Responsabilidade:** Renderiza a tabela de resultados; retorna `null` quando `entries` é `null`.

| Input (props) | Tipo | Descrição |
|---|---|---|
| `entries` | `WordEntry[] \| null` | Lista ordenada de `{ word, count }` |

Colunas: **Palavra** | **Frequência**. Wrapper com `overflow-x: auto` para responsividade.

---

## Estrutura de dados

### Tipo central

```ts
interface WordEntry {
  word: string;   // palavra normalizada (lowercase, sem pontuação)
  count: number;  // número de ocorrências
}
```

### Função de análise (pura, sem efeitos colaterais)

```ts
// src/lib/analyzeFrequency.ts
function analyzeFrequency(text: string): WordEntry[]
```

**Pipeline interno:**

```
text (string)
  → lowercase
  → substituição de pontuação por espaço: /[^a-záàâãéèêíïóôõúüçñ\s]/gi → ' '
  → split por espaço/whitespace: /\s+/
  → filter tokens vazios ('')
  → reduce para Map<string, number>
  → Array.from(map.entries()) → WordEntry[]
  → sort por count DESC (empate: ordem alfabética ASC)
```

**Fluxo completo no App:**

```
inputText (estado)
  → [clique em Translate]
  → validação: se vazio → setError('...') e retorna
  → analyzeFrequency(inputText) → WordEntry[]
  → setEntries(resultado)
  → setError(null)
```

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
│   │   └── analyzeFrequency.ts      # lógica pura, sem dependência de UI
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

---

## Edge cases e tratamentos

| Edge case | Comportamento esperado |
|---|---|
| Campo vazio (string vazia ou só espaços) | `handleAnalyze` exibe erro: `"Digite um texto para analisar."` e não atualiza `entries` |
| Texto com apenas pontuação (`"!!! ??? ---"`) | Após normalização, nenhum token restante → exibir erro: `"Nenhuma palavra encontrada no texto."` |
| Texto com apenas números (`"123 456"`) | Números são tratados como palavras válidas (não há restrição no PRD); aparecem na tabela normalmente |
| Palavras com hífen (`"guarda-chuva"`) | Hífen é substituído por espaço → contado como duas palavras: `"guarda"` e `"chuva"`. Comportamento aceitável na v1 |
| Apóstrofos (`"don't"`, `"it's"`) | Apóstrofo removido → `"dont"`, `"its"`. Comportamento aceitável na v1 |
| Texto no limite exato de 2048 caracteres | Aceito normalmente; `maxLength` no textarea impede entradas maiores |
| Caracteres especiais / Unicode (acentos) | Acentos preservados na normalização; `"maçã"` e `"MAÇÃ"` → contados como `"maçã"` |
| Empate de frequência entre palavras | Ordenação secundária alfabética crescente para resultado determinístico |
| Texto com quebras de linha | `\n` e `\r\n` tratados como whitespace pelo split → comportamento correto |
| Re-análise após resultado existente | Nova chamada a `handleAnalyze` substitui `entries` anterior; `error` é limpo |

---

## O que deve ser testado

### `analyzeFrequency` (unit tests — `tests/analyzeFrequency.test.ts`)

- Retorna array vazio para string vazia
- Retorna array vazio para string com apenas espaços
- Retorna array vazio para string com apenas pontuação
- Conta corretamente palavras em um texto simples
- Normaliza case (`"Hello"` e `"hello"` → count `2` para `"hello"`)
- Remove pontuação acoplada à palavra (`"hello,"` → `"hello"`)
- Ordena por frequência decrescente
- Desempate alfabético crescente quando frequências são iguais
- Preserva acentuação (`"maçã"` permanece `"maçã"`)
- Trata quebras de linha como separadores de palavras
- Texto no limite de 2048 caracteres retorna resultado sem erro

### `App` — integração (unit/integration tests — `tests/App.test.tsx`)

- Renderiza textarea, botão e sem tabela ao carregar
- Clicar em "Translate" com campo vazio exibe mensagem de erro
- Mensagem de erro tem `role="alert"`
- Clicar em "Translate" com texto válido exibe a tabela e remove o erro
- Re-análise com novo texto substitui resultado anterior
- CharCounter exibe `0 / 2048` ao iniciar e atualiza conforme digitação

### `FrequencyTable` (unit tests — `tests/FrequencyTable.test.tsx`)

- Não renderiza nada quando `entries` é `null`
- Renderiza cabeçalhos "Palavra" e "Frequência"
- Renderiza uma linha por entry com word e count corretos
- Mantém ordem recebida (ordenação é responsabilidade de `analyzeFrequency`)

### `ErrorMessage` (unit tests — `tests/ErrorMessage.test.tsx`)

- Não renderiza nada quando `message` é `null`
- Renderiza o texto da mensagem quando fornecido
- Possui `role="alert"` no elemento raiz

---

## Dependências

### Produção

Nenhuma dependência de runtime além do React.

```json
{
  "react": "^18",
  "react-dom": "^18"
}
```

### Desenvolvimento

```json
{
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "@vitejs/plugin-react": "^4",
  "@testing-library/react": "^14",
  "@testing-library/user-event": "^14",
  "@testing-library/jest-dom": "^6",
  "typescript": "^5",
  "vite": "^5",
  "vitest": "^1",
  "jsdom": "^24"
}
```

### APIs externas

Nenhuma na v1. Todo o processamento ocorre no cliente.
