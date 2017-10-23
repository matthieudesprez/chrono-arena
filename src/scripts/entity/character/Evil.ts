module TacticArena.Entity.Character {
    export class Evil extends TacticArena.Entity.Pawn {

        constructor(game, x, y, ext, id, bot, team) {
            super(game, x, y, ext, 'evil', id, bot, team, "Evil", Entity.Sprite);
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
