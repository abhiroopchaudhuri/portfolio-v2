import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
    // Raw mouse position (Instant)
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Spring mouse position (Elastic/Laggy)
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const [isHovering, setIsHovering] = useState(false);
    const [trail, setTrail] = useState([]);
    const trailRef = useRef([]);

    useEffect(() => {
        const moveCursor = (e) => {
            // Update motion values
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Create trail effect (only add points occasionally or it gets too dense)
            // For performance, maybe limit trail updates or use a simpler method
            // But for now, let's keep the trail logic but maybe lighter
            const newPoint = { x: e.clientX, y: e.clientY, id: Date.now() };
            trailRef.current = [newPoint, ...trailRef.current.slice(0, 12)];
            setTrail([...trailRef.current]);
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button') || e.target.closest('.cursor-pointer')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {/* Photon Trail (Static/Fading) */}
            {trail.map((point, index) => (
                <motion.div
                    key={point.id}
                    className="absolute rounded-full bg-[var(--accent-secondary)] mix-blend-screen"
                    initial={{ opacity: 0.5, scale: 0.5 }}
                    animate={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        left: point.x,
                        top: point.y,
                        width: '2px',
                        height: '2px',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}

            {/* Elastic Follower Ring (The "Vibe") */}
            <motion.div
                className="absolute rounded-full border border-white/30 mix-blend-difference"
                style={{
                    translateX: springX,
                    translateY: springY,
                    width: isHovering ? '50px' : '24px',
                    height: isHovering ? '50px' : '24px',
                    left: -12, // Center offset (half of default width)
                    top: -12,  // Center offset
                }}
                transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
            />

            {/* Main Cursor Dot (Instant/Accurate) */}
            <motion.div
                className="absolute rounded-full bg-white mix-blend-difference"
                style={{
                    translateX: mouseX,
                    translateY: mouseY,
                    width: '8px',
                    height: '8px',
                    left: -4, // Center offset
                    top: -4,  // Center offset
                }}
            />
        </div>
    );
};

export default CustomCursor;
