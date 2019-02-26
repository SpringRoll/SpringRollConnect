import { Game } from './models';

/**
 *
 * @typedef {object} GroupPermission
 * @property {0 | 1 | 2} GroupPermission.permission
 * @property {object} GroupPermission.group
 */

/**
 * @typedef {object} GameParams
 * @property {string} [GameParams.title]
 * @property {string} [GameParams.slug]
 * @property {string} [GameParams.bundleId]
 * @property {string} [GameParams.repository]
 * @property {string} [GameParams.location]
 * @property {Array<any>} [GameParams.releases]
 * @property {Array<GroupPermission>} [GameParams.groups]
 */

/**
 * @function makeGame
 * @param {GameParams} params
 * @returns {Promise<any>}
 */
export const makeGame = async ({
  title = 'Test Game',
  slug = 'test-game',
  bundleId = 'com.domain.game.SomeGame',
  repository = 'https://springroll.io',
  location = 'https://springroll.io',
  groups = [],
  releases = []
} = {}) =>
  await new Game({
    title,
    slug,
    bundleId,
    repository,
    location,
    groups,
    releases
  }).save();
