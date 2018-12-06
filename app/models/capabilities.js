module.exports = {
  /**
   * The interface capabilities
   * @property {Object} capabilities.ui
   */
  ui: {
    /**
     * Does the game support mouse interaction
     * @property {Boolean} capabilities.ui.mouse
     * @default true
     */
    mouse: {
      type: Boolean,
      default: true
    },

    /**
     * Does the game support touch interaction
     * @property {Boolean} capabilities.ui.touch
     * @default true
     */
    touch: {
      type: Boolean,
      default: true
    }
  },

  /**
   * The responsive size capabilities
   * @property {Object} capabilities.sizes
   */
  sizes: {
    /**
     * Game support displays less than 480
     * @property {Boolean} capabilities.sizes.xsmall
     * @default true
     */
    xsmall: {
      type: Boolean,
      default: true
    },

    /**
     * Game support displays less than 768
     * @property {Boolean} capabilities.sizes.small
     * @default true
     */
    small: {
      type: Boolean,
      default: true
    },

    /**
     * Game support displays less than 992
     * @property {Boolean} capabilities.sizes.medium
     * @default true
     */
    medium: {
      type: Boolean,
      default: true
    },

    /**
     * Game support displays less than 1200
     * @property {Boolean} capabilities.sizes.large
     * @default true
     */
    large: {
      type: Boolean,
      default: true
    },

    /**
     * Game support displays greater than or equal to 1200
     * @property {Boolean} capabilities.sizes.xlarge
     * @default true
     */
    xlarge: {
      type: Boolean,
      default: true
    }
  },

  /**
   * The browser features
   * @property {Object} capabilities.features
   */
  features: {
    /**
     * Strictly requires WebGL in the browser
     * @property {Boolean} capabilities.features.webgl
     * @default false
     */
    webgl: {
      type: Boolean,
      default: false
    },

    /**
     * Browser requires Geolocation API
     * @property {Boolean} capabilities.features.geolocation
     * @default false
     */
    geolocation: {
      type: Boolean,
      default: false
    },

    /**
     * Strictly requires WebAudio API (no Flash-fallback)
     * @property {Boolean} capabilities.features.webaudio
     * @default false
     */
    webaudio: {
      type: Boolean,
      default: false
    },

    /**
     * Requires Web Sockets
     * @property {Boolean} capabilities.features.websockets
     * @default false
     */
    websockets: {
      type: Boolean,
      default: false
    },

    /**
     * Strictly requires Web Worker API
     * @property {Boolean} capabilities.features.webworkers
     * @default false
     */
    webworkers: {
      type: Boolean,
      default: false
    }
  }
};
