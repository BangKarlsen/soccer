
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
    var ctx = this.ctx;
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, field.wPad, field.hPad);                     // green grass
    ctx.strokeStyle = 'white';
    ctx.strokeRect(field.x, field.y, field.w, field.h);             // field outline
    ctx.strokeRect(field.x + field.w/2 - 1, field.y, 2, field.h);   // center line
    ctx.strokeRect(field.x, (field.hPad)/2 - goal.h/2, goal.w, goal.h);  // left goal
    ctx.strokeRect(field.w + field.x - goal.w, (field.hPad)/2 - goal.h/2, goal.w, goal.h);  // right goal

    this.playersPosTeam1.forEach(drawPlayerPos);
    this.playersPosTeam2.forEach(drawPlayerPos);

    function drawPlayerPos(player) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(player.x, player.y, 5, 0, Math.PI*2);
        ctx.fill();
    }
};

Soccer.prototype.tick = function(time) {
    var posTeam1 = this.playersPosTeam1;
    var playerDirsTeam1 = this.team1.tick(this.playersPosTeam1, this.playersPosTeam2);
    playerDirsTeam1.forEach(function(playerDir, index) {
        posTeam1[index].x += Math.cos(-playerDir.runDir) * playerDir.runSpeed; // consider integrating over time
        posTeam1[index].y += Math.sin(-playerDir.runDir) * playerDir.runSpeed; // to be independent of refreshRate
    });
    var posTeam2 = this.playersPosTeam2;
    var playerDirsTeam2 = this.team2.tick(this.playersPosTeam2, this.playersPosTeam1);
    playerDirsTeam2.forEach(function(playerDir, index) {
        posTeam2[index].x += Math.cos(-playerDir.runDir) * playerDir.runSpeed; // consider integrating over time
        posTeam2[index].y += Math.sin(-playerDir.runDir) * playerDir.runSpeed; // to be independent of refreshRate
    });
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