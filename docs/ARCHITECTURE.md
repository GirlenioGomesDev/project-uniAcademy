# Decisões de arquitetura

## Organização de interface
O frontend foi dividido em layout compartilhado, UI reutilizável e features home/trial. A página compõe seções; hooks cuidam de catálogo e envio; services encapsulam HTTP. Dados estáticos e navegação têm fontes únicas. Consulte FRONTEND.md para mapa de responsabilidades e correspondência às referências visuais.

## ADR-001 — Monorepo com workspaces
Contexto: frontend e API compartilham contrato, mas executam separadamente. Decisão: workspaces npm e lockfile único. Consequência: instalação reproduzível e scripts centrais, sem misturar SQL com React.

## ADR-002 — Express 5 em camadas
Routes compõem validação e limitação; controllers traduzem HTTP; services aplicam regras; repositories isolam SQL; config contém ambiente, pool e OpenAPI. Express 5 encaminha rejeições assíncronas ao tratamento global. Serviço criado por factory facilita testar regras sem conexão MySQL.

## ADR-003 — Persistir antes de gerar link
O registro recebe ID antes da composição de wa.me. Uma falha de banco não produz sucesso aparente. Número ausente impede INSERT. A mensagem contém somente nome, modalidade e ID; telefone/e-mail não são repetidos no link. Consentimento é obrigatório no contrato; registro criado pelo fluxo representa autorização de contato, mas não guarda versão de política. Antes da operação real, adicionar trilha de consentimento versionada com data/finalidade.

## ADR-004 — Banco relacional
DECIMAL evita erro de preço; benefits JSON suporta listas; chaves estrangeiras por nome de modalidade preservam os campos exigidos. Futuras versões devem preferir modality_id e migração quando a identidade deixar de ser estável. Seeds são inseridos sem sobrescrever dados existentes; script não é ferramenta automática de migração.

## ADR-005 — Deploy compatível com Node/MySQL
Frontend estático em HTTPS; Node em host próprio; MySQL restrito à API. Sites usa runtime distinto e não hospeda esta API TCP diretamente. Não alterar stack para acomodar publicação. Um proxy de mesma origem simplifica CORS e evita URLs privadas expostas no frontend.

## Limites atuais
Limitador em memória, sem chave de idempotência, sem autenticação administrativa, sem log de auditoria de dados e sem rotina automática de retenção. Validação sintática de telefone não comprova titularidade. RequestId é gerado internamente e logs não registram payload ou senha. Backups, alertas e gestão de segredos são responsabilidades de implantação, descritas em OPERATIONS.md.
