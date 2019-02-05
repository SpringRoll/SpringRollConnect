const DOMAIN = 'http://localhost:3000';

export const API_URL = `${DOMAIN}/api`;

export const LOGOUT_URL = `${DOMAIN}/logout`;

export const LOGIN_URL = `${DOMAIN}/login`;

export const ROOT_DOMAIN = DOMAIN;

export function releaseURL(
  { status, game },
  token,
  { controls = 0, title = 0 } = {}
) {
  return `${gameURL(
    game
  )}?status=${status}&token=${token}&controls=${controls}&title=${title}`;
}

export function apiReleaseURL({ status, game }, token) {
  const { slug } = game;
  return `${API_URL}/release/${slug}?status=${status}&token=${token}`;
}

export function gameURL({ slug }) {
  return `${DOMAIN}/embed/${slug}`;
}
