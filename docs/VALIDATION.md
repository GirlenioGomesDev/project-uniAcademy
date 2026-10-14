
# Validação e evidências — UniAcademy

## 1. Reorganização visual — 10/10/2026

O frontend foi organizado em layout, UI, features, seções, hooks, dados e estilos.

O backend foi formatado sem alterar os contratos existentes.

Resultados:
- `npm test`: 10 testes aprovados.
- `npm run build`: compilação concluída.
- `npm run format:check`: aprovado.

A interface foi comparada estruturalmente com as referências fornecidas, sem validação visual em navegador nessa execução.

As fotografias são ilustrativas.

## 2. Execução inicial — 10/10/2026

Resultados:
- 10 testes automatizados aprovados.
- 0 falhas.
- Build de produção concluído.
- Auditoria do npm: 0 vulnerabilidades.
- Ambiente utilizado: Node.js 24.21.0.

Nessa execução inicial, não foi possível testar o MySQL real.

Essa limitação foi posteriormente tratada durante a validação local de 14/10/2026.

## 3. Validação local — 14/10/2026

Responsável: Girlenio Gomes

Área: Backend, banco de dados e integração.

### 3.1 Ambiente utilizado

- Sistema operacional: Windows.
- Node.js: 24.19.0.
- npm: 11.17.0.
- MySQL Community Server: 26.7.0.
- Backend: Node.js e Express.
- Frontend: React e Vite.
- Banco: uniacademy_db.
- API local: http://localhost:3001.
- Frontend local: http://localhost:5173.

### 3.2 Configuração do MySQL

O banco uniacademy_db foi criado e configurado utilizando o arquivo database/schema.sql.

Foram identificadas as quatro tabelas:

- plans
- modalities
- schedules
- trial_requests

Consultas realizadas:

SHOW TABLES;

SELECT id, name, price FROM plans;

SELECT id, name FROM modalities;

SELECT COUNT(*) FROM schedules;

SELECT COUNT(*) FROM trial_requests;

Resultados iniciais:

- 4 planos cadastrados.
- 4 modalidades cadastradas.
- 10 horários cadastrados.
- 0 solicitações experimentais.

Situação: APROVADO.

### 3.3 Permissões do banco de dados

Foi configurado o usuário uniacademy_app com permissões específicas:

- SELECT na tabela plans.
- SELECT na tabela modalities.
- SELECT na tabela schedules.
- INSERT na tabela trial_requests.

As permissões foram verificadas utilizando:

SHOW GRANTS FOR 'uniacademy_app'@'localhost';

Resultado: APROVADO.

### 3.4 Conexão entre Express e MySQL

O backend foi configurado utilizando variáveis de ambiente no arquivo backend/.env.

A conexão foi validada pelo endpoint:

GET /api/health

Resposta obtida:

{
  "status": "ok",
  "database": "connected"
}

Resultado: APROVADO.

### 3.5 Consulta dos dados pela API

Endpoint utilizado:

GET /api/site-data

A API retornou:

- 4 planos.
- 4 modalidades.
- 10 horários.
- Informações de contato demonstrativas.

Os dados foram apresentados corretamente pelo frontend React após as correções de codificação.

Resultado: APROVADO.

### 3.6 Testes automatizados

Comando executado:

npm test

Resultados:

- Total de testes: 10.
- Aprovados: 10.
- Falhas: 0.
- Cancelados: 0.
- Ignorados: 0.
- Duração aproximada: 3,15 segundos.

Cenários avaliados:

1. Consulta do catálogo e saúde da API.
2. Fluxo de persistência simulado e geração da URL.
3. Rejeição de payload inválido.
4. Rejeição de modalidade inexistente.
5. Rejeição de cadastro sem contato configurado.
6. Tratamento de erro de banco sem exposição de detalhes internos.
7. Rejeição de origem CORS desconhecida.
8. Tratamento de JSON malformado.
9. Verificação do contrato OpenAPI.
10. Limitação de solicitações por IP.

Resultado: APROVADO.

Observação: os testes automatizados utilizam repositório substituído e não executam consultas reais ao MySQL.

### 3.7 Teste de persistência real

Foi realizado um teste utilizando a função createTrial do Repository, conectada ao banco MySQL real.

Dados fictícios utilizados:

- Nome: Cliente Teste.
- Modalidade: Funcional.
- Telefone e e-mail fictícios.
- Status inicial: pending.

