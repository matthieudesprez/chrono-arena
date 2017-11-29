module TacticArena.Entity.Character {
    export class Blondy extends TacticArena.Entity.Pawn {

        constructor(state, x, y, ext, id, team) {
            super(state, x, y, ext, 'blondy', id, team, "Blondy", Entity.Sprite);
            this.skills = this.skills.concat([
                new TacticArena.Skill.Walk(this.state, this),
                new TacticArena.Skill.Heal(this.state, this),
                new TacticArena.Skill.Wind(this.state, this),
                new TacticArena.Skill.Fire(this.state, this)
            ]);
            this._apMax = 4;
        }
    }
}
