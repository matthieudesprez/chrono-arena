module TacticArena {
    export class Player {
        name;
        faction;
        isMainPlayer;
        isBot;
        battleParty;

        constructor(name) {
            this.name = name;
            this.faction = 'human';
            this.isMainPlayer = true;
            this.isBot = false;
            this.battleParty = [Entity.Character.Ruairi];
        }

        getCharacters() {
            return [Entity.Character.Ruairi, Entity.Character.Skeleton, Entity.Character.Evil, Entity.Character.Blondy];
        }

        getMaps() {
            return [Map.Arena, Map.Volcano, Map.SkyGarden];
        }

        isInBattleParty(name) {
            return this.battleParty.find(character => {
                return character.name === name;
            });
        }

        addCharacterToParty(character) {
            this.battleParty.push(character);
        }

        removeCharacterFromParty(character) {
            this.battleParty.splice(this.battleParty.indexOf(character), 1);
        }
    }
}
