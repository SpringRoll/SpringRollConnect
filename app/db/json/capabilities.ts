export const capabilities = ({
  ui: { mouse = false, touch = false } = {},
  sizes: {
    xsmall = false,
    small = false,
    medium = false,
    large = false,
    xlarge = false
  } = {},
  features: {
    webgl = false,
    geolocation = false,
    webaudio = false,
    websockets = false,
    webworkers = false
  } = {}
}) => ({
  ui: {
    mouse,
    touch
  },
  sizes: {
    xsmall,
    small,
    medium,
    large,
    xlarge
  },
  features: {
    webgl,
    geolocation,
    webaudio,
    websockets,
    webworkers
  }
});

export const mapCapabilities = json => {
  if ('object' === typeof json) {
    json = JSON.stringify(json);
  }

  return capabilities(
    JSON.parse(json.replace(/"on"|"off"/, x => x === '"on"'))
  );
};
