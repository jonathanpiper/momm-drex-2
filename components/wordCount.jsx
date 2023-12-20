/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import {Text, TextArea, Stack} from '@sanity/ui'
import {set, unset} from 'sanity'
import styled from 'styled-components'
import {useState, useEffect, useCallback} from 'react'

const StyledTextArea = styled(TextArea)`
    &[data-as='textarea'] {
        resize: vertical;
    }
`

const TextAreaWithCount = (props) => {
    const {
        value = '',
        title,
        description,
        schemaType,
        inputProps: {onChange},
    } = props
    const [wordCount, setWordCount] = useState(0)
    const [text, setText] = useState(value)

    useEffect(() => {
        let removeChar = text.replace(/[^A-Za-z]\s+|[–—]/g, ' ')
        let newWord = removeChar.trim().split(' ')
        let wordCount = newWord[0] === '' ? 0 : newWord.length
        setWordCount(wordCount)
    }, [text])

    const handleChange = useCallback(
        (event) => {
            onChange(event.currentTarget.value ? set(event.currentTarget.value) : unset())
            setText(event.currentTarget.value)
        },
        [onChange],
    )

    return (
        <Stack space="3">
            <Text as="label" size="1" weight="semibold">
                {title}
            </Text>
            {description ? (
                <Text size="1" muted="1">
                    {description}
                </Text>
            ) : (
                <></>
            )}
            <StyledTextArea
                value={value}
                rows={schemaType.rows || 12}
                resize="vertical"
                onChange={handleChange}
                readOnly={false}
            />
            {/* {props.renderDefault({...props, handleChange})} */}
            <Text size="1" muted="1">
                Word count: {wordCount}
            </Text>
        </Stack>
    )
}

export default TextAreaWithCount
