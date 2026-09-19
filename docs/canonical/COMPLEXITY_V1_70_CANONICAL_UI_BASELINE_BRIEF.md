# COMPLEXITY V1.70 — CANONICAL UI BASELINE

## Implementation Brief (para execução por outro agente/modelo)

**Companion document de:** `COMPLEXITY_V1_70_IMPLEMENTATION_BRIEF_REVISION_B.md` (Foundation, fases, Canonical/Projection/Suggestion, Decision Protocol — continua valendo integralmente e não é repetido aqui além do essencial).

**O que este documento é:** a especificação do **shell canônico real** da Complexity — a superfície permanente dentro da qual os Vertical Slices seguintes serão implementados. Não é uma proposta para eu aprovar depois; é para ser executado diretamente por quem tiver acesso ao repositório real do projeto.

**O que este documento não é:** não é código. A reconciliação de domínio (mockup vs. Foundation) já foi feita abaixo — o que falta é a reconciliação contra o código/projeto real existente, que só quem tem acesso ao repositório pode fazer.

---

## 0. Reconciliação

### 0.1 — O que já existe (conhecido por histórico, não por inspeção direta do repositório)

Este documento **não teve acesso ao código-fonte atual do projeto** — não há como inspecionar arquivos, componentes ou estrutura de pastas reais a partir daqui. O que se sabe vem do histórico do próprio Tabuleiro/Complexity já registrado:

- Uma "v1 canônica única" já foi construída e publicada (Fontes | Reader | Objetos | Campo, 5 tipos, genealogia múltipla, lifecycle completo, persistência via localStorage).
- Antes dela, um scaffold mais recente existiu com testes automatizados (Campo com ~70 testes, um scaffold com 7 testes), e duas implementações de Reader real chegaram a funcionar (scroll/zoom independentes, highlight persistido clicável).
- Múltiplas rodadas de handoff para execução externa já aconteceram, com avaliação de que a base funcional estava mais madura que a UX, e que a interface era considerada visualmente abaixo do nível desejado.

**Instrução para o executor:** a inspeção real da árvore de arquivos (seção 1 do pedido original) precisa acontecer no ambiente onde o repositório existe de fato. Antes de escrever qualquer arquivo novo, o executor deve:
1. Listar a estrutura atual do projeto.
2. Identificar Product Shell, workspace, Field/canvas, Reader, panels e componentes reaproveitáveis.
3. Identificar implementações antigas/duplicadas (possíveis resquícios de Lab/protótipos anteriores) que **não** devem virar a nova base.
4. Só então prosseguir para a implementação abaixo — reaproveitando o que for real e descartando o que for resquício de prototipagem, nunca os dois ao mesmo tempo no mesmo shell.

### 0.2 — Reconciliação de domínio: mockup × Foundation (feita aqui, vale para o executor usar diretamente)

Dois mockups já foram confrontados contra a Foundation validada (`migration_001.sql`, `invariant_tests.sql`) e contra o `IMPLEMENTATION_BRIEF_REVISION_B.md`. Resultado:

