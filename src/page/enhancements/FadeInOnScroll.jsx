import React, { useRef, useEffect, useState } from "react";

const FadeInOnScroll = ({ children, delay = 0, duration = 1000 }) => {
  const domRef = useRef();

  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);

        observer.unobserve(domRef.current);
      }
    }, {});

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(30px)",

    transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
  };

  return (
    <div className="w-full" ref={domRef} style={style}>
      {children}
    </div>
  );
};

export default FadeInOnScroll;
