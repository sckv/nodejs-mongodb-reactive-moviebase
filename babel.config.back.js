const path = require('path');
module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {node: process.versions.node},
      },
    ],
  ];
  const plugins = [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cwd: path.resolve(path.join(process.cwd(), 'server', 'build')),
        root: '.',
        extensions: ['.js'],
        alias: {
          '@src': '.',
          '@config': 'config',
        },
      },
    ],
  ];

  return {
    presets,
    plugins,
  };
};
