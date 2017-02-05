
function Soccer() {
    var canvas = document.getElementById('field');
    this.ctx = canvas.getContext('2d');
    this.field = { 
        w: canvas.getAttribute('width'), 
        h: canvas.getAttribute('height'),
    };
    this.goal = { 
        w: 40, 
        h: 90
    };
    this.ball = {
        x: this.field.w/2,
        y: this.field.h/2,
        dir: 0,
        speed: 0,
        timesKicked: 0
    };
    this.score = {
        left: 0,
        right: 0
    };

    // Find a better way to instatiate teams... hm.
    var t1 = createFcMowgli();
    var t2 = createFcKogle();
    this.team1 = new t1('left', this.field.w, this.field.h);
    this.team2 = new t2('right', this.field.w, this.field.h);

    this.playersPosTeam1 = [{x: 200, y: 100}, {x: 200, y: 200}, {x: 200, y: 300}, {x: 200, y: 350}];
    this.playersPosTeam2 = [{x: 500, y: 100}, {x: 500, y: 200}, {x: 500, y: 300}, {x: 500, y: 350}];
};

Soccer.prototype.draw = function() {
    function drawField(ctx, field, goal) {
        var gradient = ctx.createLinearGradient(0, 0, 0, 600);
        gradient.addColorStop(0.5, 'green');
        gradient.addColorStop(1, 'darkgreen');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, field.w, field.h);                                   // field grass
        ctx.strokeStyle = 'white';              
        ctx.strokeRect(0, 0, field.w, field.h);                                 // field outline
        ctx.strokeRect(field.w/2 - 1, 0, 2, field.h);                           // center line
        ctx.strokeRect(0, field.h/2 - goal.h/2, goal.w, goal.h);                // left goal
        ctx.strokeRect(field.w - goal.w, field.h/2 - goal.h/2, goal.w, goal.h); // right goal
    }
    
    function drawBall(ctx, ball) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 7, 0, Math.PI*2);
        ctx.fillStyle = 'grey';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    function drawTeam(ctx, team, teamPositions) {
        ctx.fillStyle = team.color;
        teamPositions.forEach(function (player) {
            ctx.beginPath();
            ctx.arc(player.x, player.y, 10, 0, Math.PI*2);
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();
        });
    }

    drawField(this.ctx, this.field, this.goal);
    drawBall(this.ctx, this.ball);
    drawTeam(this.ctx, this.team1, this.playersPosTeam1);
    drawTeam(this.ctx, this.team2, this.playersPosTeam2);
};

Soccer.prototype.tick = function(time) {
    function dist(a, b) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }

    function clipPlayerPos(playerPos, field) {
        playerPos.x = Math.max(0, playerPos.x);
        playerPos.x = Math.min(field.w, playerPos.x);
        playerPos.y = Math.max(0, playerPos.y);
        playerPos.y = Math.min(field.h, playerPos.y);
    }

    function updateTeam(team, teamPositions, opponentsPositions, ball, field) {
        var teamDirs = team.tick(teamPositions.slice(), opponentsPositions.slice(), { x: ball.x, y: ball.y });
        teamDirs.forEach(function(playerDir, index) {
            var variation = Math.min(Math.random() + 0.04, 1);
            var playerPos = teamPositions[index];
            playerDir.speed = Math.max(playerDir.speed, 0);
            playerDir.speed = Math.min(playerDir.speed, 3);
            playerPos.x += Math.cos(-playerDir.runDir) * playerDir.runSpeed * variation; // consider integrating over time
            playerPos.y += Math.sin(-playerDir.runDir) * playerDir.runSpeed * variation; // to be independent of refreshRate
            clipPlayerPos(playerPos, field);
            if (dist(playerPos, ball) < 10) {
                ball.timesKicked++;
                ball.dir = playerDir.kickDir;
                ball.speed = playerDir.kickSpeed;
            }
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
            start: field.h/2 - goal.h/2,
            end: field.h/2 - goal.h/2 + goal.h
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

    function resetTeams(playersPosTeam1, playersPosTeam2, ball) {
        ball.x = 350;
        ball.y = 200;
        ball.speed = 0;
        playersPosTeam1.forEach(function (playerPos, index) {
            playerPos.x = 200;
            playerPos.y = 50 + index * 100;
        });
        playersPosTeam2.forEach(function (playerPos, index) {
            playerPos.x = 500;
            playerPos.y = 50 + index * 100;
        });
    }

    function updateScore(scoringTeam, score, playersPosTeam1, playersPosTeam2, ball) {
        if (scoringTeam) {
            score[scoringTeam]++;
            console.log('Score is now ' + score.left + ' - ' + score.right + ' (' + scoringTeam + ' scored)');
            resetTeams(playersPosTeam1, playersPosTeam2, ball);
        }
    }

    var scoringTeam;
    updateTeam(this.team1, this.playersPosTeam1, this.playersPosTeam2, this.ball, this.field);
    updateTeam(this.team2, this.playersPosTeam2, this.playersPosTeam1, this.ball, this.field);
    updateBall(this.ball);
    scoringTeam = checkScores(this.ball, this.field, this.goal);
    updateScore(scoringTeam, this.score, this.playersPosTeam1, this.playersPosTeam2, this.ball);
    
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
