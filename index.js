const http = require('http');
const Vue = require('vue');
const { createStylesheet } = require('tailwindcss');
const prettier = require('prettier');

const tailwindCss = createStylesheet();
const app = new Vue({
  template: `
    <div class="${tailwindCss.classes['bg-blue-500']} ${tailwindCss.classes['text-white']} ${tailwindCss.classes['p-4']} ${tailwindCss.classes['rounded-md']}">
      <h1 class="${tailwindCss.classes['text-2xl']}">{{ title }}</h1>
      <p class="${tailwindCss.classes['mt-4']}">{{ description }}</p>
    </div>
  `,
  data: {
    title: process.env.VUE_APP_TITLE,
    description: process.env.VUE_APP_DESCRIPTION,
  },
});

const server = http.createServer((req, res) => {
  const renderer = require('vue-server-renderer').createRenderer();
  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error');
    } else {
      const formattedHtml = prettier.format(html, { parser: 'html' });
      res.end(formattedHtml);
    }
  });
});

module.exports = {
  start: () => {
    server.listen(process.env.PORT || 3000, () => {
      console.log(`Server started on http://localhost:${process.env.PORT || 3000}`);
    });
  },
};
