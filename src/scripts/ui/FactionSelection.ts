module TacticArena.UI {
    export class FactionSelection {
        //menu;
        //menuElement;
        //element;
        //selected_faction;

        constructor(menu, menuElement) {
            //this.menu = menu;
            //this.menuElement = menuElement;
        }

        init(mode) {
            //var self = this;
            //this.menuElement.html(
            //    '<div><h2>Choisissez votre faction :</h2></div>' +
            //    '<div class="faction-selector">' +
            //    '   <span class="control left fa fa-chevron-left"></span>' +
            //    '   <span class="control right fa fa-chevron-right"></span>' +
            //    '   <div class="faction human"><span class="name">Human</span></div>' +
            //    '   <div class="faction undead"><span class="name">Undead</span></div>' +
            //    '</div>' +
            //    '<div class="button submit-faction"><a>Confirmer</a></div>'
            //);
            //
            //this.menuElement.find('.control').on('click', function () {
            //    self.menuElement.find('.faction.human').toggle();
            //    self.menuElement.find('.faction.undead').toggle();
            //});
            //
            //this.menuElement.find('.submit-faction').on('click', function () {
            //    self.selected_faction = self.menuElement.find('.faction.human').is(':visible') ? 'human' : 'undead';
            //    $(this).hide();
            //    self.menuElement.find('.control').hide();
            //    if(mode == 'online') {
            //        self.menuElement.find('h2').html('En attente de votre adversaire');
            //        self.menu.serverManager.request('FACTION_CHOSEN', self.selected_faction);
            //    } else {
            //        self.menu.game.state.start('mainsolooffline', true, false, {
            //            players: [
            //                {name: 'BOT 01', faction: 'evil', player: false},
            //                {name: self.menu.login, faction: self.selected_faction, player: true}
            //            ]
            //        }, self.menu.chatUI);
            //    }
            //});
        }
    }
}
