function createFcKogle(teams) {
    function FcKogle(name, side) {
        this.name = name;
        this.side = side;
        console.log('Created ' + side + ' team: ' + name);
    }

    FcKogle.prototype.tick = function(playersPos, opponents, ball) {
        var playerDirs = [];
        var runDir = this.side === 'left' ? 0 : Math.PI;
        playersPos.forEach(function(player) {
            playerDirs.push({
                runDir: runDir,
                runSpeed: Math.random() * 3
            });
        });
        return playerDirs;
    }

    teams.push(FcKogle);
}