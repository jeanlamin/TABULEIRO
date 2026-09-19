# COMPLEXITY V1.70 — IMPLEMENTATION BRIEF (rascunho para handoff)

**Propósito deste documento:** este é um primeiro pensamento sobre a programação da Complexity V1.70, para ser passado a um executor (ChatGPT) implementar. Não é código. É a ponte entre duas coisas que já existem separadamente:

1. O **Foundation Schema Candidate 1** — schema Postgres validado com testes executáveis reais (migrations, triggers, invariantes, stress cases todos passando). Arquivos: `complexity_v1_70_migration_001.sql` e `complexity_v1_70_invariant_tests.sql`, já entregues.
2. O **mockup visual** — uma tela de produto (Knowledge Map, Reader, Details, Research Lineage) que mostra a intenção de UX, mas foi desenhada sem checar contra o schema validado.

Este brief faz essa reconciliação e organiza o que o executor deve construir, em que ordem, e o que ele **não** tem autorização para decidir sozinho.

---

## 1. O que já está fechado (não reabrir)

- **FD-001 a FD-004** (modelo de objeto canônico, identidade/versionamento, semântica de relações, semântica de exclusão) — aceitos e validados por testes executáveis reais.
- **Vocabulário de `relation_type`**: exatamente `derived_into`, `supports`, `contradicts`, `associated_with`. Nenhum outro valor sem nova auditoria.
- **Vocabulário de `objects.kind`**: exatamente `evidence`, `question`, `proposition`, `record`.
- **Command Layer mínimo** (seção 28 do Draft 1): `createSource`, `addSourceAsset`, `captureEvidence`, `correctEvidence`, `createIntellectualObject`, `editIntellectualObject`, `deriveObject`, `createRelation`, `removeRelation`, `createField`, `placeOnField`, `moveOnField`, `removeFromField`, `archiveObject`, `unarchiveObject`, `trashObject`, `restoreFromTrash`, `permanentlyDeleteObject`.
- **O banco enforça as invariantes estruturais** (triggers, FKs compostas, índices parciais). O Command Layer **não deve reimplementar essa validação** — ele confia no banco e só adiciona regras contextuais/UX (ex.: preflight de permanent_delete para mostrar a mensagem certa antes de tentar).

---

## 2. Três decisões que o mockup assume e que NÃO foram fechadas

O executor **não decide isso sozinho**. Se chegar numa bifurcação de implementação por causa de um desses pontos, ele para e pergunta — não improvisa.

### 2.1 — Composition (o node "Synthesis/Artifact" do mockup)

Confirmado: isso é o conceito **Composition** do Tabuleiro, não o `Record` que já existe no schema. Composition já tinha sido caracterizado como "artefato autoral que organiza texto e referências às investigações — projeto, artigo, dissertação" e explicitamente **não é um sexto Knowledge Type**.

Isso significa que Composition:
- provavelmente não é uma linha em `objects` com `kind` novo (isso quebraria o vocabulário fechado de 4 kinds sem nova auditoria);
- é mais provável que seja uma entidade própria (`compositions`) que **referencia** Objects (via uma tabela de junção tipo `composition_references`), similar em espírito a `field_placements`, mas para texto autoral em vez de posição espacial;
- precisa da mesma coisa que todo o resto do domínio já passou: um POC próprio (**POC-04 — Composition Model**) antes de virar schema, testando pelo menos: como um parágrafo referencia uma Proposition; o que acontece quando a Proposition referenciada muda de revisão; se Composition tem revisions próprias ou não.

**Instrução para V1.70:** não construir Composition agora. O ciclo mínimo (seção 5) e a Research Lineage funcionam sem ele — a cadeia S1→E1→P1→Q1 do mockup já é 100% coberta pelo schema atual. Deixar o nó "Synthesis/Artifact" fora do V1.70 ou, se precisar aparecer visualmente, tratar como um placeholder desabilitado ("em breve").

### 2.2 — Labels de aresta (informs / leads to / synthesizes / Extends)

Esses rótulos não existem no vocabulário congelado de `relation_type`. Ninguém decidiu ainda se são:
- (a) apenas apresentação — a mesma `derived_into` mostrada com um texto diferente dependendo do par `(from.kind, to.kind)`; ou
- (b) precisam virar dado de verdade no banco.

