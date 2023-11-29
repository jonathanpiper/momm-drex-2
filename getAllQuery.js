export const getRailQuery = groq`*[ _type == 'rail' && identifier == 'rail1a1' ][0]
    {
        identifier,
        title,
        body,
        'dwell': 
            dwellImages[]{
                asset->
            },
        content[] {
        _type=='stories' => {
            title, 
            icon{asset->},
            items[]->{title,body,heroImage{asset->},storyMedia[]{caption,asset->}}
            },
        _type=='media' => {
            title, icon{asset->},
            musicalMoments{clips[]->
                {
                title,
                artist,
                instrument,
                credit,
                thumbnail{asset->},
                media{asset->}
                }
                },
                oralHistories{clips[]->{
                title,
                summary,
                thumbnail{asset->},
                media{asset->}
                }},
                factoryFootage{clips[]->
                            {
                title,
                caption,
                thumbnail{asset->},
                media{asset->}
                }}
        },
        _type=='artifacts' => {
            title, icon{asset->},
            items[]->{description, artifactNumber, title, credit, maker, date,artifactImages[]{asset->}}
        }
        }
    }
`
