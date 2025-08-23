// netlify/functions/auth.js
import { handler } from '@sveltia/auth/netlify'

export const handler = handler({
  clientId: process.env.SVELTIA_CLIENT_ID,
  clientSecret: process.env.SVELTIA_CLIENT_SECRET,
  hostname: 'sebastiandemo.netlify.app',
})
