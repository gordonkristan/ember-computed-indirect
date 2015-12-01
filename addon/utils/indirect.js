import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default function indirect(pathProperty) {

  return Ember.computed(pathProperty, {
    get: function getIndirectPropertyValue(key) {

      var metaSourceKey = 'source.' + key;
      var metaBindingKey = 'binding.' + key;
      // Use a Ember.meta instead of storing meta info on the object itself
      var _meta = Ember.meta(this, true);
      _meta = _meta.__indirect__ || (_meta.__indirect__ = {});

      var currentKey = get(this, pathProperty);
      if (currentKey !== _meta[metaSourceKey]) {
        if (_meta[metaBindingKey]) {
          _meta[metaBindingKey].disconnect(this);
        }
        if (currentKey) {
          _meta[metaBindingKey] = Ember.Binding.from(currentKey).to(key).connect(this);
        }
        _meta[metaSourceKey] = currentKey;
      }

      return currentKey && get(this, currentKey);
    },

    set: function setIndirectPropertyValue(key, value) {
      return set(this, get(this, pathProperty), value);
    }
  });
}
