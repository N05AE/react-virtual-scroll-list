module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targe: 'current',
      },
    ],
    [
      ('@babel/preset-react',
      {
        pragma: 'React.craeteElement',
        pragmaFrag: 'React.Fragment',
        throwIfNamespace: true,
      }),
    ],
  ],
  plugins: ['@babel/plugin-proposal-class-properties'],
};