| Elemento do mockup | Classificação | Tratamento no UI Baseline |
|---|---|---|
| Nós "Concept" no Knowledge Map (Human Attention, Cognitive Control, Neural Mechanisms...) | **Domain Extension Candidate** — não é `objects.kind` hoje | Renderizar apenas via dev fixture explícita, nunca gravado como Knowledge Object real |
| Legenda "Node types": Concept, Paper, Question, Method, Artifact | **Parcial.** Paper ≈ Source (já existe); Question ≈ `kind='question'` (já existe); Concept, Method, Artifact = **Domain Extension Candidates** | Question e Paper usam o domínio real quando fixture representar objetos reais; os outros três só existem como categoria visual de fixture |
| Legenda "Relation types": Supports, Contradicts, Builds on, Relates to, Influences | `Supports`/`Contradicts` já existem. `Builds on`/`Relates to`/`Influences` são **rótulos de apresentação**, não `relation_type` novo | Usar a mesma função de mapeamento presentacional já prevista na Revision B (Decisão Pendente #1) — nunca gravar esses rótulos como `relation_type` |
| Botões "Add note" / "Extract as object" / "Ask about this" no painel Details | `Extract as object` mapeia diretamente para `deriveObject`/`createIntellectualObject` já existentes — é literalmente o gesto central do próximo Vertical Slice. `Add note` é **Domain Extension Candidate** (não há Note no schema). `Ask about this` pré-carrega o objeto selecionado no ContextBundle e abre o AI Composer | `Extract as object` deve ficar posicionado com destaque (é o próximo passo real do produto), mas nesta rodada dispara apenas a interação visual/fixture, sem chamar Commands ainda. `Add note` fica visível mas desabilitado/"Coming later" |
| Painel "AI ASSISTANT" com `Model: Sonnet 3.5`, chips "Explain simply / Find related work / Compare views", botão "Write artifact" | AI Composer já previsto na Revision B (P0.5). Chips são atalhos de prompt — puramente de apresentação nesta rodada. `Write artifact` está diretamente ligado a Composition | Chips e composer ficam posicionados e clicáveis visualmente, sem chamar providers reais. `Write artifact` fica explicitamente desabilitado com indicação "Coming later" (Composition não existe no core ainda — Revision B, seção 13) |
| "Synthesis" no Research Lineage (nó "Attention as Adaptive Coordination") | Confirmado anteriormente: isso é Composition, não `Record` | Placeholder visual explícito no fim da cadeia de lineage, nunca um objeto canônico real |
| Tags no painel Details | Sem schema | Vazio/oculto até decisão (Decisão Pendente #2, Revision B) |
| Clima/hora/Spotify no topo | Decoração pura | Pequenos slots ambientais mock, desacoplados de qualquer domínio, sem integração real |

**Nenhum item acima exige tocar `migration_001.sql`, `objects.kind` ou `relation_type`.** Isso confirma o que a Revision B já havia estabelecido: o mockup é referência visual, não schema.

### 0.3 — Novos Domain Extension Candidates identificados nesta rodada (registrar em `DECISIONS_PENDING.md`, não implementar)

- `Concept` como possível `objects.kind` futuro, ou possivelmente uma Projection calculada (clustering semântico) em vez de tipo persistido — decisão em aberto, não resolver agora.
- `Method` como possível `objects.kind` futuro.
- `Artifact`/Composition como entidade própria (já rastreado desde a Revision B, seção 13).
- `Note` como possível mecanismo leve (pode acabar não precisando de tipo novo — uma Note poderia, no futuro, ser modelada como `kind='record'` com uma marcação de apresentação; isso é uma hipótese razoável, não uma decisão).
- Vocabulário de relação mais rico (`builds_on`, `relates_to`, `influences`) — permanece como candidato de apresentação até haver evidência de que precisa virar `relation_type` real.

Nenhum desses bloqueia o UI Baseline. Todos ficam visíveis na interface quando fizer sentido, sempre como fixture/placeholder claramente identificado como tal.

---

## 1. Princípio central desta rodada

O mockup é a referência principal para: composição da tela, hierarquia, densidade, escala de controles, proporções, atmosfera, organização dos painéis, sensação de software real, relação Field/Reader/Inspector/Lineage, posição do AI composer, presença discreta de elementos ambientais.

Ele **não define automaticamente**: schema, novos `objects.kind`, novos `relation_type`, entidades persistentes, semântica de tags, semantic clusters, Composition.

**Regra:** preserve a intenção visual; não invente semântica de domínio para justificá-la. Ao mesmo tempo: não remova da interface uma boa capacidade só porque o schema ainda não a implementa — vire placeholder/future capability, disabled/inert quando necessário, documentado, sem improvisar persistência.

---

## 2. Foundation continua autoritativa (recapitulação mínima)

Não modificar nesta rodada — `objects.kind`: `evidence`, `question`, `proposition`, `record`. `relation_type`: `derived_into`, `supports`, `contradicts`, `associated_with`. Não criar silenciosamente `concept`, `method`, `artifact`/`composition`, `ai_response` como kind novo; não criar tags no banco; não criar novas `relation_type`. Ver seção 0.3 acima para onde essas ideias ficam registradas sem virar schema.

Foundation é autoritativa sobre o que já define — isso não é uma declaração de que o produto jamais poderá crescer. Qualquer extensão real passa pelo mesmo rigor de auditoria já usado para FD-001 a FD-004.

---

## 3. Objetivo desta rodada

Abrir a aplicação e já ver a **Complexity**, não uma etapa intermediária. O shell deve conter, visualmente, desde já:

- **LEFT** — Product navigation / Spaces / Sources
- **CENTER-LEFT** — Field / Knowledge surface
- **CENTER** — Reader
- **RIGHT** — Inspector / Details / AI
- **BOTTOM** — Research Lineage
- **TOP** — workspace context, search, ambient/system controls, settings/profile

Mesmo que algumas funções ainda sejam placeholders, deve ser possível olhar para a aplicação e entender onde cada capacidade futura vai morar.

---

## 4. Layout geral

```
┌──────────────────────────────────────────────────────────────┐
│ Sidebar │              Top Product Bar                       │
│         ├─────────────┬────────────────┬─────────────────────┤
│         │             │                │                     │
│         │ FIELD /     │ READER         │ INSPECTOR           │
│         │ KNOWLEDGE   │                │                     │
│         │ SURFACE     │                │                     │
│         │             │                │                     │
│         ├─────────────┴────────────────┴─────────────────────┤
│         │ RESEARCH LINEAGE                                   │
└─────────┴─────────────────────────────────────────────────────┘
```

Não copiar medidas do mockup cegamente. Buscar: mais respiro; melhor alinhamento; UI pequena e profissional; alta densidade de informação sem claustrofobia; painel central (Reader) dominante; Inspector estreito mas útil; Lineage baixa, podendo expandir.

---

## 5. Direção visual

- Fundo charcoal/neutro — **não deixar a interface azulada**.
- Superfícies discretamente separadas, chrome reduzido, bordas finas, transparência controlada.
- Contraste suficiente para leitura.
- Purple e orange como acentos; pequenos highlights cromados só onde agregam; glows sutis.
- Evitar: neon exagerado, aparência gamer, glassmorphism excessivo, cards enormes.
- Tipografia pequena mas confortável; ícones menores; mais espaço vazio.
- Visual sofisticado de software profissional — **o conteúdo vence a decoração**.
- Atmosfera existe ao redor do Field, nos fundos, nas áreas vazias, em halos/projeções futuras — nunca atrás de texto crítico.

**Não fazer design genericamente "bonito":** não é dashboard SaaS genérico, não é shadcn default, não é clone de Notion, não são cards brancos em grid, não é sidebar azul, não é gradient purple gigante, não é cyberpunk, não é glassmorphism, não é o grafo padrão default do React Flow sem estilização. O resultado precisa ser reconhecível como uma implementação **daquela** direção visual específica, só que refinada: melhor respiro, menos ruído, controles menores, alinhamento melhor, hierarquia mais forte, comportamento real de software.

---

## 6. Sidebar

Compacta, collapsible, visualmente leve, estado open/collapsed persistido localmente.

Conteúdo mínimo: nome "Complexity", Workspace atual, Sources, Spaces (itens de exemplo só se vierem de fixture de desenvolvimento claramente isolada — nunca hardcoded como produto real).

Capacidades futuras do mockup (Explore, Synthesize, Map, Artifacts) podem aparecer discretamente, mas: sem implementações independentes agora; se exibidas, devem parecer futuras/indisponíveis; sem rotas falsas; sem módulos duplicados; tooltip/status "Coming later" ou equivalente.

Incluir também "Settings" (rodapé ou top-level, conforme fizer sentido).

---

## 7. Settings — deve funcionar de verdade nesta rodada

Modal/sheet/panel real. Não precisa alterar schema. Pode persistir em `localStorage`.

- **General** — interface density (compact/comfortable); language placeholder; open panels preference.
- **Appearance** — theme (dark por enquanto); background intensity; ambient effects on/off; reduced motion; talvez panel translucency.
- **AI** — seletor visual de modelo preferido; provider placeholders; **não pedir/gravar API keys** enquanto a infraestrutura não existir.
- **Workspace** — placeholder para preferências futuras.
- **About** — "Complexity V1.70", versão atual.

Não transformar Settings em painel técnico enorme.

---

## 8. Top Product Bar

- **Left/center** — breadcrumb ou contexto de workspace; nome do Space atual.
- **Center** — campo de busca global: *"Search sources, concepts, questions, or ask..."* — pode ainda não executar busca real; Cmd/Ctrl+K foca nele.
- **Right** — indicador discreto de modelo de IA; settings; profile/account; controles ambientais.

Clima/hora/player de música podem existir como pequenos slots ambientais (fazem parte da direção visual), mas: sem integrações reais; sem ocupar espaço significativo; nunca um deles vira feature protagonista; claramente mock/placeholder desacoplado do domínio.

---

## 9. Field / Knowledge Surface

Esta é a superfície espacial canônica do produto (ver Revision B, seção 4 — Field é canônico, Knowledge Map é uma Projection dele). **Não criar uma segunda implementação paralela depois** — o que for construído aqui é o que continua.

Deve já suportar visualmente: pan; zoom; background/grid muito sutil; selection; drag de nodes de fixture; snapping geométrico básico (se simples); controles mínimos; fit view. `@xyflow/react` é a base já escolhida na Revision B.

Nós tipo "Human Attention", "Cognitive Control", "Neural Mechanisms" do mockup **não** significam criar `Concept` no schema agora (ver seção 0.3). Se precisar mostrar esse tipo de nó para reproduzir a intenção visual: usar explicitamente dev fixture, ou tratar como "projection node" — nunca gravar como Knowledge Object real.

A camada visual deve estar preparada para futuramente renderizar canonical object / source / concept / projection / suggestion sem assumir que todos pertencem à mesma tabela — **mas não implementar um "Entity Kernel" genérico agora**. Isso seria infraestrutura antes de necessidade demonstrada.

### Estados visuais de aresta (reconciliação de uma tensão introduzida nesta rodada)

O pedido original lista quatro estados de aresta — isso não contradiz a Revision B, apenas refina visualmente a fronteira Canonical/Projection/Suggestion já estabelecida:

- **Canonical Relation** (sólida/estável) — qualquer linha de `relations` ativa (`derived_into`, `supports`, `contradicts`, `associated_with`), em qualquer modo de visualização.
- **Trajectory** (distinta de relation comum) — o mesmo `derived_into`, mas com tratamento visual específico quando renderizado no modo Lineage, enfatizando direção genealógica.
- **Projection** (suave/dashed/baixo contraste) — conexão calculada que não corresponde a uma linha específica de `relations` (ex.: agrupamento de layout, futura similaridade semântica).
- **Suggestion** (ainda mais leve/temporária) — uma possível relação sugerida por IA, ainda não aceita — nunca deve se misturar visualmente com uma Canonical Relation real.

Não é preciso fechar o design definitivo agora, mas evitar que todas as arestas fiquem visualmente iguais — isso já destruiria a distinção que a seção 3 da Revision B exige.

Evitar poluição gráfica: posição espacial não é relação semântica, e nem tudo precisa estar conectado por linha.

---

## 10. Reader

Posicionado como peça central do produto. Nesta rodada pode: abrir/fechar; maximizar/minimizar; navegar visualmente; ter toolbar; usar placeholder de PDF real ou fixture; permitir UI de seleção se a infraestrutura já existir.

Não é obrigatório terminar `captureEvidence` nesta rodada — mas o layout precisa deixar claro onde vão aparecer: seleção; Evidence capture; citação de fonte; informação de página.

Toolbar possível: navegação de página; zoom; fit; placeholder de "compare"; fechar.

O Reader compartilha a mesma janela/superfície do produto — nunca um popup externo ou outra aplicação.

---

## 11. Inspector / Details

Região direita do mockup — preservar. Tabs navegáveis localmente: **Details, Insights, Notes, Citations, Chat** (níveis de completude podem variar; Details precisa funcionar visualmente de verdade).

Quando um nó de fixture é selecionado no Field, o Inspector reage e troca o item mostrado. Conteúdo de Details:

- **TYPE / TITLE / CONTENT-SUMMARY**
- **ORIGIN** — Source/página quando disponível
- **RELATIONS** — relações canônicas ativas
- **CONCEPTS/TAGS** — se ainda não implementado, sem fingir persistência: aparece só em fixture/dev state, ou fica como placeholder vazio
- **RELATED** — quando for projeção/sugestão, visualmente diferente das relações canônicas (ver estados de aresta, seção 9)

Ações inline observadas no mockup mais recente e seu tratamento:
- **"Extract as object"** — visualmente destacado (é o gesto central do próximo Vertical Slice), mas nesta rodada dispara apenas a interação de UI, sem chamar `deriveObject` de verdade ainda.
- **"Add note"** — visível, mas desabilitado/placeholder ("Coming later") — Note é Domain Extension Candidate (seção 0.3).
- **"Ask about this"** — pré-carrega o objeto selecionado no ContextBundle e abre/foca o AI Composer.

---

## 12. AI Panel / Composer

Já posicionado, fazendo parte da interface — mas ainda sem chamar modelos de verdade.

Visual de referência:
```
Ask Complexity...

[ + Context · N ]       [ Model ▾ ] [ Send ]
```

Seletor de modelo visual (Claude / GPT / Gemini, ou nomes genéricos). Chips de atalho como "Explain simply", "Find related work", "Compare views" ficam posicionados e clicáveis, mas sem lógica real por trás nesta rodada. Botão "Write artifact" fica **explicitamente desabilitado**, rotulado como "Coming later" — está diretamente ligado a Composition, que permanece fora do core (Revision B, seção 13).

Não implementar providers ainda. Não fingir resposta de IA processando. Se o usuário clicar em enviar sem provider configurado: mostrar estado claro, algo como *"AI provider not configured yet."*

Context selector pode abrir um popover pequeno mostrando fixtures como: Selected object, Current document, Current source range, Field — isso valida a UX do `ContextBundle` (Revision B, seção 12) sem exigir persistência.

---

## 13. Lineage

Região inferior, visualmente próxima ao mockup: collapsible; resizeable se razoável; cards compactos; direção temporal/genealógica clara; reage ao item selecionado no Field quando possível.

Pode usar fixture: `Source → Evidence → Question → Proposition`. **Não incluir Composition canônica ainda** — se quiser mostrar visualmente um nó futuro tipo "Synthesis", usar placeholder explícito, nunca um objeto real.

Lineage não deve virar página separada nesta rodada — é parte do workspace (Revision B, seção 9: "Lineage não é uma ilha").

---

## 14. Interações que já devem funcionar de verdade

Sidebar collapse; resize de painel onde fizer sentido; Reader abrir/fechar; tabs do Inspector; Lineage collapse/expand; Field pan/zoom; drag de nodes; seleção Field → Inspector; ESC fecha overlays/modal; Cmd/Ctrl+K foca a busca; Settings abre/fecha corretamente; ajuste de density realmente altera a densidade da UI; toggle de ambient effects realmente liga/desliga fundo/glow; tamanhos/preferências locais sobrevivem a reload via `localStorage`.

Nada disso precisa tocar o schema.

---

## 15. Responsividade / resize

Desktop-first — não gastar a rodada tentando mobile. Sidebar, Field, Reader, Inspector, Lineage devem respeitar resize sem quebrar: min-widths sensatos; overflow correto; texto nunca desaparece; painéis nunca se sobrepõem; cards nunca colidem com o chrome da UI.

---

## 16. Empty states

A aplicação vazia (fixtures desligadas) precisa continuar bonita e coerente:

- Field: *"Your field is empty."*
- Sources: *"No sources yet."*
- Reader: *"Open a source to start reading."*
- Inspector: *"Select something to inspect."*
- Lineage: *"Select an object to see its trajectory."*

---

## 17. Fixtures / mock data

Mock data serve só para validar layout. Regras: viver em `/fixtures`, `/dev` ou equivalente; fácil de desligar (ex.: `COMPLEXITY_DEV_FIXTURES=true` ou configuração local equivalente — não precisa ser env var se houver solução mais simples); nunca misturado com Commands reais; nunca cria registro fake no banco; nunca trata os nomes do mockup (Attention & Cognition, Human Attention, etc.) como produto real.

---

## 18. O que não fazer nesta rodada

Migration nova para Concept; tags persistentes; schema de Composition; provider de IA real; embeddings; busca semântica; clustering semântico real; provenance de atividade; grafo de citação; edição colaborativa; OCR; extração avançada de PDF; agentes autônomos; busca externa; fluxo completo de persistência; o Vertical Slice 01 completo. Também não redesenhar a Foundation atual.

---

## 19. Não ter medo de posicionar futuro na interface

Pode existir, na interface, uma região futura ainda não funcional (Explore, Synthesize, Artifacts, Concepts, Context, AI, controles semânticos). Três regras: não criar domínio fake; não criar outro sistema paralelo; deixar claro no código e/ou na UI que ainda é capability futura. O objetivo é descobrir *onde* essas coisas vivem, antes de decidir *como* todas elas persistem.

---

## 20. Relação com o próximo Vertical Slice

Este shell precisa estar pronto para receber, sem reescrita estrutural, o Vertical Slice 01:

```
PDF → Source → Reader → selection → captureEvidence → Evidence
  → Add to Field → move → reload → state preserved
```

Reader, Field, Inspector, Sidebar, Shell e o sistema de cards construídos agora **serão os mesmos** depois — não protótipos a substituir.

---

## 21. Componentização esperada (sugestão, não molde rígido)

```
ProductShell
  TopBar
  Sidebar

WorkspaceSurface
  FieldCanvas
  FieldToolbar
  ResearchObjectNode

ReaderPanel
  ReaderToolbar

InspectorPanel
  InspectorTabs

AiComposer
  ContextPopover
  ModelSelector

LineagePanel
  LineageCard

SettingsPanel
AmbientLayer
```

Não é obrigatório usar esses nomes exatos. Evitar abstrações prematuras — isso é orientação de organização, não arquitetura cerimonial.

---

## 22. Critério visual de aceite

Ao olhar para o resultado, deve ser possível reconhecer imediatamente: Field à esquerda; Reader central; Inspector à direita; Lineage inferior; Spaces/Sources à esquerda; busca no topo; AI contextual; Settings; o sistema ambiental discreto (clima/hora/etc.); a estética Complexity. Não deve ser necessário imaginar "como vai ficar depois" — a estrutura do produto já precisa estar visível.

---

## 23. Critério técnico de aceite

Ao final desta rodada: nenhum novo Lab existe; nenhuma Foundation Decision foi quebrada; nenhuma migration desnecessária foi criada; o UI Baseline está dentro da árvore canônica do produto; os componentes principais são reutilizáveis; funções futuras têm lugares claros e identificados; fixtures estão isoladas e desligáveis; Settings funciona localmente; painéis/layout funcionam; o próximo Vertical Slice consegue entrar sem reescrever o shell.

---

## 24. Formato de saída esperado de quem executar

Ao final do trabalho, a entrega deve conter:

**Reconciliation** — o que já existia no repositório real; o que foi reaproveitado; o que conflitava; o que foi substituído; quais elementos do mockup viraram placeholder.

**Implemented** — arquivos/componentes realmente criados ou alterados.

**Working now** — interações realmente funcionais.

**Visual placeholders** — coisas posicionadas mas ainda não conectadas.

**Foundation untouched** — confirmação explícita do que deliberadamente não mudou (schema, `kind`, `relation_type`, migrations).

**Next slice** — apenas o menor próximo passo necessário: `Source → Reader → Evidence → Field`.

Sem sugerir vinte features novas. Sem criar novos Labs. Sem reabrir arquitetura sem necessidade real.
