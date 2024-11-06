import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import CampaignCard from '@/components/ui/CampaignCard'
import Spinner from '@/components/ui/Spinner'
import MultiCampaignFilter from '@/components/ui/MultiCampaignFilter'
import { Campaign } from '@/types/Campaign'
import pb from '@/lib/pb'
import { getUserType } from '@/lib/auth'

export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/vitrine-de-campanhas/',
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
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAllCampaigns = async () => {
    setIsLoading(true)

    const records = await pb
      .collection('Campaigns')
      .getFullList<Campaign>({
        expand: 'Influencer',
      })

    setCampaigns(records)
    setIsLoading(false)
  }

  const { mutate: getCampaigns } = useMutation({
    mutationFn: async () => {
      await fetchAllCampaigns()
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

  return (
    <div className="mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-2">Vitrine de Campanhas</h1>
      <p className="text-gray-700 mb-6">
        Explore todas as campanhas disponíveis e inscreva-se nas que mais combinam com o seu perfil.
      </p>

      <MultiCampaignFilter
        campaigns={campaigns}
        onFilter={setFilteredCampaigns}
        showStatusFilter={false}
        showNichoFilter={true}
        showCanalFilter={true}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center my-10">
          <Spinner />
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      ) : (
        <>
          {filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-10">
              <p className="text-center text-gray-700 text-base">
                Não há campanhas disponíveis no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Page
