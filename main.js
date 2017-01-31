function Team(name) {
    this.name = name;
    console.log('Create team: ' + name);
}

Team.prototype.init = function(players, side) {
    console.log('building up team ' + this.name);
    // setup our initial team formation
    for(var i = 0; i < 4; i++) {
        players[i].x = side === 'left' ? 100 : 450;
        players[i].y = 400 / (i+1);
    }
};

Team.prototype.tick = function(players, opponents, ball) {
    players.forEach(function(player) {
        player.x += 1;
    });
}

function Player() {
    this.x = 0;
    this.y = 0;
    this.dir = 0;
};

function Soccer() {
    this.team1 = new Team('1');
    this.team2 = new Team('2');
    this.playersTeam1 = [new Player(), new Player(), new Player(), new Player()];
    this.playersTeam2 = [new Player(), new Player(), new Player(), new Player()];
    var canvas = document.getElementById('field');
    this.ctx = canvas.getContext('2d');
    this.goal = { 
        w: 40, 
        h: 90
    };
    this.field = { 
        w: canvas.getAttribute('width') - 20, 
        h: canvas.getAttribute('height') - 20,
        x: 10,
        y: 10
    };
};

Soccer.prototype.draw = function() {
    var field = this.field;
    var goal = this.goal;
    var ctx = this.ctx;
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, field.w + 20, field.h + 20);                 // green grass
    ctx.strokeStyle = 'white';
    ctx.strokeRect(field.x, field.y, field.w, field.h);             // field outline
    ctx.strokeRect(field.x + field.w/2 - 1, field.y, 2, field.h);   // center line
    ctx.strokeRect(field.x, (field.h + 20)/2 - goal.h/2, goal.w, goal.h);  // left goal
    ctx.strokeRect(field.w + field.x - goal.w, (field.h + 20)/2 - goal.h/2, goal.w, goal.h);  // right goal

    this.playersTeam1.forEach(drawPlayer);
    this.playersTeam2.forEach(drawPlayer);

    function drawPlayer(player) {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(player.x, player.y, 5, 0, Math.PI*2);
        ctx.fill();
    }
};

Soccer.prototype.init = function() {
    this.team1.init(this.playersTeam1, 'left');
    this.team2.init(this.playersTeam2, 'right');
    this.draw();
}

Soccer.prototype.tick = function(time) {
    // console.log(time);
    // var players = team.tick(players, opponents, ball);
    this.team1.tick(this.playersTeam1, this.playersTeam2);
    this.draw();
};

var game = new Soccer();
game.init();

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