const DOMAIN = 'http://localhost:3000';

export const API_URL = `${DOMAIN}/api`;

export const LOGOUT_URL = `${DOMAIN}/logout`;

export const LOGIN_URL = `${DOMAIN}/login`;

export const ROOT_DOMAIN = DOMAIN;

export const GAME_URL = `${DOMAIN}/games`;

export const USERS_URL = `${DOMAIN}/users`;

export const GROUPS_URL = `${DOMAIN}/groups`;

export const embeddedGameURL = ({ slug }) => `${DOMAIN}/embed/${slug}`;

export const embedReleaseURL = ({
  slug = '',
  status = 'prod',
  token = undefined,
  controls = 0,
  title = 0
} = {}) =>
  `${embeddedGameURL({
    slug
  })}?status=${status}&token=${token}&controls=${controls}&title=${title}`;

export const gameURL = ({ slug }) => `${DOMAIN}/games/${slug}`;

export const gameReleasesURL = ({ slug }) => `${DOMAIN}/games/${slug}/releases`;

export const apiReleaseURL = ({ status, game: { slug } }, token) =>
  `${API_URL}/release/${slug}?status=${status}&token=${token}`;

export const groupURL = ({ slug }) => `${GROUPS_URL}/group/${slug}`;
