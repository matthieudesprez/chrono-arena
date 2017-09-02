module TacticArena.Entity.Character {
    export class Skeleton extends TacticArena.Entity.Pawn {

        constructor(game, x, y, ext, id, bot, team) {
            super(game, x, y, ext, 'skeleton', id, bot, team, "Skeleton", Entity.Sprite);
            this.skills = this.skills.concat([
                new TacticArena.Entity.Skill.Slash(this.game, this),
                //new TacticArena.Entity.Skill.Wind(this.game, this),
                new TacticArena.Entity.Skill.Fire(this.game, this),
                new TacticArena.Entity.Skill.Walk(this.game, this),
                new TacticArena.Entity.Skill.Watch(this.game, this)
            ]);
            this._apMax = 4;
        }
    }
}
