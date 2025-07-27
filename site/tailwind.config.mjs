/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          // Main Brand - Cobalt Blue
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2C8CF4', // Main Brand Color
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          // Dark mode (15% saturation down + 10% lightness down)
          dark: {
            500: '#2D7DD4', // Reduced saturation and lightness
            600: '#1F5BA8',
            700: '#1A4A8F',
          }
        },
        accent: {
          // Green Accent
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0', 
          300: '#86efac',
          400: '#4ade80',
          500: '#26D47F', // Accent Green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          // Dark mode
          dark: {
            500: '#22B86B',
            600: '#1A8F55',
            700: '#157A47',
          }
        },
        secondary: {
          // Sunset Orange
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d', 
          400: '#fbbf24',
          500: '#FFB457', // Secondary Orange
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          // Dark mode
          dark: {
            500: '#D9984A',
            600: '#B8803E',
            700: '#9A6B33',
          }
        }
      },
      fontFamily: {
        jp: ['Noto Sans JP', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        en: ['Inter var', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter var', 'Noto Sans JP', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, rgb(44, 140, 244) 0%, rgb(38, 212, 127) 100%)',
        'gradient-brand-soft': 'linear-gradient(135deg, rgba(44, 140, 244, 0.8) 0%, rgba(38, 212, 127, 0.8) 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(44, 140, 244, 0.8) 0%, rgba(38, 212, 127, 0.8) 100%)',
        'radial-highlight': 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': '0% 50%'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': '100% 50%'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px #2C8CF4' },
          '100%': { boxShadow: '0 0 40px #26D47F' }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}