module TacticArena {
    export class Player {
        name;
        faction;
        player;
        battleParty;

        constructor(name) {
            this.name = name;
            this.faction = 'human';
            this.player = true;
            this.battleParty = [Entity.Character.Ruairi];
        }

        getCharacters() {
            return [Entity.Character.Ruairi, Entity.Character.Skeleton, Entity.Character.Evil, Entity.Character.Blondy];
        }

        isInBattleParty(name) {
            return this.battleParty.find(character => {
                return character.name === name;
            });
        }
    }
}
