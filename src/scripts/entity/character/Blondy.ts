module TacticArena.Entity.Character {
    export class Blondy extends TacticArena.Entity.Pawn {

        constructor(game, x, y, ext, id, team) {
            super(game, x, y, ext, 'blondy', id, team, "Blondy", Entity.Sprite);
            this.skills = this.skills.concat([
                new TacticArena.Entity.Skill.Walk(this.game, this),
                new TacticArena.Entity.Skill.Heal(this.game, this),
                new TacticArena.Entity.Skill.Wind(this.game, this),
                new TacticArena.Entity.Skill.Fire(this.game, this)
            ]);
            this._apMax = 4;
        }
    }
}
