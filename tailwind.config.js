/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f4f0',
                    100: '#d9e2d9',
                    200: '#b3c5b3',
                    300: '#8da88d',
                    400: '#92a78c', // Main primary color
                    500: '#6a7b65',
                    600: '#5a6b55',
                    700: '#4a5b45',
                    800: '#3a4b35',
                    900: '#2a3b25',
                },
                secondary: {
                    50: '#fefcf0',
                    100: '#fdf8e0',
                    200: '#fbf1c1',
                    300: '#f9eaa2',
                    400: '#f7e383',
                    500: '#f7cd82', // Main secondary color
                    600: '#d5ae60',
                    700: '#b38f3e',
                    800: '#91701c',
                    900: '#6f5100',
                },
                success: {
                    50: '#f0f9f0',
                    100: '#d9f2d9',
                    200: '#b3e5b3',
                    300: '#8dd88d',
                    400: '#67cb67',
                    500: '#4caf50',
                    600: '#3d8b40',
                    700: '#2e6730',
                    800: '#1f4320',
                    900: '#101f10',
                },
                warning: {
                    50: '#fff8f0',
                    100: '#ffefd9',
                    200: '#ffdfb3',
                    300: '#ffcf8d',
                    400: '#ffbf67',
                    500: '#ff9800',
                    600: '#cc7a00',
                    700: '#995c00',
                    800: '#663e00',
                    900: '#332000',
                },
                error: {
                    50: '#fdf2f2',
                    100: '#fce5e5',
                    200: '#f9cbcb',
                    300: '#f6b1b1',
                    400: '#f39797',
                    500: '#f44336',
                    600: '#c3362b',
                    700: '#922920',
                    800: '#611c15',
                    900: '#300f0a',
                },
            },
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    'Oxygen',
                    'Ubuntu',
                    'Cantarell',
                    '"Fira Sans"',
                    '"Droid Sans"',
                    '"Helvetica Neue"',
                    'sans-serif',
                ],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(0,0,0,0.1)',
                'medium': '0 4px 16px rgba(0,0,0,0.15)',
                'strong': '0 8px 32px rgba(0,0,0,0.2)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'pulse-soft': 'pulseSoft 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
    corePlugins: {
        // Disable Tailwind's base styles to avoid conflicts with Material-UI
        preflight: false,
    },
}
