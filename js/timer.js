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
        actionTitle: document.querySelector('.current__action-title'),
        time: document.querySelector('.current__time'),
        elapsed: document.querySelector('.current__elapsed-time'),
        remaining: document.querySelector('.current__remaining-time'),
        circle: document.querySelector('.current__circles-this'),
        circles: document.querySelector('.current__circles-all'),
        start: document.querySelector('.current__start'),
        pause: document.querySelector('.current__pause'),
        reset: document.querySelector('.current__reset')
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
        currentTimer.reset.setAttribute('id', 'reset-timer_' + id);
        currentTimer.start.setAttribute('id', 'start-timer_' + id);
    };

    // Transform data from timer and load to DOM
    Timer.prototype.load = function () {
        var self = this;

        // Insert name of Timer
        currentTimer.header.textContent = this.name;
        
        // Insert
        currentTimer.circles.textContent = this.program.circles;
        currentTimer.circle.textContent = 1;
        currentTimer.actionTitle.textContent = this.program.workouts[0].title;
        currentTimer.time.textContent = (function () {
            var time = self.program.workouts[0].value;
            var seconds = (function () {
                var result = time - (parseInt(time / 60) * 60);
                if (result < 10) {
                    return '0' + result;
                }
                return result;
            }());
            var minutes = parseInt(time / 60);
            if (time < 3600 && time >= 600) {
                return minutes + ':' + seconds;
            } else if (time < 600 && time >= 60) {
                return '0' + minutes + ':' + seconds;
            } else if (time < 60 && time > 10) {
                return '00:' + time;
            } else {
                return '00:0' + time;
            }
        }());

        currentTimer.remaining.textContent = (function () {
            var arr = self.program.workouts,
                arrLen = arr.length,
                allTime = 0;

            for (var it = 0; it < arrLen; it++) {
                allTime = allTime + arr[it].value;
            }

            var minutes = (function () {
                var tmpMinutes = parseInt(allTime * self.program.circles / 60);
                if (tmpMinutes < 10) {
                    return '0' + tmpMinutes;
                }
                return tmpMinutes;
            }());

            var seconds = (function () {
                var tmpSeconds = allTime * self.program.circles - parseInt(minutes) * 60;
                if (tmpSeconds < 10) {
                    return '0' + tmpSeconds;
                }
                return tmpSeconds;
            }());
    
            return minutes + ':' + seconds;

        }());

    };

    Timer.prototype.start = function (id, circle) {
        var self = this;
        var circleid = (circle) ? circle : 1;
        var index = (id) ? id : 0;
        var workouts = self.program.workouts;
        var time = workouts[index].value;
        currentTimer.actionTitle.textContent = workouts[index].title;
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

                // if possible, change action
                if (workouts[index + 1]) {
                    console.log('Action change');
                    self.start(index + 1, circleid);
                } 
                // Or changes circle, if possible
                else if (circleid < self.program.circles) {
                    console.log('Circle change');
                    self.changeCircle(circleid + 1);
                } 
                // Or stop timer
                else {
                    console.log('Timer stop');
                    self.stop(timer);
                } 

            }
        }, 1000);
    };

    Timer.prototype.changeCircle = function (circle) {
        currentTimer.circle.textContent = circle;
        this.start(0, circle);
    };

    Timer.prototype.pause = function (id) {

    };

    Timer.prototype.reset = function (id) {

    };

    Timer.prototype.stop = function (timer) {
        timer = null;
    };

    Timer.prototype.changeElapsed = function () {

    };

    Timer.prototype.changeRemaining = function () {
        
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

    function resetOrLoadData () {
        var id = this.getAttribute('id');
        id = id.substring(id.indexOf('_') + 1);
        timers[id].load();
    }

    view.addEventListener('click', resetOrLoadData, false);
    currentTimer.reset.addEventListener('click', resetOrLoadData, false);

}());