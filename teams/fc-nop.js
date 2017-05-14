function defineFcNop() {
    function FcNop(side, field) {
        this.side = side;
        this.field = field;
        this.name = 'NopNopNop';
        this.color = 'teal';
        console.log('Created ' + this.color + ' team: ' + this.name);
    }

    FcNop.prototype.tick = function (players, opponents, ball) {
        return players;
    }

    return FcNop;
}
