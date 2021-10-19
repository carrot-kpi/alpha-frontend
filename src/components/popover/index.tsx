import React, { cloneElement, useRef } from 'react'
import { usePopper } from 'react-popper'
import styled from 'styled-components'
import { Card } from '../card'
import { useTransition, config, animated } from '@react-spring/web'
import useClickAway from 'react-use/lib/useClickAway'

const PopoverContainer = styled(Card)`
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
`

export interface PopoverProps {
  content: React.ReactNode
  show: boolean
  onHide: () => void
  children: any
  className?: string
  offsetX?: number
  offsetY?: number
}

export function Popover({ content, show, onHide, children }: PopoverProps) {
  const referenceRef = useRef<HTMLDivElement | null>(null)
  const popperRef = useRef<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(referenceRef.current, popperRef.current, {
    placement: 'bottom-end',
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
  })
  const transition = useTransition(show, {
    from: { opacity: 0, scale: 0.9 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.9 },
    config: { ...config.default, duration: 100 },
  })
  useClickAway(popperRef, onHide)

  return (
    <>
      {cloneElement(children, { ref: referenceRef, innerRef: referenceRef, style: { cursor: 'pointer' } })}
      <div ref={popperRef} {...attributes.popper} style={styles.popper}>
        {transition(
          (transitionStyles, item) =>
            item && (
              <animated.div style={transitionStyles}>
                <PopoverContainer clickable={false}>{content}</PopoverContainer>
              </animated.div>
            )
        )}
      </div>
    </>
  )
}
