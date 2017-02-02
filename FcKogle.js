function createFcKogle() {
    function FcKogle(side) {
        this.side = side;
        this.name = 'FC Kogle';
        this.color = 'orange';
        console.log('Created ' + this.color + ' team: ' + this.name);
    }

    FcKogle.prototype.tick = function(playersPos, opponents, ball) {
        var playerDirs = [];
        var runDir = this.side === 'left' ? 0 : Math.PI;
        playersPos.forEach(function(player) {
            playerDirs.push({
                runDir: runDir,
                runSpeed: 2,
                kickDir: -Math.PI/4,
                kickSpeed: 15
            });
        });
        return playerDirs;
    }

    return FcKogle;
}
