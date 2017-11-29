module TacticArena.Entity.Character {
    export class Evil extends TacticArena.Entity.Pawn {

        constructor(state, x, y, ext, id, team) {
            super(state, x, y, ext, 'evil', id, team, "Evil", Entity.Sprite);
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
