function Team(name) {
    this.name = name;
    console.log('Create team: ' + name);
}

Team.prototype.init = function(players) {
    console.log('building up team ' + this.name);
    // setup our initial team formation
    for(var i = 0; i < 4; i++) {
        players[i].x = 100;
        players[i].y = 400 / (i+1);
    }
};

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
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(0, 0, field.w + 20, field.h + 20);                 // green grass
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeRect(field.x, field.y, field.w, field.h);             // field outline
    this.ctx.strokeRect(field.x + field.w/2 - 1, field.y, 2, field.h);   // center line
    this.ctx.strokeRect(field.x, (field.h + 20)/2 - goal.h/2, goal.w, goal.h);  // left goal
    this.ctx.strokeRect(field.w + field.x - goal.w, (field.h + 20)/2 - goal.h/2, goal.w, goal.h);  // right goal
};

Soccer.prototype.init = function() {
    this.team1.init(this.playersTeam1);
    this.team2.init(this.playersTeam2);
    this.draw();
}

Soccer.prototype.tick = function(time) {
    // console.log();
    // var players = team.tick(players, opponents, ball);
    this.draw();
};

var game = new Soccer();
game.init();

var start;
function run(timestamp) {
    if (!start) start = timestamp;
    var interval = timestamp - start;
    if (interval > 100) {
        start = timestamp;
        game.tick(timestamp);
    }
    window.requestAnimationFrame(run);
}

window.requestAnimationFrame(run);