const { VueLoaderPlugin } = require('vue-loader')
const path=require("path")

var chunks={
"main":{
  from:"./src/main.js",
  to:"5dbwat4-blog.chunk.main.js"
}
}



//-----------------------------------------------------------------------------------------

var entry={}
for (const key in chunks) {
  if (Object.hasOwnProperty.call(chunks, key)) {
    entry[key]= chunks[key].from;
  }
}

module.exports = {
  mode: 'production',
  entry: entry,
  output: {
    filename: (pathData,assetInfo) => {
      // if(chunks[pathData.chunk.name])
      return chunks[pathData.chunk.name].to
      // else return "5dbwat4-blog.chunk.[chunkhash].js"
    },
    chunkFilename: '5dbwat4-blog.chunk.[id].[chunkhash].js',
    // filename:"5dbwat4-blog.chunk.[chunkhash].js",
    path : path.resolve(__dirname,"./public/js/")
  },
  experiments:{
    topLevelAwait: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },{
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};