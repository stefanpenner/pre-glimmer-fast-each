import Ember from 'ember';

function name() {
  return Math.random().toString(36);
}

function syncArray(array, inputArray) {
  array.length = inputArray.length;

  Ember.beginPropertyChanges();

  for (let i = 0; i < inputArray.length; i++) {
    let entry = array[i];
    if (entry === undefined) {
      array[i] = Ember.ObjectProxy.create({
        content: inputArray[i]
      });
    } else if (entry instanceof Ember.ObjectProxy) {
      array[i].set('content', inputArray[i]);
    } else {
      throw new TypeError('array contained non ObjectProxy content');
    }
  }

  Ember.endPropertyChanges();
  return array;
}

function generateRandomArray(count) {
  var output = new Array(count);

  for (var i = 0; i < count; i++) {
    output[i] = { name: name() };
  }

  return output;
}

var count = 0;
function stable(key) {
  let stableArrayName = `_stable-array-${count++}`;

  return Ember.computed(key + '.[]', function() {
    if (this[stableArrayName] === undefined) {
      this[stableArrayName] = [];
    }

    var stableArray = this[stableArrayName];
    syncArray(stableArray, this.get('data'));
    return stableArray;
  });
}

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.set('insertionCount', 0);
    this.set('columns', [1,2,3,4,5]);
    this.set('data', generateRandomArray(1000));
  },

  stable: stable('data'),

  actions: {
    didInsert() {
      this.incrementProperty('insertionCount');
    },

    newData() {
      this.set('data', generateRandomArray(1000));
      //this.set('data', generateRandomArray(1000));

      //this.set('data', [
      //  { name: name() },
      //  { name: name() },
      //  { name: name() }
      //]);
    }
  }
});
