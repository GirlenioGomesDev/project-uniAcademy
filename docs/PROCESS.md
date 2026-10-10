# Processo de engenharia e melhoria contínua

Versão 1.0 • baseline inicial • responsável a designar pelo mantenedor.

## Escopo e limites

Práticas de gestão de requisitos, planejamento, qualidade, configuração, verificação, medição e melhoria inspiradas em CMMI e MR-MPS-SW. Não existe avaliação formal, certificação ou nível declarado. Arquivos documentados são propostas de processo; execução sustentada precisa produzir evidências organizacionais. Validar a versão vigente dos modelos com entidades responsáveis antes de avaliação.

## Ciclo de desenvolvimento

1. Registrar demanda com ID, origem, problema, regra e critério observável.
2. Responsável de produto aprova prioridade; engenharia estima esforço e dependências; registrar riscos.
3. Criar branch de tarefa. Alterações de contrato e dados incluem impacto, migração e plano de reversão.
4. Implementar mantendo separação de camadas; criar testes de regras e falhas relevantes.
5. Revisão por outro mantenedor: legibilidade, segurança, acessibilidade, contrato, dados e documentação.
6. CI deve passar; executar validação de banco e interface em homologação, registrar versão e evidências.
7. Responsável de produto aceita os critérios. Responsável operacional aprova janela e backup.
8. Publicar versão identificável, monitorar e revisar incidentes; manter causa, ação e prazo.

## Papéis e evidências

| Atividade | Responsável proposto | Evidência |
|---|---|---|
| Gestão de requisitos | Produto | Issue + critérios + aceite |
| Planejamento e risco | Líder técnico | Estimativa, dependências, registro de riscos |
| Garantia da qualidade | Revisor | Revisão PR e desvios registrados |
| Configuração | Engenharia | Git, lockfile, tag e release |
| Verificação | Engenharia/QA | CI e roteiro de homologação |
| Operação e incidentes | Operações | Logs com requestId, tickets, restauração |
| Melhoria | Equipe | Retrospectiva e ações verificadas |

## Mapeamento orientativo

| Tema dos modelos | Aplicação no projeto | Lacuna organizacional |
|---|---|---|
| Requisitos | Matriz de rastreabilidade e OpenAPI | Histórico de aprovação e controle de mudanças |
| Planejamento e acompanhamento | Ciclo acima, riscos e aceite | Estimativas e acompanhamento de projetos reais |
| Qualidade | CI, revisão proposta, testes | Revisões independentes executadas |
| Configuração | Lockfile, .gitignore, contratos | Repositório remoto, tags e auditoria de baseline |
| Medição | Métricas definidas abaixo | Coleta contínua e análise histórica |
| Verificação/validação | Testes HTTP e roteiro manual | Evidências de MySQL, navegador e aceite |
| Melhoria contínua | Revisão de incidentes e retrospectiva | Ações executadas e eficácia medida |

## Métricas

Coletar por release: proporção de critérios aprovados (meta 100% para lançar), defeitos escapados (abertos em produção), tempo de restauração (incidente até serviço normal), latência p95 da API e taxa de 5xx. Metas iniciais propostas: 5xx <1%, p95 <500 ms em cenário de carga definido, restauração <4h. Essas metas não foram medidas nem garantidas. Semanalmente analisar tendência, escolher uma ação com responsável e prazo, e verificar eficácia na retrospectiva seguinte.

## Controle de mudanças

Solicitação → análise de impacto em contrato, UI, SQL, privacidade e operação → aprovação de produto → implementação → validação → nova baseline. Emergências devem registrar motivo, responsável, revisão posterior e reversão. Não editar seeds para simular migrações em bancos existentes: adicionar arquivo numerado com estratégia segura.

## Registro inicial de riscos

| Risco | Impacto | Ação |
|---|---|---|
| Contato incorreto | Dados enviados ao destino errado | Configuração obrigatória e teste com responsável |
| Banco indisponível | Catálogo e conversão interrompidos | Health, monitoramento, backups e alerta |
| Envio duplicado após timeout | Solicitações duplicadas | Desabilitar botão; evoluir para chave de idempotência |
| Fotos externas fora do ar | Experiência visual degradada | Hospedar imagens aprovadas localmente |
| Acesso indevido a dados | Exposição de contatos | Menor privilégio, TLS e retenção controlada |
| Catálogo não aprovado | Oferta comercial incorreta | Aceite formal de preços e condições antes do lançamento |
