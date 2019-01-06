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
}


var urlObj;
var articleInfo = {};
function onload() {
    urlObj = document.getElementById('url');
}
function makeHttpObject() {
  try {return new XMLHttpRequest();}
  catch (error) {}
  try {return new ActiveXObject("Msxml2.XMLHTTP");}
  catch (error) {}
  try {return new ActiveXObject("Microsoft.XMLHTTP");}
  catch (error) {}

  throw new Error("Could not create HTTP request object.");
}
function launchURL() {
  generateImage();
}
function generateImage(){
    console.log('Retrieving info for : ', urlObj.value);
    articleInfo.url = url.value;

    //window.open(url.value,"newwindowname",'_blank', 'toolbar=0,location=0,menubar=0')
    $.getJSON(
      'http://whateverorigin.org/get?url='+encodeURIComponent(articleInfo.url)+'&callback=?',
      function(data) {
        parser = new DOMParser();
        var el = document.createElement( 'html' );
        el.innerHTML = data.contents;
        list = el.getElementsByTagName("meta");

        for (var i = 0; i < list.length; i++) {
          if (list[i].getAttribute('property')==="og:title") {
            articleInfo.title = list[i].getAttribute('content');
          }
          if (list[i].getAttribute('property')==="og:description") {
            articleInfo.description = list[i].getAttribute('content');
          }
          if (list[i].getAttribute('property')==="og:image") {
            articleInfo.image = list[i].getAttribute('content');
          }
          if (list[i].getAttribute('property')==="article:kicker") {
            articleInfo.kicker = list[i].getAttribute('content');
          }
          if (list[i].getAttribute('property')==="topo:kicker") {
            articleInfo.kicker = list[i].getAttribute('content');
          }
          if (list[i].getAttribute('property')==="article:author:1:name") {
            articleInfo.authorOneName = list[i].getAttribute('content');
          }
          if (list[i].getAttribute('property')==="article:author:1:image") {
            articleInfo.authorOneThumbnail = list[i].getAttribute('content');
          }
          if (list[i].getAttribute('property')==="article:author:2:name") {
            articleInfo.authorTwoName = list[i].getAttribute('content');
          }
          if (list[i].getAttribute('property')==="article:author:2:image") {
            articleInfo.authorTwoThumbnail = list[i].getAttribute('content');
          }
          if (list[i].getAttribute('property')==="article:author:3:name") {
            articleInfo.authorThreeName = list[i].getAttribute('content');
          }
          if (list[i].getAttribute('property')==="article:author:3:image") {
            articleInfo.authorThreeThumbnail = list[i].getAttribute('content');
          }
        }

        var options = {
          width:640,
          height:640,
          showKicker:true,
          showAuthor:true,
          showWatermark:true,
          showLogo:false,
          customHeadline:'',
          customKicker:'',
          customAuthorSource:''
        }
        /* Get options from UI */
        var formatType = document.getElementById('format').selectedOptions[0].getAttribute('value');
        options.format = formatType;
        options.width = globalOptions[options.format].imageWidth;
        options.height = globalOptions[options.format].imageHeight;

        var showAuthor = document.getElementById('showAuthor');
        options.showAuthor = showAuthor.checked;
        var showKicker = document.getElementById('showKicker');
        options.showKicker = showKicker.checked;
        var showWatermark = document.getElementById('showWatermark');
        options.showWatermark = showWatermark.checked;

        var customHeadline = document.getElementById('customHeadline');
        options.customHeadline= customHeadline.value;
        var customKicker = document.getElementById('customKicker');
        options.customKicker= customKicker.value;
        var customAuthorSource = document.getElementById('customAuthorSource');
        options.customAuthorSource= customAuthorSource.value;

        var customHeadlineColor = document.getElementById('customHeadlineColor');
        options.customHeadlineColor= customHeadlineColor.value;

        var customHeadlineBackground = document.getElementById('customHeadlineBackground');
        options.customHeadlineBackground= customHeadlineBackground.value;

        drawCanvases(
          articleInfo,
          options
        );

      }
    );
}


