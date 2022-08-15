import { useCallback, useEffect, useRef } from 'react'
import { StringFormField } from '../../types'
import { usePopper } from 'react-popper'
import styled from 'styled-components'

const PopperElement = styled.div`
  display: none;

  &[data-show] {
    display: block;
  }
`

const PopperAnchorElement = styled.div`
  width: fit-content;
`

interface StringFormWidgetProps {
  spec: StringFormField
  value: string
  onChange: (newState: any) => void
}

export const StringFormWidget = ({ spec, value, onChange }: StringFormWidgetProps) => {
  const popperElementRef = useRef<HTMLDivElement | null>(null)
  const infoElementRef = useRef<HTMLDivElement | null>(null)
  const { styles, attributes, update } = usePopper(infoElementRef.current, popperElementRef.current, {
    placement: 'right',
    modifiers: [
      { name: 'offset', options: { offset: [0, 8] } },
      {
        name: 'preventOverflow',
        options: {
          mainAxis: true,
          altAxis: true,
        },
      },
    ],
  })

  const handleLocalChange = useCallback(
    (event: any) => {
      onChange({ spec, internalState: event.target.value })
    },
    [onChange, spec]
  )

  const handleShow = useCallback(() => {
    if (!popperElementRef.current || !update) return
    popperElementRef.current.setAttribute('data-show', '')
    update()
  }, [update])

  const handleHide = useCallback(() => {
    if (!popperElementRef.current || !update) return
    popperElementRef.current.removeAttribute('data-show')
  }, [update])

  useEffect(() => {
    if (!popperElementRef.current || !infoElementRef.current || !update) return

    infoElementRef.current.addEventListener('mouseenter', handleShow)
    infoElementRef.current.addEventListener('focus', handleShow)

    infoElementRef.current.addEventListener('mouseleave', handleHide)
    infoElementRef.current.addEventListener('blur', handleHide)
  }, [handleHide, handleShow, update])

  return (
    <>
      {!!spec.label && <label htmlFor={spec.id}>{spec.label}: </label>}
      <input
        id={spec.id}
        type="text"
        value={value}
        onChange={handleLocalChange}
        placeholder={spec.placeholder}
        minLength={spec.minLength}
        maxLength={spec.maxLength}
        readOnly={spec.readonly}
        required={spec.required}
      />
      {!!spec.description && (
        <>
          <PopperAnchorElement ref={infoElementRef}>Hover for info</PopperAnchorElement>
          <PopperElement ref={popperElementRef} {...attributes.popper} style={styles.popper}>
            {spec.description}
          </PopperElement>
        </>
      )}
    </>
  )
}
