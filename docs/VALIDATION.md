# VALIDAÇÃO E EVIDÊNCIAS — UNIACADEMY

**Responsável:** Girlenio Gomes  
**Área:** Back-end, banco de dados e integração  
**Data:** 14/10/2026  
**Projeto:** UniAcademy

## 1. Objetivo

Validar o funcionamento do back-end e do banco de dados MySQL do UniAcademy, verificando conexão real, persistência de informações, relacionamentos entre tabelas, tratamento de erros, integração com a API e publicação na nuvem.

Os testes foram realizados inicialmente em ambiente local e posteriormente utilizando o MySQL hospedado na Aiven e o back-end publicado no Render.

## 2. Tecnologias utilizadas

- Node.js 24 e Express
- MySQL 8.4 — Aiven
- mysql2
- React e Vite
- Git e GitHub
- Render — hospedagem do back-end
- SSL/TLS — comunicação segura com o banco de dados
- PowerShell — execução dos testes

## 3. Configuração do banco de dados

O banco `uniacademy_db` foi criado no MySQL da Aiven.

O arquivo `database/schema.sql` foi importado utilizando a codificação `utf8mb4` para preservar os caracteres especiais.

As seguintes tabelas foram criadas:

| Tabela | Finalidade |
|---|---|
| plans | Armazenar os planos da academia |
| modalities | Armazenar as modalidades disponíveis |
| schedules | Armazenar os horários das atividades |
| trial_requests | Armazenar solicitações de aulas experimentais |

### Resultado da verificação

| Tabela | Registros iniciais |
|---|---:|
| plans | 4 |
| modalities | 4 |
| schedules | 10 |
| trial_requests | 0 |

**Resultado: APROVADO.**

## 4. Segurança e permissões

Foi criado o usuário `uniacademy_app` para utilização exclusiva pelo back-end.

As permissões concedidas foram:

- SELECT em `plans`.
- SELECT em `modalities`.
- SELECT em `schedules`.
- INSERT em `trial_requests`.

O usuário não possui permissões administrativas sobre o banco.

A conexão utiliza SSL, com validação do certificado CA disponibilizado pela Aiven.

As credenciais são armazenadas em variáveis de ambiente e não devem ser incluídas no repositório GitHub.

**Resultado: APROVADO.**

## 5. Integração entre Express e MySQL

O back-end foi configurado para acessar o banco da Aiven utilizando as variáveis de ambiente.

A conexão foi testada pelo endpoint:

`GET /api/health`

Resposta obtida:

```json
{
  "status": "ok",
  "database": "connected"
}
```

O teste foi realizado tanto localmente quanto na API publicada no Render.

**Resultado: APROVADO.**

## 6. Consulta dos dados reais

O endpoint utilizado foi:

`GET /api/site-data`

URL pública:

https://uniacademy-api.onrender.com/api/site-data

A resposta apresentou:

- 4 planos.
- 4 modalidades.
- 10 horários.
- Dados de contato demonstrativos.

Os nomes, descrições e benefícios foram retornados com a acentuação correta.

**Resultado: APROVADO.**

## 7. Persistência real dos dados

Foi realizado um cadastro de teste utilizando uma requisição HTTP POST na API local, conectada ao MySQL da Aiven.

Endpoint:

`POST /api/trial-request`

Dados fictícios utilizados:

| Campo | Valor |
|---|---|
| Nome | Cliente Teste UniAcademy |
| Telefone | Número fictício |
| E-mail | teste.uniacademy@example.com |
| Modalidade | Musculação |
| Consentimento | true |

Resposta recebida:

```json
{
  "id": 1,
  "status": "pending",
  "message": "Solicitação cadastrada com sucesso!"
}
```

Em seguida, foi realizada a consulta:

```sql
SELECT
    id,
    client_name,
    preferred_modality
FROM trial_requests
WHERE id = 1;
```

Resultado:

| id | client_name | preferred_modality |
|---|---|---|
| 1 | Cliente Teste UniAcademy | Musculação |

A consulta comprovou que o registro foi salvo no banco de dados real, e não apenas armazenado na memória do servidor.

Foi solicitado executar a exclusão controlada do registro fictício. A quantidade de linhas removidas não foi registrada na evidência apresentada.

**Resultado: APROVADO — persistência real comprovada.**

## 8. Validação dos relacionamentos

Foram identificados dois relacionamentos entre tabelas:

