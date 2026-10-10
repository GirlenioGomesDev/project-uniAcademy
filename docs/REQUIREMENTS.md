# Requisitos e rastreabilidade

| ID | Requisito / aceitação | Implementação | Evidência planejada |
|---|---|---|---|
| RF01 | Catálogo consolidado lido do banco | siteRepository, GET site-data | Teste HTTP + conferir seed no MySQL |
| RF02 | Aula válida gera registro pending e wa.me | siteService, TrialModal | Teste de persistência anterior ao link + roteiro real |
| RF03 | Saúde confirma conexão real | health SELECT 1 | HTTP substituído + banco real |
| RF04 | Quatro planos com condições distintas | schema.sql, Home | Conferência visual e SQL |
| RF05 | Menu móvel e seções institucionais | Header, Home, styles.css | Navegador 360/768/1440 px |
| RF06 | Grade com dia e modalidade | Schedules | Filtros e combinação sem resultados |
| RF07 | Identidade e logo consistentes | Brand, public/logo.jpg | Navbar, mapa, rodapé e favicon |
| RNF01 | Payload inválido não escreve no banco | Joi e middleware | Teste HTTP 400 |
| RNF02 | Falha interna não revela SQL/segredos | errorHandler | Teste 500 |
| RNF03 | Proteção básica HTTP/CORS/abuso | Helmet, CORS, rateLimit | Testes 403/429 + inspeção de cabeçalhos |
| RNF04 | Contratos OpenAPI 3.0 completos | swagger.js | Teste de contrato e revisão de schemas |
| RNF05 | Seeds idempotentes e relações | schema.sql | Executar duas vezes e comparar contagens |
| RNF06 | Loading, falha e sucesso perceptíveis | Home, TrialModal | Throttling/offline no navegador |
| RNF07 | Processo e configuração rastreáveis | docs, CI, lockfile | Revisão e registros por release |

Regras: Light restrito a 10h–16h seg–sex; Plus adiciona aulas e horários; MegaPlus inclui lutas/avaliações; Day-use dura um dia, duration_months=0. Solicitações não são matrícula, pagamento ou reserva. Admin, autenticação, gestão de alunos e cobrança não foram solicitados e não fazem parte da API pública.

Aceite de produção exige endereço, contatos, fotos, política de dados e valores aprovados; MySQL e interface validados; acesso à infraestrutura e revisão por responsáveis. A conformidade formal a modelos de maturidade fica fora do escopo de comprovação deste código.
