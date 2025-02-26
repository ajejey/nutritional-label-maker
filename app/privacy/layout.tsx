import React from 'react'
import SuspendedPostHogPageView from '../components/posthog/page-view-component'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SuspendedPostHogPageView />
      {children}
    </div>
  )
}

export default layout