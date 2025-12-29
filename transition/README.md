# Page Transition Animation

A customizable full-screen transition effect using GSAP. It creates a "blinds" or "blocks" wipe effect.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install gsap
   # or
   pnpm add gsap
   ```

## Usage

1. **Add to Layout**: Place the component in your root `layout.tsx` (or any parent component).
2. **Control with Ref**: Use a `ref` to map the `cover()` and `reveal()` functions to your routing logic.

```tsx
"use client";
import React, { useRef } from "react";
import Transition, { TransitionHandle } from "./Transition";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const transitionRef = useRef<TransitionHandle>(null);
  const router = useRouter();

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();

    // 1. Start Cover Animation
    transitionRef.current?.cover(() => {
      // 2. Navigate after clean cover
      router.push(href);

      // 3. Reveal on new page (simulate with timeout if same component)
      // In a real Next.js app, the new page mounts.
      // You might use a Template or Context to trigger reveal.
      setTimeout(() => {
        transitionRef.current?.reveal();
      }, 500);
    });
  };

  return (
    <>
      <Transition ref={transitionRef} blockColor="#ff0000" />

      <a href="/about" onClick={(e) => handleLinkClick(e, "/about")}>
        Go to About
      </a>
    </>
  );
}
```

## Props

| Prop             | Type     | Default  | Description                     |
| ---------------- | -------- | -------- | ------------------------------- |
| `blockColor`     | `string` | `"#333"` | Color of the transition blocks. |
| `numberOfBlocks` | `number` | `25`     | Number of horizontal slices.    |
