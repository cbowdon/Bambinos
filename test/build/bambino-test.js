/// <reference path="../node_modules/tsmonad/dist/tsmonad.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/mithril/mithril.d.ts" />
var Bambino;
(function (Bambino) {
    (function (Model) {
        'use strict';

        (function (EventType) {
            EventType[EventType["WokeUp"] = 0] = "WokeUp";
            EventType[EventType["FellAsleep"] = 1] = "FellAsleep";
            EventType[EventType["AteMeal"] = 2] = "AteMeal";
            EventType[EventType["AteSnack"] = 3] = "AteSnack";
            EventType[EventType["DrankWater"] = 4] = "DrankWater";
            EventType[EventType["DrankMilk"] = 5] = "DrankMilk";
            EventType[EventType["Pooped"] = 6] = "Pooped";
        })(Model.EventType || (Model.EventType = {}));
        var EventType = Model.EventType;

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
    (function (Controller) {
        'use strict';
    })(Bambino.Controller || (Bambino.Controller = {}));
    var Controller = Bambino.Controller;
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

                new Model.History(localStorage).add(new Model.BabyEvent(0 /* WokeUp */, moment('2014-09-08T06:00'))).add(new Model.BabyEvent(2 /* AteMeal */, moment('2014-09-08T07:00')));

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
