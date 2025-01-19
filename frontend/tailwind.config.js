module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
        secondary: '#50E3C2',
        accent: '#F5A623',
        success: '#27AE60',
        error: '#E74C3C',
        warning: '#F1C40F',
        neutral: {
          light: '#F7F7F7',
          dark: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
};
