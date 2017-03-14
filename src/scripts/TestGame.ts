///// <reference path="./state/Main.ts"/>
//
//module TacticalArena.Specs {
//    import Main = TacticArena.State.Main;
//    export class TestGame {
//        baseview:Main;
//
//        constructor() {
//            return this.setupSingleView(testgame => {
//                testgame.baseview = new Main();
//                return [testgame.baseview, []];
//            });
//        }
//
//        setupSingleView(buildView:(testgame:TestGame) => [Phaser.State, any[]]) {
//            let testgame = new Main();
//
//            beforeEach(function (done) {
//                spyOn(console, "log").and.stub();
//                spyOn(console, "warn").and.stub();
//
//
//                if (testgame.load) {
//                    spyOn(testgame.load, 'image').and.stub();
//                    spyOn(testgame.load, 'audio').and.stub();
//                }
//
//               // let [state, stateargs] = buildView(testgame);
//
//               // let orig_create = bound(testgame, "create");
//                spyOn(testgame, "create").and.callFake(() => {
//                    //orig_create();
//                    done();
//                });
//
//                //testgame.baseview.state.add("test", state);
//                //testgame.baseview.state.start("test", true, false, ...stateargs);
//            });
//
//            afterEach(function () {
//                //let ui = testgame.baseview;
//                //window.requestAnimationFrame(() => {
//                //    if (ui) {
//                //        //ui.destroy();
//                //    }
//                //});
//            });
//
//            return testgame;
//        }
//    }
//}
