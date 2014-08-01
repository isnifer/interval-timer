/** @jsx React.DOM */
;(function (window, document, React, undefined) {

    var mountPoint = document.querySelector('.page');

    var Page = React.createClass({displayName: 'Page',
      render: function () {
        return (
          React.DOM.div({className: "page__wrapper"}, 
            React.DOM.h2({className: "page__title"}, "Интервальный таймер"), 
            Controls(null), 
            Timer(null), 
            TimersList(null)
          )
        );
      }
    });

    var Controls = React.createClass({displayName: 'Controls',
      render: function () {
        return (
          React.DOM.div({className: "controls"}, 
            React.DOM.p({className: "controls__view-form"}, "Создать новый"), 
            ControlsForm(null)
          )
        );
      }
    });

    // Форма создания нового таймера
    var ControlsForm = React.createClass({displayName: 'ControlsForm',
      render: function () {
        return (
          React.DOM.div({className: "controls__form controls__form_state_hidden"}, 
            React.DOM.div({className: "controls__name-block"}, 
              React.DOM.label(null, 
                React.DOM.input({type: "text", name: "timer-name", className: "controls__timer-name"})
              ), 
              React.DOM.button({type: "button", className: "controls__create"}, "Я выбрал имя")
            ), 
            Partials(null)
          )
        );
      }
    });

    // Содержимое таймера
    var Partials = React.createClass({displayName: 'Partials',
      render: function () {
        return (
          React.DOM.div({className: "partials"}, 
            React.DOM.p({className: "partials__timer-name"}, "Таймер: ", React.DOM.span({className: "partials__timer-user-name"})), 
            React.DOM.div({className: "partials__content"}, 
              React.DOM.label({className: "partials__label"}, 
                React.DOM.span({className: "partials__name"}, "Количество кругов: "), 
                React.DOM.input({type: "text", name: "circle-num", className: "partials__input partials__circle"})
              ), 
              React.DOM.div({className: "partials__divider"}, "Содержимое круга:"), 
              React.DOM.label({className: "partials__label"}, 
                React.DOM.span({className: "partials__name"}, "work (s)"), 
                React.DOM.input({type: "text", name: "work_0", className: "partials__input partials__work"})
              ), 
              React.DOM.label({className: "partials__label"}, 
                React.DOM.span({className: "partials__name"}, "rest (s)"), 
                React.DOM.input({type: "text", name: "rest_0", className: "partials__input partials__rest"})
              )
            ), 
            React.DOM.button({type: "button", className: "partials__btn partials__add"}, "Добавить"), 
            React.DOM.button({type: "button", className: "partials__btn partials__save"}, "Сохранить таймер"), 
            React.DOM.button({type: "button", className: "partials__btn partials__create-new"}, "Создать новый"), 
            React.DOM.button({type: "button", className: "partials__btn partials__load", disabled: true}, "Посмотреть"), 
            React.DOM.button({type: "button", className: "partials__btn partials__local", disabled: true}, "Сохранить локально")
          )
        );
      }
    });

    // Текущий таймер
    var Timer = React.createClass({displayName: 'Timer',
      render: function () {
        return (
          React.DOM.div({className: "current"}, 
            React.DOM.header({className: "current__header"}, "Название таймера"), 
            React.DOM.div({className: "current__action-title"}, "Действие"), 
            React.DOM.div({className: "current__action-time"}, "00:00"), 
            React.DOM.div({className: "current__circles"}, 
              React.DOM.span({className: "current__circles-this"}, "Текущий круг"), " / ", 
              React.DOM.span({className: "current__circles-all"}, "Всего кругов")
            ), 
            React.DOM.div({className: "current__footer"}, 
              React.DOM.div({className: "current__elapsed"}, 
                React.DOM.p({className: "current__footer-title"}, "Прошло"), 
                React.DOM.div({className: "current__elapsed-time"}, "00:00")
              ), 
              React.DOM.div({className: "current__remaining"}, 
                React.DOM.p({className: "current__footer-title"}, "Осталось"), 
                React.DOM.div({className: "current__remaining-time"}, "00:00")
              )
            ), 
            React.DOM.div({className: "current__controls"}, 
              React.DOM.button({type: "button", className: "current__start", disabled: true}, "Пуск"), 
              React.DOM.button({type: "button", className: "current__pause", disabled: true}, "Пауза"), 
              React.DOM.button({type: "button", className: "current__stop", disabled: true}, "Стоп")
            ), 
            React.DOM.audio({src: "audio/timer.mp3", className: "current__audio"})
          )
        );
      }
    });

    // Список таймеров
    var TimersList = React.createClass({displayName: 'TimersList',
      render: function () {
        return (
          React.DOM.div({className: "timers"}, 
            React.DOM.ul({className: "timers__list"})
          )
        );
      }
    });

    React.renderComponent(Page(null), mountPoint);

}(window, window.document, window.React));