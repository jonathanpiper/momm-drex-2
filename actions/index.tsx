import {useState, useEffect} from 'react'
import groq from 'groq'
import {createClient} from '@sanity/client'
import {DocumentActionComponent} from 'sanity'
import {DesktopIcon} from '@sanity/icons'
import {FetchCompleteRail} from '../queries/FetchCompleteRail'
import axios from 'axios'

export const client = createClient({
    projectId: '4udqswqp',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2023-10-06',
})

const middlewareURL = 'http://localhost:3000/'
// const wsURL = 'ws://localhost:3000'

export const DistributeToRail: DocumentActionComponent = ({
    id,
    onComplete,
    published,
}: {
    id: string
    onComplete: any
    published: any
}) => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [railResult, setRailResult] = useState<any>()
    const [loadedRailResult, setLoadedRailResult] = useState<boolean>(false)
    const [middlewareActive, setMiddlewareActive] = useState<boolean>()

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

    const getMiddlewareStatus = async () => {
        axios.get(`${middlewareURL}status`).then((response) => {
            console.log(response)
            setMiddlewareActive(response.status === 200 ? true : false)
        })
    }

    useEffect(() => {
        if (loadedRailResult && middlewareActive) {
            axios.post(`${middlewareURL}api/transform`, {railResult}).then((response) => {
                console.log(response)
            })
        }
    }, [loadedRailResult, middlewareActive])

    return {
        label: 'Distribute to Rail',
        header: 'Distribute to Rail',
        icon: DesktopIcon,
        disabled: published === null,
        onHandle: () => {
            setDialogOpen(true)
            getCompleteRail(id)
            getMiddlewareStatus()
        },
        onClose: onComplete,
        dialog: dialogOpen && {
            type: 'dialog',
            onClose: onComplete,
            content: (
                <div>
                    <p>
                        {loadedRailResult
                            ? railResult
                                ? railResult.title
                                : 'Could not load rail content. Verify that all items are complete and published.'
                            : 'Loading rail content.'}
                    </p>
                    <p>{middlewareActive ? 'Middleware is active' : 'Middleware not connected'}</p>
                </div>
            ),
        },
    }
}
