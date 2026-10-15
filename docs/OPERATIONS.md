# Operação, dados e incidentes

## Preparação
Responsável deve definir domínio, certificado HTTPS, número oficial, endereço e política de dados. Criar usuário mínimo do README, configurar segredos fora do Git, usar conexão TLS quando remoto e restringir rede do banco. Não habilitar rotas administrativas públicas sem autenticação e autorização.

## Backup e recuperação
Proposta: backup diário criptografado, retenção de 7 dias e teste mensal de restauração em ambiente isolado. Objetivos iniciais: RPO 24h e RTO 4h, dependentes de infraestrutura e validação. Operador registra data, resultado, contagem de dados e versão do schema. Nunca sobrescrever banco de produção para testar restauração.

## Retenção
Solicitações contêm dados pessoais. Política demonstrativa prevê exclusão de pendências inativas em 90 dias; implementar e agendar rotina revisada com usuário operacional separado antes de coletar dados reais. Usuário da API não recebe DELETE. Procedimento de direitos precisa identificar o controlador e canal real. Não coletar dados de saúde; consentimento é limitado ao atendimento do interesse informado. Alinhar a política e fundamento de tratamento com responsáveis antes do lançamento.

## Incidentes
Registrar horário local e UTC, requestId, impacto e release. Verificar health e disponibilidade MySQL sem copiar payloads para tickets. Se credencial comprometida, revogar e rotacionar. Se release quebrar fluxo, servir frontend anterior e reverter aplicação; SQL exige análise específica e restauração controlada, jamais rollback destrutivo improvisado. Registrar causa, ação preventiva, responsável e prazo.

## Observabilidade
Sondar GET /api/health externamente, com limites e frequência proporcionais ao ambiente. Coletar latência, 5xx e disponibilidade na plataforma. Logs atuais registram só requestId e código interno de erros; enviar a coletor com acesso controlado, sem dados pessoais. Não considerar health um teste completo do catálogo ou de conversão.
