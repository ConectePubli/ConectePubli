import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import CampaignCard from '@/components/ui/CampaignCard'
import Spinner from '@/components/ui/Spinner'
import { CampaignParticipation } from '@/types/Campaign_Participations'
import { Campaign } from '@/types/Campaign'
import pb from '@/lib/pb'
import { UserAuth } from '@/types/UserAuth'
import { getUserType } from '@/lib/auth'

export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/dashboard-influenciador/',
)({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType()

    if (!userType) {
      throw redirect({
        to: '/login123new',
      })
    } else if (userType !== 'Influencers') {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
})

function Page() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [campaigns, setCampaigns] = useState<CampaignParticipation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCampaignParticipations = async () => {
    setIsLoading(true)

    const user: UserAuth = JSON.parse(
      localStorage.getItem('pocketbase_auth') as string,
    )

    const records = await pb
      .collection('Campaigns_Participations')
      .getFullList<CampaignParticipation>({
        filter: `Influencer="${user.model.id}"`,
        expand: 'Campaign,Influencer',
      })

    setCampaigns(records)
    setIsLoading(false)
  }

  const { mutate: getCampaigns } = useMutation({
    mutationFn: async () => {
      await fetchCampaignParticipations()
    },
    onError: () => {
      setCampaigns([])
      setIsLoading(false)
    },
  })

  useEffect(() => {
    getCampaigns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // filter campaigns
  const filteredCampaigns = campaigns.filter((participation) => {
    const campaign = participation.expand.Campaign as Campaign
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === '' || participation.status === statusFilter
    const matchesType =
      typeFilter === '' || campaign.objective?.toLowerCase() === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // control when user filter data
  const hasFiltersApplied =
    search !== '' || statusFilter !== '' || typeFilter !== ''

  return (
    <div className="mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-2">Minhas Participações</h1>
      <p className="text-gray-700 mb-6">
        Acompanhe todas as campanhas nas quais você se inscreveu e gerencie suas
        participações.
      </p>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <label htmlFor="search" className="sr-only">
              Pesquisar pelo nome da campanha
            </label>
            <input
              type="text"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar pelo nome da campanha"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex flex-col md:flex-row w-full md:w-1/2 gap-4">
            <div className="w-full md:w-1/2">
              <label htmlFor="type" className="sr-only">
                Categoria
              </label>
              <select
                id="type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Categoria</option>
                <option value="ugc">UGC</option>
                <option value="influenciador">Influenciador</option>
              </select>
            </div>

            <div className="w-full">
              <label htmlFor="status" className="sr-only">
                Status da campanha
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Status da campanha</option>
                <option value="waiting">Aguardando</option>
                <option value="approved">Aprovado</option>
                <option value="completed">Concluído</option>
                <option value="sold_out">Esgotado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center my-10">
          <Spinner />
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      ) : (
        <>
          {filteredCampaigns.length === 0 ? (
            hasFiltersApplied ? (
              <div className="flex flex-col items-center justify-center my-10">
                <p className="text-center text-gray-700 text-base">
                  Nenhum resultado encontrado para o filtro selecionado.
                </p>
                <button
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('')
                    setTypeFilter('')
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center my-10">
                <p className="text-center text-gray-700 text-base">
                  Você ainda não se inscreveu em nenhuma campanha. Navegue pelas
                  campanhas disponíveis e comece a participar agora mesmo!
                </p>
                <button
                  onClick={() => {
                    console.log('to do')
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Explorar Campanhas
                </button>
              </div>
            )
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((participation) => (
                <CampaignCard
                  key={participation.id}
                  campaign={participation.expand.Campaign as Campaign}
                  participationStatus={participation.status}
                  fromMyCampaigns={true}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Page
