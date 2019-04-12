export const MAIN_URL = 'http://localhost:3000';

export const GAME_ONE_NAME = 'Empty Game';

export const GAME_TWO_NAME = 'Empty Game 2';

export const GAME_ONE_SLUG = 'empty-game';

export const GAME_TWO_SLUG = 'empty-game-2';

export const ADMINS_GROUP_NAME = 'admins';

export const READERS_GROUP_NAME = 'readers';

export const EDITORS_GROUP_NAME = 'editors';

export const ADMINS_GROUP_SLUG = 'admins';

export const EDITORS_GROUP_SLUG = 'editors';

export const READERS_GROUP_SLUG = 'readers';

export const EMPTY_GROUP_SLUG = 'empty';

export const API_URL = `${MAIN_URL}/api`;

export const LOGOUT_URL = `${MAIN_URL}/logout`;

export const LOGIN_URL = `${MAIN_URL}/login`;

export const GAMES_URL = `${MAIN_URL}/games`;

export const GAME_ONE_URL = `${GAMES_URL}/${GAME_ONE_SLUG}`;

export const GAME_ONE_RELEASES_URL = `${GAMES_URL}/${GAME_ONE_SLUG}/releases`;

export const GAME_TWO_URL = `${GAMES_URL}/${GAME_ONE_SLUG}`;

export const GAME_TWO_RELEASES_URL = `${GAMES_URL}/${GAME_ONE_SLUG}/releases`;

export const USERS_URL = `${MAIN_URL}/users`;

export const GROUPS_URL = `${MAIN_URL}/groups`;

export const DOCS_URL = `${MAIN_URL}/docs`;

export const PROFILE_URL = `${MAIN_URL}/profile`;

export const PASSWORD_URL = `${MAIN_URL}/password`;

export const API_GAMES_URL = `${API_URL}/games`;

export const ADMINS_GROUP_URL = `${GROUPS_URL}/group/${ADMINS_GROUP_SLUG}`;

export const EDITORS_GROUP_URL = `${GROUPS_URL}/group/${EDITORS_GROUP_SLUG}`;

export const READERS_GROUP_URL = `${GROUPS_URL}/group/${READERS_GROUP_SLUG}`;

export const EMPTY_GROUP_URL = `${GROUPS_URL}/group/${EMPTY_GROUP_SLUG}`;

export const GAME_TWO_EMBED_URL = `${MAIN_URL}/embed/${GAME_TWO_SLUG}`;

export const embeddedGameURL = ({ slug }) => `${MAIN_URL}/embed/${slug}`;

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

export const gameURL = ({ slug }) => `${MAIN_URL}/games/${slug}`;

export const gameReleasesURL = ({ slug }) =>
  `${MAIN_URL}/games/${slug}/releases`;

export const apiReleaseURL = ({ status, game: { slug } }, token) =>
  `${API_URL}/release/${slug}?status=${status}&token=${token}`;

export const groupURL = ({ slug }) => `${GROUPS_URL}/group/${slug}`;
