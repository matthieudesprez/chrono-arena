module TacticArena.Entity.Character {
    export class Ruairi extends TacticArena.Entity.Pawn {

        constructor(game, x, y, ext, id, bot, team) {
            super(game, x, y, ext, 'ruairi', id, bot, team, "Ruairi", Entity.Sprite);
            this.skills = this.skills.concat([
                new TacticArena.Entity.Skill.Walk(this.game, this),
                new TacticArena.Entity.Skill.Slash(this.game, this),
                //new TacticArena.Entity.Skill.Wind(this.game, this),
                new TacticArena.Entity.Skill.Fire(this.game, this)
            ]);
            this._apMax = 4;
            this._hpMax = 5;
            this._hp = 5;
        }
    }
}
