# Text Reveal Animation

A reusable React component for revealing text line-by-line using GSAP and SplitType.

## Setup

1. **Install Dependencies**:

   ```bash
   npm install gsap @gsap/react split-type
   # or
   pnpm add gsap @gsap/react split-type
   ```

2. **Add CSS Utilities**:
   Add this to your global CSS (e.g., `globals.css`) to ensure the font renders correctly during the split:

   ```css
   .line {
     display: block;
     line-height: 1.2; /* Adjust as needed */
   }

   .line-mask {
     overflow: hidden;
     padding-bottom: 0.05em; /* Prevents descender clipping */
   }
   ```

## Usage

Import the component and wrap your text elements.

```tsx
import TextReveal from "./TextReveal";

export default function MyComponent() {
  return (
    <section>
      <TextReveal>
        <h1>This is a headline that animates in.</h1>
      </TextReveal>

      {/* With options */}
      <TextReveal animateOnScroll={true} delay={0.2} stagger={0.05}>
        <p>
          This paragraph will animate when it scrolls into view. It handles
          multiple lines automatically.
        </p>
      </TextReveal>
    </section>
  );
}
```

## Props

| Prop              | Type      | Default     | Description                                                 |
| ----------------- | --------- | ----------- | ----------------------------------------------------------- |
| `animateOnScroll` | `boolean` | `false`     | If true, triggers when element enters viewport.             |
| `delay`           | `number`  | `0`         | Delay before animation starts (seconds).                    |
| `stagger`         | `number`  | `0.1`       | Time between each line animation (seconds).                 |
| `trigger`         | `boolean` | `undefined` | Manual control. Pass `true` to play, `false` to hide/reset. |
