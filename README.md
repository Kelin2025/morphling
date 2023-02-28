# MorpherX

Morphing animations with ease

## How to use

```ts
import { createMorpher } from '@morpherx/core'

export const morpher = createMorpher({
  duration: 500,
  easing: 'ease-in'
})

export const openButtonPressed = createEvent()
export const closeButtonPressed = createEvent()

sample({
  clock: openButtonPressed,
  target: morpher.morphIn
})

sample({
  clock: closeButtonPressed,
  target: morpher.morphOut
})
```

```tsx
import { useMorpherIn } from '@morpherx/react'

import { morpher, openButtonPressed } from './morpher'

const OpenModalButton = () => {
  return <button ref={useMorpherIn(morpher)} onClick={openButtonPressed}>Open modal!</button>
}
```

```tsx
import { useMorpherOut } from '@morpherx/react'

import { morpher, closeButtonPressed } from './morpher'

const Modal = () => {
  return <div ref={useMorpherOut(morpher)}>
    <p>Modal content</p>
    <button onClick={closeButtonPressed}>Close modal!</button>
   </dialog>
}
