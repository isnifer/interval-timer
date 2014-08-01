/** @jsx React.DOM */
;(function (window, document, React, undefined) {

    var mountPoint = document.querySelector('.page');

    var Page = React.createClass({
      render: function () {
        return (
          <div className="page__wrapper">
            <h2 className="page__title">Интервальный таймер</h2>
            <Controls />
            <Timer />
            <TimersList />
          </div>
        );
      }
    });

    var Controls = React.createClass({
      render: function () {
        return (
          <div className="controls">
            <p className="controls__view-form">Создать новый</p>
            <ControlsForm />
          </div>
        );
      }
    });

    // Форма создания нового таймера
    var ControlsForm = React.createClass({
      render: function () {
        return (
          <div className="controls__form controls__form_state_hidden">
            <div className="controls__name-block">
              <label>
                <input type="text" name="timer-name" className="controls__timer-name" />
              </label>
              <button type="button" className="controls__create">Я выбрал имя</button>
            </div>
            <Partials />
          </div>
        );
      }
    });

    // Содержимое таймера
    var Partials = React.createClass({
      render: function () {
        return (
          <div className="partials">
            <p className="partials__timer-name">Таймер: <span className="partials__timer-user-name"></span></p>
            <div className="partials__content">
              <label className="partials__label">
                <span className="partials__name">Количество кругов: </span>
                <input type="text" name="circle-num" className="partials__input partials__circle" />
              </label>
              <div className="partials__divider">Содержимое круга:</div>
              <label className="partials__label">
                <span className="partials__name">work (s)</span>
                <input type="text" name="work_0" className="partials__input partials__work" />
              </label>
              <label className="partials__label">
                <span className="partials__name">rest (s)</span>
                <input type="text" name="rest_0" className="partials__input partials__rest" />
              </label>
            </div>
            <button type="button" className="partials__btn partials__add">Добавить</button>
            <button type="button" className="partials__btn partials__save">Сохранить таймер</button>
            <button type="button" className="partials__btn partials__create-new">Создать новый</button>
            <button type="button" className="partials__btn partials__load" disabled>Посмотреть</button>
            <button type="button" className="partials__btn partials__local" disabled>Сохранить локально</button>
          </div>
        );
      }
    });

    // Текущий таймер
    var Timer = React.createClass({
      render: function () {
        return (
          <div className="current">
            <header className="current__header">Название таймера</header>
            <div className="current__action-title">Действие</div>
            <div className="current__action-time">00:00</div>
            <div className="current__circles">
              <span className="current__circles-this">Текущий круг</span>&nbsp;/&nbsp;
              <span className="current__circles-all">Всего кругов</span>
            </div>
            <div className="current__footer">
              <div className="current__elapsed">
                <p className="current__footer-title">Прошло</p>
                <div className="current__elapsed-time">00:00</div>
              </div>
              <div className="current__remaining">
                <p className="current__footer-title">Осталось</p>
                <div className="current__remaining-time">00:00</div>
              </div>
            </div>
            <div className="current__controls">
              <button type="button" className="current__start" disabled>Пуск</button>
              <button type="button" className="current__pause" disabled>Пауза</button>
              <button type="button" className="current__stop" disabled>Стоп</button>
            </div>
            <audio src="audio/timer.mp3" className="current__audio"></audio>  
          </div>
        );
      }
    });

    // Список таймеров
    var TimersList = React.createClass({
      render: function () {
        return (
          <div className="timers">
            <ul className="timers__list"></ul>
          </div>
        );
      }
    });

    React.renderComponent(<Page />, mountPoint);

}(window, window.document, window.React));