import './embed.less';
import {
  Container,
  HelpPlugin,
  CaptionsPlugin,
  SoundPlugin,
  PausePlugin
} from 'springroll-container';
Container.uses(new HelpPlugin('#helpButton'));
Container.uses(new CaptionsPlugin('#captionsButton'));
Container.uses(new PausePlugin('#pauseButton, #resumeButton'));
Container.uses(
  new SoundPlugin({
    voButton: '#voButton',
    soundButton: '#soundButton',
    sfxButton: '#sfxButton',
    musicButton: '#musicButton'
  })
);

const container = new Container('#frame');

console.log('foo');
