module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      browsers: [
        'last 2 versions',
        '> 1%',
        'not dead',
        'not ie <= 11'
      ],
      grid: true
    },
    'postcss-preset-env': {
      features: {
        'nesting-rules': true,
      }
    },
    'cssnano': process.env.NODE_ENV === 'production' ? {
      preset: 'default',
    } : false,
  },
} 