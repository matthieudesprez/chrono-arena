module TacticArena.Entity.Character {
    export class Amanda extends TacticArena.Entity.Pawn {

        constructor(state, x, y, ext, id, team) {
            super(state, x, y, ext, 'amanda', id, team, "Amanda", Entity.Sprite);
            this.skills = this.skills.concat([
                new TacticArena.Skill.Slash(this.state, this),
                //new TacticArena.Skill.Wind(this.state, this),
                new TacticArena.Skill.Fire(this.state, this),
                new TacticArena.Skill.Walk(this.state, this)
            ]);
            this._apMax = 4;
        }
    }
}
