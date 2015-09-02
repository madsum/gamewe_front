define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'i18next',
  'bootstrap-collapse'
],
/**
  * Initialize router.
  * @global
  */
function($, _, Backbone, Router) {

  var initialize = function() {
    console.log('app.js');

    Router.initialize();

    Backbone.history.start();
  };
  
  return {
    initialize: initialize
  };
});
