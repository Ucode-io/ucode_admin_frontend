import React, { useEffect, useRef, useState } from 'react';

export const StickyLikeElement = ({ children, top = 0 }) => {
    const [isSticky, setIsSticky] = useState(false);
    const elementRef = useRef(null);
    const placeholderRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!elementRef.current || !placeholderRef.current) return;

            const rect = placeholderRef.current.getBoundingClientRect();

            if (rect.top <= top) {
                setIsSticky(true);
                elementRef.current.style.position = 'absolute';
                elementRef.current.style.top = `${window.scrollY + top}px`;
                elementRef.current.style.width = `${placeholderRef.current.offsetWidth}px`;
            } else {
                setIsSticky(false);
                elementRef.current.style.position = 'static';
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [top]);

    return (
        <>
          <div ref={placeholderRef} style={{ height: isSticky ? elementRef.current?.offsetHeight : 'auto' }} />
          <div ref={elementRef}>
              {children}
          </div>
        </>
    );
};
