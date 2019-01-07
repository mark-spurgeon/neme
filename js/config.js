var globalOptions = {
  "instagram-feed" : {
    imageWidth:1280,
    imageHeight:1280,
    kickerFontSize:32,
    headlineFontSize:72,
    authorsFontSize:36,
    bottomMargin:256,
    leftMargin:48,
    rightMargin:48,
    authorImageSize:96
  },
  "instagram-story" : {
    imageWidth:1080,
    imageHeight:1920,
    kickerFontSize:28,
    headlineFontSize:64,
    authorsFontSize:28,
    bottomMargin:456,
    leftMargin:150,
    rightMargin:150,
    authorImageSize:96
  },
  "twitter-feed" : {
    imageWidth:1080,
    imageHeight:512,
    kickerFontSize:24,
    headlineFontSize:48,
    authorsFontSize:24,
    bottomMargin:128,
    leftMargin:24,
    rightMargin:400,
    authorImageSize:96
  }
};

var sourceOptions = {
  default: {
    background:"rgb(100,100,100)",
    foreground:"black",
    text:"Unkown source"
  },
  "topolitique.ch": {
    background:"#C30E00",
    foreground:"#ffffff",
    text:"Topolitique"
  },
  "theguardian.com": { /*this source works, at least...*/
    background:"blue", /* TODO : find proper colour*/
    foreground:"#ffffff",
    text:"The Guardian"
  },
  "bbc.com": {
    background:"#C30E00",
    foreground:"#ffffff",
    text:"BBC"
  },
}



/* functions to avoid missing properties */
function getSourceOptions(source)  {
  try {
    var s_options = sourceOptions.default;
    for (var attrname in sourceOptions[source]) { s_options[attrname] = sourceOptions[source][attrname]; }

  } catch (e) {
    var s_options = sourceOptions.default
  }
  return s_options;
}
function customSourceOptions(opts) {
  var s_options = sourceOptions.default;
  for (var attrname in opts) { s_options[attrname] = opts[attrname]; }
  return s_options
}
