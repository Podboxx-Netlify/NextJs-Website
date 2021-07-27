const colors = require('tailwindcss/colors')

module.exports = {
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            spacing: {
                'player': '235px',
            },
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                black: colors.black,
                white: colors.white,
                gray: colors.trueGray,
                indigo: colors.indigo,
                red: colors.rose,
                yellow: colors.amber,
                'cards-dark': '#292d35',
                'main-dark': '#151a23',
                'header-red': '#4d1e1f',
                'post': '#202527',
                'demo-dark': '#191919',
                'demo-nav-bar': '#333333',
                'demo-bg': '#222222',
                '00dp': '#121212',
                '01dp': '#1e1e1e',
                '02dp': '#222222',
                '03dp': '#242424',
                '04dp': '#272727',
                '06dp': '#2c2c2c',
                '08dp': '#2e2e2e',
                '12dp': '#333333',
                '16dp': '#343434',
                '24dp': '#383838',
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: '#FFFFFF',
                        h1: {
                            color: '#FFFFFF',
                        },
                        h2: {
                            color: '#FFFFFF',
                        },
                        h3: {
                            color: '#FFFFFF',
                        },
                        h4: {
                            color: '#FFFFFF',
                        },
                        strong: {
                            color: '#737373'
                        },
                        a: {
                            color: '#737373'
                        },
                    },
                },
            }),
        },
        container: {
            center: true,
            // padding: '2rem'
        },
    },
    variants: {
        extend: {
            display: ['first', 'last', 'dark']
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
        require('daisyui'),
        function ({addComponents}) {
            addComponents({
                '.container': {
                    maxWidth: '100%',
                    // '@screen sm': {
                    //     maxWidth: '515px',
                    // },
                    // '@screen md': {
                    //     maxWidth: '625px',
                    // },
                    '@screen lg': {
                        maxWidth: '1120px',
                    },
                    '@screen xl': {
                        maxWidth: '1200px',
                    },
                }
            })
        }
    ],
    daisyui: {
        styled: true,
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        themes: [
            {
                'theme-podboxx': {
                    'primary': '#b34d50',
                    'primary-focus': '#6b2e30',
                    'primary-content': '#ffffff',
                    'secondary': '#6b2e30',
                    'secondary-focus': '#562526',
                    'secondary-content': '#ffffff',
                    'accent': '#9f8360',
                    'accent-focus': '#604e39',
                    'accent-content': '#ffffff',
                    'neutral': '#242424',
                    'neutral-focus': '#343434',
                    'neutral-content': '#ffffff',
                    'base-100': '#333333',
                    'base-200': '#242424',
                    'base-300': '#343434',
                    'base-content': '#ffffff',
                    'info': '#2094f3',
                    'success': '#0d9467',
                    'warning': '#ff9900',
                    'error': '#ff5724',
                },
            },
        ],
    },
}
