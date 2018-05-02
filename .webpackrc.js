
export default {
  "entry": "src/index.js",
  // "entry": "src/index.js",
  "hash": true,
  // "sass": {},
  "disableCSSModules": true,
  "theme": {
    // "@primary-color": "#FB7D55",
    "@primary-color": "#29A0E7",
  },
  "html": {
    "template": "./src/index.ejs"
  },
  "extraBabelPlugins": [
    [
      "import",
      {
        "libraryName": "antd",
        "style": true,
      }
    ]
  ],
  // "env": {
  //   "development": {
  //     "extraBabelPlugins": [
  //       "transform-runtime",
  //       [
  //         "import",
  //         {
  //           "libraryName": "antd",
  //           "style": true,
  //         }
  //       ]
  //     ]
  //   },
  //   "production": {
  //     "extraBabelPlugins": [
  //       "transform-runtime",
  //       [
  //         "import",
  //         {
  //           "libraryName": "antd",
  //           "style": true,
  //         }
  //       ]
  //     ]
  //   }
  // }
}
