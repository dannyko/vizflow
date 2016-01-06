// vizflow: application-agnostic interactive vizualization engine
// by Daniel Korenblum 4/20/2015
// http://github.com/dannyko/vizflow

// define some default values for the $Z object's attributes: 

var _item   = []       ; // initialize the array of items (change to an object pool later to reduce garbage collection)
var _prep   = []       ; // array of actions to perform before rendering the items on each frame (e.g. collision detection, background clearing)
var _detect = []       ; // array of detectors to perform before rendering the items on each frame (e.g. collision detection, background clearing)
var _action = []       ; // array of actions to perform before rendering the items on each frame (e.g. collision detection, background clearing)
var iter    = 0        ; // default initial iteration count
var verbose = false    ; // default verbosity value
var maxIter = Infinity ; // default iteration limit

// import the helper functions and wrappers attached to the $Z object:

import step            from './step'            ;
import item            from './item'            ;
import prep            from './prep'            ;
import detect          from './detect'          ;
import action          from './action'          ;
import pipe            from './pipe'            ;
import done            from './done'            ;
import exit            from './exit'            ;
import run             from './run'             ;
import update          from './update'          ;
import transition      from './transition'      ;

// import the functions defining the asynchronous tasks comprising the main simulation or game loop, stored in an array called "tasks": 

import preprocess      from './preprocess'      ;
import update_items    from './update_items'    ;
import detect_actions  from './detect_actions'  ;
import perform_actions from './perform_actions' ;
import render_image    from './render_image'    ;
import step_or_exit    from './step_or_exit'    ;

var task = [       // array of functions defining the sequence of asynchronous (non-blocking) tasks to perform for each step/frame/iteration of the visualization
  preprocess,      // process user inputs and translate them into actionable changes to the data item attributes
  update_items,    // apply changes to the data item attributes as determined by current data item and user input states 
  detect_actions,  // apply simulation or game logic e.g. collision detection etc. to determine what actions need to be performed
  perform_actions, // perform any actions e.g. item updates that are necessary for the simulation to continue
  render_image,    // draw the data items to the screen somehow (render-agnostic)
  step_or_exit     // decides whether to generate another frame or to stop the simulation/game
] ; 

// define the vizflow object ($Z): 

window.$Z = { // define the "bling Z" object for running interactive vizualizations
  verbose,    // toggles console log statements
	iter,       // initialize loop iteration index (simulation step counter)
	maxIter,    // default maximum iteration count allowed (max # of frames
	transition, // module comtaining transition helpers
	_item,      // default data item array (internal use only as marked by underscore)
	_action,    // array of actions (internal use only as marked by underscore)
	_prep,      // array of preprocessing tasks to perform (internal use only as marked by underscore)
	item,       // getter/setter function for interfacing with the item/data array
	detect,     // getter/setter function for interfacing with the _detect array
	action,     // getter/setter function for interfacing with the _action array
	prep,       // getter/setter function for interfacing with the _prep array
	update,     // default update function for items using arrays of transition objects containing interpolation functions
	pipe,       // function for dynamically chaining promises using a for-loop
	step,       // function that executes one complete step (frame) of the interactive visualization / simulation / game
	done,       // function to check for the end of the simulation or game, returns true if the simulation or game has ended
	exit,       // function to execute after the simulation or game has ended to trigger the exit sequence
	task,       // array of functions defining the sequence of asynchronous tasks to perform for each step or frame of the visualization
	run         // function that executes each of the asynchronous tasks sequentially using Promise.then() chaining
} ;

export default {}