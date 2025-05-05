import React from "react";

const darkColors = [
    '#1F2937', // slate-800
    '#4B5563', // gray-700
    '#374151', // gray-800
    '#1E3A8A', // blue-900
    '#6D28D9', // purple-900
    '#7C3AED', // violet-700
    '#064E3B', // emerald-900
    '#0F172A', // zinc-900
    '#422006', // amber-900
];

export const Avatar = ({ name, size }) => {
    const color = React.useMemo(() => {
        // Choose consistent color for the same name, or random if you prefer
        const index = Math.abs(name?.charCodeAt(0) || 0) % darkColors.length;
        return darkColors[index];
    }, [name]);

    const firstLetter = name?.charAt(0)?.toUpperCase() || '?';

    return (
        <div
            // className={`w-${size} h-${size} rounded flex items-center justify-center text-xl font-semibold text-white`}
            className={`${size === 12 ? "w-12 h-12" : "w-8 h-8"} rounded flex items-center justify-center text-xl font-semibold text-white`}
            style={{ backgroundColor: color }}
        >
            {firstLetter}
        </div>
    );
};
