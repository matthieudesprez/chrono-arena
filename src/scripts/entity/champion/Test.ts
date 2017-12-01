module TacticArena.Champion {
    export class Test extends BaseChampion {

        constructor(state, x, y, ext, id, team) {
            super(state, x, y, ext, 'skeleton', id, team, "Skeleton", Sprite.BaseSprite);
            this.skills = this.skills.concat([
                new TacticArena.Skill.Walk(this.state, this),
                new TacticArena.Skill.Slash(this.state, this),
                new TacticArena.Skill.Wind(this.state, this),
                new TacticArena.Skill.Fire(this.state, this)
            ]);
        }
    }
}
