module TacticArena {
    export class BaseAnimation {
        state:State.BasePlayable; // reference to current state, BasePlayable because can be played outside a battle
        pawn:Entity.Pawn; // pawn doing the animation
        order:BaseOrder; // origin of the action

        constructor(state:State.BasePlayable, pawn:Entity.Pawn, order:BaseOrder) {
            this.state = state;
            this.pawn = pawn;
            this.order = order;
        }

        get():Promise<any> {
            return null;
        }

        handleBackward(animation:Promise<any>):Promise<any> {
            let result;
            let spritePosition: Position = this.state.spritesManager.getReal(this.pawn).getPosition();
            if(!spritePosition.equals(this.order.position)) {
                result = this.state.spritesManager.getReal(this.pawn).moveTo(this.order.position.x, this.order.position.y, null, false);
                result.then((res) => {
                    return animation;
                });
            } else {
                result = animation;
            }
            return result;
        }
    }
}
