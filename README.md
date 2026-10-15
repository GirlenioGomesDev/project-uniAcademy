# UniAcademy

Projeto web demonstrativo de uma academia moderna em Recife, Pernambuco. A identidade visual utiliza roxo, preto e branco, com a marca UniAcademy e um layout inspirado nas referências do projeto.

## Experiência

- Apresentação da academia, proposta e diferenciais.
- Modalidades de musculação, funcional, dança e lutas.
- Planos Light, Plus, MegaPlus e Day-use.
- Consulta de horários e apresentação da estrutura.
- Informações de localização e contato.
- Solicitação de aula experimental, sujeita à confirmação da equipe.
- Interface adaptada a celulares, tablets e computadores.

## Qualidade e organização

O projeto adota separação de responsabilidades, padronização de código, revisão de alterações e verificação automatizada. A documentação pública apresenta o produto e as práticas de qualidade; instruções de configuração e operação são destinadas à equipe responsável e mantidas separadamente.

As práticas de processo são inspiradas em CMMI e MPS.BR, sem declaração de certificação ou nível de maturidade formal. Consulte [Qualidade e processo](docs/QUALITY.md).

## Regras de maturidade de desenvolvimento

Este projeto acadêmico deve demonstrar o processo utilizado para construir o produto, além de apresentar suas funcionalidades. Toda alteração deve:

1. Estar associada a um requisito e a um critério de aceitação verificável.
2. Ter responsável, escopo e impacto registrados antes da implementação.
3. Preservar a separação de responsabilidades e a padronização do código.
4. Passar por revisão de outro integrante da equipe.
5. Apresentar evidências de testes e verificação visual quando afetar a interface.
6. Atualizar a documentação pertinente e registrar desvios ou limitações.
7. Receber aceite antes de ser considerada concluída.

A equipe acompanha qualidade, cumprimento de requisitos e melhorias por entrega. O processo completo, os procedimentos de execução e o mapa técnico de manutenção ficam no guia de circulação interna. Informações operacionais não fazem parte deste documento público.

## Demonstração acadêmica

O modo demonstrativo permite explorar planos, modalidades, grade de horários e simular a aula experimental sem guardar dados pessoais. Telefones, perfil social, endereço e mapa estão identificados como fictícios ou ilustrativos.

O rodapé disponibiliza informações de privacidade, proteção de dados e termos de uso. A demonstração não comprova conformidade legal integral, certificação ou maturidade organizacional formal. O uso real depende de validação dos responsáveis, dos dados institucionais e do tratamento de informações pessoais.

## Conteúdo demonstrativo

Preços, horários e condições comerciais precisam ser aprovados pela academia antes da divulgação. As fotografias são ilustrativas. Endereço e contatos oficiais dependem de confirmação.

© 2026 UniAcademy.

## Configuração de dados e cadastros

O back-end usa `DATA_SOURCE=mysql` por padrão. Nesse modo, a API valida a modalidade e salva a solicitação de aula experimental no MySQL, devolvendo confirmação sem exigir WhatsApp ou Instagram. Configure as variáveis do arquivo `backend/.env.example` apenas no ambiente local ou no serviço de hospedagem; nunca publique credenciais.

Para uma demonstração sem banco, use explicitamente `DATA_SOURCE=demo` em desenvolvimento. O formulário será simulado e nenhum dado será armazenado. **O modo `demo` é bloqueado em produção.** O front-end também pode apresentar um catálogo demonstrativo em ambiente local quando a API não está disponível; isso não significa que exista conexão com o banco.

Verifique as evidências de integração em `docs/VALIDATION.md` e as instruções de operação em `docs/OPERATIONS.md`.
