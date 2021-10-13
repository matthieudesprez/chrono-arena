module TacticArena.Champion {
    export class Ruairi extends BaseChampion {

        constructor(state, position, id, team) {
            super(state, position, 'ruairi', id, team, "Ruairi", Sprite.LpcSprite);
            this.skills = this.skills.concat([
                new TacticArena.Skill.Walk(this.state, this),
                new TacticArena.Skill.Slash(this.state, this),
                new TacticArena.Skill.Wind(this.state, this),
                new TacticArena.Skill.Fire(this.state, this)
            ]);
            this._apMax = 4;
            this._hpMax = 5;
            this._hp = 5;
        }
    }
}
