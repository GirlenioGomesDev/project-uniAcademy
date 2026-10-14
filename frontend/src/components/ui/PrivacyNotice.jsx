export default function PrivacyNotice() {
  return (
    <div className="privacy-content">
      <p>
        Esta é uma demonstração acadêmica. No modo demonstrativo, o formulário apenas simula a
        solicitação: não armazena dados e não envia mensagens. Utilize informações fictícias.
      </p>
      <h4>Finalidade e dados</h4>
      <p>
        Em uma operação real, nome, telefone, e-mail e modalidade serão utilizados para responder ao
        pedido de aula experimental, mediante a autorização apresentada no formulário. Não são
        solicitados dados de saúde.
      </p>
      <h4>Seus direitos</h4>
      <p>
        Você pode solicitar acesso, correção de dados e revogação do consentimento, além dos demais
        direitos aplicáveis. O controlador e seu canal oficial devem ser identificados antes de
        qualquer coleta real. Os contatos deste projeto são fictícios e não atendem pedidos de
        titulares.
      </p>
      <h4>Serviços externos e conservação</h4>
      <p>
        As fotos ilustrativas são carregadas de um provedor externo, que recebe dados técnicos da
        conexão. As fontes são hospedadas no próprio site. Não utilizamos rastreadores
        publicitários. Links de mapas e WhatsApp somente são abertos quando acionados. No modo real,
        o WhatsApp receberá nome e modalidade ao continuar o atendimento.
      </p>
      <p>
        A retenção e a exclusão precisam ser definidas e implementadas pelo responsável antes da
        operação real; a demonstração não representa conformidade legal certificada.
      </p>
      <a
        href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares"
        target="_blank"
        rel="noreferrer"
      >
        Conheça seus direitos no portal da ANPD ↗
      </a>
    </div>
  );
}