**Instrução para V1.70:** usar (a) como default seguro, mas **não silenciosamente** — o mapeamento de apresentação deve ficar isolado numa função pura de UI (`getRelationLabel(fromKind, toKind, relationType)`), fácil de trocar depois, e o código deve ter um comentário explícito apontando que isso é provisório e pendente de decisão de produto. Nunca gravar esses rótulos como `relation_type` no banco.

### 2.3 — Tags

Não existe no schema validado. Fica em aberto.

**Instrução para V1.70:** não inventar uma coluna nem uma tabela de tags agora. Se a UI precisar do espaço visual do mockup, deixar a seção "Tags" do painel Details vazia/oculta até essa decisão ser tomada — não popular com dado fake nem com uma implementação provisória que crie schema.

---

## 3. Mapeamento do mockup → modelo já validado

| Região do mockup | Mapeia para | Observação |
|---|---|---|
| Sidebar "Spaces" (Attention & Cognition, Planetary Futures...) | `workspaces` | Já suportado nativamente pelo schema — múltiplos workspaces não exigem mudança nenhuma. |
| "Knowledge Map" (grafo de nós/clusters) | `objects` + `relations` ativas | **Atenção:** o mockup mostra nós tipo "Consciousness", "Neural Mechanisms" — esses parecem *conceitos/clusters semânticos*, não Objects individuais. Isso é a feature de clustering semântico que a auditoria já marcou como **DROP/DEFER explícito** (seção 22 do Draft 0: "Semantic clusters", "Embeddings"). Para V1.70, o Knowledge Map deve renderizar o grafo real de Objects+Relations (Evidence/Question/Proposition), não clusters temáticos. |
| "Papers / [arquivo].pdf" (Reader) | `sources` + `source_assets` | Visualizador de PDF com seleção de texto → gera `captureEvidence` (locator = página + posição). |
| Painel Details → "Selected Evidence" | uma linha de `evidences` | `text_snapshot` + citação (via `source_asset_id → source_id`). |
| Painel Details → "Related Items" | `relations` ativas do objeto selecionado | Rótulos "Supports/Extends" seguem a regra da seção 2.2 acima. |
| Painel Details → "Open Questions" | `objects` com `kind='question'` relacionados, ainda sem resposta | Não é sugestão de IA por padrão em V1.70 — são Questions que o usuário já criou e ainda não colocou no Campo. Sugestão de IA aqui é V1.71 (ver seção 2.1 do Foundation Audit Pack sobre `ai_suggestions`). |
| Caixa "Ask a question or make a note" | Fora do escopo V1.70 | Isso é a fronteira de IA (`AiRun → AiSuggestion → aceite → Command`) já desenhada, mas explicitamente adiada (seção 26 do Draft 1: "AI persistence não bloqueia migration 001"). Para V1.70, esse campo pode existir só como criação manual de `createIntellectualObject(kind='question')`, sem IA nenhuma por trás. |
| "Research Lineage" (Timeline) | a genealogia via `derived_into` recursiva | Exatamente o que POC-03/Draft 1 já resolveram — é literalmente a query de ancestors/descendants já escrita e testada. |
| Ícone/relógio/clima/Spotify no topo | Decoração do mockup, fora de escopo | Não construir — são preenchimento visual do mockup, não requisitos de produto. |

---

## 4. Stack recomendada

