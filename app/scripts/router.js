define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseRouter',
  'views/CommonView',
  'views/DefaultView',
  'views/MainView'
],
/**
  * AppRouter defines applications routes.
  * @module router
  * @augments BaseRouter
  */
function($, _, Backbone, BaseRouter, CommonView, DefaultView, MainView) {

  var AppRouter = BaseRouter.extend({

    routes: {
      'main': 'showMain',
      'param1/:_value1/param2/:_value2': 'showDefault',
      '*actions': 'showDefault'
    }
  });

  var initialize = function() {
    console.log('router.js');

    var appRouter = new AppRouter;

    appRouter.on('route:showMain', function() {
      $("#container").html(new MainView().render().el);
    });

    appRouter.on('route:showDefault', function(_value1, _value2) {
      $("#container").html(new DefaultView({
        _value1: _value1,
        _value2: _value2
      }).render().el);
    });

    /**
      * Executed on every route request.
      * @event route
      */
    appRouter.on("route", function() {
      console.log('router.js (on every route)');
      $("#container").prepend(new CommonView().render().el);
    });
  };

  return {
    initialize: initialize
  };
});
