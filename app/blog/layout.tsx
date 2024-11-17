import React, { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      }>
        {children}
      </Suspense>
    </div>
  )
}

export default layout