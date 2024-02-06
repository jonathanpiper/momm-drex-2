import {PreviewProps} from 'sanity'
import {Badge, Flex, Box, BadgeProps} from '@sanity/ui'

export function ArtifactPreview(props: PreviewProps) {
    console.log(props)
    return (
        <Flex align="center">
            <Box flex={1}>{props.renderDefault({...props})}</Box>
        </Flex>
    )
}