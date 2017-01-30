
function Soccer() {
    console.log('im here.');
};

Soccer.prototype.init = function() {
    var canvas = document.getElementById('field');
    var ctx = canvas.getContext('2d');
    
    var goal = { 
        w: 40, 
        h: 90
    };
    var field = { 
        w: canvas.getAttribute('width') - 20, 
        h: canvas.getAttribute('height') - 20,
        x: 10,
        y: 10
    };

    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, field.w + 20, field.h + 20);                 // green grass
    ctx.strokeStyle = 'white';
    ctx.strokeRect(field.x, field.y, field.w, field.h);             // field outline
    ctx.strokeRect(field.x + field.w/2 - 1, field.y, 2, field.h);   // center line
    ctx.strokeRect(field.x, (field.h + 20)/2 - goal.h/2, goal.w, goal.h);  // left goal
    ctx.strokeRect(field.w + field.x - goal.w, (field.h + 20)/2 - goal.h/2, goal.w, goal.h);  // right goal
}

var game = new Soccer();

game.init();
