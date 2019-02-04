const DOMAIN = 'http://localhost:3000';

export function releaseURL(
  { status, game },
  token,
  { controls = 1, title = 1 } = {}
) {
  return `${gameURL(
    game
  )}?status=${status}&token=${token}&controls=${controls}&title=${title}`;
}

export function gameURL({ slug }) {
  return `${DOMAIN}/embed/${slug}`;
}

export const LOGOUT_URL = `${DOMAIN}/logout`;

export const LOGIN_URL = `${DOMAIN}/login`;

export const ROOT_DOMAIN = DOMAIN;
