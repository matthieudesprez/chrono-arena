module TacticArena.Champion {
    export class Blondy extends BaseChampion {

        constructor(state, x, y, ext, id, team) {
            super(state, x, y, ext, 'blondy', id, team, "Blondy", Sprite.BaseSprite);
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
