/// <reference path="../node_modules/tsmonad/dist/tsmonad.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/mithril/mithril.d.ts" />
var Bambino;
(function (Bambino) {
    (function (Model) {
        'use strict';

        // TODO load dynamically from JSON File
        Model.events = {
            wokeUp: 'Woke up',
            fellAsleep: 'Fell asleep',
            ateMeal: 'Ate meal',
            ateSnack: 'Ate a snack',
            drankWater: 'Drank water',
            drankMilk: 'Drank milk',
            pooped: 'Pooped',
            hadBath: 'Had a bath'
        };

        var BabyEvent = (function () {
            function BabyEvent(type, time) {
                this.type = m.prop(type);
                this.time = m.prop(time);
            }
            return BabyEvent;
        })();
        Model.BabyEvent = BabyEvent;

        var List = (function () {
            function List(inner) {
                this.inner = inner;
                this.of = this.unit;
                this.chain = this.bind;
                this.lift = this.fmap;
                this.map = this.fmap;
            }
            List.prototype.unit = function (u) {
                return new List([u]);
            };

            List.prototype.bind = function (f) {
                return new List(this.inner.map(f));
            };

            List.prototype.push = function (t) {
                return new List(this.inner.concat(t));
            };

            List.prototype.fmap = function (f) {
                return new List(this.inner.map(f));
            };
            return List;
        })();

        var History = (function () {
            function History(storage) {
                this.storage = storage;
                this.events = TsMonad.maybe(storage.getItem(History.key)).fmap(JSON.parse).caseOf({
                    just: function (data) {
                        return data;
                    },
                    nothing: function () {
                        return [];
                    }
                });
            }
            History.clear = function (storage) {
                storage.setItem(History.key, JSON.stringify([]));
            };

            History.prototype.add = function (evt) {
                this.events.push(evt);
                this.storage.setItem(History.key, JSON.stringify(this.events));
                return this;
            };

            History.prototype.caseOf = function (patterns) {
                return patterns.history(this.events);
            };
            History.key = 'Bambino';
            return History;
        })();
        Model.History = History;
    })(Bambino.Model || (Bambino.Model = {}));
    var Model = Bambino.Model;
})(Bambino || (Bambino = {}));

var Bambino;
(function (Bambino) {
    (function (View) {
        function selectEvent(prop, options) {
            return m('div.form-group', [
                m('select.form-control.babyEvent', { onchange: m.withAttr('value', prop) }, options.map(function (o) {
                    return m('option[value=' + o.value + ']', o.text);
                }))
            ]);
        }

        function inputDate() {
            return m('div.form-group', [
                m('input.form-control.date[type="date"][placeholder="Date"]', { value: moment().format('YYYY-MM-DD') })
            ]);
        }

        function inputTime() {
            return m('div.form-group', [
                m('input.form-control.time[type="time"][placeholder="Time"]', { value: moment().format('HH:MM') })
            ]);
        }

        function row(id, options, selection) {
            return m('div#entry' + id, [
                m('form#entry-form' + id + '.form-inline[action="#"]', [
                    selectEvent(selection, options),
                    inputDate(),
                    inputTime(),
                    m('button.btn.btn-default[type="submit"]', [
                        m('span.glyphicon.glyphicon-add', ' '),
                        '+'
                    ])
                ])
            ]);
        }
        View.row = row;
    })(Bambino.View || (Bambino.View = {}));
    var View = Bambino.View;
})(Bambino || (Bambino = {}));

var Bambino;
(function (Bambino) {
    'use strict';

    function controller() {
        this.selection = m.prop('dummy');
        this.events = function () {
            return _.map(Bambino.Model.events, function (n) {
                return { text: n, value: n };
            });
        };
    }
    Bambino.controller = controller;

    function view(ctrl) {
        return Bambino.View.row(0, ctrl.events(), ctrl.selection);
    }
    Bambino.view = view;
})(Bambino || (Bambino = {}));
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../src/bambino.ts" />
var Bambino;
(function (Bambino) {
    (function (Model) {
        (function (Test) {
            'use strict';

            QUnit.test('History', function (assert) {
                Model.History.clear(localStorage);

                new Model.History(localStorage).add(new Model.BabyEvent(Model.events['wokeUp'], moment('2014-09-08T06:00'))).add(new Model.BabyEvent(Model.events['ateMeal'], moment('2014-09-08T07:00')));

                assert.ok(new Model.History(localStorage).caseOf({
                    history: function (evts) {
                        console.log(evts);
                        return evts.length === 2;
                    }
                }));
            });
        })(Model.Test || (Model.Test = {}));
        var Test = Model.Test;
    })(Bambino.Model || (Bambino.Model = {}));
    var Model = Bambino.Model;
})(Bambino || (Bambino = {}));
//# sourceMappingURL=bambino-test.js.map