| Tabela de origem | Campo | Tabela referenciada |
|---|---|---|
| schedules | modality_name | modalities.name |
| trial_requests | preferred_modality | modalities.name |

### Teste 1 — Solicitação com modalidade inexistente

Foi executada uma tentativa de cadastro utilizando uma modalidade que não existe no banco.

Resultado:

`ERROR 1452 (23000): Cannot add or update a child row`

O banco rejeitou o cadastro devido à restrição de chave estrangeira.

### Teste 2 — Horário com modalidade inexistente

Foi executada uma tentativa de inserir um horário associado a uma modalidade inexistente.

Resultado:

`ERROR 1452 (23000): Cannot add or update a child row`

O banco rejeitou a operação.

Os dois testes foram realizados em transações encerradas com `ROLLBACK`.

**Resultado: APROVADO — integridade referencial validada.**

## 9. Validação das restrições do MySQL

### Teste 3 — Plano com preço negativo

Foi realizada uma tentativa de cadastrar um plano com preço de R$ -50,00.

Resultado:

`ERROR 3819 (HY000): Check constraint 'chk_price' is violated.`

O banco impediu o cadastro.

**Resultado: APROVADO.**

### Teste 4 — Dia da semana inválido

Foi realizada uma tentativa de cadastrar um horário utilizando `weekday = 9`.

Resultado:

`ERROR 3819 (HY000): Check constraint 'chk_weekday' is violated.`

O banco impediu o cadastro de um dia fora do intervalo permitido.

**Resultado: APROVADO.**

Os testes utilizaram transações encerradas com `ROLLBACK`.

## 10. Tratamento de falhas da API

Foi enviada uma solicitação de cadastro contendo um e-mail inválido.

Resposta HTTP:

`400 Bad Request`

Corpo da resposta:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revise os campos informados.",
    "details": [
      {
        "field": "email",
        "message": "\"email\" must be a valid email"
      }
    ]
  }
}
```

O resultado confirmou que o back-end verifica as informações recebidas e rejeita entradas inválidas.

Os testes automatizados também cobriram:

- Modalidade inexistente.
- JSON malformado.
- Erro interno sem exposição de detalhes sensíveis.
- Origem CORS não autorizada.
- Limitação de requisições.

**Resultado: APROVADO para os cenários executados.**

## 11. Cadastro sem WhatsApp ou Instagram obrigatório

O funcionamento do cadastro foi atualizado para que as solicitações sejam armazenadas diretamente no MySQL, sem exigir WhatsApp ou Instagram.

O fluxo atualizado é:

1. O aluno preenche o formulário.
2. O React envia os dados para o back-end.
3. O Express valida as informações.
4. O MySQL armazena a solicitação.
5. A API retorna o ID e a confirmação de cadastro.
6. O formulário apresenta uma mensagem de sucesso.

O campo de telefone do aluno continua sendo necessário para contato posterior.

A alteração foi validada localmente por requisição HTTP e consulta direta ao banco.

**Resultado: APROVADO localmente.**

A publicação dessa mudança no Render ainda precisa ser confirmada.

## 12. Testes automatizados

Comando executado:

```bash
npm test
```

Resultados obtidos:

| Indicador | Quantidade |
|---|---:|
| Total de testes | 10 |
| Aprovados | 10 |
| Falhas | 0 |
| Cancelados | 0 |
| Ignorados | 0 |

Os testes verificaram:

1. Consulta do catálogo e saúde da API.
2. Cadastro com retorno de confirmação.
3. Rejeição de dados inválidos.
4. Rejeição de modalidade inexistente.
5. Cadastro sem WhatsApp configurado.
6. Proteção contra exposição de erros internos.
7. Bloqueio de origem CORS desconhecida.
8. Tratamento de JSON inválido.
9. Disponibilidade dos contratos OpenAPI.
10. Limitação de requisições.

**Resultado: APROVADO.**

Observação: os testes automatizados utilizam repositórios simulados. A persistência com MySQL real foi comprovada separadamente.

## 13. Build do front-end

Comando utilizado:

```bash
npm run build
```

Resultado:

```text
vite v7.3.7 building client environment for production...
1603 modules transformed.
built in 4.45s
```

O React foi compilado com sucesso após as alterações no formulário.

**Resultado: APROVADO.**

## 14. Publicação do back-end no Render

O back-end foi publicado no serviço `uniacademy-api`, utilizando a plataforma Render.

Configuração:

| Item | Valor |
|---|---|
| Hospedagem | Render |
| Repositório | GirlenioGomesDev/project-uniAcademy |
| Branch | main |
| Build Command | npm ci |
| Start Command | npm start -w backend |
| Deploy automático | On Commit |
| Banco conectado | MySQL Aiven |
| SSL | Ativado |

URL:

https://uniacademy-api.onrender.com

O deploy inicial foi concluído com o status `Live`.

Foram validados os endpoints públicos:

- `GET /api/health`
- `GET /api/site-data`

**Resultado: APROVADO para a versão publicada anteriormente.**

As alterações posteriores no cadastro ainda precisam ser enviadas ao GitHub para atualização automática do Render.

## 15. Integração com o front-end

O back-end disponibiliza a seguinte URL base:

`https://uniacademy-api.onrender.com/api`

