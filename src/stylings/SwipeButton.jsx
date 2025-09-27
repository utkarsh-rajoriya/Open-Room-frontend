import { useRef, useState } from "react";

export default function SwipeButton({ onSuccess , content}) {
  const containerRef = useRef(null);
  const knobRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState(0);

  const startDrag = (clientX) => {
    setIsDragging(true);
    knobRef.current.startX = clientX - offset;
  };

  const moveDrag = (clientX) => {
    if (!isDragging) return;
    const max = containerRef.current.offsetWidth - knobRef.current.offsetWidth;
    const dx = clientX - knobRef.current.startX;
    const clamped = Math.min(Math.max(0, dx), max);
    setOffset(clamped);
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const max = containerRef.current.offsetWidth - knobRef.current.offsetWidth;
    if (offset >= max * 0.9) {
      setOffset(max);
      onSuccess?.();
    } else {
      setOffset(0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-12 w-40 rounded-full bg-[#433D8B] overflow-hidden select-none "
      onMouseMove={(e) => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
    >
      <div
        ref={knobRef}
        className="absolute top-0 h-full w-12 bg-white rounded-full flex-row cursor-pointer transition-all text-3xl"
        style={{ left: offset }}
        onMouseDown={(e) => startDrag(e.clientX)}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      >
        →
      </div>
      <span className="absolute inset-0 flex items-center justify-center text-white text-sm pointer-events-none pl-7">
        {content}
      </span>
    </div>
  );
}
