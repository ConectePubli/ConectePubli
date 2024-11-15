import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/aprovar',
)({
  component: () => (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-bold text-xl">Aqui seria a tela de administração da campanha</h1>

      <p>Não planejo colocar nada aqui no momento como uma lôgica de conseguir os dados da campanha pois seria melhor deixar isso para quem estiver com a US dessa tela no fúturo já que seria mais fácil do que seguir o meu côdigo (que é bem ruim)</p>

      <p>Para testar a edição: http://localhost:5173/dashboard/campanhas/id da campanha/editar</p>

      <p>Exemplo: http://localhost:5173/dashboard/campanhas/2qyy2t1tstoth27/editar - Para encontrar o ID é só olhar na URL dessa tela ou ir na Pocketbase. Também é póssivel trocar a URL de "aprovar" para "editar", pois também funciona</p>

      <span className="font-medium">Nota adicional: Não é póssivel editar a campanha de outro usuário então tem que ser a sua própria. Também o ideal seria só deixar editavel se a campanha não ter pessoas inscritas inicialmente, mais isso vem depois já que vai dificultar os testes de começo já que eu coloco várias campanhas no meu nome atrávez da Pocketbase e seria bem estranho tentar acessar um ID que deveria funcionar mais não funciona magicamente pois eu me inscrevi nela sem a sua permissão</span>
    </div>
  ),
})
