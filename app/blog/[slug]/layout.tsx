import SuspendedPostHogPageView from '@/app/components/posthog/page-view-component'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SuspendedPostHogPageView />
      {children}
    </div>
  )
}

export default layout