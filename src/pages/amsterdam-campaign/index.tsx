import { ReactElement, useEffect } from 'react'

export function AmsterdamCampaign(): ReactElement {
  useEffect(() => {
    window.location.href = 'https://amsterdam.carrot.eth.limo'; 
  }, []);

  return <></>
}
