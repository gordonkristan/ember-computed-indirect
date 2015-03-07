import Ember from 'ember';

var sourcePropertyObservers = {};
var lastSourceProperties = {};

export default function indirect(middlePropertyName) {
  return function(key, value) {
    var guid = Ember.guidFor(this);
    var sourceProperty = this.get(middlePropertyName);

    if (lastSourceProperties[guid] !== sourceProperty) {
      if (lastSourceProperties[guid] && sourcePropertyObservers[guid]) {
        this.removeObserver(lastSourceProperties[guid], this, sourcePropertyObservers[guid]);
      }

      sourcePropertyObservers[guid] = function() {
        this.notifyPropertyChange(key);
      };

      this.addObserver(sourceProperty, this, sourcePropertyObservers[guid]);
      lastSourceProperties[guid] = sourceProperty;
    }

    if (arguments.length > 1) {
      this.set(sourceProperty, value);
    }

    return this.get(sourceProperty);
  }.property(middlePropertyName);
}
