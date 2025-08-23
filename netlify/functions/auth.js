// netlify/functions/auth.js
import { handler } from '@sveltia/auth/netlify'

export const handler = handler({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  hostname: 'sebastiandemo.netlify.app',  // sin https:// ni slash
})
