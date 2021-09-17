import { Placement } from '@popperjs/core'
import { transparentize } from 'polished'
import React, { MutableRefObject, useCallback, useState } from 'react'
import { usePopper } from 'react-popper'
import styled from 'styled-components'
import Portal from '@reach/portal'
import { Card } from '../card'
import { useInterval } from 'react-use'

const PopoverContainer = styled(Card)<{ show: boolean; style: any }>`
  z-index: ${(props) => (props.show ? 9999 : 0)};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transform: translateY(${(props) => (props.show ? 0 : '1000000000px')});
  transition: ${(props) => (props.show ? 'opacity 0.2s ease' : 'transform 0.2s ease 0.2s, opacity 0.2s ease')};
  box-shadow: 0px 0px 8px ${({ theme }) => transparentize(0.84, theme.black)};
`

const ReferenceElement = styled.div`
  display: flex;
`

export interface PopoverProps {
  content: React.ReactNode
  show: boolean
  children: React.ReactNode
  placement?: Placement
  innerRef?: MutableRefObject<HTMLDivElement | null>
  className?: string
  offsetX?: number
  offsetY?: number
}

export function Popover({
  content,
  show,
  innerRef,
  children,
  placement = 'auto',
  offsetY = 8,
  offsetX = 0,
}: PopoverProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [offsetX, offsetY] } },
      {
        name: 'computeStyles',
        options: { adaptive: false },
      },
    ],
  })
  const updateCallback = useCallback(() => {
    update && update()
  }, [update])
  useInterval(updateCallback, show ? 100 : null)

  return (
    <>
      <ReferenceElement ref={setReferenceElement as any}>{children}</ReferenceElement>
      <Portal>
        <div ref={innerRef}>
          <PopoverContainer show={show} ref={setPopperElement} style={styles.popper} {...attributes.popper}>
            {content}
          </PopoverContainer>
        </div>
      </Portal>
    </>
  )
}
