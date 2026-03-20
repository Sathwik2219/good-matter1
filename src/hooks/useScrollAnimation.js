import { useEffect } from 'react';

/**
 * useScrollAnimation — Intersection Observer-based scroll reveal
 * 
 * Supports multiple animation types via data-animate attribute:
 *   data-animate="fade-up"    → fade + slide up (default)
 *   data-animate="fade-in"    → fade only
 *   data-animate="slide-left" → fade + slide from right
 *   data-animate="scale-up"   → fade + scale from 0.92
 * 
 * Optional: data-delay="200" → delay in ms (100–800)
 */
export const useScrollAnimation = () => {
  useEffect(() => {
    // Pre-style all elements before observing
    const elements = document.querySelectorAll('.scroll-animate, [data-animate]');

    elements.forEach((el) => {
      const type  = el.dataset.animate || 'fade-up';
      const delay = parseInt(el.dataset.delay || '0', 10);

      el.style.opacity         = '0';
      el.style.transitionDelay = delay ? `${delay}ms` : '0ms';
      el.style.transition      = `opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)`;
      el.style.willChange      = 'transform, opacity';

      if (type === 'fade-up' || type === 'scroll-animate') {
        el.style.transform = 'translateY(28px)';
      } else if (type === 'slide-left') {
        el.style.transform = 'translateX(28px)';
      } else if (type === 'scale-up') {
        el.style.transform = 'scale(0.94)';
      } else {
        el.style.transform = 'none';
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'none';
            observer.unobserve(entry.target); // only animate once
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};
