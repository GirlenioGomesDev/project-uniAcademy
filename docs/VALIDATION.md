# Validação e evidências

## Reorganização visual de 10/10/2026
Frontend separado em layout, UI, features, seções, hooks, dados e estilos; backend formatado sem alterar seus contratos. `npm test`: 10 aprovados. `npm run build`: concluído. `npm run format:check`: aprovado. Interface comparada estruturalmente com as referências fornecidas, sem validação visual em navegador nesta sessão. Fotografias continuam ilustrativas, pois os arquivos originais das capturas não estão disponíveis localmente.

## Execução de 10/10/2026
`npm test`: 10 testes aprovados, 0 falhas. `npm run build`: compilação de produção concluída. `npm install`: auditoria reportou 0 vulnerabilidades. Ambiente Node 24.21.0. Comandos de teste/build precisaram de autorização para subprocessos no sandbox Windows. Servidor/cliente MySQL não foram encontrados na inspeção local; testes SQL reais e navegação visual não foram executados. Esses limites não são tratados como aceite de produção.

## Automatizada
Na raiz: `npm test` e `npm run build`. Testes HTTP usam repositório em memória substituído; verificam comportamento, mas não executam SQL. A execução final e limites são informados no handoff.

## Banco real — executar em homologação
1. Rodar schema.sql duas vezes em MySQL 8; conferir 4 planos, 4 modalidades e 10 horários, sem duplicação.
2. Configurar ambiente e usuário mínimo. GET health deve devolver connected; interromper MySQL e confirmar erro genérico.
3. GET site-data: confirmar preços e benefits como array, is_featured como boolean.
4. POST válido com dados fictícios: conferir pending na tabela e ID igual ao retorno.
5. POST inválido, modalidade ausente e contato ausente: conferir que não há novo registro.
6. Confirmar restrições FOREIGN KEY, preço não negativo e dia válido.
7. Registrar versão MySQL, release, comandos, resultados e executor.

## Interface — executar em navegador
1. Testar larguras 360, 768 e 1440 px; verificar menu, ausência de overflow global e tabela com rolagem local.
2. Navegar por teclado; abrir/fechar modal com Escape; conferir foco, campos e consentimento.
3. Rede lenta: skeleton; API desligada: erro e retry; banco vazio: não inventar planos.
4. Filtros: todos, um dia, uma modalidade e combinação vazia.
5. Envio válido: conferir POST, sucesso, aba wa.me e ID. Bloquear popups e testar continuidade.
6. Falha 400/500/503: feedback acessível, aba provisória fechada e possibilidade de repetir.
7. Verificar âncoras, mapa regional, fotos ilustrativas, logo em todos os pontos e política de privacidade.
8. Medir contraste e testar leitor de tela; registrar eventuais desvios. Não declarar WCAG sem avaliação.

## Registro de aceite
Release: ___; ambiente: ___; executor: ___; data: ___; evidências: ___; desvios: ___; decisão do responsável: ___.
