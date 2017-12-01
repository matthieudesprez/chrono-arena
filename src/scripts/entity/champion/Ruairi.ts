module TacticArena.Champion {
    export class Ruairi extends BaseChampion {

        constructor(state, x, y, ext, id, team) {
            super(state, x, y, ext, 'ruairi', id, team, "Ruairi", Sprite.BaseSprite);
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
