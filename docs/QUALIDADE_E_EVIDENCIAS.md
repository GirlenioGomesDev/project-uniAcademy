# UniAcademy — Qualidade, documentação e evidências

**Projeto:** UniAcademy  
**Atualização do registro:** 16/10/2026  
**Participantes das revisões:** Girlenio, Gabriel e Pedro Vinicius  
**Escopo:** testes, rastreabilidade, riscos, métricas, revisões e retrospectiva.

> **Limite da avaliação:** as práticas de processo são inspiradas em CMMI e MPS.BR, **sem declaração de certificação, avaliação oficial ou nível de maturidade formal**. Os resultados aqui registrados são evidências acadêmicas de atividades realizadas pela equipe, não uma auditoria independente.

## 1. Objetivo e método

Este documento registra como a equipe verificou o funcionamento do UniAcademy e acompanhou melhorias no processo de desenvolvimento. As atividades incluem testes automatizados, verificação de build e formatação, validação funcional da integração com API, controle de mudanças e retrospectiva.

Fluxo adotado para documentar as entregas:

`Identificar necessidade → Implementar → Verificar → Corrigir → Testar novamente → Registrar evidência → Revisar e acompanhar`

**Fontes das evidências:** comandos executados no terminal pelo grupo e suas capturas de tela, demonstração funcional no navegador e informações confirmadas pelos integrantes. Os resultados de comandos não foram reexecutados na elaboração deste arquivo; correspondem às execuções relatadas e registradas durante a validação.

## 2. Estratégia e resultados dos testes

| ID | Tipo | Procedimento | Resultado registrado | Situação |
|---|---|---|---|---|
| T-01 | Backend/API | `npm test` | 15 testes aprovados; 0 falhas | Aprovado na execução registrada |
| T-02 | Interface | `npm run test:ui` | 23 testes Playwright aprovados; 0 falhas | Aprovado na execução registrada |
| T-03 | Build | `npm run build` | Build aprovado; 1.617 módulos processados | Aprovado na execução registrada |
| T-04 | Padrão de código | `npm run format:check` | `All matched files use Prettier code style!` | Aprovado na execução registrada |
| T-05 | Integração com API | Uso do frontend com a API publicada | Dados carregados corretamente no navegador | Confirmado funcionalmente |
| T-06 | Envio de solicitação | Preenchimento e confirmação de aula experimental | Mensagem de sucesso com solicitação nº 15 | Confirmado pela interface e resposta da API |
| T-07 | Persistência MySQL | Confirmação da equipe responsável pelo banco | Persistência declarada pela equipe | Confirmada pela equipe; consulta SQL não anexada |

**Indicador de execução automatizada:** 38/38 testes aprovados (15 backend + 23 interface), representando **100% de aprovação nas execuções observadas**. Esse percentual não equivale a 100% de cobertura de código nem à ausência de defeitos.

### 2.1 Comandos para reproduzir

Executar na raiz do repositório, com as dependências instaladas:

```powershell
npm install
npm test
npm run test:ui
npm run build
npm run format:check
```

Se o Playwright exigir navegador local, seguir a orientação do erro e instalar o navegador de teste correspondente (`npx playwright install chromium`).

**Observação:** os testes de interface presentes em `frontend/test/` utilizam interceptação/simulação de respostas de API em cenários automatizados; portanto, os 23 testes não são, isoladamente, prova de escrita no MySQL. O fluxo real de cadastro foi verificado separadamente pelo navegador.

### 2.2 Arquivos envolvidos

- `backend/test/api.test.js` — testes de comportamento e validações da API.
- `backend/test/planInterest.test.js` — testes relacionados ao interesse em planos.
- `frontend/test/ui.spec.js` — testes de interface, responsividade e fluxos.
- `frontend/test/plans-and-schedule.spec.js` — testes de planos e horários.
- `playwright.config.js` — configuração da execução de interface.
- `package.json` — scripts de testes, build e Prettier.
- `docs/QUALITY.md` — políticas gerais de qualidade já existentes no projeto.

## 3. Matriz de rastreabilidade

A tabela relaciona necessidades do site aos locais de implementação e aos meios de verificação. Um vínculo com arquivo ou teste não substitui uma inspeção de cada critério de aceite.

