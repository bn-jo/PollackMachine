module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        damn: ["Damn", "sans-serif"],
        space: ["Space Mono", "monospace"],
      },
      webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Important: return the modified config
        return config
      },
    
    },
  },
  plugins: [],
};
