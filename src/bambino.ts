/// <reference path="../node_modules/tsmonad/dist/tsmonad.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/mithril/mithril.d.ts" />

module Bambino.Model {
    'use strict';

    export interface EventType {
        [name: string]: string;
    }

    // TODO load dynamically from JSON File
    export var events: EventType = {
        wokeUp: 'Woke up',
        fellAsleep: 'Fell asleep',
        ateMeal: 'Ate meal',
        ateSnack: 'Ate a snack',
        drankWater: 'Drank water',
        drankMilk: 'Drank milk',
        pooped: 'Pooped',
        hadBath: 'Had a bath'
    };

    export class BabyEvent {
        type: MithrilProp<string>;
        time: MithrilProp<Moment>;
        constructor(type: string, time: Moment) {
            this.type = m.prop(type);
            this.time = m.prop(time);
        }
    }

    class List<T> implements TsMonad.Monad<T>, TsMonad.Functor<T> {
        constructor(private inner: T[]) {}
        unit<U>(u: U) {
            return new List([u]);
        }
        of = this.unit;
        bind<U>(f: (t: T) => List<U>) {
            return new List(this.inner.map(f));
        }
        chain = this.bind;

        push(t: T) {
            return new List(this.inner.concat(t));
        }

        fmap<U>(f: (t: T) => U) {
            return new List(this.inner.map(f));
        }
        lift = this.fmap;
        map = this.fmap;
    }

    export interface HistoryPatterns<T> {
        history(evts: BabyEvent[]): T;
    }

    export class History {
        private events: BabyEvent[];
        private static key = 'Bambino';

        static clear(storage: Storage) {
            storage.setItem(History.key, JSON.stringify([]));
        }

        constructor(private storage: Storage) {
            this.events = TsMonad.maybe(storage.getItem(History.key))
                .fmap(JSON.parse)
                .caseOf({
                    just: data => data,
                    nothing: () => []
                });
        }

        add(evt: BabyEvent) {
            this.events.push(evt);
            this.storage.setItem(History.key, JSON.stringify(this.events));
            return this;
        }

        caseOf<T>(patterns: HistoryPatterns<T>) {
            return patterns.history(this.events);
        }
    }
}

module Bambino.View {
    'use strict';

    function selectEvent(prop: MithrilProp<string>, options: HTMLOptionElement[]) {
        return m('div.form-group', [
            m('select.form-control.babyEvent',
                { onchange: m.withAttr('value', prop) },
                options.map(o => m('option[value=' + o.value + ']', o.text))),
        ]);
    }

    function inputDate(prop: MithrilProp<string>) {
        return m('div.form-group', [
            m('input.form-control.date[type="date"][placeholder="Date"]', 
                { onchange: m.withAttr('value', prop), value: prop() }),
        ]);
    }

    function inputTime(prop: MithrilProp<string>) {
        return m('div.form-group', [
            m('input.form-control.time[type="time"][placeholder="Time"]', 
                { onchange: m.withAttr('value', prop), value: prop() }),
        ]);
    }

    export function row(id: number, options: HTMLOptionElement[], rowData: RowData, clicker: () => any) {
        return m('div#entry' + id, [
            m('form#entry-form' + id + '.form-inline[action="#"]', [
                selectEvent(rowData.selection, options),
                inputDate(rowData.date),
                inputTime(rowData.time),
                m('button.btn.btn-default[type="submit"]', 
                    { onclick: clicker },
                    [ m('span.glyphicon.glyphicon-add', ' '), '+' ]
                ), 
            ])
        ]);
    }
}

module Bambino {
    'use strict';
    
    export interface RowData {
        selection: MithrilProp<string>;
        date: MithrilProp<string>;
        time: MithrilProp<string>;
    }

    export function controller() {
        this.rowData = {
            selection: m.prop('dummy'),
            date: m.prop('date'),
            time: m.prop('time')
        };
        this.events = function () {
            return _.map(Model.events, n => { return { text: n, value: n } });
        };
        this.add = () => {
            console.log(this.rowData);
        };
    }

    export function view(ctrl: any) {
        return View.row(0, ctrl.events(), ctrl.rowData, ctrl.add);
    }
}
