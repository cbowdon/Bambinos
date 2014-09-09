/// <reference path="../../node_modules/tsmonad/dist/tsmonad.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/mithril/mithril.d.ts" />
declare module Bambino.Model {
    interface EventType {
        [name: string]: string;
    }
    var events: EventType;
    class BabyEvent {
        public type: MithrilProp<string>;
        public time: MithrilProp<Moment>;
        constructor(type: string, time: Moment);
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
declare module Bambino.View {
    function row(id: number, options: HTMLOptionElement[], rowData: RowData, clicker: () => any): MithrilVirtualElement;
}
declare module Bambino {
    interface RowData {
        selection: MithrilProp<string>;
        date: MithrilProp<string>;
        time: MithrilProp<string>;
    }
    function controller(): void;
    function view(ctrl: any): MithrilVirtualElement;
}
declare module Bambino.Model.Test {
}
