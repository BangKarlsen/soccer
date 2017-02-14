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

        function isClosestsToBall(player, players, ball) {
            return player.role === findClosestPlayerToBall(players, ball).role;
        }

        function setupRoles(players) {
            var roles = {
                'goalie': players[0],
                'center': players[1],
                'attacker': players[2],
                'defender': players[3]
            }
            players[0].role = 'goalie';
            players[1].role = 'center';
            players[2].role = 'attacker';
            players[3].role = 'defender';
            return roles;
        }

        function findBestRecieverDir(goalie, players) {
            return Math.PI;
        }

        function updateGoalie(goalie, players, ball) {
            var goaldir;
            var runDir;
            var runSpeed = 3;
            var kickDir;
            if (dist(goalie, ball) < 100 && isClosestsToBall(goalie, players, ball)) {
                // run to ball and kick it away
                runDir = dir(goalie, ball);
                // kick it to player
                kickDir = findBestRecieverDir(goalie, players);
            } else if (dist(goalie, goalPos()) > 20) {
                runDir = dir(goalie, goalPos());
            } else {
                runSpeed = 0;
            }
            return {
                runDir: runDir,
                runSpeed: runSpeed,
                kickDir: kickDir,
                kickSpeed: 15
            };
        }

        function updateDefender(defender, players, ball, closestsToBall) {
            var runDir;
            var runSpeed = 3;
            var defendSpot = { x: 550, y: fieldH / 2 };
            if (isClosestsToBall(defender, players, ball)) {
                // run to ball and kick it away
                runDir = dir(defender, ball);
                // kick it to player
                // find good kick dir..
            } else if(dist(defender, defendSpot) > 30) {
                runDir = dir(defender, defendSpot);
                runSpeed = 3;
            } else {
                runDir = dir(defender, defendSpot);
                runSpeed = 0.5;
            }
            return {
                runDir: runDir,
                runSpeed: runSpeed,
                kickDir: Math.PI,
                kickSpeed: 15
            };
        }

        function isOpponentBlocking(player, reciever, opponents) {
            var blocked = false;
            var recieverDir = dir(player, reciever);
            opponents.forEach(function (opponent) {
                var opponentDir = dir(players, opponent);
                if (Math.abs(opponentDir - recieverDir) < 0.2 && dist(player, opponent) < dist(player, reciever)) {
                    blocked = true;
                    console.log(player.role + ' is blocked trying to pass to ' + reciever.role);
                }
            });
        }

        function updateCenter(center, players, opponents, ball) {
            var runDir;
            var runSpeed = 3;
            var kickDir = Math.PI;
            var cSpot = { 
                x: fieldW / 2,
                y: ball.y < fieldH / 2 ? fieldH / 3 : fieldH - fieldH / 3 
            };
            var attacker = roles['attacker'];
            if (isClosestsToBall(center, players, ball)) {
                // run to ball and kick it away
                runDir = dir(center, ball);
                if(!isOpponentBlocking(center, attacker, opponents)) {
                    if (attacker.x < center.x) {
                        kickDir = dir(center, attacker);
                    }
                }
            } else if(dist(center, cSpot) > 30) {
                runDir = dir(center, cSpot);
                runSpeed = 3;
            } else {
                runDir = dir(center, cSpot);
                runSpeed = 1;
            }
            return {
                runDir: runDir,
                runSpeed: runSpeed,
                kickDir: kickDir,
                kickSpeed: 15
            };

        }

        var side = this.side;
        var fieldW = this.fieldW;
        var fieldH = this.fieldH;
        players.forEach(function (player, index) {
            players[index] = {
                x: player.x,
                y: player.y,
                runDir: dir(player, ball),
                runSpeed: 3,
                kickDir: dir(player, opponentGoalPos()),
                kickSpeed: 15
            };
        });
        var roles = setupRoles(players);
        players[0] = updateGoalie(players[0], players, ball);
        players[1] = updateDefender(players[1], players, ball);
        players[3] = updateCenter(players[3], players, opponents, ball);
        return players;
    }

    return FcKogle;
}
