import { HomeShell } from '@/components/HomeShell'
import { getPortfolioContent } from '@/lib/content'

export const revalidate = 60

export default async function HomePage() {
  const content = await getPortfolioContent()
  return <HomeShell content={content} />
}
