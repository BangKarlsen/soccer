function createFcMowgli() {
    function FcMowgli(side, fieldW, fieldH) {
        this.side = side;
        this.fieldW = fieldW; 
        this.fieldH = fieldH;
        this.name = 'FC Mowgli';
        this.color = 'lightblue';
        console.log('Created ' + this.color + ' team: ' + this.name);
    }

    FcMowgli.prototype.tick = function(playersPos, opponentsPos, ball) {
        function dist(a, b) {
            return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
        }

        function dir(from, to) {
            return -Math.atan2(to.y - from.y, to.x - from.x);
        }
        
        function goalPos() {
            return {
                x: side === 'left' ? 0 : fieldW,
                y: fieldH / 2
            };
        }
        
        function opponentGoalPos() {
            return {
                x: side === 'left' ? fieldW : 0,
                y: fieldH / 2
            };
        }

        function updateGoalie(goaliePos) {
            var runDir = 0;
            var runSpeed = 3; 
            if (dist(goaliePos, goalPos()) > 15) {
                runDir = dir(goaliePos, goalPos());
                console.log(runDir);
            } else {
                runSpeed = 0;
            }
            return {
                runDir: runDir,
                runSpeed: runSpeed,
                kickDir: Math.PI/4,
                kickSpeed: 15
            };
        }

        function getBestKickDir(playerPos, opponentsPos, goalPos) {
            var goalDir = -dir(playerPos, goalPos);
            var badIdea = false;
            opponentsPos.forEach(function(opponentPos) {
                var opponentDir = dir(playerPos, opponentPos);
                if (Math.abs(opponentDir - goalDir) < 0.2) {
                    badIdea = true;
                }
            });
            if (badIdea) {
                // pass to fellow player
            } else {
                // shoot at goal
                return goalDir;
            }
        }

        var playerDirs = [{}, {}, {}, {}];
        var runDir = this.side === 'left' ? 0 : Math.PI;
        var side = this.side;
        var fieldW = this.fieldW; 
        var fieldH = this.fieldH;        

        // Player 0 is goal keeper
        playerDirs[0] = updateGoalie(playersPos[0]);

        // Find player closest to ball
        var minDist = 99999;
        var bestPlayerIndex = 3;
        playersPos.forEach(function(player, index) {
            var playerBallDist = dist(player, ball);
            if (playerBallDist < minDist) {
                minDist = playerBallDist;
                bestPlayerIndex = index;
                console.log('best player is ' + bestPlayerIndex);
            }    
        });

        playerDirs[bestPlayerIndex] = {
                runDir: dir(playersPos[bestPlayerIndex], ball),
                runSpeed: 3,
                kickDir: getBestKickDir(playersPos[bestPlayerIndex], opponentsPos, goalPos()),
                kickSpeed: 15
            }

        playersPos.forEach(function(player, index) {
            if (index != 0 && index != bestPlayerIndex) {
                playerDirs[index] = {
                    runDir: runDir,
                    runSpeed: 3,
                    kickDir: runDir,
                    kickSpeed: 4
                };
            }
        });
        return playerDirs;
    }

    return FcMowgli;
};
