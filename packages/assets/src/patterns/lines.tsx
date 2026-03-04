export const LinesPattern = ({
    color = "var(--text-color, #000)",
    opacity = 0.1,
}) => {
    const id = `pattern-lines-${Math.random().toString(36).substr(2, 9)}`;
    return (
        <>
            <defs>
                <pattern
                    id={id}
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                >
                    <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="10"
                        stroke={color}
                        strokeWidth="2"
                        opacity={opacity}
                    />
                </pattern>
            </defs>
            <rect x="-50%" y="-50%" width="200%" height="200%" fill={`url(#${id})`} />
        </>
    );
};
