if (typeof window != "undefined") {
    (<any>window).describe = (<any>window).describe || function () { };
}

module TacticArena.Specs {
    describe("MainUI", () => {
        it("must works", function () {
            let result = true;
            expect(result).toBe(true);
        });
    });
}