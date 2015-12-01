import Ember from 'ember';
import { module, test } from 'qunit';
import computedIndirect from 'ember-computed-indirect/utils/indirect';

var IndirectObject = Ember.Object.extend({
  source1: 'value1',
  source2: 'value2',
  value: computedIndirect('path')
});

var BoundObject = Ember.Object.extend({
  valueBinding: 'object.value'
});

var object = null;

module('Indirect Computed Test', {
  setup: function() {
    object = IndirectObject.create({
      path: 'source1'
    });
  }
});

test('reading indirect property gets source value', function(assert) {
  assert.expect(1);

  assert.strictEqual(object.get('value'), 'value1');
});

test('updating indirect property updates source value', function(assert) {
  assert.expect(4);

  assert.strictEqual(object.get('value'), 'value1');
  assert.strictEqual(object.get('source1'), 'value1');

  object.set('value', 'newvalue');

  assert.strictEqual(object.get('value'), 'newvalue');
  assert.strictEqual(object.get('source1'), 'newvalue');
});

test('updating source value fires indirect observer', function(assert) {
	assert.expect(0);

  var deferred = Ember.RSVP.defer();

  object.get('value');
  object.addObserver('value', object, function() {
    if (this.get('value') === 'newvalue') {
      deferred.resolve();
    } else {
      throw new Error();
    }
  });

  object.set('source1', 'newvalue');

  return deferred.promise;
});

test('updating path property fires indirect observer', function(assert) {
	assert.expect(0);

  var deferred = Ember.RSVP.defer();

  object.get('value');
  object.addObserver('value', object, function() {
    if (this.get('value') === 'value2') {
      deferred.resolve();
    } else {
      throw new Error();
    }
  });

  object.set('path', 'source2');

  return deferred.promise;
});

test('observers are torn down correctly', function(assert) {
  assert.expect(0);

  // Create two test objects
  var t1 = IndirectObject.create({ path: 'source1' });
  var t2 = IndirectObject.create({ path: 'source2' });

  // Activate the observers
  t1.get('value');
  t2.get('value');

  // Change the path of the second object and activate the observer
  t1.set('path', 'source2');
  t1.get('value');

  // Set an observer on the first object
  t1.addObserver('value', t1, function() {
    throw new Error('The observer wasn\'t torn down correctly!');
  });

  // Make sure that the first object's observer was left alone when we changed the second object's path
  t1.set('source1', null);
});

test('binding value fires observer only once', function(assert) {
  assert.expect(1);

  var bound = BoundObject.create({ object });

  object.addObserver('value', object, function() {
    assert.strictEqual(this.get('value'), 'newvalue');
  });

  Ember.run(function() {
    object.set('value', 'newvalue');
  });
});