Para o front-end React/Vite, a configuração prevista é:

```env
VITE_API_URL=https://uniacademy-api.onrender.com/api
```

Quando o front-end for publicado pela equipe, seu domínio deverá ser incluído na variável `CORS_ORIGINS` do Render.

A integração local de leitura foi validada.

A integração entre o front-end publicado e a API pública ainda depende da publicação realizada pelos colegas.

## 16. Pendências finais

Antes de considerar o trabalho completamente encerrado, ainda precisamos:

- Conferir e atualizar a documentação Swagger/OpenAPI para refletir o cadastro sem WhatsApp.
- Enviar as alterações locais para o GitHub.
- Confirmar o deploy automático da versão atualizada no Render.
- Testar o POST de cadastro na API pública.
- Confirmar a remoção dos registros fictícios utilizados nos testes.
- Verificar a restauração do backup em um banco isolado.
- Adicionar ao CORS o domínio do front-end após sua publicação.

Os testes com indisponibilidade real do banco devem ser realizados em ambiente controlado, sem interromper o serviço compartilhado.

## 17. Conclusão

Os testes realizados demonstraram o funcionamento do MySQL real e sua integração com o back-end Express.

Foi possível comprovar a persistência de dados por requisição HTTP, a integridade dos relacionamentos, a aplicação de restrições do banco e o tratamento de entradas inválidas.

Os dez testes automatizados foram aprovados e o build do React foi concluído sem erros.

A infraestrutura do back-end já foi publicada e validada no Render, utilizando o MySQL da Aiven com conexão SSL.

**Situação geral: requisitos principais de back-end, banco de dados e integração validados, com pendências de atualização da documentação da API, publicação da nova versão e verificações finais.**



## 18. Validação final da persistência em produção

Foi realizado um teste de cadastro utilizando a API pública
do UniAcademy, hospedada no Render e conectada ao MySQL
da Aiven.

Endpoint:
POST https://uniacademy-api.onrender.com/api/trial-request

Dados fictícios:
- Nome: Teste Publico UniAcademy
- E-mail: teste.publico@example.com
- Modalidade: Musculação
- Consentimento: true

Resposta recebida:
- ID: 3
- Status: pending
- Mensagem: Solicitação cadastrada com sucesso!

Após a requisição, foi executada uma consulta SQL diretamente
no MySQL da Aiven, que confirmou a existência do registro ID 3
com os mesmos dados enviados à API.

O registro fictício foi posteriormente removido.

Resultado: APROVADO.

Conclusão: a API publicada no Render recebe solicitações
e persiste os dados no MySQL da Aiven sem depender de
WhatsApp ou Instagram.

O deploy automático do commit b258d51 também foi
confirmado no Render com status Live.




## 19. Teste de restauração do backup

Foi realizado um teste de recuperação do banco de dados
MySQL em um ambiente local isolado.

Arquivo utilizado: backup_uniacademy.sql
Banco de destino: uniacademy_restore_test

Antes da restauração, foi criada uma cópia do backup
sem a instrução global GTID_PURGED, preservando o
arquivo original.

A importação foi concluída sem erros.

Após a restauração, foram executados SHOW TABLES e
consultas COUNT(*) para verificar os dados recuperados.

Resultados:
- plans: 4 registros
- modalities: 4 registros
- schedules: 10 registros
- trial_requests: 0 registros

As quatro tabelas foram recuperadas corretamente.

Resultado: APROVADO.

Conclusão: foi comprovada a recuperação básica do
backup local sem alterar o banco de produção da Aiven.

Observação: o teste não equivale à validação de um
backup atual do banco hospedado na nuvem.
