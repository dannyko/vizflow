let drawHelper = {

  item: function draw_helper_item ( item, context, ratio ) { // render item and its child items

    if ( item === undefined ) {
      item = this ;
    }

    drawHelper.image(item) ;
    if( item.child !== undefined ) {
      // console.log('draw helper item:', 'item.child', item.child) ;
      for ( var kOver = 0 ; kOver < item.child.length ; kOver++ ) {
        item.child[kOver].x = item.x ;
        item.child[kOver].y = item.y ;
        item.child[kOver].angle = item.angle ;
        item.child[kOver].xScale = item.xScale ;
        item.child[kOver].yScale = item.yScale; 

        var opacity = item.child[kOver].opacity ;

        if ( item.childFade === true ) {
          item.child[kOver].opacity = item.child[kOver].opacity * item.opacity ;
        }
        
        // console.log('item.child[kOver]', item.child[kOver], 'item.child[kOver].x', item.child[kOver].x) ;
        item.child[kOver].render() ;

        item.child[kOver].opacity = opacity ;
      }      
    }
  },

  indexed: function draw_helper_indexed(item, canvas, width, height) { // takes an array of items and draws them using indexed colors

    if(canvas === undefined) { 
      var canvas  = $Z.helper.image.create (width, height) ;
    } else {
      canvas.width = canvas.width // resets the canvas simiar to clearRect
    }

    var context = canvas.context() ;

    for(var kItem = 0 ; kItem < item.length ; kItem++) {

      if ( item[kItem].uiSwitch === false ) {
        continue ;
      }

      var img ;

      if ( item[kItem].image.originalCanvas !== undefined ) {
        img = item[kItem].image.originalCanvas ;
      } else {
        img = item[kItem].image ;
      }

      var imageDataK = img
        .context()
        .getImageData(0, 0, item[kItem].image.width, item[kItem].image.height) ;

      var imageK     = $Z.helper.image.to_index(imageDataK, kItem) ; // ImageData object
      var tempCanvas = $Z.helper.image.create(item[kItem].image.width, item[kItem].image.height) ;

      tempCanvas
        .context()
        .clearRect(0, 0, tempCanvas.width, tempCanvas.height) ;
      tempCanvas
        .context()
        .putImageData(imageK, 0, 0) ;

      if ( item[kItem].xOrigin !== undefined ) {
        var xOrigin = item[kItem].xOrigin * item[kItem].xScale ;
      } else {
        var xOrigin = 0 ;
      }

      if ( item[kItem].yOrigin !== undefined ) {
        var yOrigin = item[kItem].yOrigin * item[kItem].yScale ;
      } else {
        var yOrigin = 0 ;
      }

      var itemImage = item[kItem].image ;
      item[kItem].image = tempCanvas ;
      var op = item[kItem].opacity ; 
      item[kItem].opacity = 1 ;
      drawHelper.image(item[kItem], context) ; // context.drawImage(tempCanvas, item[kItem].x - xOrigin, item[kItem].y - yOrigin) ; // draw color-indexed button for color picking
      item[kItem].image = itemImage ;
      item[kItem].opacity = op ;

    }

    // $Z.helper.image.view(context.canvas) ;

    // console.log('indexed draw: ', 'item', item)

    return canvas ; 

  },  

  image: function draw_helper_image (item, context, ratio) {

    if (item === undefined) {
      item = this ;
    } 

    if ( item.opacity === 0 ) {
      return ;
    }

    if (context === undefined) {
      context = item.viz.fullContext ;
    }

    if (ratio === undefined) {
      ratio = document.ratio ;
    }

    if (item.xScale === undefined) {
      item.xScale = 1 ;
    }

    if (item.yScale === undefined) {
      item.yScale = 1 ;
    }

    // console.log('item.x', item.x, 'width', item.viz.screenCanvas.width) ;

    // console.log('draw_image', 'item', item, 'context', context, 'this', this) ;

    var viewX, viewY ;
    var itemX, itemY;

    if(item.fixed === true) {

      viewX = item.viz.viewportX ;
      viewY = item.viz.viewportY ;
      itemX = item.x ;
      itemY = item.y ;

      if ( item.x < 0 ) { // periodic wrap negative values
        itemX = item.viz.viewportWidth + item.x ;
      }

      if ( item.y < 0 ) { // periodic wrap negative values
        itemY = item.viz.viewportHeight + item.y ;
      }

    } else {

      viewX = 0 ;
      viewY = 0 ;
      itemX = item.x ;
      itemY = item.y ;

    }

    var originX = item.xOrigin * item.xScale || 0 ;
    var originY = item.yOrigin * item.yScale || 0 ;

    var dx = (itemX + item.viz.xShift + viewX - originX) * ratio ;
    var dy = (itemY + item.viz.yShift + viewY - originY) * ratio ;

    dx = Math.floor( dx ) ;
    dy = Math.floor( dy ) ;

    if(item.opacity !== undefined) {

      // console.log('item opacity', item.opacity) ;
      var alpha = context.globalAlpha ;
      context.globalAlpha = item.opacity ;
      var xShift = Math.floor(ratio * (item.x + item.xAngle)) ;
      var yShift = Math.floor(ratio * (item.y + item.yAngle)) ;
      context.translate(xShift, yShift) ;
      context.rotate(item.angle) ;
      context.translate(-xShift, -yShift) ;
      var dw = Math.floor(item.image.width * item.xScale) ;
      var dh = Math.floor(item.image.height * item.yScale) ;
      // console.log('draw helper', 'item', item, 'dw', dw, 'dh', dh) ;
      context.drawImage(item.image, 0, 0, item.image.width, item.image.height, dx, dy, dw, dh) ;
      context.setTransform(1, 0, 0, 1, 0, 0) ;
      context.globalAlpha = alpha ;      

    } else {
      context.drawImage(item.image, dx, dy) ;      
    }

  },
  
  rect: function draw_helper_rect (rect, context, ratio) {

    if (rect === undefined) {
      rect = this ;
    }

    if(context === undefined) {
      context = $Z.helper.image.create(rect.width, rect.height).context() ;
    }

    if(ratio === undefined) {
      ratio = document.ratio ;
    }

    var fillStyle = context.fillStyle ;

    if(rect.color === undefined) {
      rect.color = fillStyle ;
    }

    var strokeStyle = context.strokeStyle ;

    if(rect.stroke === undefined) {
      rect.stroke = strokeStyle ;
    }

    var xNew, yNew ;

    if(rect.viz !== undefined) {

      var viewX, viewY ;

      if(rect.fixed === true) {

        viewX = rect.viz.viewportX ;
        viewY = rect.viz.viewportY ;

      } else {

        viewX = 0 ;
        viewY = 0 ;

      }

      xNew = (rect.x + rect.viz.xShift + viewX) ;
      yNew = (rect.y + rect.viz.yShift + viewY) ;

    } else {

      xNew = rect.x ;
      yNew = rect.y ;

    }

    var yNew ;
    var dx = xNew * ratio ;
    var dy = yNew * ratio ;

    dx = Math.floor( dx ) ;
    dy = Math.floor( dy ) ;
    
    context.beginPath() ;
    context.fillStyle = rect.color ;
    context.strokeStyle = rect.stroke ;

    if(rect.opacity !== undefined) {
      // console.log('item', rect) ;
      // var alpha = context.globalAlpha ;
      context.globalAlpha = rect.opacity ;
      // context.globalAlpha = alpha ;      
    } 

    // console.log('draw rect: ', 'dx, dy, Math.floor(rect.width * ratio), Math.floor(rect.height * ratio)', dx, dy, Math.floor(rect.width * ratio), Math.floor(rect.height * ratio)) ;

    var xShift = Math.floor(ratio * (rect.x + rect.xAngle)) ;
    var yShift = Math.floor(ratio * (rect.y + rect.yAngle)) ;
    context.translate(xShift, yShift) ;
    context.rotate(rect.angle) ;
    context.translate(-xShift, -yShift) ;

    context.rect(dx, dy, Math.floor(rect.width * ratio), Math.floor(rect.height * ratio)) ;
    context.fill() ;
    context.stroke() ;
    context.closePath() ;

    context.setTransform(1, 0, 0, 1, 0, 0) ;

    context.fillStyle = fillStyle ;
    context.strokeStyle = strokeStyle ;

    return context.canvas ;

  },

  circle: function draw_circle (circ, context) {

    if (circ === undefined) {
      circ = this ;  
    }

    let lineWidth = circ.lineWidth || 0 ;

    if (context === undefined) {
      var pad = 2 ;
      let size = (circ.radius + lineWidth) * 2 + pad ;
      context = $Z.helper.image.create(size, size).context() ;
    }

    context.beginPath() ;
    let x = circ.x || (circ.radius + lineWidth + pad) ;
    let y = circ.y || (circ.radius + lineWidth + pad) ;

    x = Math.floor(x) ;
    y = Math.floor(y) ;

    let r = circ.radius ;
    context.arc(x, y, r, 0, Math.PI * 2, true) ;

    if(circ.fill !== undefined) {
      context.fillStyle = circ.fill ;
      context.fill() ;
    }

    if(circ.stroke !== undefined) {
      context.lineWidth = lineWidth ;
      context.strokeStyle = circ.stroke ;
      context.stroke() ;
    }

    context.closePath() ;

    return context.canvas ;

  },


} ;

export { drawHelper as default }