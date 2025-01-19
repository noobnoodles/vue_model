module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ]
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