Resultado apresentado pelo Node.js:

Cadastro salvo! ID: 1

A persistência foi confirmada posteriormente no MySQL:

SELECT id, client_name, preferred_modality, status
FROM trial_requests;

Resultado:

| id | client_name | preferred_modality | status |
|---|---|---|---|
| 1 | Cliente Teste | Funcional | pending |

O registro fictício foi destinado à remoção após o teste.

Resultado: APROVADO.

Esse procedimento comprovou o INSERT real realizado pelo Repository, mas não substitui o teste HTTP completo do formulário.

### 3.8 Tratamento de falhas

Foi testada a tentativa de solicitação experimental sem número oficial de WhatsApp configurado.

O backend registrou:

CONTACT_NOT_CONFIGURED

O sistema apresentou mensagem de indisponibilidade ao usuário.

Essa situação ocorre porque o Service exige um número oficial antes de permitir a persistência pelo fluxo HTTP.

Resultado: comportamento esperado confirmado.

Pendente: configurar o WhatsApp oficial e executar o fluxo completo de cadastro.

### 3.9 Correção de codificação

Durante a integração, foram identificados problemas de acentuação nos textos armazenados no banco de dados.

Foi verificada a configuração de caracteres e utilizada a codificação utf8mb4.

Foram corrigidos:

- Nomes das modalidades.
- Descrições das modalidades.
- Condições de pagamento.
- Benefícios dos planos.
- Resumos dos horários.
- Nome da sala Estúdio.

As correções foram verificadas por consultas SQL, valores hexadecimais e apresentação dos dados no site.

Resultado: APROVADO no ambiente local.

Observação: as correções foram realizadas diretamente no banco local. Uma nova implantação deve importar os dados com a codificação UTF-8 correta.

### 3.10 Compilação do frontend

Comando executado:

npm run build

Resultados:

- Vite 7.3.7.
- 1603 módulos transformados.
- Compilação concluída em 6,76 segundos.
- Arquivos de produção gerados em frontend/dist.

Resultado: APROVADO.

### 3.11 Teste visual e integração

O frontend foi iniciado e acessado pelo navegador.

Foram verificados:

- Apresentação da academia.
- Planos e preços.
- Modalidades.
- Benefícios.
- Horários.
- Estrutura do site.
- Formulário de aula experimental.
- Carregamento dos dados provenientes da API.

Os textos corrigidos foram confirmados na interface.

Resultado: integração de leitura APROVADA.

Não foram concluídos testes abrangentes de responsividade, acessibilidade e fluxo integral de solicitação.

## 4. Validações complementares pendentes

### Backend e banco

- Testar POST completo com WhatsApp oficial.
- Confirmar persistência utilizando a rota HTTP.
- Testar indisponibilidade real do MySQL.
- Validar restrições de chave estrangeira.
- Validar preço negativo e dia inválido.
- Repetir a importação SQL com UTF-8 em ambiente novo.
- Validar o backup por meio de restauração em ambiente isolado.

### Frontend

- Testar larguras de 360, 768 e 1440 pixels.
- Verificar navegação por teclado.
- Testar abertura e fechamento do modal com Escape.
- Validar estados de carregamento.
- Testar filtros de horários.
- Verificar tratamento de falhas HTTP.
- Avaliar acessibilidade e contraste.
- Testar o envio real para WhatsApp.

### Implantação online

- Escolher hospedagem para o frontend.
- Configurar hospedagem para o backend.
- Configurar MySQL na nuvem.
- Definir variáveis de ambiente.
- Configurar CORS.
- Configurar HTTPS.
- Verificar conexão e persistência em produção.
- Executar testes após a implantação.

## 5. Registro de aceite

Projeto: UniAcademy

Responsável técnico: Girlenio Gomes

Área: Backend, banco e integração

Data da validação: 14/10/2026

Ambiente: Desenvolvimento local

Testes automatizados: 10 aprovados, 0 falhas

Conexão Express/MySQL: Aprovada

Consulta de dados reais: Aprovada

Persistência direta pelo Repository: Aprovada

Compilação frontend: Aprovada

Integração de leitura React/Express/MySQL: Aprovada

Fluxo HTTP completo de cadastro: Pendente

Implantação online: Pendente

Decisão: Validação local parcial concluída. O sistema ainda necessita dos testes complementares e da configuração do ambiente de produção antes do aceite final.
