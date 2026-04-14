# PRD — Word Frequency

## Problema que resolve

Analisar manualmente a frequência de palavras em um bloco de texto é tedioso e sujeito a erro humano. Ferramentas automatizadas para isso são úteis em casos como análise semântica, otimização de conteúdo, estudos linguísticos e preparação de dados para algoritmos de busca e ordenação.

---

## Objetivo

Oferecer uma interface web simples onde o usuário cola ou digita um texto e obtém, instantaneamente, uma tabela ordenada com cada palavra única e sua frequência de aparição.

---

## Público-alvo

- Estudantes e pesquisadores que precisam de análise textual básica
- Desenvolvedores explorando algoritmos de NLP / bag-of-words
- Redatores e criadores de conteúdo que querem identificar repetições excessivas

---

## Métricas de sucesso

| Métrica | Meta v1 |
|---|---|
| Usuário consegue obter a tabela de frequência sem instrução adicional | 100% das sessões de teste de usabilidade |
| Tempo entre clicar em "Translate" e ver a tabela preenchida | < 300 ms para textos até 2048 caracteres |
| Taxa de erro inesperado (crash / resultado incorreto) | 0% em testes funcionais |
| Exibição de mensagem de erro ao submeter campo vazio | Presente em 100% dos casos |

---

## Requisitos funcionais

### Interface

- Usuário pode ver uma área de entrada de texto (textarea), um botão "Translate" e uma tabela de frequência de palavras na mesma tela.
- Usuário pode digitar ou colar texto livremente na área de entrada, com limite de 2048 caracteres.
- Usuário pode ver um contador ou indicação visual do limite de caracteres (ex: "1024 / 2048").

### Análise

- Usuário pode clicar no botão "Translate" para disparar a análise de frequência do texto inserido.
- Usuário pode ver uma mensagem de erro clara caso clique em "Translate" com o campo de texto vazio.
- Usuário pode ver a tabela de resultados preenchida após clicar em "Translate", contendo duas colunas: **Palavra** e **Frequência**.
- Usuário pode ver a tabela ordenada em ordem decrescente de frequência (palavras mais frequentes no topo).
- Usuário pode ver palavras tratadas sem distinção de maiúsculas/minúsculas (ex: "The" e "the" contam como a mesma palavra).
- Usuário pode ver pontuação ignorada na contagem (vírgulas, pontos, etc. não fazem parte das palavras).

---

## Requisitos não-funcionais

### Performance
- A análise e renderização da tabela deve ocorrer em menos de 300 ms para textos de até 2048 caracteres, processada inteiramente no cliente (sem chamadas de rede).

### Acessibilidade
- Todos os elementos interativos devem ser acessíveis via teclado.
- Textarea e botão devem ter `label` ou `aria-label` descritivos.
- Mensagens de erro devem ser anunciadas por leitores de tela (`role="alert"` ou equivalente).
- Contraste de texto e fundo deve seguir WCAG 2.1 nível AA.

### Responsividade
- Layout deve ser utilizável em telas a partir de 320px de largura (mobile) até desktop.
- Tabela deve ter scroll horizontal em telas pequenas se necessário.

### Compatibilidade
- Deve funcionar nos navegadores modernos: Chrome, Firefox, Safari e Edge (últimas 2 versões).

---

## Fora do escopo da v1

- Análise de URLs ou páginas externas
- Gráficos ou visualizações da frequência
- Exportação dos resultados (CSV, JSON, etc.)
- Suporte a múltiplos idiomas com remoção de stopwords
- Histórico de análises anteriores
- Autenticação ou persistência de dados

---

## Bonus / v2

- **Visualização gráfica:** Usuário pode alternar entre a tabela e um gráfico de bolhas (*bubble chart*), barras ou nuvem de palavras representando a frequência visualmente.
- **Análise por URL:** Usuário pode inserir a URL de uma página web no lugar do texto e obter a análise de frequência do conteúdo textual dessa página.
