export default function indirect(middlePropertyName) {
  var lastSourcePropertyName = '__indirect:' + middlePropertyName;
  var sourcePropertyObserverName = '__indirect:' + middlePropertyName;

  return function(key, value) {
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
