/* jshint esnext: true */
(function (window) {
'use strict';

class CatModel {
  constructor (name) {
    this.name = name;
    this.image = getImage();
    this.clicks = 0;
    function getImage () {
      return `https://placekitten.com/g/${random(400, 500)}/${random(400, 500)}`;
    }
    function random (min, max) {
      return (Math.round((Math.floor(Math.random() * (max - min)) + min)/10)) * 10;
    }
  }
  incrementClicks () {
    this.clicks++;
  }
}


class CatCollection {
  constructor (models) {
    this.models = models.map((name) => {
      return new CatModel(name);
    });
    // Index of the selected cat.
    this.selected = 0;
  }
}

class View {
  constructor (model, element) {
    this.model = model;
    this.element = element;
    this.init();
  }
  init () {
    this.render();
    this.bind();
  }
  bind () {
    this.binding =  Object.observe(this.model, (changes) => {
      changes.forEach( function (change) {
        console.log(change.type, change.name, change.oldValue);
        this.render();
      }, this);
    });
  }
  render () {}
}

class CollectionView {
  constructor (collection, element) {
    this.collection = collection;
    this.models = collection.models;
    this.element = element;
    this.init();
  }
  init () {
    this.render();
    this.bind();
  }
  bind () {
    this.binding =  Object.observe(this.collection, (changes) => {
      changes.forEach( function (change) {
        console.log(change.type, change.name, change.oldValue);
        this.render();
      }, this);
    });
  }
  render () { }
}
class CatAdminView extends View {
  constructor (model, element) {
    super(model, element);
    this._isVisable = false;
  }

  init () {
    this._nameElement = document.getElementById('name');
    this._clicksElement = document.getElementById('clicks');
    this._pictureElement = document.getElementById('picture');
    this._resetElement = document.getElementById('reset');
    this._editElement = document.getElementById('edit');
    this._submitElement = document.getElementById('submit');
    this._formElement = this.element.querySelector('form');
    this._editElement.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleVisability();
    });
    this._submitElement.addEventListener('click', (e) => {
      e.preventDefault();
      this.submit();
    });
    this._resetElement.addEventListener('click', (e) => {
      e.preventDefault();
      this.reset();
    });

    super();
  }
  toggleVisability () {
    this._isVisable = !this._isVisable;
    this.render();
  }

  reset () {
    this._renderValues();
  }

  submit () {
    if (this._formElement.reportValidity()) {
      this.setValues();
      this.toggleVisability();
    }
  }


  setValues () {
    this.model.name = this._nameElement.value;
    this.model.clicks = this._clicksElement.value;
    this.model.image = this._pictureElement.value;
  }

  _renderValues () {
    this._nameElement.value = this.model.name;
    this._clicksElement.value = this.model.clicks;
    this._pictureElement.value = this.model.image;
  }

  _renderFormVisability () {
    if (!this._isVisable) {
      this._formElement.classList.add('hidden');
      this._formElement.setAttribute('aria-hidden', true);
      this._editElement.classList.remove('active');
    } else {
      this._formElement.classList.remove('hidden');
      this._formElement.setAttribute('aria-hidden', false);
      this._editElement.classList.add('active');
    }
  }
  render () {
    this._renderFormVisability();
    if (!this._isVisable) { return; }
    this._renderValues();
  }
}
class CatView extends View {
  constructor (model, element) {
    super(model, element);
  }

  init () {
    // Contiainer class
    this.element.classList.add('thumbnail');
    // Image element
    this._imageElement = document.createElement('img');
    this.element.appendChild(this._imageElement);
    this._imageElement.addEventListener('click', () => {
      this.model.incrementClicks();
    });
    // Caption element
    this._captionElement = document.createElement('div');
    this._captionElement.classList.add('caption');
    this.element.appendChild(this._captionElement);
    // Name element
    this._nameElement = document.createElement('h3');
    this._captionElement.appendChild(this._nameElement);
    // Counter
    this._counterElement = document.createElement('p');
    this._captionElement.appendChild(this._counterElement);
    super();
  }

  render () {

    this._imageElement.setAttribute('src', this.model.image);
    this._imageElement.setAttribute('alt', `Picture of a cat named ${this.model.name}`);

    this._nameElement.innerText = this.model.name;
    this._counterElement.innerText = `Clicked ${this.model.clicks} times.`;
  }
}

class CatCollectionView extends CollectionView {
  constructor(collection, element, modelElement, modelAdminElement) {
    this.listItems = [];
    this.modelView = new CatView(collection.models[collection.selected], modelElement);
    this.modelAdminView = new CatAdminView(collection.models[collection.selected], modelAdminElement);
    super(collection, element);
  }
  init () {
    var itemTemplate = document.createElement('a');
    itemTemplate.classList.add('list-group-item');
    itemTemplate.setAttribute('href', '#');
    this.models.forEach( (model, index) => {
      let item = itemTemplate.cloneNode();
      item.innerText = model.name;
      item.dataset.index = index;
      item.addEventListener('click', (e) => {
        e.preventDefault();
        if (item.dataset.index != this.collection.selected) {
          this.collection.selected = item.dataset.index;
        }
      });
      this.element.appendChild(item);
      this.listItems.push(item);
    });
    super();
  }
  render () {
    let oldActive = this.element.querySelector('.active');
    if  (oldActive){
      oldActive.classList.remove('active');
    }
    this.listItems[this.collection.selected].classList.add('active');
    this.setModelView();
  }
  setModelView () {
    this.modelView.model = this.collection.models[this.collection.selected];
    this.modelAdminView.model = this.collection.models[this.collection.selected];

    this.modelView.render();
    this.modelAdminView.render();

    this.modelView.bind();
    this.modelAdminView.bind();
  }
}






class Application {
  constructor (cats, collectionElement, modelElement, adminElement) {
    this.collection = new CatCollection(cats);
    this.collectionElement = collectionElement;
    this.modelElement = modelElement;
    this.adminElement = adminElement;
    this.collectionView = new CatCollectionView(this.collection, this.collectionElement, this.modelElement, this.adminElement);
    this.modelView = this.collectionView.modelView;
  }
}

var app;
var cats = [
  'Fluffy', 'Suzy', 'Tabitha', 'Karen', 'Aaron', 'Beth', 'Fluffy', 'Chewy', 'Momo',
  'Snowball', 'Max', 'Sir Bennington the 4th'
];
function createApplication () {
  var list = document.getElementById('catlist');
  var view = document.getElementById('catview');
  var admin = document.getElementById('catadmin');
  app = window.app = new Application(cats, list,  view, admin);
  window.removeEventListener('load', createApplication);
}
window.addEventListener('load', createApplication);
})(this);
