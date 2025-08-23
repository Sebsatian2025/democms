// netlify/functions/auth.js
const { handler } = require('@sveltia/auth/netlify')

exports.handler = handler({
  clientId: process.env.SVELTIA_CLIENT_ID,
  clientSecret: process.env.SVELTIA_CLIENT_SECRET,
  hostname: 'sebastiandemo.netlify.app',  // o tu dominio netlify.app
})
