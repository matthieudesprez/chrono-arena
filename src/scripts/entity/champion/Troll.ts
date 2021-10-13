module TacticArena.Champion {
    export class Troll extends BaseChampion {

        constructor(state, position, id, team) {
            super(state, position, 'troll', id, team, "Troll", Sprite.TrollSprite);
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
