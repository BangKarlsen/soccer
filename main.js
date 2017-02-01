function Team(name, side) {
    this.name = name;
    this.side = side;
    console.log('Created ' + side + ' team: ' + name);
}

Team.prototype.tick = function(playersPos, opponents, ball) {
    var playerDirs = [];
    playersPos.forEach(function(player) {
        // ignore positions and just run
        playerDirs.push({
            // runDir: Math.random() * Math.PI * 2,
            runDir: 0,
            runSpeed: Math.random() * 3
        });
    });
    return playerDirs;
}


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

    this.team1 = new Team('1', 'left');
    this.team2 = new Team('2', 'right');
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
    var i = 0;
    playerDirsTeam1.forEach(function(playerDir) {
        posTeam1[i].x += Math.cos(-playerDir.runDir) * playerDir.runSpeed;
        posTeam1[i].y += Math.sin(-playerDir.runDir) * playerDir.runSpeed;
        i++;
    });
    this.draw();
};

var game = new Soccer();
var start;

function run(timestamp) {
    var refreshRate = 10; // millis

    if (!start) start = timestamp;
    var interval = timestamp - start;
    if (interval > refreshRate) {    
        start = timestamp;
        game.tick(timestamp);
    }
    window.requestAnimationFrame(run);
}

window.requestAnimationFrame(run);