import Ember from 'ember';

var get = Ember.get;
var set = Ember.set;

export default function indirect(pathProperty) {

  return Ember.computed(pathProperty, {
    get: function getIndirectPropertyValue(key) {

      var metaSourceKey = 'source.' + key;
      var metaObserverKey = 'observer.' + key;
      // Use a Ember.meta instead of storing meta info on the object itself
      var _meta = Ember.meta(this, true);
      _meta = _meta.__indirect__ || (_meta.__indirect__ = {});

      var metaObserver = _meta[metaObserverKey];
      if (!metaObserver) {
        _meta[metaObserverKey] = metaObserver = function() {
          this.notifyPropertyChange(key);
        };
      }

      var currentKey = get(this, pathProperty);
      if (currentKey !== _meta[metaSourceKey]) {
        if (_meta[metaSourceKey]) {
          Ember.removeObserver(this, _meta[metaSourceKey], this, metaObserver);
        }
        if (currentKey) {
          Ember.addObserver(this, currentKey, this, metaObserver);
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
