
function Soccer() {
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
    this.playersTeam1 = [{ x: 200, y: 100 }, { x: 200, y: 200 }, { x: 200, y: 300 }, { x: 200, y: 350 }];
    this.playersTeam2 = [{ x: 500, y: 100 }, { x: 500, y: 200 }, { x: 500, y: 300 }, { x: 500, y: 350 }];

    // Find a better way to instatiate teams, some kind of dependecy injection..
    var t1 = createFcMowgli();
    var t2 = createFcKogle();
    this.team1 = new t1('left', this.field.w, this.field.h);
    this.team2 = new t2('right', this.field.w, this.field.h);

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
        ctx.fillStyle = team.color;
        players.forEach(function (player) {
            ctx.beginPath();
            ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();
        });
    }

    drawField(this.ctx, this.field, this.goal);
    drawBall(this.ctx, this.ball);
    drawTeam(this.ctx, this.team1, this.playersTeam1);
    drawTeam(this.ctx, this.team2, this.playersTeam2);
};

Soccer.prototype.tick = function (time) {
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

    function updatePosition(player) {
        var variation = Math.min(Math.random() + 0.04, 1);
        player.x += Math.cos(-player.runDir) * player.runSpeed * variation; // consider integrating over time
        player.y += Math.sin(-player.runDir) * player.runSpeed * variation; // to be independent of refreshRate
    }

    function kickBall(player, ball) {
        if (dist(player, ball) < 15) {
            ball.timesKicked++;
            ball.dir = player.kickDir;
            ball.speed = player.kickSpeed;
        }
    }

    function updateTeam(team, players, opponents, ball, field) {
        var updatedPlayers = team.tick(players.slice(), opponents.slice(), { x: ball.x, y: ball.y });
        updatedPlayers.forEach(function (updatedPlayer, index) {
            var player = players[index];
            copyPlayer(player, updatedPlayer);
            repectSpeedlimits(player);
            updatePosition(player);
            clipPlayer(player, field);
            kickBall(player, ball);
        });
    }

    function updateBall(ball, field, goal, score) {
        if (ball.timesKicked > 1) {
            ball.dir = Math.random() * Math.PI * 2;
        }
        ball.timesKicked = 0;
        ball.speed = Math.max(ball.speed, 0);
        ball.speed = Math.min(ball.speed, 15);
        ball.x += Math.cos(-ball.dir) * ball.speed;
        ball.y += Math.sin(-ball.dir) * ball.speed;
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
        if (ball.x < 10 && isInGoal) {
            scoringTeam = 'right';
        } else if (ball.x > field.w && isInGoal) {
            scoringTeam = 'left';
        } else {
            clipBallPos(ball, field);
        }
        return scoringTeam;
    }

    function resetPlayer(player) {
        player.x = 0;
        player.y = 0;
        player.runDir = 0;
        player.runSpeed = 0;
        player.kickDir = 0;
        player.kickSpeed = 0;
    }

    function resetTeams(playersTeam1, playersTeam2, ball) {
        ball.x = 350;
        ball.y = 200;
        ball.speed = 0;
        playersTeam1.forEach(function (player, index) {
            resetPlayer(player);
            player.x = 200;
            player.y = 50 + index * 100;
        });
        playersTeam2.forEach(function (player, index) {
            resetPlayer(player);
            player.x = 500;
            player.y = 50 + index * 100;
        });
    }

    function updateScore(scoringTeam, score, playersTeam1, playersTeam2, ball) {
        if (scoringTeam) {
            score[scoringTeam]++;
            console.log('Score is now ' + score.left + ' - ' + score.right + ' (' + scoringTeam + ' scored)');
            resetTeams(playersTeam1, playersTeam2, ball);
        }
    }

    var scoringTeam;
    updateTeam(this.team1, this.playersTeam1, this.playersTeam2, this.ball, this.field);
    updateTeam(this.team2, this.playersTeam2, this.playersTeam1, this.ball, this.field);
    updateBall(this.ball);
    scoringTeam = checkScores(this.ball, this.field, this.goal);
    updateScore(scoringTeam, this.score, this.playersTeam1, this.playersTeam2, this.ball);

    this.draw();
};

function run(currentTime) {
    var refreshRate = 10; // millis
    var interval = currentTime - lastTime;
    if (!lastTime) {
        lastTime = currentTime;
    }

    if (interval > refreshRate) {
        lastTime = currentTime;
        game.tick(currentTime);
    }
    window.requestAnimationFrame(run);
}

var game = new Soccer();
var lastTime;
window.requestAnimationFrame(run);
