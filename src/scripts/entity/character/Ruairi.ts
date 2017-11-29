module TacticArena.Entity.Character {
    export class Ruairi extends TacticArena.Entity.Pawn {

        constructor(state, x, y, ext, id, team) {
            super(state, x, y, ext, 'ruairi', id, team, "Ruairi", Entity.Sprite);
            this.skills = this.skills.concat([
                new TacticArena.Skill.Walk(this.state, this),
                new TacticArena.Skill.Slash(this.state, this),
                new TacticArena.Skill.Wind(this.state, this),
                new TacticArena.Skill.Fire(this.state, this)
            ]);
            this._apMax = 4;
            this._hpMax = 5;
            this._hp = 5;
        }
    }
}
