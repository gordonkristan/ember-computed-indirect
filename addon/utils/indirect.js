export default function indirect(middlePropertyName) {
  return function(key, value) {
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

    if (arguments.length > 1) {
      this.set(sourceProperty, value);
    }

    return this.get(sourceProperty);
  }.property(middlePropertyName);
}
