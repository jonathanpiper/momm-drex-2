import {Card, Text, Flex, TextArea, Stack} from '@sanity/ui'
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
    inputProps: {onChange},
  } = props
  const [wordCount, setWordCount] = useState(0)
  const [text, setText] = useState(value)

  useEffect(() => {
    const words = text.split(' ')
    let wordCount = 0
    words.forEach((word) => {
      if (word.trim() !== '') {
        wordCount++
      }
    })
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
    <Flex direction="column" height="fill">
      <Card padding={0}>
        <Stack space="3">
          <Text as="label" size="1" weight="semibold">
            {title}
          </Text>
          <Text size="1" muted="1">
            {description}
          </Text>
          <StyledTextArea
            value={value}
            rows={18}
            resize="vertical"
            onChange={handleChange}
            readOnly={false}
          />
          <Text size="1" muted="1">
            Word count: {wordCount}
          </Text>
        </Stack>
      </Card>
    </Flex>
  )
}

export default TextAreaWithCount
