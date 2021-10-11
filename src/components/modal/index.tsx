import React, { useRef } from 'react'
import styled, { css } from 'styled-components'
import { animated, useTransition, config } from '@react-spring/web'
import { useIsMobile } from '../../hooks/useIsMobile'
import { Card } from '../card'
import useClickAway from 'react-use/lib/useClickAway'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AnimatedDialogOverlay = animated(Overlay)
const AnimatedDialogContent = animated(Card)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ minHeight, maxHeight, maxWidth, mobile, open, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog',
})`
  overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};

  background: none;
  box-shadow: 0px 16px 12px rgba(0, 0, 0, 0.2);
  padding: 0px;
  width: ${({ mobile }) => (mobile ? '100%' : '50vw')};
  margin: ${({ mobile }) => (mobile ? '8px' : '0px')};
  overflow-y: ${({ mobile }) => (mobile ? 'scroll' : 'hidden')};
  overflow-x: hidden;

  align-self: ${({ mobile }) => (mobile ? 'flex-end' : 'center')};

  max-width: ${({ maxWidth, mobile }) => (mobile ? '100%' : `${maxWidth}px`)};
  ${({ maxHeight }) =>
    maxHeight &&
    css`
      max-height: ${maxHeight}vh;
    `}
  ${({ minHeight }) =>
    minHeight &&
    css`
      min-height: ${minHeight}vh;
    `}
`

interface ModalProps {
  open: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  maxWidth?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
  className?: string
}

export function Modal({
  open,
  onDismiss,
  minHeight = false,
  maxHeight = 90,
  maxWidth = 460,
  initialFocusRef,
  children,
  className,
}: ModalProps) {
  const modalRef = useRef(null)
  const isMobile = useIsMobile()
  const transition = useTransition(open, {
    config: { ...config.default, duration: 100 },
    from: { opacity: 0, scale: 0.9 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.9 },
    onDestroyed: () => {},
  })
  useClickAway(modalRef, onDismiss)

  return (
    <>
      {transition(
        (style, item) =>
          item && (
            <AnimatedDialogOverlay style={style} initialFocusRef={initialFocusRef}>
              <div ref={modalRef}>
                <StyledDialogContent
                  aria-label="dialog content"
                  minHeight={minHeight}
                  maxHeight={maxHeight}
                  maxWidth={maxWidth}
                  mobile={isMobile}
                  className={className}
                >
                  {/* prevents the automatic focusing of inputs on mobile by the reach dialog */}
                  {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                  {children}
                </StyledDialogContent>
              </div>
            </AnimatedDialogOverlay>
          )
      )}
    </>
  )
}
