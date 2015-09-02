define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView'
],
function($, _, Backbone, BaseView) {

  'use strict';

  var BeforeView = BaseView.extend({

    initialize: function() {
      console.log('views/BeforeView');

      // register handlbars helpers
      this.handlebarsHelpers();

      this.constructor.__super__.initialize.apply(this);
    },

    handlebarsHelpers: function() {
      /**
        * Helper for basic math operations.
        */
      Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue
        }[operator];
      });

      /**
        * HTML select option selected.
        */
      Handlebars.registerHelper('selected', function(option, value) {
        return (option == value) ? new Handlebars.SafeString('selected') : '';
      });
    }
  });

  return BeforeView;
});
