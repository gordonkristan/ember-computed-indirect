import computedIndirect from 'ember-computed-indirect/utils/indirect';

export default {
  name: 'ember-computed-indirect',
  initialize: function() {
    Ember.computed.indirect = computedIndirect;
  }
};
