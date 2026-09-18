import { useEffect, useRef, useState } from "react";

export default function MarqueeText({ text }) {
  const viewportRef = useRef(null);
  const textRef = useRef(null);
  const [style, setStyle] = useState(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const textEl = textRef.current;
    if (!viewport || !textEl) return;

    const measure = () => {
      const overflow = textEl.scrollWidth - viewport.clientWidth;
      if (overflow > 4) {
        const distance = overflow + 24;
        const duration = Math.max(6, distance / 30);
        setStyle({ "--marquee-distance": `-${distance}px`, "--marquee-duration": `${duration}s` });
      } else {
        setStyle(null);
      }
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    return () => resizeObserver.disconnect();
  }, [text]);

  return (
    <div ref={viewportRef} className="marquee-viewport">
      <span ref={textRef} className={`marquee-track ${style ? "scrolling" : ""}`} style={style || undefined}>
        {text}
      </span>
    </div>
  );
}
