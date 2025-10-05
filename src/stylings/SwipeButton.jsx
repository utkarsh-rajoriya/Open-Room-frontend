import { useRef, useState, useCallback } from "react";

export default function SwipeButton({ onSuccess, content, bg = "#433D8B" }) {
  const containerRef = useRef(null);
  const knobRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState(0);

  // --- Use useCallback to memoize event handlers ---
  const handleDragStart = useCallback((clientX) => {
    if (!knobRef.current) return;
    setIsDragging(true);
    // Store the initial starting position on the knob itself
    knobRef.current.startX = clientX - offset;
  }, [offset]);

  const handleDragMove = useCallback((clientX) => {
    if (!isDragging || !containerRef.current || !knobRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const knobWidth = knobRef.current.offsetWidth;
    const maxOffset = containerWidth - knobWidth;
    
    // Calculate the distance moved
    const distanceX = clientX - knobRef.current.startX;
    
    // Clamp the value between 0 and the maximum allowed offset
    const clampedOffset = Math.min(Math.max(0, distanceX), maxOffset);
    setOffset(clampedOffset);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !containerRef.current || !knobRef.current) return;
    setIsDragging(false);
    
    const containerWidth = containerRef.current.offsetWidth;
    const knobWidth = knobRef.current.offsetWidth;
    const maxOffset = containerWidth - knobWidth;

    // If swiped over 90% of the way, consider it a success
    if (offset >= maxOffset * 0.9) {
      setOffset(maxOffset); // Complete the swipe animation
      onSuccess?.();
      
      // Reset after a short delay to show completion
      setTimeout(() => {
        setOffset(0);
      }, 300);

    } else {
      // Otherwise, animate it back to the start
      setOffset(0);
    }
  }, [isDragging, offset, onSuccess]);

  // --- Event handlers for mouse and touch ---
  const onMouseMove = (e) => handleDragMove(e.clientX);
  const onTouchMove = (e) => handleDragMove(e.touches[0].clientX);

  return (
    <div
      ref={containerRef}
      // --- RESPONSIVE FIX: Adjusted width and added padding for better scaling ---
      className="relative h-12 w-36 sm:w-40 rounded-full overflow-hidden select-none touch-pan-y"
      style={{ backgroundColor: bg }}
      onMouseMove={isDragging ? onMouseMove : undefined}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchMove={isDragging ? onTouchMove : undefined}
      onTouchEnd={handleDragEnd}
    >
      <div
        ref={knobRef}
        // --- VISUAL FIX: Used flexbox to perfectly center the icon ---
        className="absolute top-0 h-full w-12 bg-white rounded-full cursor-grab active:cursor-grabbing shadow-lg flex items-center justify-center transition-transform duration-200 ease-out"
        // --- PERF FIX: Using transform is smoother than animating `left` ---
        style={{ transform: `translateX(${offset}px)` }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      >
        <svg
          // --- VISUAL FIX: Simplified SVG classes for consistency ---
          className="w-6 h-6 text-gray-700"
          aria-hidden="true"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </div>

      <span 
        // --- VISUAL FIX: Centered the text and added a subtle transition ---
        className="absolute inset-0 flex items-center justify-center pl-5 max-md:pl-9 text-white text-sm font-semibold pointer-events-none transition-opacity duration-300"
        // --- UX FIX: Fade out the text as the user swipes ---
        style={{ opacity: 1 - (offset / 50) }}
      >
        {content}
      </span>
    </div>
  );
}
