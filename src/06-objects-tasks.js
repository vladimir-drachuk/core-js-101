/* eslint-disable no-proto */
/* eslint-disable func-names */
/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function () {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  obj.__proto__ = proto;
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

function checkCorrectOrder(arr) {
  arr.forEach((item) => {
    if ((item) && !Array.isArray(item)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    } else if (Array.isArray(item) && !!(item[0])) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  });
}

class Selector {
  constructor() {
    this.selector = {
      class: [],
      attr: [],
      pseudoClass: [],
    };
  }

  element(value) {
    checkCorrectOrder([
      this.selector.id,
      this.selector.class,
      this.selector.attr,
      this.selector.pseudoClass,
      this.selector.pseudoElement]);
    if (this.selector.element) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.selector.element = value;
    return this;
  }

  id(value) {
    checkCorrectOrder([
      this.selector.class,
      this.selector.attr,
      this.selector.pseudoClass,
      this.selector.pseudoElement]);
    if (this.selector.id) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.selector.id = `#${value}`;
    return this;
  }

  class(value) {
    checkCorrectOrder([
      this.selector.attr,
      this.selector.pseudoClass,
      this.selector.pseudoElement]);
    this.selector.class.push(`.${value}`);
    return this;
  }

  attr(value) {
    checkCorrectOrder([
      this.selector.pseudoClass,
      this.selector.pseudoElement]);
    this.selector.attr.push(`[${value}]`);
    return this;
  }

  pseudoClass(value) {
    checkCorrectOrder([
      this.selector.pseudoElement]);
    this.selector.pseudoClass.push(`:${value}`);
    return this;
  }

  pseudoElement(value) {
    if (this.selector.pseudoElement) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.selector.pseudoElement = `::${value}`;
    return this;
  }

  stringify() {
    const element = this.selector.element || '';
    const id = this.selector.id || '';
    const class1 = (this.selector.class[0]) ? this.selector.class.reduce((accum, item) => accum + item, '') : '';
    const attr = (this.selector.attr[0]) ? this.selector.attr.reduce((accum, item) => accum + item, '') : '';
    const pClass = (this.selector.pseudoClass[0]) ? this.selector.pseudoClass.reduce((accum, item) => accum + item, '') : '';
    const pElem = this.selector.pseudoElement || '';
    return element + id + class1 + attr + pClass + pElem;
  }
}

function Combainer(value) {
  this.combineResult = value;
  this.stringify = function () {
    return this.combineResult;
  };
}

const cssSelectorBuilder = {

  element(value) {
    return new Selector().element(value);
  },

  id(value) {
    return new Selector().id(value);
  },

  class(value) {
    return new Selector().class(value);
  },

  attr(value) {
    return new Selector().attr(value);
  },

  pseudoClass(value) {
    return new Selector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new Selector().pseudoElement(value);
  },

  stringify() {
    return new Selector().stringify();
  },

  combine(selector1, combinator, selector2) {
    const result = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return new Combainer(result);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
