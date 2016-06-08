function tiered(element) {

  var self = {};

  self.body = document.body;

  self.element = element;

  self.list = self.element.querySelector(':scope > ul');

  self.matches = function(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
  };

  self.getParents = function(el, selector) {
    var parents = [];
    while ((el = el.parentNode) && el !== document) {
      if (!selector || self.matches(el, selector)) parents.unshift(el);
    }
    return parents;
  };

  self.init = function() {
    self.setup();
    self.update();
  };

  self.setup = function() {
    self.element.classList.add('tiered');
    self.setupList();
    self.setupHeader();
    self.setupLimits();
  };

  self.setupList = function() {
    var div = document.createElement('div');
    div.innerHTML = '<div class="tiered__scroll">' + self.list.outerHTML + '</div>';
    self.element.replaceChild(div.firstChild, self.list);
    self.scroll = document.querySelector('.tiered__scroll');
    self.list = self.scroll.querySelector(':scope > ul');
    self.items = self.list.querySelectorAll('li');
  };

  self.setupHeader = function() {
    var div = document.createElement('div');
    div.classList.add('tiered__header');
    self.element.appendChild(div);
    self.header = document.querySelector('.tiered__header');
    self.header.style.right = self.scroll.offsetWidth - self.list.clientWidth + 'px';
  };

  self.setupLimits = function () {
    for (var i = 0; i < self.items.length; i += 1) {
      var item = self.items[i];
      if (item.querySelectorAll('ul').length) {
        var top = item.offsetTop - self.list.offsetTop;
        var bottom = top + item.offsetHeight;
        var height = item.querySelector(':scope > :first-child').offsetHeight;
        var parents = self.getParents(item, 'li');
        if (parents.length) {
          for (var j = 0; j < parents.length; j += 1) {
            var parent = parents[j];
            top -= parent.querySelector(':scope > :first-child').offsetHeight;
            bottom -= parent.querySelector(':scope > :first-child').offsetHeight;
          }
        }
        item.classList.add('tiered__parent');
        item.setAttribute('data-top', top);
        item.setAttribute('data-bottom', bottom);
        item.setAttribute('data-height', height);
      }
    }
    self.parents = self.list.querySelectorAll('.tiered__parent');
  };

  self.update = function() {
    self.updateHeader();
  };

  self.updateHeader = function() {
    var position = self.scroll.scrollTop;
    self.header.innerHTML = '';
    for (var i = 0; i < self.parents.length; i += 1) {
      var item = self.parents[i];
      var top = item.getAttribute('data-top');
      var bottom = item.getAttribute('data-bottom');
      var height = item.getAttribute('data-height');
      var offset = bottom - height;
      if (position > top && position < bottom) {
        var div = document.createElement('div');
        var clone = item.querySelector(':scope > :first-child').cloneNode(true);
        clone.classList.add('tiered__header__item');
        if (position > offset) {
          clone.classList.add('tiered__header__item--offset');
          clone.style.marginTop = offset - position + 'px';
        }
        div.innerHTML = '<ul><li>' + clone.outerHTML + '</li></ul>';
        clone = div.firstChild;
        if (self.header.querySelectorAll('ul').length) {
          var items = self.header.querySelectorAll('li');
          items[items.length - 1].parentNode.appendChild(clone);
        } else {
          self.header.appendChild(clone);
        }
      }
    }
    requestAnimationFrame(self.updateHeader);
  };

  return self;

}
