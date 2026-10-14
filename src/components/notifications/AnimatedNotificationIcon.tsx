import React, { useEffect, useRef, useState, useCallback } from "react";
import lottie, { AnimationItem } from "lottie-web";

interface AnimatedNotificationIconProps {
  className?: string;
  isHovered?: boolean;
  animationJson?: any;
}

export const AnimatedNotificationIcon: React.FC<AnimatedNotificationIconProps> = ({
  className = "w-5 h-5 text-foreground",
  isHovered = false,
  animationJson,
}) => {
  const lottieRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [isReady, setIsReady] = useState(false);

  const playAnimation = useCallback(() => {
    if (animRef.current) {
      animRef.current.goToAndPlay(0, true);
    }
  }, []);

  useEffect(() => {
    if (isHovered) playAnimation();
  }, [isHovered, playAnimation]);

  useEffect(() => {
    const el = lottieRef.current;
    if (!el || !animationJson || typeof window === "undefined") return;

    el.innerHTML = "";
    let anim: AnimationItem | null = null;

    try {
      anim = lottie.loadAnimation({
        container: el,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: animationJson,
      });

      anim.addEventListener("DOMLoaded", () => setIsReady(true));
      anim.addEventListener("complete", () => {
        if (animRef.current) animRef.current.goToAndStop(0, true);
      });

      animRef.current = anim;
    } catch (err) {
      // fallback
    }

    return () => {
      if (anim) anim.destroy();
      animRef.current = null;
    };
  }, [animationJson]);

  return (
    <div
      onMouseEnter={playAnimation}
      className={`animated-bell-icon relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden ${className}`}
      style={{ width: 20, height: 20, maxWidth: 20, maxHeight: 20 }}
    >
      <div
        ref={lottieRef}
        className={`w-full h-full overflow-hidden flex items-center justify-center pointer-events-none [&_svg]:!w-full [&_svg]:!h-full [&_path[stroke]]:!stroke-current ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
      />
      {!isReady && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-current absolute inset-0 m-auto transition-transform hover:rotate-12 duration-200"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      )}
    </div>
  );
};
