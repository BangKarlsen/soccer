function Soccer(leftTeam, rightTeam) {
    var canvas = document.getElementById('field');
    this.ctx = canvas.getContext('2d');
    this.field = {
        w: canvas.getAttribute('width'),
        h: canvas.getAttribute('height')
    };
    this.goal = {
        w: 40,
        h: 90
    };
    this.ball = {
        x: this.field.w / 2,
        y: this.field.h / 2,
        dir: 0,
        speed: 0,
        timesKicked: 0
    };
    this.score = {
        left: 0,
        right: 0
    };
    this.players = {
        left: [{ x: 200, y: 100 }, { x: 200, y: 200 }, { x: 200, y: 300 }, { x: 200, y: 350 }],
        right: [{ x: 500, y: 100 }, { x: 500, y: 200 }, { x: 500, y: 300 }, { x: 500, y: 350 }]
    };

    this.team1 = new leftTeam('left', this.field.w, this.field.h);
    this.team2 = new rightTeam('right', this.field.w, this.field.h);
};

Soccer.prototype.draw = function () {
    function drawField(ctx, field, goal) {
        var gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0.5, 'green');
        gradient.addColorStop(1, 'darkgreen');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, field.w, field.h);                                   // field grass
        ctx.strokeStyle = 'white';
        ctx.strokeRect(0, 0, field.w, field.h);                                 // field outline
        ctx.strokeRect(field.w / 2 - 1, 0, 2, field.h);                           // center line
        ctx.strokeRect(0, field.h / 2 - goal.h / 2, goal.w, goal.h);                // left goal
        ctx.strokeRect(field.w - goal.w, field.h / 2 - goal.h / 2, goal.w, goal.h); // right goal
    }

    function drawBall(ctx, ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'grey';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    function drawTeam(ctx, team, players) {
        var drawPlayerNumber = false;
        players.forEach(function (player, index) {
            ctx.fillStyle = team.color;
            ctx.beginPath();
            ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();
            if (drawPlayerNumber) {
                // ctx.beginPath();
                // ctx.lineTo( Math.cos(-player.runDir) * player.runSpeed,  Math.sin(-player.runDir) * player.runSpeed);
                // ctx.strokeStyle = 'red';
                // ctx.stroke();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'white';
                ctx.fillText(index, player.x, player.y - 1);
            }
        });
    }

    drawField(this.ctx, this.field, this.goal);
    drawBall(this.ctx, this.ball);
    drawTeam(this.ctx, this.team1, this.players[this.team1.side]);
    drawTeam(this.ctx, this.team2, this.players[this.team2.side]);
};

Soccer.prototype.tick = function (timestep) {
    function dist(a, b) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }

    function clipPlayer(player, field) {
        player.x = Math.max(0, player.x);
        player.x = Math.min(field.w, player.x);
        player.y = Math.max(0, player.y);
        player.y = Math.min(field.h, player.y);
    }

    function copyPlayer(player, updatedPlayer) {
        player.runSpeed = updatedPlayer.runSpeed;
        player.runDir = updatedPlayer.runDir;
        player.kickDir = updatedPlayer.kickDir;
        player.kickSpeed = updatedPlayer.kickSpeed;
    }

    function repectSpeedlimits(player) {
        player.runSpeed = Math.max(player.runSpeed, 0);
        player.runSpeed = Math.min(player.runSpeed, 3);
        player.kickSpeed = Math.max(player.kickSpeed, 0);
        player.kickSpeed = Math.min(player.kickSpeed, 15);
    }

    function updatePosition(player, timestep) {
        var speedFix = 0.06;
        var variation = Math.min(Math.random() + 0.04, 1);
        player.runDir = player.runDir || 0;
        player.runSpeed = player.runSpeed || 0;
        player.x += Math.cos(-player.runDir) * player.runSpeed * variation * timestep * speedFix;
        player.y += Math.sin(-player.runDir) * player.runSpeed * variation * timestep * speedFix;
    }

    function kickBall(player, ball) {
        if (dist(player, ball) < 15) {
            ball.timesKicked++;
            ball.dir = player.kickDir;
            ball.speed = player.kickSpeed;
        }
    }

    function updateTeam(team, players, opponents, ball, field, timestep) {
        var updatedPlayers = team.tick(players.slice(), opponents.slice(), { x: ball.x, y: ball.y });
        updatedPlayers.forEach(function (updatedPlayer, index) {
            var player = players[index];
            copyPlayer(player, updatedPlayer);
            repectSpeedlimits(player);
            updatePosition(player, timestep);
            clipPlayer(player, field);
            kickBall(player, ball);
        });
    }

    function updateBall(ball, timestep) {
        var speedFix = 0.06;
        if (ball.timesKicked > 1) {
            ball.dir = Math.random() * Math.PI * 2;
        }
        ball.timesKicked = 0;
        ball.speed = Math.max(ball.speed, 0);
        ball.speed = Math.min(ball.speed, 15);
        ball.s
        ball.x += Math.cos(-ball.dir) * ball.speed * timestep * speedFix;
        ball.y += Math.sin(-ball.dir) * ball.speed * timestep * speedFix;
        ball.speed *= 0.9;
    }

    function clipBallPos(ball, field) {
        ball.x = Math.max(0, ball.x);
        ball.x = Math.min(field.w, ball.x);
        ball.y = Math.max(10, ball.y);
        ball.y = Math.min(field.h, ball.y);
    }

    function checkScores(ball, field, goal) {
        var scoringTeam;
        var goalLine = {
            start: field.h / 2 - goal.h / 2,
            end: field.h / 2 - goal.h / 2 + goal.h
        };
        var isInGoal = ball.y > goalLine.start && ball.y < goalLine.end;
        if (ball.x < 0 && isInGoal) {
            scoringTeam = 'right';
        } else if (ball.x > field.w && isInGoal) {
            scoringTeam = 'left';
        } else {
            clipBallPos(ball, field);
        }
        return scoringTeam;
    }

    function resetPlayer(player, xPos, yPos) {
        player.x = xPos;
        player.y = yPos;
        player.runDir = 0;
        player.runSpeed = 0;
        player.kickDir = 0;
        player.kickSpeed = 0;
    }

    function resetTeam(players, distCenterLine) {
        players.forEach(function (player, index) {
            resetPlayer(player, distCenterLine, 50 + index * 100);
        });
    }

    /* uh, much hardcoded stuff going on here.. */
    function resetTeams(scoringTeam, players, ball) {
        ball.x = 350;
        ball.y = 200;
        ball.speed = 0;
        if (scoringTeam === 'left') {
            resetTeam(players.right, 360);
            resetTeam(players.left, 150);
        } else {
            resetTeam(players.right, 550);
            resetTeam(players.left, 340);
        }
    }

    function updateScores(score, players, ball, field, goal) {
        var scoringTeam = checkScores(ball, field, goal);
        if (scoringTeam) {
            score[scoringTeam]++;
            console.log('Score is now ' + score.left + ' - ' + score.right + ' (' + scoringTeam + ' scored)');
            resetTeams(scoringTeam, players, ball);
        }
    }

    updateTeam(this.team1, this.players[this.team1.side], this.players[this.team2.side], this.ball, this.field, timestep);
    updateTeam(this.team2, this.players[this.team2.side], this.players[this.team1.side], this.ball, this.field, timestep);
    updateBall(this.ball, timestep);
    updateScores(this.score, this.players, this.ball, this.field, this.goal);

    this.draw();
};
