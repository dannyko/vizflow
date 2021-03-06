var playerBattleHelper = {

  health_bar: function (player) {
    if (player === undefined) {
      player = this ;
    }

    var healthbarConfig = { 

      color:  '#FF0000',
      height: 5,
      width:  player.health,
      angle:  0,
      x:      0,
      y:      0,

    } ;

    var healthbarImage  = $Z.helper.image.create(healthbarConfig.width, healthbarConfig.height) ;

    $Z.helper.draw.rect(healthbarConfig, healthbarImage.context() ) ; // draw the non-upsampled healthbar to a canvas

    healthbarImage  = $Z.helper.image.adjust_ratio( healthbarImage ) ;

    return healthbarImage ;

  },

  setup: function player_battle_helper_setup(viz) {

    var player                  = setup_element(viz, viz.playerConfig) ;
    player.level                = 0 ;
    player.update               = playerBattleHelper.update_player ;
    player.levelup              = playerBattleHelper.levelup ;
    player.paused               = false ;
    player.state                = [] ;
    player.item.responseSet.hit = playerHitHelper.setup(viz, player) ;
    player.health               = 15 ;
    player.health_bar           = playerBattleHelper.health_bar ;
    player.attack               = playerBattleHelper.attack ;
    player.block                = playerBattleHelper.block ;
    player.hit                  = playerBattleHelper.hit ;
    player.healthbar = viz.setup_item ({
    image: player.health_bar(),
      x: 10,
      y: 38,
    }) ;

    player.item.default_child() ;
    player.healthbar.add() ;

    player.add_event = function(event) {
      if (this.state.indexOf(event.keyCode) == -1) {
        this.state.push(event.keyCode) ;
      }      
    } ;

    player.remove_event = function(event) {
        this.state = this.state.filter(function (d) {
            d !== event.keyCode ;
        }) ;     
    } ;

    return player ;

  },

  attack: function player_battle_helper_attack (attackType, player) {
    if (player === undefined) {
      player = this ;
    }
      switch (attackType) {

        case 'slash':
          var dur1 = 220 ;
          var dur2 = 100 ;
          var dur3 = 90 ;
          var dur4 = 300 ;
          var dur5 = 600 ;
          var trans1 = $Z.helper.transition.new_step('image', player.sprite.attack[0], dur1) ;
          var trans2 = $Z.helper.transition.new_step('image', player.sprite.attack[1], dur2) ;
          var trans3 = $Z.helper.transition.new_step('image', player.sprite.attack[2], dur3) ;  
          var trans4 = $Z.helper.transition.new_step('image', player.sprite.attack[3], dur4) ;            
          var trans5 = $Z.helper.transition.new_step('image', player.sprite.rest[0], dur5) ;

          trans1.child = trans2 ;
          trans1.child.child = trans3 ;
          trans1.child.child.child = trans4 ;
          trans1.child.child.child.child = trans5 ;
          player.item.add_transition(trans1) ;          
          
          break;

        case 'thrust':
          var dur1 = 800 ;
          var dur2 = 500 ;
          var dur3 = 500 ;
          var trans1 = $Z.helper.transition.new_step('image', player.sprite.thrust[0], dur1) ;
          var trans2 = $Z.helper.transition.new_step('image', player.sprite.thrust[1], dur2) ;
          var trans3 = $Z.helper.transition.new_step('image', player.sprite.rest[0], dur3) ;
          
          trans1.child = trans2 ;
          trans1.child.child = trans3 ;
          player.item.add_transition(trans1) ;
          break;

        case 'finisher':
          var dur1 = 300 ;
          var dur2 = 250 ;
          var dur3 = 400 ;
          var dur4 = 250 ;
          var dur5 = 100 ;
          var dur6 = 50 ;
          var dur7 = 50 ;
          var dur8 = 50 ;
          var dur9 = 50 ;
          var trans1 = $Z.helper.transition.new_step('image', player.sprite.finisher[0], dur1) ;
          var trans2 = $Z.helper.transition.new_step('image', player.sprite.finisher[1], dur2) ;
          var trans3 = $Z.helper.transition.new_step('image', player.sprite.finisher[2], dur3) ;          
          var trans4 = $Z.helper.transition.new_step('image', player.sprite.finisher[3], dur4) ;    
          var trans5 = $Z.helper.transition.new_step('image', player.sprite.finisher[4], dur5) ;
          var trans6 = $Z.helper.transition.new_step('image', player.sprite.finisher[5], dur6) ;
          var trans7 = $Z.helper.transition.new_step('image', player.sprite.finisher[6], dur7) ;
          var trans8 = $Z.helper.transition.new_step('image', player.sprite.finisher[7], dur8) ; 
          var trans9 = $Z.helper.transition.new_step('image', player.sprite.rest[0], dur9) ;

          trans1.child = trans2 ;
          trans1.child.child = trans3 ;
          trans1.child.child.child = trans4 ;
          trans1.child.child.child.child = trans5 ;
          trans1.child.child.child.child.child = trans6 ;
          trans1.child.child.child.child.child.child = trans7 ;
          trans1.child.child.child.child.child.child.child = trans8 ;
          trans1.child.child.child.child.child.child.child.child = trans9 ;

          player.item.add_transition(trans1) ;          
          
          break;
        
        }     
  },

  block: function player_battle_helper_block (blockType, player) {
    if(player === undefined) {
      player = this ;
    }
      switch (blockType) {

        case 'shield':  
          var dur1 = 100 ;
          var dur2 = 1000 ;
          var dur3 = 200 ;
          var trans1 = $Z.helper.transition.new_step('image', player.sprite.block[0], dur1) ;
          var trans2 = $Z.helper.transition.new_step('image', player.sprite.block[1], dur2) ;          
          var trans3 = $Z.helper.transition.new_step('image', player.sprite.rest[0], dur3) ;

          trans1.child = trans2 ;
          trans1.child.child = trans3 ;
          player.item.add_transition(trans1) ;

            if (player.restoreRest === true) {
              finalFrame = player.sprite.rest[0] ;  
            }
          player.restoreRest === true ;    
          break ;
      }
  },

    hit: function player_battle_helper_hit (hitType, player) {
    if(player === undefined) {
      player = this ;
    }
      switch (hitType) {

        case 'hit1':
          var dur1 = 100 ;
          var dur2 = 100 ;

          var trans1 = $Z.helper.transition.new_step('image', player.sprite.hit[0], dur1) ;
          var trans2 = $Z.helper.transition.new_step('image', player.sprite.rest[0], dur2) ;        

          trans1.child = trans2 ;
          
          player.item.add_transition(trans1) ;
         break ;
      }   
  },

  update: function player_helper_update(event, player) {

    if( player === undefined ) {
      player = this ;
    }

    if( player.paused === true ) {
      return ;
    }

    player.add_event(event) ;

    var transition ;

    for (var kState = 0 ; kState < player.state.length ; kState++) {
      var keyCode = player.state[kState] ;
      var state ;
      var scaleDur = 2000 ;

        switch (keyCode) {

          case 37: // left
            state = 'l' ;
            break;
          case 65: // a
            state = 't' ;
            break;
          case 39: // right
            state = 'r' ;
            break;
          case 83: // s
            state = 'd' ;
            break;
          case 68: // d
            state = 'a' ;
            break ;
          case 70: // f
            state = 'f' ;
            break ;  

        } 

      switch(state) {

        case 'l' :
        

          player.item.add_linear_sequence('x', [-30, 60], [100, 1400]) ;
 
          break ;

        case 'r' :

          player.item.add_linear_sequence('x', [160, 60], [100, 1400]) ;

          break ;
       
        case 'd' :

          // if( $Z.helper.transition.find('image', player.item.transition) > -1 ) {
          //   return ; // don't interrupt the current attack animation 
          // }
          viz.player.block('shield') ;
          viz.button.thrust.item.add_linear('x', 4, scaleDur * 0.1) ;
          viz.button.thrust.item.fade({
              opacity: 1,
              duration: 0.3 * viz.fadeDuration,
          }) ;   


    
            break ;

        case 'a' :
         
          // if( $Z.helper.transition.find('image', player.item.transition) > -1 ) {
          //   return ; // don't interrupt the current attack animation 
          // }
          viz.player.attack('slash') ;
          viz.button.slash.item.uiSwitch = false ; 
          viz.button.finisher.item.uiSwitch = true ;
          viz.button.finisher.item.add_linear('x', 270, 0.1 * scaleDur ) ;
          viz.button.finisher.item.fade({
              opacity: 1,
              duration: 0.3 * viz.fadeDuration,
          }) ; 
          viz.button.slash.item.add_linear('x', 320, 0.1 * scaleDur ) ;
          viz.button.slash.item.fade({
              opacity: 0,
              duration: 0.3 * viz.fadeDuration,
          }) ;           

          break ;

        case 't' :
         
          // if( $Z.helper.transition.find('image', player.item.transition) > -1 ) {
          //   return ; // don't interrupt the current attack animation 
          // }
          viz.player.attack('thrust') ;
          viz.button.thrust.item.add_linear('x', -50, scaleDur * 0.1) ;

          break ;         

        case 'f' :
         
          // if( $Z.helper.transition.find('image', player.item.transition) > -1 ) {
          //   return ; // don't interrupt the current attack animation 
          // }
          viz.player.attack('finisher') ;
          viz.button.slash.item.uiSwitch = true; 
          viz.button.finisher.item.add_linear('x', 320, 0.1 * scaleDur ) ;

          viz.button.finisher.item.fade({
            opacity: 0,
            duration: 0.3 * viz.fadeDuration,
          }) ;   
          viz.button.slash.item.add_linear('x', 270, 0.1 * scaleDur ) ;
          viz.button.slash.item.fade({
            opacity: 1,
            duration: 0.3 * viz.fadeDuration,
          }) ; 
          viz.button.finisher.item.uiSwitch = false ;          

          break ;              
                  
      }

    }
     
    player.remove_event(event) ;       

  },
      
} ;