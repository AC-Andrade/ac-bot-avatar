export const NoisePattern = ({ opacity = 0.4 }) => {
    const id = `pattern-noise-${Math.random().toString(36).substr(2, 9)}`;
    return (
        <>
            <defs>
                <filter id={id}>
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.65"
                        numOctaves="3"
                        stitchTiles="stitch"
                    />
                    <feColorMatrix
                        type="matrix"
                        values={`1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 ${opacity} 0`}
                    />
                </filter>
            </defs>
            <rect
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
                filter={`url(#${id})`}
                style={{ mixBlendMode: "overlay" as any }}
                pointerEvents="none"
            />
        </>
    );
};
