import {useState, useEffect} from 'react'
// import groq from 'groq'
import {createClient} from '@sanity/client'
import {DocumentActionComponent} from 'sanity'
import {DesktopIcon} from '@sanity/icons'
import {FetchCompleteRail} from '../queries/FetchCompleteRail'
import {FetchRailConfig} from '../queries/FetchRailConfig'
import axios, {AxiosError} from 'axios'
import {Box, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {Pending, Success, Failed} from './RequestStates'

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

const middlewareURL = 'http://192.168.168.180:3000/'

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
    const [loadedRailResult, setLoadedRailResult] = useState<RequestStatus>()
    const [middlewareError, setMiddlewareError] = useState<string>('')
    const [middlewareActive, setMiddlewareActive] = useState<RequestStatus>()
    const [railTransformed, setRailTransformed] = useState<RequestStatus>()
    const [railTransformError, setRailTransformError] = useState<string>('')
    const [railTransferred, setRailTransferred] = useState<RequestStatus>()
    const [railTransferError, setRailTransferError] = useState<string>('')
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
        setMiddlewareActive(RequestStatus.Pending)
        axios
            .get(`${middlewareURL}api/status`)
            .then((response) => {
                console.log('middleware', response)
                setMiddlewareActive(RequestStatus.Successful)
            })
            .catch(function (error) {
                console.log(error)
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
        if (
            loadedRailResult &&
            loadedConfigResult &&
            middlewareActive === RequestStatus.Successful
        ) {
            setRailTransformed(RequestStatus.Pending)
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

    useEffect(() => {
        if (
            railTransformed === RequestStatus.Successful &&
            middlewareActive === RequestStatus.Successful
        ) {
            setRailTransferred(RequestStatus.Pending)
            axios
                .post(`${middlewareURL}api/deploy`, {railIdentifier: railResult.identifier})
                .then((response) => {
                    console.log(response)
                    setRailTransferred(RequestStatus.Successful)
                })
                .catch(function (error: Error | AxiosError) {
                    setRailTransferred(RequestStatus.Failed)
                    console.log(error)
                    if (axios.isAxiosError(error)) {
                        if (error.response) {
                            console.log(error.response)
                            setRailTransferError(error.response.data)
                        } else if (error.request) {
                            setRailTransferError('Files could not be transfered')
                        } else {
                            setRailTransferError('Something went wrong.')
                        }
                    } else {
                        setRailTransferError('Something went wrong.')
                    }
                })
        }
    }, [railTransformed, middlewareActive, railResult])

    return {
        label: 'Distribute to Rail',
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
            header: 'Distribute to Rail',
            onClose: onComplete,
            content: (
                <Stack space={5}>
                    {(() => {
                        switch (loadedRailResult) {
                            case RequestStatus.Pending:
                                return <Pending text={`Fetching rail contents.`}></Pending>
                            case RequestStatus.Failed:
                                return <Failed text={'Could not fetch rail contents.'}></Failed>
                            case RequestStatus.Successful:
                                return (
                                    <Success text={`Successfully loaded rail contents.`}></Success>
                                )
                        }
                    })()}
                    {(() => {
                        switch (middlewareActive) {
                            case RequestStatus.Pending:
                                return <Pending text={`Connecting to middleware.`}></Pending>
                            case RequestStatus.Failed:
                                return (
                                    <Failed
                                        text={`Middleware connection failed with this message:`}
                                        error={middlewareError}
                                    ></Failed>
                                )
                            case RequestStatus.Successful:
                                return (
                                    <Success
                                        text={'Successfully connected to middleware. 🎉'}
                                    ></Success>
                                )
                        }
                    })()}
                    {(() => {
                        switch (railTransformed) {
                            case RequestStatus.Pending:
                                return (
                                    <Pending
                                        text={`Creating rail definition and copying files to
                                        server.`}
                                    ></Pending>
                                )
                            case RequestStatus.Failed:
                                return (
                                    <Failed
                                        text={`Rail definition failed with this message:`}
                                        error={railTransformError}
                                    ></Failed>
                                )
                            case RequestStatus.Successful:
                                return (
                                    <Success
                                        text={
                                            'Rail definition created and files copied to server. 🤖'
                                        }
                                    ></Success>
                                )
                        }
                    })()}
                    {(() => {
                        switch (railTransferred) {
                            case RequestStatus.Pending:
                                return (
                                    <Pending
                                        text={`Transferring files to rail computer. This may take
                                            several minutes, especially if the contents are
                                            being distributed for the first time.`}
                                    ></Pending>
                                )
                            case RequestStatus.Failed:
                                return (
                                    <Failed
                                        text={`File transfer failed with this message:`}
                                        error={railTransferError}
                                    ></Failed>
                                )
                            case RequestStatus.Successful:
                                return (
                                    <Success
                                        text={'Files transfered to rail computer. 🚀'}
                                    ></Success>
                                )
                        }
                    })()}
                </Stack>
            ),
        },
    }
}
