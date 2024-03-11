import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import {DistributeToRail} from './actions'
import {colorInput} from '@sanity/color-input'
import {
    BookIcon,
    CubeIcon,
    DesktopIcon,
    ControlsIcon,
    PresentationIcon,
    HomeIcon,
    PlayIcon,
    UserIcon,
} from '@sanity/icons'
import {PiSpeakerHighLight} from 'react-icons/pi'

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
const singletonTypes = new Set(['railConfig'])

export default defineConfig({
    name: 'default',
    title: 'MoMM DREX',

    projectId: '4udqswqp',
    dataset: 'production',

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        S.documentTypeListItem('rail').title('Rails').icon(DesktopIcon),
                        S.documentTypeListItem('story').title('Stories').icon(BookIcon),
                        S.documentTypeListItem('artifact').title('Artifacts').icon(CubeIcon),
                        S.documentTypeListItem('musicalMoment')
                            .title('Musical Moments')
                            .icon(PlayIcon),
                        S.documentTypeListItem('oralHistory')
                            .title('Oral Histories')
                            .icon(UserIcon),
                        S.documentTypeListItem('factoryFootage')
                            .title('Factory Footage')
                            .icon(HomeIcon),
                        S.documentTypeListItem('soundSample')
                            .title('Sound Sample')
                            .icon(PiSpeakerHighLight),
                        S.documentTypeListItem('customMediaClip')
                            .title('Custom Media Clips')
                            .icon(PresentationIcon),
                        S.listItem()
                            .title('Rail Configuration')
                            .icon(ControlsIcon)
                            .id('railConfig')
                            .child(S.document().schemaType('railConfig').documentId('railConfig')),
                    ]),
        }),
        visionTool(),
        colorInput(),
    ],

    schema: {
        types: schemaTypes,
        // templates: (templates) =>
        //     templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
    },

    document: {
        actions: (prev, context) => {
            return context.schemaType === 'rail'
                ? [...prev.slice(0, 1), DistributeToRail, ...prev.slice(1)]
                : singletonTypes.has(context.schemaType)
                  ? prev.filter(({action}) => action && singletonActions.has(action))
                  : prev
        },
    },
})
