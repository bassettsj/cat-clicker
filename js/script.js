(function (){

    function Cat (element) {
        var clicks = 0;
        var img = document.createElement('img');
        var name = element.dataset.catClick;
        var nameElement = document.createElement('h4');
        nameElement.innerText  = name;
        var w = random(200, 300);
        var h = random(200, 300);
        img.setAttribute('src', 'https://placekitten.com/g/' + w + '/' + h);
        img.setAttribute('alt', 'Picture of a cat named ' + name);

        img.addEventListener('click', function () {
            clicks++;
            updateCounter();
        }, false);


        var caption =  document.createElement('div');
        caption.classList.add('caption');

        var counter = document.createElement('p');
        counter.classList.add('counter');
        updateCounter();

        element.appendChild(img);
        element.appendChild(caption);
        caption.appendChild(nameElement);
        caption.appendChild(counter);

        function updateCounter () {
            counter.innerText = 'Cat clicked ' + clicks + ' times.';
        }
    }

    function onPageLoad () {
        var elements = document.querySelectorAll('[data-cat-click]');
        for (var i = 0; i < elements.length; i++) {
            var cat = new Cat(elements[i]);
        }
        window.removeEventListener('load', onPageLoad, false);
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    window.addEventListener('load', onPageLoad, false);

})();
