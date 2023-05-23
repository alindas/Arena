import PcNotice from '@/util/pcNotice'
import React from 'react'

export default function Notice() {

  function showNotice() {
    PcNotice();
  }

  return (
    <div>
      <button onClick={showNotice}>show notice</button>
    </div>
  )
}
