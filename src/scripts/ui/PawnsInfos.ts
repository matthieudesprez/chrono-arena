module TacticArena.UI {
    export class PawnsInfos {
        menu;
        element;

        constructor(menu) {
            this.menu = menu;
            var self = this;
            var html = '<div class="ui-pawns-infos">';
            // sort for displaying player pawns on top
            let pawns = this.menu.game.pawns.sort( p => { return p.team != self.menu.game.playerTeam; });
            for(var i = 0; i < pawns.length; i++) {
                let pawn = pawns[i];
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
                if(selectedPawn.team == self.menu.game.turnManager.currentTeam) {
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
            for(var i=0; i < this.menu.game.pawns.length; i++) {
                let entity = this.menu.game.pawns[i];
                this.element.find('.pawn0' + entity._id).toggleClass('dead', !entity.isAlive());
                this.element.find('.pawn0' + entity._id + ' .infos .hp .value').html(entity.getHp());
                this.element.find('.pawn0' + entity._id + ' .infos .hp .bar .current').css('width', ((entity.getHp() / entity._hpMax) * 100) + '%');
                this.element.find('.pawn0' + entity._id + ' .infos .ap .value').html(entity.getAp());
                this.element.find('.pawn0' + entity._id + ' .infos .ap .bar .current').css('width', ((entity.getAp() / entity._apMax) * 100) + '%');
                this.element.find('.pawn0' + entity._id + ' .infos .ap .bar .remaining').css('width', '0%');
            }
        }

        showApCost(pawn, apCost) {
            let percentRemaining = apCost > 0 ? ((pawn.getAp() / pawn._apMax) * 100) : 0;
            this.element.find('.pawn0' + pawn._id + ' .infos .ap .bar .current').css('width', (((pawn.getAp() - apCost) / pawn._apMax) * 100) + '%');
            this.element.find('.pawn0' + pawn._id + ' .infos .ap .bar .remaining').css('width', percentRemaining + '%');
            this.element.find('.pawn0' + pawn._id + ' .infos .ap .value').html(pawn.getAp() - apCost);
        }
    }
}
