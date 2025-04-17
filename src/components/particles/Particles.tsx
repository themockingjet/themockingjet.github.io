export const Particles = () => {
    return (
        <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => {
                    const size = Math.random() * 4 + 2; // Smaller sizes for fireflies
                    const opacity = Math.random() * 0.5 + 0.3; // Brighter core
                    const hue =
                        Math.random() > 0.5
                            ? Math.floor(Math.random() * 30 + 180) // Blue/cyan colors
                            : Math.floor(Math.random() * 30 + 140); // Green/teal colors
                    const glowSize = size * 1; // Larger glow relative to particle size

                    return (
                        <div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                backgroundColor: `hsla(${hue}, 100%, 75%, ${opacity})`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                boxShadow: `0 0 ${glowSize}px ${
                                    glowSize / 2
                                }px hsla(${hue}, 100%, 70%, 0.6)`,
                                filter: `blur(${size / 3}px) brightness(1.2)`,
                                animation: `firefly ${
                                    Math.random() * 10 + 5
                                }s ease-in-out infinite alternate`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: Math.random() * 0.1, // Higher base opacity
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};
