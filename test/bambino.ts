/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../src/bambino.ts" />

module Bambino.Model.Test {
    'use strict';

    QUnit.test('History', assert => {
        History.clear(localStorage);

        new History(localStorage)
            .add(new BabyEvent(EventType.WokeUp, moment('2014-09-08T06:00')))
            .add(new BabyEvent(EventType.AteMeal, moment('2014-09-08T07:00')));

        assert.ok(new History(localStorage)
            .caseOf({
                history: evts => { console.log(evts); return evts.length === 2; }
            }));
    });
}
