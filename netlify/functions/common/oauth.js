// netlify/functions/common/oauth.js
const { AuthorizationCode } = require('simple-oauth2')

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  OAUTH_CALLBACK,
} = process.env

const OAUTH_PROVIDERS = {
  github: {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    url: 'https://github.com',
  },
}

class OAuth {
  constructor(provider) {
    this.provider = provider
    const cfg = OAUTH_PROVIDERS[provider] || {}
    const { client_id, client_secret, url } = cfg

    if (!client_id || !client_secret) {
      throw new Error(`Missing OAuth config for provider ${provider}`)
    }

    this.client = new AuthorizationCode({
      client: { id: client_id, secret: client_secret },
      auth: {
        tokenHost: url,
        tokenPath: '/login/oauth/access_token',
        authorizePath: '/login/oauth/authorize',
      },
    })
  }

  getAuthorizationURL(scope) {
    return this.client.authorizeURL({
      redirect_uri: OAUTH_CALLBACK,
      scope,
    })
  }

  async getToken(code) {
    return this.client.getToken({
      code,
      redirect_uri: OAUTH_CALLBACK,
    })
  }
}

module.exports = { OAuth }

