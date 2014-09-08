/// <reference path="../node_modules/tsmonad/dist/tsmonad.d.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/mithril/mithril.d.ts" />

module Bambino.Model {
    'use strict';

    export enum EventType { WokeUp, FellAsleep, AteMeal, AteSnack, DrankWater, DrankMilk, Pooped }

    export class BabyEvent {
        type: MithrilProp<EventType>;
        time: MithrilProp<Moment>;
        constructor(type: EventType, time: Moment) {
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

module Bambino.Controller {
    'use strict';

}
