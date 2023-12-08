import {useState, useEffect} from 'react'
import groq from 'groq'
import {createClient} from '@sanity/client'
import {DocumentActionComponent} from 'sanity'
import {DesktopIcon} from '@sanity/icons'
import {FetchCompleteRail} from '../queries/FetchCompleteRail';

export const client = createClient({
  projectId: '4udqswqp',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-10-06',
})

const middlewareURL = ''

export const DistributeToRail: DocumentActionComponent = ({
  id,
  type,
  published,
  onComplete,
}: {
  id: string
  type: string
  published: any
  onComplete: any
}) => {
  const getCompleteRail = async (id: string) => {
    const params = {
      id: id,
    }
    client.fetch(FetchCompleteRail, params).then((result) => {
        console.log(result)
        setRailResult(result)
        setLoadedRailResult(true)
    })
    console.log(loadedRailResult)
  }

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [railResult, setRailResult] = useState<any>()
  const [loadedRailResult, setLoadedRailResult] = useState<boolean>(false)
  return {
    label: 'Distribute to Rail',
    header: 'Distribute to Rail',
    icon: DesktopIcon,
    onHandle: () => {
    //   console.log(id, type, published)
      setDialogOpen(true)
      getCompleteRail(id)
    },
    onClose: onComplete,
    dialog: dialogOpen && {
      type: 'dialog',
      onClose: onComplete,
      content: <div><p>{loadedRailResult ? railResult.title : 'Loading rail content'}</p></div>,
    },
  }
}