| Camada | Escolha | Por quê |
|---|---|---|
| Banco | **Postgres via Supabase** | O schema já foi escrito e testado assumindo Postgres (triggers plpgsql, FKs compostas, índices parciais). Supabase dá Postgres + Auth + Storage prontos sem acoplar regra de negócio ao Supabase em si — a `migration_001.sql` já entregue roda nele sem alteração. |
| Acesso a dados | **Kysely** (query builder tipado, não ORM pesado) | O schema depende de o banco ser a fonte de verdade das invariantes (triggers, FKs compostas). Um ORM como Prisma tende a lutar contra FKs compostas e a duplicar validação em JS — Kysely deixa o SQL explícito e tipado sem esconder o que está sendo garantido pelo banco. |
| Command Layer | Next.js **Server Actions** | Uma função por comando da seção 28, cada uma abrindo uma transação, chamando o banco, e devolvendo o resultado tipado. Não precisa de uma API REST separada para um app single-user. |
| Frontend | **Next.js (App Router) + TypeScript + Tailwind** | Consistente com a direção visual "low chrome" já estabelecida para o projeto. |
| Reader de PDF | **react-pdf** (wrapper de pdf.js) | Necessário para o painel central do mockup; suporta seleção de texto para virar Evidence. |
| Knowledge Map | **@xyflow/react** (React Flow) | Grafo de nós arrastáveis com zoom/pan pronto — evita reinventar layout de grafo à mão. |
| Deploy | Vercel (app) + Supabase (banco/storage) | Combinação padrão para este stack, baixo atrito operacional para um projeto single-user. |

---

## 5. Fases de construção

### P0 — Ciclo mínimo (prova o domínio funcionando de ponta a ponta)

Corresponde exatamente ao ciclo mínimo já definido na auditoria de arquitetura original:

1. Login (Supabase Auth, single user)
2. Upload de PDF → `createSource` + `addSourceAsset`
3. Reader básico (páginas, zoom, texto nativo — sem OCR ainda)
4. Selecionar texto → `captureEvidence`
5. Derivar Question/Proposition a partir de uma ou mais Evidences → `deriveObject` + `createRelation(derived_into)`
6. Colocar/remover objeto de um Field (lista simples, ainda sem o grafo visual) → `placeOnField` / `removeFromField`
7. Archive / Trash / Restore / Permanent Delete, com a tela de preflight ("N conexões, cancelar ou remover e excluir")
8. Reload da página preservando tudo

**Critério de saída do P0:** os 27 passos do stress test do Foundation Schema (arquivo já validado) acontecem de verdade clicando na UI, não só via SQL direto.

### P1 — Camada visual do mockup

- Knowledge Map real via React Flow, renderizando Objects+Relations (não clusters semânticos — ver seção 3)
- Research Lineage como o componente de cards/timeline do mockup, usando a query de genealogia já escrita
- Painel Details com Related Items e Open Questions reais
- Múltiplos Workspaces ("Spaces" na sidebar)
- Busca simples por texto em `sources`/`objects` (sem embeddings)

### P2 — Explicitamente depois, não agora

- Pipeline de IA (`AiRun`/`AiSuggestion`, a caixa "Ask a question")
- Composition (após POC-04 próprio)
- OCR para PDFs escaneados
- Multiusuário/colaboração
- Fila assíncrona de processamento

---

## 6. O que NÃO implementar (herdado da auditoria, não é opinião nova)

- Graph database, hyperedges, MCP, router de IA genérico, fila distribuída, CRDT, event sourcing, CQRS — todos já `DROP` na auditoria de schema, sem evidência de necessidade real.
- Clustering semântico / embeddings / "Concept" como tipo de nó — o mockup sugere isso visualmente, mas é DEFER explícito.
- Qualquer `relation_type` ou `objects.kind` novo sem passar por uma rodada de auditoria como as que já fizemos (POC-01 a POC-03 + stress test).
- Tags como taxonomia real (ver 2.3).
- Composition como schema real antes do POC-04 (ver 2.1).

---

## 7. Formato de entrega esperado do executor

- Estrutura de pastas separando claramente: `/db` (migrations — reusar as já validadas), `/commands` (um arquivo por grupo de comando da seção 28), `/app` (rotas Next.js), `/components` (Reader, KnowledgeMap, DetailsPanel, LineageView).
- Cada Command como função pura e tipada: recebe input, abre transação, confia nas constraints do banco, devolve resultado — sem reimplementar validação que o banco já garante.
- Qualquer ponto em que o executor precisar tomar uma decisão de produto não coberta aqui (especialmente as três da seção 2) deve ser sinalizado explicitamente no output, não resolvido silenciosamente.
- Testes automatizados mínimos para o ciclo P0 (pode reaproveitar a lógica dos testes de invariante já escritos, adaptando para chamar os Commands em vez de SQL direto).
