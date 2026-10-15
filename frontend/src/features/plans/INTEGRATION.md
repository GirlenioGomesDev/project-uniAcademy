# Interesse em planos — entrega de frontend

Os quatro botões abrem o mesmo componente configurável, preservando plano, preço, benefícios e identidade. O fluxo atual consiste em preenchimento e revisão local; não há envio, armazenamento, matrícula ou cobrança. Fechar o modal descarta os dados. O cadastro de aula experimental permanece separado e integrado.

## Responsabilidades

- `components/PlanInterestModal.jsx`: apresentação, campos e resumo do plano selecionado.
- `hooks/usePlanInterest.js`: estado efêmero, erros e navegação entre formulário e revisão.
- `services/planInterest.js`: normalização e preparação do contrato de dados, sem comunicação externa.
- `config/academy.js`: expediente e datas de Recife, compartilhados com a grade de aulas.

## Contrato preparado

`preparePlanInterest(plan, fields)` retorna `schema_version` 1.1, `plan_id`, `client_name`, `phone`, `email`, `preferred_date`, `experience_level` opcional, `consent` e `marketing_consent` opcional (false por padrão). Não contém preferência de horário, preço, benefícios ou dados de pagamento. Datas usam `AAAA-MM-DD`; telefone contém apenas dígitos. A preferência de data não representa um agendamento. A autorização de comunicações não é condição para revisar o interesse.

`billingPreview.js` e `PlanBillingSummary.jsx` apresentam totais e datas estimadas na revisão: mensalidade seguinte no próximo mês, limitada ao último dia quando necessário. Day-use mostra somente uma cobrança prevista. Trata-se de uma ilustração local: nenhum contrato, conta, pagamento ou calendário de cobrança real é criado. Os meios de pagamento exibidos são previstos e dependem de integração, não bandeiras ou serviços já contratados.

## Trabalho de integração do Girlenio

Definir e documentar o contrato real, validar todos os campos novamente, buscar plano e preço pelo identificador, aplicar regras de acesso e disponibilidade, registrar autorização de tratamento e implementar persistência com resposta identificável. Depois, substituir a etapa de prévia por um adaptador de envio e adicionar estados de espera, falha e confirmação real. O frontend não deve afirmar que houve cadastro enquanto o serviço não confirmar. Definir idempotência e tratamento de repetição antes de aceitar interesse real.

As regras de feriados dependem de um calendário oficial ainda não integrado; a interface informa fechamento e sujeita datas à confirmação. Nenhuma integração real foi inventada nesta entrega. As informações pessoais de teste devem ser fictícias.

## Verificação

Todos os planos usam o mesmo expediente: seg–sex 06h–23h, sábado 08h–14h, domingos e feriados fechados. O frontend apresenta essa nova regra inclusive quando o catálogo ainda contém a descrição antiga do Light; a equipe deverá atualizar a regra e os textos persistidos na integração, sem restringir o Light a 10h–16h.

Testes de navegador cobrem abertura dos quatro planos em três larguras, fechamento por Escape e retorno de foco, revisão sem requisições, horários iguais entre planos, Day-use no sábado e preservação do cadastro experimental. O preço apresentado é a informação recebida pelo catálogo, sem servir como autoridade para contratação.
