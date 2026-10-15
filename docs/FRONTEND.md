# Organização e fidelidade visual

## Responsabilidades

`pages/Home.jsx` compõe a página, sem conteúdo estático, consulta de API ou lógica de envio embutida. `components/layout` contém cabeçalho e rodapé. `components/ui` contém marca e título reutilizáveis. `config/navigation.js` é a fonte única de navegação.

`features/home/sections` contém as dez seções institucionais e a faixa informativa. `features/home/components` contém cartões de planos e grade de horários. `features/home/hooks/useSiteData.js` gerencia carregamento, cancelamento e tentativa de recuperação. `features/home/data/content.js` contém fotos e FAQ.

`features/trial/components` contém o modal; `features/trial/hooks` gerencia envio e redirecionamento. `services/api.js` é a fronteira HTTP, com timeout e tratamento de resposta. Somente essa camada conhece a URL da API.

Estilos separam tokens e base (`base.css`), navegação (`layout.css`), seções (`sections.css`), controles/estados (`components.css`) e adaptações de tela (`responsive.css`). `styles.css` apenas importa a composição e o Tailwind. Não há arquivo adicional sobrepondo todo o design. Frontend e backend usam formatação Prettier consistente.

## Correspondência às referências

Cabeçalho branco, marca à esquerda, oito âncoras e dois botões à direita. Hero com texto grande à esquerda, foto de fundo, dois CTAs e localização no canto inferior direito. Faixa informativa com três colunas. Sobre com imagem à esquerda e texto/quote à direita. Diferenciais em faixa escura com três colunas. Quatro modalidades e quatro planos no desktop. Horários com resumo à esquerda, três cartões à direita e tabela com filtros ao expandir. Galeria em quatro colunas com primeira imagem ocupando duas, seguida por quatro imagens na segunda linha. Localização em duas colunas. Contato com introdução e três cartões. FAQ aberta inicialmente, CTA final em duas colunas e rodapé com navegação.

Preservadas adaptações solicitadas: UniAcademy, logo original, Recife, roxo/preto/branco e novos planos. Fotos dos screenshots não foram fornecidas como arquivos separados; o JPG local é a logo. Portanto imagens ilustrativas continuam sendo substitutas, e não se declara reprodução fotográfica exata. Para igualdade dos ativos, substituir URLs no conteúdo e no seed por imagens originais licenciadas.

## Convenções

Componentes em PascalCase; hooks com prefixo use; configuração/dados fora da renderização; HTTP fora dos componentes; mudanças de contrato documentadas no backend. `npm run format` formata fontes; `npm run format:check` verifica consistência. Seção só deve ser extraída em novos componentes quando existir responsabilidade reutilizável ou comportamento independente.
