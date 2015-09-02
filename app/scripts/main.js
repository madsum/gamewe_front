/*global require*/
'use strict';

require.config({

  paths: {
    'autonumeric': '../bower_components/autoNumeric/autoNumeric',
    'backbone': '../bower_components/backbone/backbone',
    'backbone-forms': "../bower_components/backbone-forms/distribution.amd/backbone-forms",
    'bootstrap-alert': '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/alert',
    'bootstrap-carousel': '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/carousel',
    'bootstrap-collapse': '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/collapse',
    'bootstrap-modal': '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/modal',
    'bootstrap-tab': '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/tab',
    // 'bootstrap-tooltip': '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/tooltip',
    'bootstrap-transition': '../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/transition',
    'bootstrap-daterangepicker': '../bower_components/bootstrap-daterangepicker/daterangepicker',
    'handlebars': '../bower_components/handlebars/handlebars',
    'i18next': '../bower_components/i18next/i18next.amd.withJQuery',
    'jquery': '../bower_components/jquery/dist/jquery',
    'jquery-cookie': '../bower_components/jquery-cookie/jquery.cookie',
    'jquery-serialize-object': '../bower_components/jQuery.serializeObject/jquery.serializeObject',
    'jquery-ui': '../bower_components/jquery-ui/ui/jquery-ui',
    'jquery.serializeObject': '../bower_components/jQuery.serializeObject/jquery.serializeObject',
    'moment': '../bower_components/moment/min/moment-with-locales',
    // 'routes': 'routes',
    'text': '../bower_components/requirejs-text/text',
    'underscore': '../bower_components/underscore/underscore',
    'qtip2': '../bower_components/qtip2/jquery.qtip'
  },

  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'bootstrap-alert': {
      deps: ['jquery'],
      exports: 'jquery'
    },
    'bootstrap-carousel': {
      deps: ['jquery'],
      exports: 'jquery'
    },
    'bootstrap-collapse': {
      deps: ['jquery', 'bootstrap-transition'],
      // deps: ['jquery'],
      exports: 'jquery'
    },
    'bootstrap-modal': {
      deps: ['jquery'],
      exports: 'jquery'
    },
    'bootstrap-tab': {
      deps: ['jquery'],
      exports: 'jquery'
    },
    // 'bootstrap-tooltip': {
    //   deps: ['jquery'],
    //   exports: 'jquery'
    // },
    'bootstrap-transition': {
      deps: ['jquery'],
      exports: 'jquery'
    },
    'jquery-ui': {
      deps: ['jquery']
    },
    'handlebars': {
      exports: 'Handlebars'
    },
    'qtip2': {
      deps: ['jquery']
    }
  }
});

require([
  'jquery',
  'underscore',
  'backbone',
  'app',
  'jquery-cookie'
  ], function($, _, Backbone, App) {

    // initialize translations before App
    $.i18n.init({
      resGetPath: 'locales/__lng__/__ns__.json',
      lng: $.cookie('language'),
      fallbackLng: 'en',
      cookieName: 'language',
      ns: {
        namespaces: ['translation'],
        defaultNs: 'translation'
      }
    }, function () {
      console.log('main.js');
      App.initialize();
    });
  });
