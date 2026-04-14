import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Loading from './Loading'

const GalleryDashboard = dynamic(() => import('@/components/GalleryDashboard'), {
  ssr: false,
  loading: () => <Loading />,
})

export default function GalleryPage() {
  useEffect(() => {
    document.body.classList.add('app-mode')
    return () => document.body.classList.remove('app-mode')
  }, [])

  return <GalleryDashboard />
}
