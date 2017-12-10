module TacticArena.Champion {
    export class Evil extends BaseChampion {

        constructor(state, position, id, team) {
            super(state, position, 'evil', id, team, "Inugami", Sprite.BaseSprite);
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
