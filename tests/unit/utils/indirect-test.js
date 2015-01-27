import Ember from 'ember';
import { test } from 'ember-qunit';
import computedIndirect from 'ember-computed-indirect/utils/indirect';

var object = null;

module('Indirect Computed Test', {
  setup: function() {
    object = Ember.Object.extend({
      source1: 'value1',
      source2: 'value2',
      path: 'source1',
      value: computedIndirect('path')
    }).create();
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
