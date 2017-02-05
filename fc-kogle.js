function createFcKogle() {
    function FcKogle(side, fieldW, fieldH) {
        this.side = side;
        this.fieldW = fieldW; 
        this.fieldH = fieldH;
        this.name = 'FC Kogle';
        this.color = 'orange';
        console.log('Created ' + this.color + ' team: ' + this.name);
    }

    FcKogle.prototype.tick = function(playersPos, opponentsPos, ball) {
        var playerDirs = [];
        var runDir = this.side === 'left' ? 0 : Math.PI;
        playersPos.forEach(function(player) {
            playerDirs.push({
                runDir: runDir,
                runSpeed: 2,
                kickDir: Math.PI + Math.PI/12,
                kickSpeed: 15
            });
        });
        return playerDirs;
    }

    return FcKogle;
}
