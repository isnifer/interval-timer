(function () {
    
    var create = document.querySelector('.controls__create');
    var save = document.querySelector('.partials__save');
    var reset = document.querySelector('.partials__reset');
    var view = document.querySelector('.partials__view');
    var form = document.querySelector('.controls__form');
    var partials = document.querySelector('.partials');
    var partialsForm = document.querySelector('.partials__content');
    var addWork = document.querySelector('.partials__add');
    var welcomeBlock = document.querySelector('.controls__name-block');
    var timerList = document.querySelector('.timers__list');
    var timerItem = document.getElementsByClassName('timers__item');
    var currentTimer = {
        el: document.querySelector('.current'),
        header: document.querySelector('.current__header'),
        actionTitle: document.querySelector('.current__action-title-current'),
        time: document.querySelector('.current__time'),
        elapsed: document.querySelector('.current__elapsed-time'),
        remaining: document.querySelector('.current__remaining-time'),
        circle: document.querySelector('.current__circles-this'),
        circles: document.querySelector('.current__circles-all'),
        start: document.querySelector('.current__start')
    };
    var i = 1, j = 1;

    var timers = [];

    function Timer (options) {
        
        this.name = options.name || 'Press';
        this.date = (function () {
            
            if (options.date) {
                return options.date;
            }

            var d = new Date();
            var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

            return d.getDate() + '.' + months[d.getMonth()] + '.' + d.getFullYear();
        
        }());

    }

    Timer.prototype.add = function () {
        
        var createControls = function (options) {

            var temp = document.createElement(options.tag);

            for (var dd = 0; dd < options.classNames.length; dd++) {
                temp.classList.add(options.classNames[dd]);
            }

            if (options.name) {
                temp.setAttribute('name', options.name + '_' + i);
            }

            if (options.content) {
                temp.textContent = options.content;
            }

            if (options.name === 'work') {
                i++;
            } else {
                j++;
            }

            return temp;

        };

        var control = function (type) {
            
            var label =  createControls({
                tag: 'label',
                classNames: ['partials__label']
            });

            var name = createControls({
                tag: 'span',
                classNames: ['partials__name'],
                content: type + ' (s)'
            });

            var input = createControls({
                tag: 'input',
                classNames: ['partials__input', 'partials__' + type],
                name: type
            });

            label.appendChild(name);
            label.appendChild(input);

            return label;
        };

        var element1 = control('work');
        var element2 = control('rest');

        partialsForm.appendChild(element1);
        partialsForm.appendChild(element2);

    };

    Timer.prototype.pushToDOM = function (name, id) {
        var elem = document.createElement('li');
        elem.classList.add('timers__item');
        elem.setAttribute('id', 'timer_' + id);
        elem.textContent = name;

        timerList.appendChild(elem);

        view.setAttribute('id', 'view-timer_' + id);
        currentTimer.start.setAttribute('id', 'start-timer_' + id);
    };

    // Transform data from timer and load to DOM
    Timer.prototype.load = function () {
        var self = this;

        currentTimer.header.textContent = this.name;
        currentTimer.circles.textContent = this.program.circles;
        currentTimer.circle.textContent = 1;
        currentTimer.actionTitle.textContent = this.program.workouts[0].title;
        currentTimer.time.textContent = (function () {
            var time = self.program.workouts[0].value;
            if (time < 60 && time > 10) {
                return '00:' + time;
            } else {
                return '00:0' + time;
            }
        }());
        
    };

    Timer.prototype.start = function () {
        var time = this.program.workouts[0].value;
        var timer = setInterval(function () {
            time -= 1; 
            currentTimer.time.textContent = (function () {
                if (time < 60 && time >= 10) {
                    return '00:' + time;
                } else {
                    return '00:0' + time;
                }
            }());
            if (time === 0) { 
                clearInterval(timer); 
            }
        }, 1000);
    };

    Timer.prototype.pause = function (id) {

    };

    Timer.prototype.reset = function (id) {

    };

    create.addEventListener('click', function (e) {
        e.preventDefault();

        welcomeBlock.classList.add('controls_hidden');
        partials.classList.add('partials_visible');

        var timerName = document.querySelector('.partials__timer-user-name');
        timerName.textContent = document.querySelector('input[name="timer-name"]').value;

    }, false);

    save.addEventListener('click', function (e) {

        var tempTimer = new Timer ({
            name: document.querySelector('input[name="timer-name"]').value
        });

        tempTimer.program = {
            "circles": parseInt(document.querySelector('.partials__circle').value),
            "workouts": []
        };

        var works = document.getElementsByClassName('partials__work');
        var rests = document.getElementsByClassName('partials__rest');

        for (var it = 0; it < works.length; it++) {
            tempTimer.program.workouts.push({"title": "work", "value": parseInt(works[it].value)});
            tempTimer.program.workouts.push({"title": "rest", "value": parseInt(rests[it].value)});
        }

        timers.push(tempTimer);

        tempTimer.pushToDOM(tempTimer.name, timers.length - 1);

        console.log(timers);
        console.log(timerItem);

    }, false);

    addWork.addEventListener('click', function (e) {
        e.preventDefault();
        Timer.prototype.add();
    }, false);

    currentTimer.start.addEventListener('click', function () {
        var id = this.getAttribute('id');
        id = id.substring(id.indexOf('_') + 1);
        timers[id].start();
    }, false);

    view.addEventListener('click', function () {
        var id = this.getAttribute('id');
        id = id.substring(id.indexOf('_') + 1);
        timers[id].load();
    }, false);

}());