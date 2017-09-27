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
            console.log('init');
            this.game.pawns.forEach(function (pawn, index) {
                let pawnGroup = self.game.add.group();
                pawnGroup.x = index * 70;
                let frame = self.game.make.sprite(0, 0, 'avatar-frame');
                frame.anchor.set(0.5);
                let avatar = self.game.make.sprite(0, 0, 'avatar-' + pawn.type);
                avatar.anchor.set(0.5);
                avatar.scale.set(0.45);

                let dead = self.game.make.sprite(0, 0, 'icon-dead');
                dead.anchor.set(0.5);
                dead.alpha = 0;

                let heart = self.game.make.sprite(-13, 25, 'icon-heart');
                heart.anchor.set(0.5);
                let hpText = self.game.add.text(0, 0, pawn.getHp(), {
                    font: '15px Iceland',
                    fill: '#FFFFFF',
                    align: 'center',
                    boundsAlignH: 'center',
                    boundsAlignV: 'center',
                    strokeThickness: 3,
                    stroke: '#000000',
                    wordWrap: true
                });
                hpText.setTextBounds(heart.x - 13, heart.y - 10, 26, 21);

                let energy = self.game.make.sprite(1, 11, 'icon-power');
                energy.anchor.set(0);
                let apText = self.game.add.text(0, 0, pawn.getAp(), {
                    font: '15px Iceland',
                    fill: '#FFFFFF',
                    align: 'center',
                    boundsAlignH: 'center',
                    boundsAlignV: 'center',
                    strokeThickness: 3,
                    stroke: '#000000',
                    wordWrap: true
                });
                apText.setTextBounds(energy.x, energy.y + 4, energy.width, energy.height);

                pawnGroup.add(frame);
                pawnGroup.add(avatar);
                pawnGroup.add(dead);
                pawnGroup.add(heart);
                pawnGroup.add(hpText);
                pawnGroup.add(energy);
                pawnGroup.add(apText);

                avatarsGroup.add(pawnGroup);

                self.pawns[pawn._id] = {
                    hpText: hpText,
                    apText: apText,
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

        updateAp(pawn) {
            this.pawns[pawn._id].apText.setText(pawn.getAp());
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
    }
}
