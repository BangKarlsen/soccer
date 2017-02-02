function createFcMowgli() {
    function FcMowgli(name, side) {
        this.name = name;
        this.side = side;
        console.log('Created ' + side + ' team: ' + name);
    }

    FcMowgli.prototype.tick = function(playersPos, opponents, ball) {
        var playerDirs = [];
        var runDir = this.side === 'left' ? 0 : Math.PI;
        playersPos.forEach(function(player) {
            playerDirs.push({
                runDir: runDir,
                runSpeed: Math.random() * 3,
                kickDir: Math.PI/4,
                kickSpeed: 15
            });
        });
        return playerDirs;
    }

    return FcMowgli;
};
