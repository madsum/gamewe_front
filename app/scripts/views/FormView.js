define([
  'jquery',
  'underscore',
  'backbone',
  'core/BaseView',
  'models/TerritoryModel',
  'templates',
  'backbone-forms',
  'jquery-serialize-object'
], function($, _, Backbone, BaseView, TerritoryModel, JST) {

  'use strict';

  Backbone.Form.validators.errMessages.required = 'error.required';

  var territoryErrors = {
    nameLength: {
      message: 'territory.name.error.length'
    },
    populationAmount: {
      message: 'territory.population.error.amount'
    }
  };

  var territorySchema = {
    name: {
      type: 'Text',
      validators: [
        'required',
        function checkLength(value, formValues) {
          if (value.length < 3) {
            return territoryErrors.nameLength;
          }
        }
      ],
      editorClass: 'form-control',
      editorAttrs: {
        'data-i18n': '[placeholder]territory.name.placeholder'
      }
    },
    population: {
      type: 'Number',
      validators: [
        'required',
        function checkAmount(value, formValues) {
          if (value < 1000) {
            return territoryErrors.populationAmount;
          }
        }
      ],
      editorClass: 'form-control',
      editorAttrs: {
        'data-i18n': '[placeholder]territory.population.placeholder'
      }
    }
  };

  var TerritoryForm = Backbone.Form.extend({
    template: JST['app/scripts/templates/formTemplate.hbs'],
    schema: territorySchema
  });

  var FormView = BaseView.extend({

    className: 'view view-form',

    events: {
      'submit form': 'submit',
      'blur .form-control': 'submit'
    },

    submit: function(e) {
      e.preventDefault();

      var self = this;

      $('.alert', this.$el).remove();

      var errors = this.territoryForm.validate() || {};

      _.each(territorySchema, function(field, index, list) {
        if (!_.isUndefined(errors[index])) {
          $('#form', self.$el).prepend($('<div>')
            .attr('class', 'alert alert-danger')
            .attr('role', 'alert')
            .text($.t(errors[index].message))
          );          
        }
      });

      if (e.type === 'submit' && _.isEmpty(errors)) {
        var form = $('#form', this.$el).serializeObject();
        var territoryModel = new TerritoryModel(form);
        // territoryModel.trigger('save', territoryModel);
        territoryModel.save({}, {
          success: function(model, response, options) {
            self.render();
          },
          error: function(model, response, options) {}
        });
      }
    },

    initialize: function() {
      console.log('views/FormView.js');

      this.territoryForm = new TerritoryForm();
    },

    render: function() {
      this.$el.html(this.territoryForm.render().el);

      this.$el.i18n();

      this.delegateEvents();

      return this;
    }
  });

  return FormView;
});
