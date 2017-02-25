
var lastTime = 0;

function run() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        // xRot += (xSpeed * elapsed) / 1000.0;
        // yRot += (ySpeed * elapsed) / 1000.0;
        game.tick(elapsed);
    }
    lastTime = timeNow;
    requestAnimationFrame(run);
}

function createNewGame() {
    var leftTeam = eval(leftTeamSelect.value)();    // Yikes, it's the evil eval!
    var rightTeam = eval(rightTeamSelect.value)();  // Be careful not to eval user-submitted input..
    game = new Soccer(leftTeam, rightTeam);
}

var game;
var leftTeamSelect = document.getElementById('left-team');
var rightTeamSelect = document.getElementById('right-team');
leftTeamSelect.addEventListener('change', createNewGame);
rightTeamSelect.addEventListener('change', createNewGame);
createNewGame();
run();
