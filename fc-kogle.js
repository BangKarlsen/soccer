function createFcKogle() {
    function FcKogle(side, fieldW, fieldH) {
        this.side = side;
        this.fieldW = fieldW;
        this.fieldH = fieldH;
        this.name = 'FC Kogle';
        this.color = 'orange';
        console.log('Created ' + this.color + ' team: ' + this.name);
    }

    FcKogle.prototype.tick = function (players, opponents, ball) {
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

        function findClosestPlayerToBall(players, ball) {
            var minDist = 9999;
            var closestPlayer;
            players.forEach(function (player) {
                var distPlayerBall = dist(player, ball);
                if (distPlayerBall < minDist) {
                    minDist = distPlayerBall;
                    closestPlayer = player;
                }
            });
            if (!closestPlayer) {
                console.log('No closests player found. is ball ok?');
            }
            return closestPlayer;
        }

        function isClosestsPlayerToBall(player, players, ball) {
            return player.name === findClosestPlayerToBall(players, ball).name;
        }

        function addNames(players) {
            players.forEach(function (player, index) {
                player.name = '' + index;
            });
        }

        function updateGoalie(goalie, ball) {
            var goaldir;
            var runDir;
            var runSpeed = 3;
            if (dist(goalie, ball) < 100) {
                // run to ball and kick it away
                runDir = dir(goalie, ball);
            } else if (dist(goalie, goalPos()) > 15) {
                runDir = dir(goalie, goalPos());
            } else {
                runSpeed = 0;
            }
            return {
                runDir: runDir,
                runSpeed: runSpeed,
                kickDir: Math.PI,
                kickSpeed: 15
            };
        }

        var side = this.side;
        var fieldW = this.fieldW;
        var fieldH = this.fieldH;
        // addNames(players);
        players.forEach(function (player, index) {
            players[index] = {
                x: player.x,
                y: player.y,
                runDir: dir(player, goalPos()),
                runSpeed: 3,
                kickDir: Math.PI,
                kickSpeed: 15
            };
        });
        players[1] = updateGoalie(players[1], ball);
        return players;
    }

    return FcKogle;
}
