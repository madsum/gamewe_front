define([
	'underscore',
	'backbone',
  'views/BeforeView',
  'views/AfterView'
],
function(_, Backbone, BeforeView, AfterView) {

  'use strict';

	var BaseRouter = Backbone.Router.extend({

    before: function(params, next) {
      new BeforeView();
      return next();
    },

    after: function() {
      new AfterView();
    },

    /**
     * Overwrites Backbone route method adding after and before methods.
     * Next wraps the normal route functionality which can be triggered
     * explicitly, e.g. when some conditions are met.
     * 
     * @param {String} route
     * @param {String} name
     * @param {String} callback
     * @returns Backbone.Router
     */
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        var next = function(){
          callback && callback.apply(router, args);
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
          router.after.apply(router, args);
        };
        router.before.apply(router, [args, next]);
      });
      return this;
    }
	});

	return BaseRouter;
});