| ID | Necessidade / requisito | Implementação de referência | Verificação / evidência | Situação |
|---|---|---|---|---|
| RF-01 | Apresentar academia e diferenciais | `frontend/src/features/home/sections/AboutSection.jsx` e `HeroSection.jsx` | Inspeção funcional no navegador; build | Verificado visualmente |
| RF-02 | Exibir modalidades | `frontend/src/features/home/sections/ModalitiesSection.jsx` | Interface Playwright e inspeção | Coberto pelos testes de interface |
| RF-03 | Apresentar planos e valores | `frontend/src/features/home/sections/PlansSection.jsx` e `PlanCard.jsx` | `plans-and-schedule.spec.js` e teste manual de interesse | Verificado |
| RF-04 | Mostrar horários e filtros | `frontend/src/features/home/sections/ScheduleSection.jsx` e `ScheduleTable.jsx` | `ui.spec.js` e `plans-and-schedule.spec.js` | Verificado |
| RF-05 | Mostrar estrutura e localização | `GallerySection.jsx` e `LocationSection.jsx` | Inspeção e testes de composição | Verificado parcialmente; conferir imagens finais |
| RF-06 | Informar meios de contato | `ContactSection.jsx` | Inspeção visual; verificação manual de links | Verificar cada destino antes da entrega |
| RF-07 | Registrar interesse / solicitação | Componentes em `frontend/src/features/plans/` e `frontend/src/features/trial/`; rotas da API | Testes automatizados e confirmação da solicitação nº 15 | Fluxo confirmado |
| RNF-01 | Responsividade e navegação intuitiva | Componentes React e estilos em `frontend/src/styles/` | Playwright em diferentes larguras e revisão visual da equipe | Verificado nos cenários cobertos |
| RNF-02 | Padronização e compilação | Arquivos-fonte do monorepo | `npm run format:check` e `npm run build` | Aprovado |

## 4. Registro de riscos

Os itens a seguir são **riscos monitorados/propostos**, não defeitos necessariamente ocorridos. Quando uma ocorrência foi relatada, ela está identificada.

| ID | Risco | Probabilidade | Impacto | Tratamento / prevenção | Estado |
|---|---|---|---|---|---|
| R-01 | Falha na comunicação frontend–API | Média | Alto | Configurar URL da API, testar respostas e revalidar o fluxo | **Ocorrência relatada e corrigida** |
| R-02 | Indisponibilidade do backend ou MySQL | Média | Alto | Verificar endpoint de saúde, tratamento de erro e fallback de interface | Monitorar |
| R-03 | Layout difícil de navegar | Média | Médio | Revisões coletivas e testes em tamanhos variados | **Melhoria relatada e aplicada** |
| R-04 | Erros de entrada ou cadastro inválido | Média | Médio | Validação de formulários e testes negativos | Monitorar |
| R-05 | Alterações não revisadas no Git | Média | Médio | Histórico de commits, branch e revisão entre integrantes | Manter evidências de aprovação |
| R-06 | Exposição de dados pessoais em capturas | Média | Alto | Usar dados fictícios e ocultar nome, telefone e e-mail | Aplicar em todas as evidências |

## 5. Métricas e indicadores

| Indicador | Valor | Origem / interpretação |
|---|---:|---|
| Testes de backend aprovados | 15 | Execução registrada de `npm test` |
| Testes de interface aprovados | 23 | Execução registrada de `npm run test:ui` |
| Testes automatizados reprovados | 0 | Nas execuções acima |
| Taxa de aprovação observada | 100% | 38 aprovados / 38 executados |
| Resultado do build | Aprovado | `npm run build` |
| Módulos no build observado | 1.617 | Saída registrada do Vite |
| Avisos de Prettier antes da correção | 66 | `npm run format:check`, execução inicial da versão atualizada |
| Avisos de Prettier depois da correção | 0 | Saída `All matched files use Prettier code style!` |
| Solicitação real de teste confirmada | nº 15 | Mensagem retornada pela aplicação |
| Cobertura percentual de código | Não medida | Não deduzir da taxa de aprovação |
| Defeitos críticos em aberto | Não aferido | Exige controle formal de defeitos |

## 6. Revisões realizadas pela equipe

**Participantes informados:** Girlenio, Gabriel e Pedro Vinicius. A participação conjunta foi confirmada pela equipe; não há ata datada ou aprovações individuais anexadas a este documento.

