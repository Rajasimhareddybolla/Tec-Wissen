
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function JoinRoom({ params }: { params: { roomId: string } }) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main room with the roomId as a query parameter
    router.push(`/study-room?roomId=${params.roomId}`)
  }, [params.roomId, router])

  return (
    <div className="flex items-center justify-center h-screen bg-[#1C1C1C] text-white">
      <p>Joining room...</p>
    </div>
  )
}
