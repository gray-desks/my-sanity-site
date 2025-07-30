/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'base': '#FDFCFB',       // A warmer, more subtle off-white
        'ink': '#2C2C2C',         // A softer charcoal black
        'primary': '#A61E22',     // A deeper, more elegant red
        'secondary': '#5A5A5A',   // A slightly lighter grey for balance
        'accent': '#D94741',      // A refined, less saturated red for highlights
        'border': '#EAE8E5',     // A soft border color
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif JP', 'serif'],
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
        'gradient-brand': 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
        'gradient-brand-soft': 'linear-gradient(135deg, rgba(14, 165, 233, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(14, 165, 233, 0.9) 0%, rgba(16, 185, 129, 0.7) 50%, rgba(249, 115, 22, 0.8) 100%)',
        'gradient-premium': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
        'radial-highlight': 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
        'mesh-gradient': 'conic-gradient(from 0deg at 50% 50%, #0ea5e9, #10b981, #f97316, #a855f7, #0ea5e9)',
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-up-delayed': 'slideUp 0.6s ease-out 0.2s both',
        'float-delayed-1': 'float 6s ease-in-out infinite -1s',
        'float-delayed-3': 'float 6s ease-in-out infinite -3s',
        'bounce-slow-delayed-1': 'bounce 3s infinite -1s',
        'bounce-slow-delayed-2': 'bounce 3s infinite -2s',
        'scale-in': 'scaleIn 0.5s ease-out',
        'rotate-slow': 'rotate 20s linear infinite',
        'mesh': 'mesh 8s ease-in-out infinite',
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
          '0%': { boxShadow: '0 0 20px #0ea5e9' },
          '100%': { boxShadow: '0 0 40px #10b981' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        mesh: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' }
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