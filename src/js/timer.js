(function (window, document, localStorage, undefined) {

    var formActions = {
            chooseName: document.querySelector('.controls__view-form'),
            fillFields: document.querySelector('.controls__create'),
            addWork: document.querySelector('.partials__add'),
            save: document.querySelector('.partials__save'),
            createNew: document.querySelector('.partials__create-new'),
            load: document.querySelector('.partials__load'),
            saveLocal: document.querySelector('.partials__local')
        },
        formUI = {
            el: document.querySelector('.controls__form'),
            partials: document.querySelector('.partials'),
            partialsForm: document.querySelector('.partials__content'),
            welcomeBlock: document.querySelector('.controls__name-block')
        },
        currentTimer = {
            el: document.querySelector('.current'),
            header: document.querySelector('.current__header'),
            actionTitle: document.querySelector('.current__action-title'),
            actionTime: document.querySelector('.current__action-time'),
            elapsed: document.querySelector('.current__elapsed-time'),
            remaining: document.querySelector('.current__remaining-time'),
            circle: document.querySelector('.current__circles-this'),
            circles: document.querySelector('.current__circles-all'),
            start: document.querySelector('.current__start'),
            pause: document.querySelector('.current__pause'),
            stop: document.querySelector('.current__stop'),
            audio: document.querySelector('.current__audio')
        },
        timerList = document.querySelector('.timers__list'),
        i = 1,
        j = 1,
        timers = [],
        flags = {
            currentTimer: 0,
            onPause: false
        },
        setFlags = function (type) {
            currentTimer.start.disabled = type; 
            currentTimer.pause.disabled = currentTimer.stop.disabled = !type;
        };

    function Timer (options) {
        this.name = (options && options.name) ? options.name : 'Press';
        this.program = (options && options.program) ? options.program : {};
        this.date = (function () {

            var date = new Date();
            var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

            if (options && options.date) {
                return options.date;
            }

            return date.getDate() + '.' + months[date.getMonth()] + '.' + date.getFullYear();
        
        }());
    }

    Timer.prototype.add = function () {
        var createControls = function (options) {
            var tempElement = document.createElement(options.tag),
                k = 0;

            for (k; k < options.classNames.length; k++) {
                tempElement.classList.add(options.classNames[k]);
            }

            if (options.name) {
                tempElement.setAttribute('name', options.name + '_' + i);
            }

            tempElement.textContent = (options.content) ? options.content : '';

            if (options.name === 'work') {
                i += 1;
            } else {
                j += 1;
            }

            return tempElement;
        };

        var control = function (type) {
            var label =  createControls({
                    tag: 'label',
                    classNames: ['partials__label']
                }),
                name = createControls({
                    tag: 'span',
                    classNames: ['partials__name'],
                    content: type + ' (s)'
                }),
                input = createControls({
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

        formUI.partialsForm.appendChild(element1);
        formUI.partialsForm.appendChild(element2);
    };

    Timer.prototype.pushToDOM = function (name, id) {
        pushLocalTimerToList(id, name);

        formActions.load.setAttribute('data-timer', id);
        formActions.saveLocal.setAttribute('data-timer', id);
    };

    /*
    * Function transform time to format 00:00
    *
    * @param {Number} minutes Integer value of minutes (s)
    * @param {Number} seconds Rest of seconds (allTime - minutes) (s)
    *
    * @returns {String} value of time in 00:00 format
    * */
    Timer.prototype.getHumanReadableTime = function (minutes, seconds) {
        var tempMinutes = (minutes < 10) ? '0' + minutes : minutes,
            tempSeconds = (seconds < 10) ? '0' + seconds : seconds;

        return tempMinutes + ':' + tempSeconds;
    };

    // Transform data from timer and load to DOM
    Timer.prototype.load = function () {
        var allTime = this.program.alltime,
            minutes = parseInt(allTime / 60),
            seconds = allTime - minutes * 60,
            firstActionTime = this.program.workouts[0].value,
            firstActionMinutes = parseInt(firstActionTime / 60),
            firstActionSeconds = firstActionTime - firstActionMinutes * 60;

        // Insert name and remaining time of Timer
        currentTimer.header.textContent = this.name;
        currentTimer.remaining.textContent = this.getHumanReadableTime(minutes, seconds);

        // Insert title and time of first action in Workout
        currentTimer.actionTitle.textContent = this.program.workouts[0].title;
        currentTimer.actionTime.textContent = this.getHumanReadableTime(firstActionMinutes, firstActionSeconds);
        
        // Insert current circle value of workout and total value of it
        currentTimer.circle.textContent = 1;
        currentTimer.circles.textContent = this.program.circles;
    };

    Timer.prototype.start = function () {
        var self = this,
            startTime = 0,
            circleid = 1,
            index = 0,
            allTime = self.program.alltime,
            workouts = self.program.workouts,
            actionTime = workouts[index].value;

            this.timer = new OverallTimer(function () {

                var elapsedMinutes = parseInt(startTime / 60),
                    elapsedSeconds = startTime - parseInt(elapsedMinutes) * 60,
                    remainingMinutes = parseInt(allTime / 60),
                    remainingSeconds = allTime - parseInt(remainingMinutes) * 60,
                    actionMinutes = parseInt(actionTime / 60),
                    actionSeconds = actionTime - parseInt(actionMinutes) * 60;

                // Elapsed
                currentTimer.elapsed.textContent = self.getHumanReadableTime(elapsedMinutes, elapsedSeconds);

                // Remaining
                currentTimer.remaining.textContent = self.getHumanReadableTime(remainingMinutes, remainingSeconds);

                // Current action time
                currentTimer.actionTime.textContent = self.getHumanReadableTime(actionMinutes, actionSeconds);

                if (allTime !== 0) {
                    
                    // Play audio in the end of action
                    if (actionTime === 4) {
                        currentTimer.audio.currentTime = 0;
                        currentTimer.audio.play();
                    } else if (actionTime <= 0) {

                        // if possible, change action
                        if (workouts[index + 1]) {
                            index += 1;
                        }

                        // Or changes circle, if possible
                        else if (circleid < self.program.circles) {
                            circleid += 1;
                            index = 0;
                            currentTimer.circle.textContent = circleid;
                        }

                        actionTime = workouts[index].value;
                        currentTimer.actionTitle.textContent = workouts[index].title;
                    }

                    startTime += 1;
                    allTime -= 1;
                    actionTime -= 1;

                } else {
                    self.timer.stop();
                }

            }, 1000);

    };

    /*
    * Class for manipulating timer
    *
    * @param {function} callback
    * */
    function OverallTimer (callback, delay) {
        var timerId,
            start,
            resume,
            remaining = delay;

        this.pause = function () {
            window.clearInterval(timerId);
            remaining -= new Date() - start;
        };

        this.stop = function () {
            window.clearInterval(timerId);
            timerId = null;
            currentTimer.elapsed.textContent = '00:00';
        };

        resume = function () {
            start = new Date();
            timerId = window.setTimeout(function () {
                remaining = delay;
                resume();
                callback();
            }, remaining);
        };

        this.resume = resume;

        this.resume();
    }

    // View new Timer form
    function fillNewTimerFields () {
        formUI.welcomeBlock.classList.add('controls_hidden');
        formUI.partials.classList.add('partials_visible');

        var timerName = document.querySelector('.partials__timer-user-name');
        timerName.textContent = document.querySelector('input[name="timer-name"]').value;
    }

    // Save created timer
    function saveCreatedTimer () {
        var works = document.getElementsByClassName('partials__work'),
            rests = document.getElementsByClassName('partials__rest'),
            tempTimer = new Timer ({
                name: document.querySelector('input[name="timer-name"]').value
            });

        tempTimer.program = {
            "circles": parseInt(document.querySelector('.partials__circle').value),
            "workouts": [],
            "alltime": ""
        };

        for (var k = 0; k < works.length; k++) {
            tempTimer.program.workouts.push({"title": "work", "value": parseInt(works[k].value)});
            tempTimer.program.workouts.push({"title": "rest", "value": parseInt(rests[k].value)});
        }

        tempTimer.program.alltime = tempTimer.program.workouts.reduce(function (memo, current) {
            return memo + current.value * tempTimer.program.circles;
        }, 0);

        // Push new Timer to Timer's Array
        timers.push(tempTimer);

        tempTimer.pushToDOM(tempTimer.name, timers.length - 1);

        formActions.load.disabled = false;
        formActions.saveLocal.disabled = !localStorage;
    }

    // Start current timer
    function startCurrentTimer () {
        timers[flags.currentTimer].start();
        setFlags(true);
    }

    // Set Pause or Resume current timer
    function setPauseResumeCurrentTimer () {
        if (!flags.onPause) {
            timers[flags.currentTimer].timer.pause();
            this.textContent = 'Возобновить';
        } else {
            timers[flags.currentTimer].timer.resume();
            this.textContent = 'Пауза';
        }
        flags.onPause = !flags.onPause;
    }

    // Open new Timer form
    function chooseNewTimerName () {
        formUI.el.classList.toggle('controls__form_state_hidden');
    }

    // Stop current timer
    function stopCurrentTimer () {
        timers[flags.currentTimer].timer.stop();
        timers[flags.currentTimer].load();
        setFlags(false);
        currentTimer.pause.textContent = 'Пауза';
    }

    // Save timer to localStorage
    function saveToLocalStorage () {
        var id = this.getAttribute('data-timer'),
            timer = {
                name: timers[id].name,
                program: timers[id].program
            },
            localTimers = [],
            tmpArray;

        localTimers.push(JSON.stringify(timer));

        if (!localStorage.timers) {
            localStorage.setItem('timers', JSON.stringify(localTimers));
        } else {
            tmpArray = JSON.parse(localStorage.timers);
            tmpArray.push(JSON.stringify(timer));
            localStorage.setItem('timers', JSON.stringify(tmpArray));
        }
    }

    // Procedure stops current timer and load selected timer
    function resetOrLoadData (e) {

        // Stop current timer
        if (flags.currentTimer && timers[flags.currentTimer].timer) {
            timers[flags.currentTimer].timer.stop();
        }

        // Load new timer
        var id = e.target.getAttribute('data-timer');
        timers[id].load();

        flags.currentTimer = id;
        setFlags(false);
    }

    // Set timer current from list
    function startFromList (e) {
        if (e.target === this) {
            resetOrLoadData(e);
        }
    }

    // Procedure removes Timer from list and Local storage
    function removeTimer (e) {
        if (e.target === this) {
            var id = this.getAttribute('data-timer'),
            tmpArray = JSON.parse(localStorage.timers);

            tmpArray.splice(id, 1);
            localStorage.setItem('timers', JSON.stringify(tmpArray));

            timers.splice(id, 1);
            this.parentNode.remove();
        }
    }


    // Procedure creates DOM elements of Timer's list
    function pushLocalTimerToList (id, name) {
        var item = document.createElement('li'),
            itemRemove = document.createElement('span');

        item.classList.add('timers__item');
        itemRemove.classList.add('timers__remove');
        
        item.setAttribute('data-timer', id);
        itemRemove.setAttribute('data-timer', id);
        
        item.textContent = name;
        itemRemove.textContent = 'Remove';
        
        item.appendChild(itemRemove);

        timerList.appendChild(item);

        item.addEventListener('click', startFromList, false);
        itemRemove.addEventListener('click', removeTimer, false);
    }

    /* EVENT HANDLERS */

    // Create timer
    formActions.fillFields.addEventListener('click', fillNewTimerFields, false);

    // Save timer
    formActions.save.addEventListener('click', saveCreatedTimer, false);

    // Add circle
    formActions.addWork.addEventListener('click', Timer.prototype.add, false);

    // Start timer
    currentTimer.start.addEventListener('click', startCurrentTimer, false);

    // Pause timer
    currentTimer.pause.addEventListener('click', setPauseResumeCurrentTimer, false);

    // Stop timer
    currentTimer.stop.addEventListener('click', stopCurrentTimer, false);

    // Load timer
    formActions.load.addEventListener('click', resetOrLoadData, false);

    // Save timer to LocalStorage
    formActions.saveLocal.addEventListener('click', saveToLocalStorage, false);

    // id for new timer creation
    formActions.chooseName.addEventListener('click', chooseNewTimerName, false);

    // Initialization of Timers
    var init = (function () {
        if (localStorage && localStorage.timers) {
            var localData = localStorage.timers,
                k = 0;

            localData = JSON.parse(localData);

            for (k; k < localData.length; k++) {
                var localItem = JSON.parse(localData[k]);

                timers[timers.length] = new Timer ({
                    name: localItem.name,
                    program: localItem.program
                });

                pushLocalTimerToList(timers.length - 1, localItem.name);
            }
        }
    }());

}(window, window.document, window.localStorage));
