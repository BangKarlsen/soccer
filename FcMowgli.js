function createFcMowgli() {
    function FcMowgli(side) {
        this.side = side;
        this.name = 'FC Mowgli';
        this.color = 'lightblue';
        console.log('Created ' + this.color + ' team: ' + this.name);
    }

    FcMowgli.prototype.tick = function(playersPos, opponents, ball) {
        var playerDirs = [];
        var runDir = this.side === 'left' ? 0 : Math.PI;
        playersPos.forEach(function(player) {
            playerDirs.push({
                runDir: runDir,
                runSpeed: 3,
                kickDir: Math.PI/4,
                kickSpeed: 15
            });
        });
        return playerDirs;
    }

    return FcMowgli;
};
