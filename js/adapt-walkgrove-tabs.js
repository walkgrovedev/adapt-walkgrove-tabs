define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

  var TabsView = ComponentView.extend({

    events: {
      'click .js-tab-item': 'onSelect'
    },
    
    preRender: function() {
      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();

      this.$('.tabs__widget').eq(0).addClass('is-selected');
      this.$('.tabs__content-holder').eq(0).addClass('is-visible');
      this.setItemVisited(0);

    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    },

    onSelect: function(event) {
      event.preventDefault();

      // reset all
      this.model.get('_items').forEach(function(item, index) {
        this.$('.tabs__widget').eq(index).removeClass('is-selected');
        this.$('.tabs__content-holder').eq(index).removeClass('is-visible');
      });
      // select the tab and show the content
      const tabIndex = $(event.currentTarget).parent().data('index');
      this.$('.tabs__widget').eq(tabIndex).addClass('is-selected');
      this.$('.tabs__content-holder').eq(tabIndex).addClass('is-visible');
      //audio?
      if (Adapt.config.get('_sound')._isActive === true) {
        this.model.get('_items').forEach((item, i) => {
          if (i === tabIndex) {
            if (item._audio) {
              Adapt.trigger('audio:partial', {src: item._audio._src});
            }
          }
        });
      }
      // set as visited
      this.setItemVisited(tabIndex);
    },

    setItemVisited: function(index) {
      this.$('.tabs__widget').eq(index).addClass('is-visited');
      this.checkAllItemsCompleted();
    },

    checkAllItemsCompleted: function() {
      var complete = false;
      if(this.$('.tabs__widget').length === this.$('.is-visited').length){
        complete = true;
      }
      if(complete) {
        this.setCompletionStatus();
      }
    },

  },
  {
    template: 'tabs'
  });

  return Adapt.register('tabs', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: TabsView
  });
});
