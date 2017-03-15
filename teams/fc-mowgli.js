function defineFcMowgli() {
    function FcMowgli(side, field) {
        this.side = side;
        this.field = field;
        this.name = 'FC Mowgli';
        this.color = 'lightblue';
        console.log('Created ' + this.color + ' team: ' + this.name);
    }

    FcMowgli.prototype.tick = function (players, opponents, ball) {
        function dist(a, b) {
            return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
        }

        function dir(from, to) {
            return -Math.atan2(to.y - from.y, to.x - from.x);
        }

        function goalPos() {
            return {
                x: side === 'left' ? 0 : field.w,
                y: field.h / 2
            };
        }

        function opponentGoalPos() {
            return {
                x: side === 'left' ? field.w : 0,
                y: field.h / 2
            };
        }

        function updateGoalie(goalie) {
            var runDir = 0;
            var runSpeed = 3;
            if (dist(goalie, goalPos()) > 15) {
                runDir = dir(goalie, goalPos());
            } else {
                runSpeed = 0;
            }
            return {
                runDir: runDir,
                runSpeed: runSpeed,
                kickDir: Math.PI / 4,
                kickSpeed: 15
            };
        }

        function getBestKick(players, opponents, goalPos) {
            var goalDir = dir(players, goalPos);
            var badIdea = false;
            opponents.forEach(function (opponent) {
                var opponentDir = dir(players, opponent);
                if (Math.abs(opponentDir - goalDir) < 0.2 && dist(players, opponent) < 40) {
                    badIdea = true;
                }
            });
            if (badIdea) {
                // should pass to fellow player
                return { dir: goalDir - 0.9, speed: 10 };
            } else {
                // shoot at goal
                return { dir: goalDir, speed: 15 };
            }
        }

        var runDir = this.side === 'left' ? 0 : Math.PI;
        var side = this.side;
        var field = {
            w: this.field.w,
            h: this.field.h
        };

        // Player 0 is goal keeper
        players[0] = updateGoalie(players[0]);

        // Find player closest to ball
        var minDist = 99999;
        var bestPlayerIndex = 3;
        players.forEach(function (player, index) {
            var playerBallDist = dist(player, ball);
            if (playerBallDist < minDist) {
                minDist = playerBallDist;
                bestPlayerIndex = index;
            }
        });
        var bestKick = getBestKick(players[bestPlayerIndex], opponents, opponentGoalPos());
        players[bestPlayerIndex] = {
            runDir: dir(players[bestPlayerIndex], ball),
            runSpeed: 3,
            kickDir: bestKick.dir,
            kickSpeed: bestKick.speed
        }

        players.forEach(function (player, index) {
            if (index != 0 && index != bestPlayerIndex) {
                players[index] = {
                    runDir: runDir,
                    runSpeed: 2,
                    kickDir: runDir,
                    kickSpeed: 4
                };
            }
        });
        return players;
    }

    return FcMowgli;
};
