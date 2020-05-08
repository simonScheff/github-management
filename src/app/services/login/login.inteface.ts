export enum GithubLoginProps {
  AUTHORIZE_URL = 'https://github.com/login/oauth/authorize',
  REDIRECT_URL = 'http://localhost:4200/callback',
  CLIENT_ID = 'aad96884d3f18597b0ed'
}

export function getEncodedRedirectUrl() {
  return encodeURIComponent(GithubLoginProps.REDIRECT_URL);
}
