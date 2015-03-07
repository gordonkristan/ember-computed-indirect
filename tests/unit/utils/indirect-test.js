import Ember from 'ember';
import { test } from 'ember-qunit';
import computedIndirect from 'ember-computed-indirect/utils/indirect';

var IndirectObject = Ember.Object.extend({
  source1: 'value1',
  source2: 'value2',
  value: computedIndirect('path')
});

var object = null;

module('Indirect Computed Test', {
  setup: function() {
    object = IndirectObject.create({
      path: 'source1'
    });
  }
});

test('reading indirect property gets source value', function() {
  expect(1);

  strictEqual(object.get('value'), 'value1');
});

test('updating indirect property updates source value', function() {
  expect(4);

  strictEqual(object.get('value'), 'value1');
  strictEqual(object.get('source1'), 'value1');

  object.set('value', 'newvalue');

  strictEqual(object.get('value'), 'newvalue');
  strictEqual(object.get('source1'), 'newvalue');
});

test('updating source value fires indirect observer', function() {
	expect(1);
  stop();

  object.get('value');
  object.addObserver('value', object, function() {
    start();
    strictEqual(this.get('value'), 'newvalue');
  });

  object.set('source1', 'newvalue');
});

test('updating path property fires indirect observer', function() {
	expect(1);
  stop();

  object.get('value');
  object.addObserver('value', object, function() {
    start();
    strictEqual(this.get('value'), 'value2');
  });

  object.set('path', 'source2');
});

test('observers are torn down correctly', function() {
  expect(0);

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
