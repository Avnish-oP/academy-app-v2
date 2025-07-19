const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // Fallback for environments where LightningCSS native modules aren't available
    ...(process.env.NODE_ENV === 'production' && {
      autoprefixer: {},
    }),
  },
};

export default config;
