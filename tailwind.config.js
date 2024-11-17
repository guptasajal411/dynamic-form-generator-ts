/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--color-bg-primary)",
                primary: "var(--color-primary)"
            }
        },
        keyframes: {
            'fade-in': {
                '0%': { opacity: 0 },
                '100%': { opacity: 1 },
            },
        },
        animation: {
            'fade-in': 'fade-in 0.5s ease-in-out',
        },
    },
    plugins: [],
    darkMode: "class"
}

