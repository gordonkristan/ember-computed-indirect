import Ember from 'ember';

function manageObservers(middlePropertyName, key) {
  // TODO: I don't like using `key`. Can we do better?
  var lastSourcePropertyName = '__indirect_lastSourceProperty:' + key;
  var sourcePropertyObserverName = '__indirect_sourcePropertyObserver:' + key;

  var sourceProperty = this.get(middlePropertyName);
  var lastSourceProperty = this[lastSourcePropertyName];
  var sourcePropertyObserver = this[sourcePropertyObserverName];

  if (lastSourceProperty !== sourceProperty) {
    if (lastSourceProperty && sourcePropertyObserver) {
      this.removeObserver(lastSourceProperty, this, sourcePropertyObserver);
    }

    this[sourcePropertyObserverName] = function() {
      this.notifyPropertyChange(key);
    };

    this.addObserver(sourceProperty, this, this[sourcePropertyObserverName]);
    this[lastSourcePropertyName] = sourceProperty;
  }
};

export default function indirect(middlePropertyName) {
  return Ember.computed(middlePropertyName, {
    set: function(key, value) {
      manageObservers.call(this, middlePropertyName, key);
      this.set(this.get(middlePropertyName), value);
      return value;
    },
    get: function(key) {
      manageObservers.call(this, middlePropertyName, key);
      return this.get(this.get(middlePropertyName));
    }
  });
}
