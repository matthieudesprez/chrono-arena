module TacticArena.UI {
    export class Modal {
        state;

        constructor(state) {
            this.state = state;
        }

        createGameOverModal() {
            let state = this.state;
            state.uiManager.dialogUI.createModal({
                type: "battleOver",
                includeBackground: true,
                fixedToCamera: true,
                itemsArr: [
                    {
                        type: "image",
                        content: "background-modal",
                        offsetY: -50,
                        contentScale: 1
                    },
                    {
                        type: "text",
                        content: "[t]",
                        fontFamily: "Press Start 2P",
                        fontSize: 21,
                        color: "0x000000",
                        offsetY: -225
                    },
                    {
                        type: "text",
                        content: state.getResult(),
                        fontFamily: "Press Start 2P",
                        fontSize: 18,
                        color: "0x000000",
                        offsetY: -150
                    },
                    {
                        type: "button",
                        atlasParent: "small-button",
                        content: "background-button",
                        buttonHover: "background-button-hover",
                        offsetY: -60,
                        contentScale: 0.7,
                        callback: function () {
                            state.game.state.start('mainsolooffline', true, false, {
                                players: this.state.players,
                                map: this.state.mapClass
                            }, null);
                        }
                    },
                    {
                        type: "text",
                        content: "Replay",
                        fontFamily: "Press Start 2P",
                        fontSize: 18,
                        color: "0x000000",
                        offsetY: -60
                    },
                    {
                        type: "button",
                        atlasParent: "small-button",
                        content: "background-button",
                        buttonHover: "background-button-hover",
                        offsetY: 20,
                        contentScale: 0.7,
                        callback: function () {
                            state.game.state.start('menu');
                        }
                    },
                    {
                        type: "text",
                        content: "Quit",
                        fontFamily: "Press Start 2P",
                        fontSize: 18,
                        color: "0x000000",
                        offsetY: 20
                    },
                ]
            });
        }
    }
}
