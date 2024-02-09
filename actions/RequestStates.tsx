import {Box, Spinner, Inline, Text} from '@sanity/ui'
import {CheckmarkIcon, ErrorOutlineIcon} from '@sanity/icons'

export const Pending = (props: any) => {
    console.log(props)
    return (
        <Text size={2}>
            <Inline space={2}>
                <Spinner />
                <Text>{props.text}</Text>
            </Inline>
        </Text>
    )
}

export const Success = (props: any) => {
    console.log(props)
    return (
        <Text size={2}>
            <Inline space={2}>
                <CheckmarkIcon></CheckmarkIcon>
                <Text>{props.text}</Text>
            </Inline>
        </Text>
    )
}

export const Failed = (props: any) => {
    console.log(props)
    return (
        <>
            <Text size={2}>
                <Inline space={2}>
                    <ErrorOutlineIcon></ErrorOutlineIcon>
                    <Text>{props.text}</Text>
                </Inline>
                {props.error ? (
                    <Box paddingLeft={4} paddingTop={3} paddingBottom={2}>
                        <Text>{props.error}</Text>
                    </Box>
                ) : (
                    ''
                )}
            </Text>
        </>
    )
}
