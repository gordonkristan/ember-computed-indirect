export default function indirect(middlePropertyName) {
  var sourcePropertyObserver, lastSourceProperty;

  return function(key, value) {
    var sourceProperty = this.get(middlePropertyName);

    if (lastSourceProperty !== sourceProperty) {
      if (lastSourceProperty && sourcePropertyObserver) {
        this.removeObserver(lastSourceProperty, this, sourcePropertyObserver);
      }

      sourcePropertyObserver = function() {
        this.notifyPropertyChange(key);
      };

      this.addObserver(sourceProperty, this, sourcePropertyObserver);
      lastSourceProperty = sourceProperty;
    }

    if (arguments.length > 1) {
      this.set(sourceProperty, value);
    }

    return this.get(sourceProperty);
  }.property(middlePropertyName);
}
