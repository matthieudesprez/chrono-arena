module TacticArena.Entity.Character {
    export class Amanda extends TacticArena.Entity.Pawn {

        constructor(game, x, y, ext, id, team) {
            super(game, x, y, ext, 'amanda', id, team, "Amanda", Entity.Sprite);
            this.skills = this.skills.concat([
                new TacticArena.Entity.Skill.Slash(this.game, this),
                //new TacticArena.Entity.Skill.Wind(this.game, this),
                new TacticArena.Entity.Skill.Fire(this.game, this),
                new TacticArena.Entity.Skill.Walk(this.game, this)
            ]);
            this._apMax = 4;
        }
    }
}
