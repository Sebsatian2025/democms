const cookie = require('cookie')
const { OAuth } = require('./common/oauth.js')
const oauth = new OAuth(process.env.OAUTH_PROVIDER || 'github')

exports.handler = async (event) => {
  // Sveltia pasa provider, site_id y scope
  const { provider, site_id, scope } = event.queryStringParameters
  const redirectUri = `${event.headers['x-forwarded-proto']}://${event.headers.host}/.netlify/functions/callback`

  // arrancamos OAuth y guardamos provider + redirectUri
  const authURL = oauth
    .getAuthorizationURL(scope)
    .replace(
      encodeURIComponent(process.env.OAUTH_CALLBACK),
      encodeURIComponent(redirectUri)
    )

  const cookies = [
    cookie.serialize('provider', provider,  { httpOnly: true, path: '/', maxAge: 600 }),
    cookie.serialize('redirectUri', redirectUri, { httpOnly: true, path: '/', maxAge: 600 }),
  ]

  return {
    statusCode: 302,
    multiValueHeaders: { 'Set-Cookie': cookies },
    headers: { Location: authURL }
  }
}
