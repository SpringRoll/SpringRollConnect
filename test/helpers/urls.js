const DOMAIN = 'http://localhost:3000';

export const API_URL = `${DOMAIN}/api`;

export const LOGOUT_URL = `${DOMAIN}/logout`;

export const LOGIN_URL = `${DOMAIN}/login`;

export const ROOT_DOMAIN = DOMAIN;

export function embeddedGameURL({ slug }) {
  return `${DOMAIN}/embed/${slug}`;
}

export function embedReleaseURL({
  slug = '',
  status = 'prod',
  token = undefined,
  controls = 0,
  title = 0
} = {}) {
  return `${embeddedGameURL({
    slug
  })}?status=${status}&token=${token}&controls=${controls}&title=${title}`;
}

export function gameReleasesURL({ slug }) {
  return `${DOMAIN}/games/game/${slug}/releases`;
}

export function apiReleaseURL({ status, game }, token) {
  const { slug } = game;
  return `${API_URL}/release/${slug}?status=${status}&token=${token}`;
}
