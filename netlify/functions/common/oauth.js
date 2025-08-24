// netlify/functions/common/oauth.js
const { AuthorizationCode } = require('simple-oauth2');

const OAUTH_PROVIDERS = {
  github: {
    client_id:     process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    url:           'https://github.com'
  }
};

class OAuth {
  constructor(provider) {
    const cfg = OAUTH_PROVIDERS[provider] || {};
    if (!cfg.client_id || !cfg.client_secret) {
      throw new Error(`Missing OAuth config for provider ${provider}`);
    }
    this.provider = provider;
    this.client = new AuthorizationCode({
      client: { id: cfg.client_id, secret: cfg.client_secret },
      auth: {
        tokenHost:   cfg.url,
        tokenPath:   '/login/oauth/access_token',
        authorizePath: '/login/oauth/authorize'
      }
    });
  }

  getAuthorizationURL(scope) {
    return this.client.authorizeURL({
      redirect_uri: process.env.OAUTH_CALLBACK,
      scope
    });
  }

  async getToken(code) {
    return this.client.getToken({
      code,
      redirect_uri: process.env.OAUTH_CALLBACK
    });
  }
}

module.exports = { OAuth };



