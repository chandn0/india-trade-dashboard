import * as React from 'react';

// Charts size their SVG viewBox to the measured container width (1 viewBox unit = 1 CSS px),
// so axis text and strokes render at true pixel sizes on every screen instead of scaling down
// with a fixed-width viewBox. Below COMPACT_BELOW the geometry switches to a phone layout:
// taller aspect, tighter padding, fewer axis labels, shorter tick formats.
export const COMPACT_BELOW = 560;

export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

export function useMeasuredWidth(ref, fallback) {
  const [width, setWidth] = React.useState(fallback);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w > 0) setWidth(w);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}
