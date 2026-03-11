import { useEffect } from 'react';

export const useScrollAnimation = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = document.querySelectorAll('.scroll-animate');
        animatedElements.forEach((el) => {
            el.style.opacity = '0';
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);
};
