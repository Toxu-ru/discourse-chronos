import { registerOption } from 'pretty-text/pretty-text';

registerOption((siteSettings, opts) => {
  opts.features['discourse-chronos'] = !!siteSettings.discourse_chronos_enabled;
});

function addChronos(buffer, matches, state) {
  let token;

  let config = {
    date: null,
    time: null,
    format: "YYYY-MM-DD HH:mm"
  };

  const options = matches[1].split(";");
  options.forEach((option) => {
    let o = option.split("=");
    config[o[0]] = o[1];
  });

  token = new state.Token('span_open', 'span', 1);
  token.attrs = [
    ['class', 'discourse-chronos'],
    ['title', config.previews.split("|").join("\n")],
    ['data-date', config.date],
    ['data-time', config.time],
    ['data-recurring', config.recurring],
    ['data-format', config.format]
  ];
  buffer.push(token);

  token = new state.Token('text', '', 0);
  token.content = config.previews.split("|").join(", ");
  buffer.push(token);

  token = new state.Token('span_close', 'span', -1);
  buffer.push(token);
}

export function setup(helper) {
  helper.whiteList([
    'span.discourse-chronos',
    'span[data-*]',
    'span[title]'
  ]);

  helper.registerOptions((opts, siteSettings) => {
    opts.features['discourse-chronos'] = !!siteSettings.discourse_chronos_enabled;
  });

  helper.registerPlugin(md => {
    const rule = {
      matcher: /\[discourse-chronos (.*?)\]/,
      onMatch: addChronos
    };

    md.core.textPostProcess.ruler.push('discourse-chronos', rule);
  });
}
