module TacticArena.UI {
    export class TopMenu {
        game;
        mainGroup;
        isOver;
        pawns;
        barWidth;

        constructor(game) {
            let self = this;
            this.game = game;
            this.pawns = {};
            this.barWidth = 52;
            this.mainGroup = this.game.add.group();
            this.mainGroup.x = 40;
            this.mainGroup.y = 37;

            let itemWidth = this.game.pawns.length > 5 ? 60 : 65;

            let avatarsGroup = this.game.add.group();
            this.game.pawns.forEach(function (pawn, index) {
                let pawnGroup = self.game.add.group();
                pawnGroup.x = index * itemWidth;
                let frame = self.game.make.sprite(0, 0, 'avatar-frame');
                frame.anchor.set(0.5);
                let avatar = self.game.make.sprite(0, 0, 'avatar-' + pawn.type + '-small');
                avatar.anchor.set(0.5);

                let dead = self.game.make.sprite(0, 0, 'icon-dead');
                dead.anchor.set(0.5);
                dead.alpha = 0;

                let hpBarGroup = self.createBar(-28, 28, pawn._hpMax, '#962b36', '#d54445');
                let apBarGroup = self.createBar(-28, 35, pawn._apMax, '#225572', '#4bbbff');
                let mpBarGroup = self.createBar(-28, 42, pawn._mpMax, '#2e632c', '#64c55f');

                pawnGroup.add(frame);
                pawnGroup.add(avatar);
                pawnGroup.add(dead);
                pawnGroup.add(hpBarGroup);
                pawnGroup.add(apBarGroup);
                pawnGroup.add(mpBarGroup);

                avatarsGroup.add(pawnGroup);

                self.pawns[pawn._id] = {
                    hpBarGroup: hpBarGroup,
                    apBarGroup: apBarGroup,
                    mpBarGroup: mpBarGroup,
                    dead: dead,
                    avatar: avatar
                };

                self.updateHp(pawn);
                self.updateAp(pawn);
                self.updateMp(pawn);
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
            let percent = (hp / pawn._hpMax) * 100;
            this.pawns[pawn._id].hpBarGroup.getByName('bar').setPercent(percent);
            if(hp <= 0) {
                this.pawns[pawn._id].dead.alpha = 1;
                this.pawns[pawn._id].avatar.alpha = 0.5;
            } else {
                this.pawns[pawn._id].dead.alpha = 0;
                this.pawns[pawn._id].avatar.alpha = 1;
            }
        }

        updateAp(pawn) {
            this.pawns[pawn._id].apBarGroup.getByName('bar').setPercent((pawn.getAp() / pawn._apMax) * 100);
        }

        updateMp(pawn) {
            this.pawns[pawn._id].mpBarGroup.getByName('bar').setPercent((pawn.getMp() / pawn._mpMax) * 100);
        }

        createBar(x, y, max, bgColor, barColor):Phaser.Group {
            let group = this.game.add.group();
            group.x = x;
            group.y = y;
            let bar = new Bar(this.game, {
                x: 2,
                y: 2,
                width: this.barWidth,
                height: 4,
                text: false,
                name: 'bar',
                max: max,
                textColor: '#ffffff',
                bg: { color: bgColor },
                bar: { color: barColor },
                frame: 'bar-frame',
                frameOffsetX: -2,
                frameOffsetY: -2,
            });
            group.add(bar);
            for(var i = 0; i < max - 1; i++) {
                let line =  this.game.make.graphics((this.barWidth / max) * (i + 1) + 1, 1);
                line.lineStyle(1, 0x140c1c, 1);
                line.drawRect(0, 0, 1, 6);
                group.add(line);
            }
            return group;
        }
    }
}
