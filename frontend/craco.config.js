module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  outputPath: 'images/',
                  publicPath: '/images/',
                },
              },
            ],
          },
        ],
      },
    },
  },
};
