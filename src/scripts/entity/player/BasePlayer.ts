module TacticArena.Player {
    export class BasePlayer {
        _id;
        name;
        faction;
        isLocalPlayer;
        isBot;
        battleParty;

        constructor(name) {
            this.name = name;
            this.faction = 'human';
            this.isLocalPlayer = true;
            this.isBot = false;
            this.battleParty = [Champion.Ruairi, Champion.Blondy];
        }

        getCharacters() {
            return [Champion.Ruairi, Champion.Skeleton, Champion.Evil, Champion.Blondy];
        }

        getMaps() {
            return [Map.Arena, Map.Volcano, Map.SkyGarden];
        }

        isInBattleParty(name) {
            return this.battleParty.find((character: Function) => {
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
