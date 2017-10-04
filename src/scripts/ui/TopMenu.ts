module TacticArena.UI {
    export class TopMenu {
        game;
        mainGroup;
        isOver;
        pawns;

        constructor(game) {
            let self = this;
            this.game = game;
            this.pawns = {};
            this.mainGroup = this.game.add.group();
            this.mainGroup.x = 40;
            this.mainGroup.y = 37;

            let avatarsGroup = this.game.add.group();
            this.game.pawns.forEach(function (pawn, index) {
                let pawnGroup = self.game.add.group();
                pawnGroup.x = index * 70;
                let frame = self.game.make.sprite(0, 0, 'avatar-frame');
                frame.anchor.set(0.5);
                let avatar = self.game.make.sprite(0, 0, 'avatar-' + pawn.type + '-small');
                avatar.anchor.set(0.5);

                let dead = self.game.make.sprite(0, 0, 'icon-dead');
                dead.anchor.set(0.5);
                dead.alpha = 0;

                let barWidth = 52;
                let hpBar = new Bar(self.game, {
                    x: -28 + 2,
                    y: 28 + 2,
                    width: barWidth,
                    height: 4,
                    text: false,
                    name: 'hpbar',
                    unit: 'HP',
                    max: pawn._hpMax,
                    textColor: '#ffffff',
                    bg: { color: '#962b36' },
                    bar: { color: '#d54445' },
                    textStyle: '10px Iceland',
                    frame: 'bar-frame',
                    frameOffsetX: -2,
                    frameOffsetY: -2,
                });
                let apBar = new Bar(self.game, {
                    x: -28 + 2,
                    y: 28 + 6 + 2,
                    width: barWidth,
                    height: 4,
                    text: false,
                    name: 'apbar',
                    unit: 'AP',
                    max: pawn._apMax,
                    textColor: '#ffffff',
                    bg: { color: '#0096ff' },
                    bar: { color: '#4bbbff' },
                    textStyle: '10px Iceland',
                    frame: 'bar-frame',
                    frameOffsetX: -2,
                    frameOffsetY: -2,
                });
                let mpBar = new Bar(self.game, {
                    x: -28 + 2,
                    y: 28 + 12 + 2,
                    width: barWidth,
                    height: 4,
                    text: false,
                    name: 'mpbar',
                    unit: 'MP',
                    max: pawn._mpMax,
                    textColor: '#ffffff',
                    bg: { color: '#2e632c' },
                    bar: { color: '#64c55f' },
                    textStyle: '10px Iceland',
                    frame: 'bar-frame',
                    frameOffsetX: -2,
                    frameOffsetY: -2,
                });

                pawnGroup.add(frame);
                pawnGroup.add(avatar);
                pawnGroup.add(dead);
                pawnGroup.add(hpBar);
                pawnGroup.add(apBar);
                pawnGroup.add(mpBar);

                avatarsGroup.add(pawnGroup);

                self.pawns[pawn._id] = {
                    hpBar: hpBar,
                    dead: dead,
                    avatar: avatar
                };
            });

            this.mainGroup.add(avatarsGroup);
            this.game.uiGroup.add(this.mainGroup);

        }

        over() {
            this.isOver = true;
        }

        out() {
            this.isOver = false;
        }

        updateHp(pawn) {
            let hp = pawn.getHp();
            this.pawns[pawn._id].hpText.setText(hp);
            if(hp <= 0) {
                this.pawns[pawn._id].dead.alpha = 1;
                this.pawns[pawn._id].avatar.alpha = 0.5;
            } else {
                this.pawns[pawn._id].dead.alpha = 0;
                this.pawns[pawn._id].avatar.alpha = 1;
            }
        }

        updateAp(pawn) {
            //this.pawns[pawn._id].apText.setText(pawn.getAp());
        }

        updateMp(pawn) {
            //this.pawns[pawn._id].apText.setText(pawn.getAp());
        }
    }
}
