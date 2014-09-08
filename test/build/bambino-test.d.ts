/// <reference path="../../node_modules/tsmonad/dist/tsmonad.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/mithril/mithril.d.ts" />
declare module Bambino.Model {
    enum EventType {
        WokeUp = 0,
        FellAsleep = 1,
        AteMeal = 2,
        AteSnack = 3,
        DrankWater = 4,
        DrankMilk = 5,
        Pooped = 6,
    }
    class BabyEvent {
        public type: MithrilProp<EventType>;
        public time: MithrilProp<Moment>;
        constructor(type: EventType, time: Moment);
    }
    interface HistoryPatterns<T> {
        history(evts: BabyEvent[]): T;
    }
    class History {
        private storage;
        private events;
        private static key;
        static clear(storage: Storage): void;
        constructor(storage: Storage);
        public add(evt: BabyEvent): History;
        public caseOf<T>(patterns: HistoryPatterns<T>): T;
    }
}
declare module Bambino.Controller {
}
declare module Bambino.Model.Test {
}
