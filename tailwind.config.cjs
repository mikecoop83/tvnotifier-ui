/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp')
    // Skeleton plugins removed for now to avoid build issues
    // ...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
  ]
};
