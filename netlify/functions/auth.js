// netlify/functions/auth.js
const { handler } = require('@sveltia/auth/netlify')

exports.handler = handler({
  clientId:     process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  hostname:     'sebastiandemo.netlify.app',
})
