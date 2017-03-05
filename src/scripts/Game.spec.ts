if (typeof window != "undefined") {
    (<any>window).describe = (<any>window).describe || function () { };
}

module TS.TacticArena.Specs {
    describe("MainUI", () => {
        it("must works", function () {
            let result = true;
            expect(result).toBe(true);
        });
    });
}