import React from 'react';
import { useGlitch } from 'react-powerglitch';

const GlitchImage = ({ src, alt, className }) => {
    const glitch = useGlitch({
        playMode: 'hover',
        createContainers: true,
        hideOverflow: false,
        timing: {
            duration: 250,
            iterations: 1
        },
        glitchTimeSpan: false,
        shake: {
            velocity: 15,
            amplitudeX: 0.2,
            amplitudeY: 0.2,
        },
        slice: {
            count: 6,
            velocity: 15,
            minHeight: 0.02,
            maxHeight: 0.15,
            hueRotate: true,
        },
        pulse: false,
    });

    return (
        <div className={`relative overflow-hidden ${className}`} ref={glitch.ref}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default GlitchImage;
