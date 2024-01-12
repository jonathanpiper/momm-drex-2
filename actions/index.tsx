import {useState, useEffect} from 'react'
// import groq from 'groq'
import {createClient} from '@sanity/client'
import {DocumentActionComponent} from 'sanity'
import {DesktopIcon} from '@sanity/icons'
import {FetchCompleteRail} from '../queries/FetchCompleteRail'
import {FetchRailConfig} from '../queries/FetchRailConfig'
import axios, {AxiosError} from 'axios'
import {Box, Flex, Spinner, Stack, Text} from '@sanity/ui'

export const client = createClient({
    projectId: '4udqswqp',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2023-10-06',
})

enum RequestStatus {
    Pending,
    Failed,
    Successful,
}

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
    const [loadedRailResult, setLoadedRailResult] = useState<RequestStatus>(RequestStatus.Pending)
    const [middlewareError, setMiddlewareError] = useState<string>('')
    const [middlewareActive, setMiddlewareActive] = useState<RequestStatus>(RequestStatus.Pending)
    const [railTransformed, setRailTransformed] = useState<RequestStatus>(RequestStatus.Pending)
    const [railTransformError, setRailTransformError] = useState<string>('')
    const [configResult, setConfigResult] = useState<any>()
    const [loadedConfigResult, setLoadedConfigResult] = useState<RequestStatus>(
        RequestStatus.Pending,
    )

    const getCompleteRail = async (id: string) => {
        const params = {
            id: id,
        }
        client.fetch(FetchCompleteRail, params).then((result) => {
            console.log(result)
            setRailResult(result)
            setLoadedRailResult(RequestStatus.Successful)
        })
        client.fetch(FetchRailConfig).then((result) => {
            console.log(result)
            setConfigResult(result)
            setLoadedConfigResult(RequestStatus.Successful)
        })
    }

    const getMiddlewareStatus = async () => {
        axios
            .get(`${middlewareURL}api/status`)
            .then((response) => {
                console.log(response)
                setMiddlewareActive(RequestStatus.Successful)
            })
            .catch(function (error) {
                setMiddlewareActive(RequestStatus.Failed)
                if (error.response) {
                    setMiddlewareError('Middleware was active but refused the connection.')
                } else if (error.request) {
                    setMiddlewareError('Middleware cannot be reached.')
                } else {
                    setMiddlewareError('Something went wrong.')
                }
            })
    }

    useEffect(() => {
        if (loadedRailResult && loadedConfigResult && middlewareActive) {
            axios
                .post(`${middlewareURL}api/transform`, {rail: railResult, config: configResult})
                .then((response) => {
                    // console.log(response)
                    setRailTransformed(RequestStatus.Successful)
                })
                .catch(function (error: Error | AxiosError) {
                    setRailTransformed(RequestStatus.Failed)
                    console.log(error)
                    if (axios.isAxiosError(error)) {
                        if (error.response) {
                            console.log(error.response)
                            setRailTransformError(error.response.data)
                        } else if (error.request) {
                            setRailTransformError('Middleware cannot be reached.')
                        } else {
                            setRailTransformError('Something went wrong.')
                        }
                    } else {
                        setRailTransformError('Something went wrong.')
                    }
                })
        }
    }, [loadedRailResult, middlewareActive, railResult, configResult, loadedConfigResult])

    // useEffect(() => {
    //     if (railTransformed && middlewareActive) {
    //         axios.post(`${middlewareURL}api/deploy`, {railIdentifier: railResult.identifier}).then((response) => {
    //             console.log(response)
    //         })
    //     }
    // }, [railTransformed, middlewareActive, railResult])

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
                <Stack space={5}>
                    <Text size={2}>
                        {(() => {
                            switch (loadedRailResult) {
                                case RequestStatus.Pending:
                                    return (
                                        <>
                                            <Flex direction="row">
                                                <Spinner />
                                                Fetching rail contents.
                                            </Flex>
                                        </>
                                    )
                                case RequestStatus.Failed:
                                    return 'Could not fetch rail contents.'
                                case RequestStatus.Successful:
                                    return `Successfully loaded rail contents.`
                            }
                        })()}
                    </Text>
                    <Text size={2}>
                        {(() => {
                            switch (middlewareActive) {
                                case RequestStatus.Pending:
                                    return (
                                        <>
                                            <Flex direction="row">
                                                <Spinner />
                                                Connecting to middleware.
                                            </Flex>
                                        </>
                                    )
                                case RequestStatus.Failed:
                                    <>
                                        Middleware connection failed with this message:{' '}
                                        <Box padding={3}>
                                            <Text size={2}>{middlewareError}</Text>
                                        </Box>
                                    </>
                                case RequestStatus.Successful:
                                    return 'Successfully connected to middleware. 🎉'
                            }
                        })()}
                    </Text>
                    <Text size={2}>
                        {(() => {
                            switch (railTransformed) {
                                case RequestStatus.Pending:
                                    return
                                case RequestStatus.Failed:
                                    return (
                                        <>
                                            Rail definition failed with this message:{' '}
                                            <Box padding={3}>
                                                <Text size={2}>{railTransformError}</Text>
                                            </Box>
                                        </>
                                    )
                                case RequestStatus.Successful:
                                    return 'Rail definition created and files copied to server. 🤖'
                            }
                        })()}
                    </Text>
                </Stack>
            ),
        },
    }
}