function roundRect(ctx, x, y, width, height, radius) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  ctx.fill();
}




/* Actually drawing */


function drawCanvases(articleInfo, opts) {
  var options = {
    format:opts.format||'instagram-feed',
    width:opts.width||1080,
    height:opts.height||1080
  }
  for (var attrname in opts) { options[attrname] = opts[attrname]; }


  /* Square */
  var block = document.getElementById('canvas-block');
  block.innerHTML="";
  var can1 = document.createElement('canvas');
  can1.id = "smig-image";
  can1.width = options.width;
  can1.height = options.height;
  var ctx1 = can1.getContext("2d");

  var ctx1BaseHeight = options.height;
  var ctx1BaseWidth = options.width;

  block.appendChild(can1);

  ctx1.beginPath();
  ctx1.fillStyle="#000000";
  ctx1.rect(0,0,ctx1BaseWidth,ctx1BaseHeight);
  ctx1.fill();
  ctx1.closePath()

  console.log(options);

  var img = new Image();
  var timestamp = new Date().getTime();
  if (articleInfo.image) {
    img.src = articleInfo.image + '?' + timestamp;
  } else {
    console.log('Couldnt find image');
    img.src = "http://topolitique.ch/neme/style/bg.png" + '?' + timestamp;
  }
  img.onload = function(event){

    /* Draw image on Square */
    console.log('Drawing Image for 1080x1080 image');

    renderBackgroundImage(ctx1, this, {width:options.width, height:options.height});
    /* Draw watermark and text on Square */
    var log = new Image();
    var timestamp = new Date().getTime();
    if (options.format==="instagram-feed") {
      log.src = "http://topolitique.ch/neme/style/watermark_Square.png"+ "?"+timestamp;
    } else if (options.format==="instagram-story") {
      log.src = "http://topolitique.ch/neme/style/watermark_Screen.png"+ "?"+timestamp;
    } else if (options.format==="twitter-feed") {
      log.src = "http://topolitique.ch/neme/style/watermark_Twitter.png"+ "?"+timestamp;
    } else {
      log.src = "http://topolitique.ch/neme/style/watermark_Screen.png"+ "?"+timestamp;
    }
    log.onload = function(e){
      ctx1.drawImage(log, 0,0);

      /* Headline Text */
      if (options.customHeadlineColor) {
        var headlineColor = options.customHeadlineColor
      } else {
        var headlineColor = "#ffffff"
      }
      if (options.customHeadlineBackground) {
        var headlineBackground = options.customHeadlineBackground
      } else {
        var headlineBackground = "transparent"
      }
      var headlineOptions = {
        fontSize:globalOptions[options.format].headlineFontSize,
        lineHeight:Math.round(globalOptions[options.format].headlineFontSize*1.5),
        width:options.width-globalOptions[options.format].leftMargin-globalOptions[options.format].rightMargin,
        fontFamily:"IBM Plex Sans",
        fillForeground:headlineColor,
        fillBackground:headlineBackground
      }
      if (options.customHeadline && options.customHeadline!='') {
        var headlineDrawable = prepareText(ctx1, options.customHeadline, headlineOptions);
      } else {
        var headlineDrawable = prepareText(ctx1, articleInfo.title, headlineOptions);

      }
      renderText(ctx1, headlineDrawable, {x:globalOptions[options.format].leftMargin, y:options.height-headlineDrawable.height-globalOptions[options.format].bottomMargin});
      if (options.showKicker) {
        var kickText = articleInfo.kicker;
        if (options.customKicker && options.customKicker!='') {
          kickText=options.customKicker;
        }
        var kickerDrawable = prepareText(ctx1, kickText, {fontSize:globalOptions[options.format].kickerFontSize,lineHeight:Math.round(globalOptions[options.format].kickerFontSize*1.5),width:options.width-globalOptions[options.format].rightMargin,fontFamily:"IBM Plex Sans",fillForeground:"#ffffff",fillBackground:"#C30E00", roundedCorners:2});
        renderText(ctx1, kickerDrawable, {x:globalOptions[options.format].leftMargin+4, y:options.height-headlineDrawable.height-kickerDrawable.height-globalOptions[options.format].bottomMargin-10});
      }

      /* Draw authors on Square */
      /* 1 */
      var authorsText = "";
      var authorsNum = 0
      if (articleInfo.authorOneName) {
        var authorsText=authorsText+articleInfo.authorOneName;
        authorsNum=1;
        if (options.showAuthor) {
          var au = new Image();
          var timestamp = new Date().getTime();
          au.src = articleInfo.authorOneThumbnail+ "?"+timestamp;
          au.onload = function(e){
            renderCircleImage(ctx1, this, {x:globalOptions[options.format].leftMargin,y:options.height-globalOptions[options.format].bottomMargin+14, size:globalOptions[options.format].authorImageSize})
          }
        }
      }
      if (articleInfo.authorTwoName) {
        var authorsText=authorsText+", "+articleInfo.authorTwoName;
        authorsNum=2;
        if (options.showAuthor) {
          var au2 = new Image();
          var timestamp = new Date().getTime();
          au2.src = articleInfo.authorTwoThumbnail+ "?"+timestamp;
          au2.onload = function(e){
            renderCircleImage(ctx1, this, {x:globalOptions[options.format].leftMargin+(globalOptions[options.format].authorImageSize+14),y:options.height-globalOptions[options.format].bottomMargin+14, size:globalOptions[options.format].authorImageSize})
          }
        }
      }
      if (articleInfo.authorThreeName) {
        var authorsText=authorsText+", "+articleInfo.authorThreeName;
        authorsNum=3;
        if (options.showAuthor) {
          var au2 = new Image();
          var timestamp = new Date().getTime();
          au2.src = articleInfo.authorThreeThumbnail+ "?"+timestamp;
          au2.onload = function(e){
            renderCircleImage(ctx1, this, {x:globalOptions[options.format].leftMargin+2*(globalOptions[options.format].authorImageSize+14),y:options.height-globalOptions[options.format].bottomMargin+14, size:globalOptions[options.format].authorImageSize})
          }
        }
      }
      if (authorsText) {
        if (options.showAuthor) {
          var leftPos = globalOptions[options.format].leftMargin+(globalOptions[options.format].authorImageSize+14)*(authorsNum)+14;
        } else {
          var leftPos=globalOptions[options.format].leftMargin+5;
        }
        var textWidth = options.width/3*2;
        var authorTextOptions = {
          fontSize:globalOptions[options.format].authorsFontSize,
          lineHeight:Math.round(globalOptions[options.format].authorsFontSize*1.5),
          width:textWidth,
          fontFamily:"IBM Plex Sans",
          fontWeight:'normal',
          textShadow:false,
          fillForeground:'#ffffff',
          fillBackground:"rgba(30,30,30,0.2)"
        }
        var authorTextDrawable = prepareText(ctx1, authorsText, authorTextOptions);
        renderText(ctx1, authorTextDrawable, {x:leftPos, y:options.height-globalOptions[options.format].bottomMargin+14});

        console.log(options.customAuthorSource);
        if (options.customAuthorSource && options.customAuthorSource!='') {
          var source = options.customAuthorSource;
        } else {
          var source = "topolitique.ch";
        }
        var topoDrawable = prepareText(ctx1, source, {fontSize:24, lineHeight:40, width:300, fontFamily:"IBM Plex Sans", fillBackground:"#C30E00",fillForeground:"#ffffff", roundedCorners:2});
        renderText(ctx1, topoDrawable, {x:leftPos, y:options.height-globalOptions[options.format].bottomMargin+24+authorTextDrawable.height});

      }
    }


    //var d = can1.toDataURL();
    //console.log(d);
  }/* when image is loaded */
}
