let asyncHelper = {

  promisify: function async_promisify(async_func) { // async_func should only accept one or two arguments (resolve and reject, see Promise API for details)

    var p = new Promise(function(resolve) {
      async_func(resolve) ;
    }) ;

    return p ;

  },

  promise: function async_promise(async) { // function that creates functions that return promises that wrap our async functions 

    function setup_async_promise() {
      return asyncHelper.promisify(async) ;
    }

    return setup_async_promise ;

  },

  pipe: function async_pipe(asyncList) { // takes an array of async functions and pipes them using async Promises
    return $Z.pipe( asyncList.map( (d) => asyncHelper.promise(d) ) ) ; // async pipe ftw
  },

} ;

export { asyncHelper as default }