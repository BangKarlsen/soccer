
function Soccer() {
    var canvas = document.getElementById('field');
    this.ctx = canvas.getContext('2d');
    this.field = { 
        x: 10,
        y: 10,
        w: canvas.getAttribute('width') - 20, 
        h: canvas.getAttribute('height') - 20,
        wPad: canvas.getAttribute('width'),
        hPad: canvas.getAttribute('height')
    };
    this.goal = { 
        w: 40, 
        h: 90
    };
    this.ball = {
        x: this.field.w/2,
        y: this.field.h/2,
        dir: 0,
        speed: 0
    };

    // Find a better way to instatiate teams... hm.
    var t1 = createFcMowgli();
    var t2 = createFcKogle();
    this.team1 = new t1('1', 'left');
    this.team2 = new t2('2', 'right');

    this.playersPosTeam1 = [{x: 200, y: 100}, {x: 200, y: 200}, {x: 200, y: 300}, {x: 200, y: 350}];
    this.playersPosTeam2 = [{x: 500, y: 100}, {x: 500, y: 200}, {x: 500, y: 300}, {x: 500, y: 350}];
};

Soccer.prototype.draw = function() {
    var field = this.field;
    var goal = this.goal;
    var ball = this.ball;
    var ctx = this.ctx;
    
    function drawField() {
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, field.wPad, field.hPad);                          // green grass
        ctx.strokeStyle = 'white';
        ctx.strokeRect(field.x, field.y, field.w, field.h);                  // field outline
        ctx.strokeRect(field.x + field.w/2 - 1, field.y, 2, field.h);        // center line
        ctx.strokeRect(field.x, (field.hPad)/2 - goal.h/2, goal.w, goal.h);  // left goal
        ctx.strokeRect(field.w + field.x - goal.w, (field.hPad)/2 - goal.h/2, goal.w, goal.h);  // right goal
    }
    
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 7, 0, Math.PI*2);
        ctx.fillStyle = 'grey';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    function drawPlayerPos(player) {
        ctx.beginPath();
        ctx.arc(player.x, player.y, 10, 0, Math.PI*2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    drawField();
    drawBall();
    this.playersPosTeam1.forEach(drawPlayerPos);
    this.playersPosTeam2.forEach(drawPlayerPos);
};

Soccer.prototype.tick = function(time) {
    function dist(a, b) {
        return Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
    };
    var kicked = false;
    var ball = this.ball;
    var posTeam1 = this.playersPosTeam1;
    var playerDirsTeam1 = this.team1.tick(this.playersPosTeam1, this.playersPosTeam2);
    playerDirsTeam1.forEach(function(playerDir, index) {
        var playerPos = posTeam1[index]; 
        playerPos.x += Math.cos(-playerDir.runDir) * playerDir.runSpeed; // consider integrating over time
        playerPos.y += Math.sin(-playerDir.runDir) * playerDir.runSpeed; // to be independent of refreshRate

        if (dist(playerPos, ball) < 10) {
            kicked = true;
            ball.dir = playerDir.kickDir;
            ball.speed = playerDir.kickSpeed;
        }
    });

    var posTeam2 = this.playersPosTeam2;
    var playerDirsTeam2 = this.team2.tick(this.playersPosTeam2, this.playersPosTeam1);
    playerDirsTeam2.forEach(function(playerDir, index) {
        var playerPos = posTeam2[index];
        playerPos.x += Math.cos(-playerDir.runDir) * playerDir.runSpeed; // consider integrating over time
        playerPos.y += Math.sin(-playerDir.runDir) * playerDir.runSpeed; // to be independent of refreshRate

        if (dist(playerPos, ball) < 10) {
            kicked = true;
            ball.dir = playerDir.kickDir;
            ball.speed = playerDir.kickSpeed;
        }
    });

    ball.speed *= 0.9;
    ball.x += Math.cos(-ball.dir) * ball.speed;
    ball.y += Math.sin(-ball.dir) * ball.speed;

    this.draw();
};

var game = new Soccer();
var now;

function run(timestamp) {
    var refreshRate = 10; // millis
    var interval = timestamp - now;
    if (!now) {
        now = timestamp;
    }
        
    if (interval > refreshRate) {    
        now = timestamp;
        game.tick(timestamp);
    }
    window.requestAnimationFrame(run);
}

window.requestAnimationFrame(run);