function defineFcTest() {
    function FcTest(side, field) {
        this.side = side;
        this.field = field;
        this.name = 'FC Test';
        this.color = 'red';
        console.log('Created ' + this.color + ' team: ' + this.name);
    }

    FcTest.prototype.tick = function (players, opponents, ball) {
        function dist(a, b) {
            return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
        }

        function dir(from, to) {
            return -Math.atan2(to.y - from.y, to.x - from.x);
        }

        var side = this.side;
        var field = {
            w: this.field.w,
            h: this.field.h
        };
        players.forEach(function (player, index) {
            players[index] = {
                x: player.x,
                y: player.y,
                runDir: dir(player, ball),
                runSpeed: 0,
                kickDir: 4.4,
                kickSpeed: 15
            };
        });

        players[0].runSpeed = 4;
        return players;
    }

    return FcTest;
}
