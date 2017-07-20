module TacticArena.UI {
    export class PawnsInfos {
        menu;
        element;
        pawnsInfos;

        constructor(menu) {
            this.menu = menu;
            var self = this;
            this.pawnsInfos = {};
            var html = '<div class="ui-pawns-infos">';
            // sort for displaying player pawns on top
            let pawns = this.menu.game.pawns.sort(p => {
                return p.team != self.menu.game.playerTeam;
            });
            for (var i = 0; i < pawns.length; i++) {
                let pawn = pawns[i];

                let img = self.menu.game.add.image(i * 64, 0, 'avatar-' + pawn.type);
                img.width = 64;
                img.height = 64;

                let hpBar = new Bar(this.menu.game, {
                    x: i * 64,
                    y: 64,
                    width: 64,
                    height: 10,
                    unit: 'HP',
                    max: pawn._hpMax,
                    textColor: '#ffffff',
                    bg: {
                        color: '#808080'
                    },
                    bar: {
                        color: '#8b0000'
                    }
                });

                let apBar = new Bar(this.menu.game, {
                    x: i * 64,
                    y: 74,
                    width: 64,
                    height: 10,
                    unit: 'AP',
                    max: pawn._apMax,
                    textColor: '#ffffff',
                    bg: {
                        color: '#267ac9'
                    },
                    bar: {
                        color: '#1E90FF'
                    }
                });
                //bar.setPercent(80);
                this.pawnsInfos[pawn._id] = {
                    hpBar: hpBar,
                    apBar: apBar
                }

                let classColor = pawn.team == self.menu.game.playerTeam ? 0 : 1;
                html += '<div pawn-index="' + i + '" class="pawn pawn0' + pawn._id + ' ' + pawn.type + ' team-' + classColor + '">' +
                    '<div class="avatar"><div class="picture shiny"></div></div>' +
                    '<div class="name">' + pawn._name + '</div>' +
                    '<div class="infos">' +
                    '<div class="hp">' +
                    '<div class="bar">' +
                    '<div class="content current"></div>' +
                    '<div class="text"><span class="value"></span> / ' + pawn._hpMax + ' HP</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="ap">' +
                    '<div class="bar">' +
                    '<div class="content remaining"></div>' +
                    '<div class="content current"></div>' +
                    '<div class="text"><span class="value"></span> / ' + pawn._apMax + ' AP</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            html += '</div>';
            this.menu.element.append(html);
            this.element = this.menu.element.find('.ui-pawns-infos');

            this.element.find('.pawn').on('click', function () {
                let selectedPawn = self.menu.game.pawns[parseInt($(this).attr('pawn-index'))];
                if (selectedPawn.team == self.menu.game.turnManager.currentTeam) {
                    self.menu.game.turnManager.setActivePawn(selectedPawn);
                }
            });
        }

        select(id) {
            this.deselectAll();
            this.element.find('.pawn0' + id).addClass('active');
        }

        deselectAll() {
            this.element.find('.pawn').removeClass('active');
        }

        selectAll() {
            this.element.find('.pawn').addClass('active');
        }

        updateInfos() {
            for (var i = 0; i < this.menu.game.pawns.length; i++) {
                let pawn = this.menu.game.pawns[i];
                //TODO maintain
                //this.element.find('.pawn0' + entity._id).toggleClass('dead', !entity.isAlive());

                //this.element.find('.pawn0' + entity._id + ' .infos .hp .value').html(entity.getHp());
                //this.element.find('.pawn0' + entity._id + ' .infos .hp .bar .current').css('width', ((entity.getHp() / entity._hpMax) * 100) + '%');
                //this.element.find('.pawn0' + entity._id + ' .infos .ap .value').html(entity.getAp());
                //this.element.find('.pawn0' + entity._id + ' .infos .ap .bar .current').css('width', ((entity.getAp() / entity._apMax) * 100) + '%');
                //this.element.find('.pawn0' + entity._id + ' .infos .ap .bar .remaining').css('width', '0%');

                this.pawnsInfos[pawn._id].hpBar.setPercent(((pawn.getHp() / pawn._hpMax) * 100));
                this.pawnsInfos[pawn._id].hpBar.updateValue(pawn.getHp());
                this.pawnsInfos[pawn._id].apBar.setPercent(((pawn.getAp() / pawn._apMax) * 100));
                this.pawnsInfos[pawn._id].apBar.updateValue(pawn.getAp());
            }
        }

        showApCost(pawn, apCost) {
            //let percentRemaining = apCost > 0 ? ((pawn.getAp() / pawn._apMax) * 100) : 0;
            let currentPercent = (((pawn.getAp() - apCost) / pawn._apMax) * 100);
            let remainingAp = pawn.getAp() - apCost;
            //this.element.find('.pawn0' + pawn._id + ' .infos .ap .bar .current').css('width', currentPercent + '%');
            //this.element.find('.pawn0' + pawn._id + ' .infos .ap .bar .remaining').css('width', percentRemaining + '%');
            //this.element.find('.pawn0' + pawn._id + ' .infos .ap .value').html(remainingAp);
            this.pawnsInfos[pawn._id].apBar.setPercent(currentPercent);
            this.pawnsInfos[pawn._id].apBar.updateValue(remainingAp);
        }
    }
}
