(function () {
    
    var create = document.querySelector('.controls__create');
    var save = document.querySelector('.partials__submit');
    var reset = document.querySelector('.partials__reset');
    var form = document.querySelector('.controls__form');
    var partials = document.querySelector('.partials');
    var partialsForm = document.querySelector('.partials__content');
    var addWork = document.querySelector('.partials__add');
    var welcomeBlock = document.querySelector('.controls__name-block');
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
            tempTimer.program.workouts.push({"work": parseInt(works[it].value)});
            tempTimer.program.workouts.push({"rest": parseInt(rests[it].value)});
        }

        timers.push(tempTimer);
        localStorage.setItem('timers', JSON.stringify(timers));

        console.log(timers);

    }, false);

    addWork.addEventListener('click', function (e) {
        e.preventDefault();
        Timer.prototype.add();
    }, false);

}());