| REV | Ponto analisado | Problema identificado | Ação relatada | Resultado observado |
|---|---|---|---|---|
| REV-01 | Integração frontend/API | Falha no carregamento/comunicação com a API | Equipe revisou e corrigiu a integração | Dados do site passaram a carregar pela API |
| REV-02 | Layout e experiência | Navegação considerada pouco intuitiva | Equipe reorganizou/melhorou o layout geral | Interface considerada mais intuitiva pela equipe; cenários responsivos testados |
| REV-03 | Padronização de código | 66 arquivos sinalizados pelo Prettier | Formatação e revalidação | Verificação do Prettier aprovada e testes mantidos aprovados |

**Rastreabilidade no Git:** o histórico mostrado pela equipe inclui o commit `4e66cca` (`fix: corrige formatacao e testes da integracao de planos`). Na verificação posterior, `main` e a branch de formatação apontavam para o mesmo commit. **Não há evidência fornecida de Pull Request aprovado ou revisão formal em plataforma**; não registrar como concluída sem link ou captura.

## 7. Retrospectiva

**O que dificultou o desenvolvimento?** A equipe enfrentou problemas na integração da API e identificou que o layout geral precisava ser mais intuitivo.

**O que foi feito?** Os três integrantes participaram das conversas e revisões. Foram corrigidas a integração e partes da interface. Depois, o sistema foi validado por testes e verificação funcional.

**O que funcionou bem?** A colaboração permitiu identificar e corrigir dificuldades. As execuções registradas de backend, interface, build e padronização terminaram com sucesso.

**Aprendizados e ações para a próxima etapa:**

1. Testar integrações mais cedo e sempre que a URL/configuração da API mudar.
2. Conferir navegação, linguagem e responsividade desde as primeiras versões.
3. Fazer revisão por outro integrante e registrar a aprovação por commit ou Pull Request.
4. Executar `npm test`, `npm run test:ui`, `npm run build` e `npm run format:check` antes de entregar.
5. Guardar evidências com data, resultado e referência da versão testada.

Estas são **ações propostas**, não atividades futuras já executadas.

## 8. Evidências a manter no repositório

Guardar prints em `docs/evidencias/` (quando adequado e autorizado), preferencialmente com dados pessoais ocultos:

| Arquivo sugerido | Conteúdo a comprovar | Situação |
|---|---|---|
| `01-backend-testes.png` | Resultado dos 15 testes de backend | Captura compartilhada na conversa; não inserida aqui |
| `02-playwright-testes.png` | Resultado dos 23 testes da interface | Captura compartilhada na conversa; não inserida aqui |
| `03-build.png` | Build aprovado | Captura compartilhada na conversa; não inserida aqui |
| `04-prettier.png` | Zero avisos | Resultado textual compartilhado; captura opcional |
| `05-solicitacao-15.png` | Confirmação de cadastro com ID 15 | Captura compartilhada; ocultar dados pessoais |
| `06-git-commit.png` | Identificador do commit e branch | Resultado compartilhado; captura opcional |
| `07-revisao-equipe.md` | Data, participantes, decisões e responsável pelas ações | Registro narrativo neste documento; ata original não apresentada |
| `08-mysql-consulta.png` | Consulta ao registro no banco da API hospedada, sem dados pessoais | **Ainda não anexada** |

> A confirmação de sucesso da solicitação nº 15 é prova de resposta positiva da API, mas **não substitui uma consulta ao banco de dados**. A persistência real em MySQL foi confirmada verbalmente pela equipe.

## 9. Critérios de aceite e pendências

- [x] Testes de backend executados e aprovados (15/15).
- [x] Testes de interface executados e aprovados (23/23).
- [x] Build concluído com sucesso.
- [x] Padronização Prettier aprovada após correção de 66 avisos.
- [x] Integração frontend–API demonstrada funcionando.
- [x] Solicitação funcional nº 15 confirmada pela interface/API.
- [x] Revisão e retrospectiva narradas pela equipe (três participantes).
- [ ] Inserir no repositório as capturas de testes e build, sem dados pessoais.
- [ ] Anexar, se necessário para a avaliação, evidência de consulta à base de dados vinculada à API.
- [ ] Registrar data e aprovação individual de uma revisão de código, caso exigida pelo professor.
- [ ] Conferir critérios de aceitação e vínculos de requisitos pendentes antes da entrega.

## 10. Manutenção da documentação

Sempre que houver mudança relevante, atualizar: versão/commit testado, comandos, data, quantidade de testes, defeitos conhecidos, decisões da equipe e links para evidências. Não substituir evidência ausente por afirmação de aprovação.

**Referências internas:** `docs/QUALITY.md`, `package.json`, `backend/test/`, `frontend/test/`, `playwright.config.js` e histórico de commits do repositório.
