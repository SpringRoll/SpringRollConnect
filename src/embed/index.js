import './embed.less';
import {
  Container,
  HelpPlugin,
  CaptionsPlugin,
  SoundPlugin,
  PausePlugin,
  UserDataPlugin
} from 'springroll-container';

const container = new Container('#appContainer');
const frame = $('#frame');
const captionsToggle = $('#captionsToggle');
const soundToggle = $('#soundToggle');
captionsToggle.hide();
soundToggle.hide();

container.uses(new UserDataPlugin());
container.uses(new HelpPlugin('#helpButton'));
container.uses(new CaptionsPlugin('#captionsButton'));
container.uses(new PausePlugin('#pauseButton, #resumeButton'));
container.uses(
  new SoundPlugin({
    voButton: '#voButton',
    soundButton: '#soundButton',
    sfxButton: '#sfxButton',
    musicButton: '#musicButton'
  })
);

function pauseOverlay({ data }) {
  data.paused ? frame.addClass('paused') : frame.removeClass('paused');
}
container.client.on('paused', pauseOverlay);
container.client.on('resumed', pauseOverlay);
container.client.on('loaded', () => frame.removeClass('loading'));
container.client.on('features', ({ data }) => {
  if (data.captions) {
    captionsToggle.show();
  }
  if (data.sound) {
    soundToggle.show();
  }
});

container.setupPlugins();

$('form').submit(function(e) {
  return false;
});

$('.drop-down');

const parseQuery = queryString => {
  var params = {};
  var entries = queryString.split('&');
  for (var i in entries) {
    var parts = entries[i].split('=');
    params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  }
  return params;
};

const start = () => {
  // Open via api
  let api = location.pathname.replace('/embed/', '/api/release/');
  let playOptions = null;
  let singlePlay = false;
  let apiArgs = [];
  const queryArgs = [];

  if (location.search) {
    const params = parseQuery(location.search.substr(1));

    // API configurations
    ['version', 'status', 'commitId', 'token'].forEach(function(param) {
      if (params[param]) {
        apiArgs.push(param + '=' + params[param]);
        delete params[param];
      }
    });

    // Check for debug
    if (params.debug) {
      apiArgs.push('debug=true');
      delete params.debug;
    }

    // Show the controls
    if (params.controls) {
      delete params.controls;
      frame.addClass('show-controls');
    }

    // Show the title
    if (params.title) {
      frame.addClass('show-title');
      delete params.title;
    }

    // Add the arguments
    if (apiArgs.length) {
      api += '?' + apiArgs.join('&');
    }

    // Single play
    if (params.singlePlay) {
      singlePlay = params.singlePlay == 'true' || params.singlePlay == '1';
      delete params.singlePlay;
    }

    // Play options
    if (params.playOptions) {
      try {
        playOptions = JSON.parse(params.playOptions);
      } catch (e) {} // ignore invalid JSON parse
      delete params.playOptions;
    }

    // Get any other options and pass them to the query string
    for (var param in params) {
      queryArgs.push(param + '=' + params[param]);
    }
  }

  container.openRemote(api, {
    singlePlay,
    playOptions,
    query: queryArgs.length ? '?' + queryArgs.join('&') : ''
  });
};

start();
