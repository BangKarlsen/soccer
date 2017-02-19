
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

function createNewGame() {
    var leftTeam = eval(leftTeamSelect.value)();    // Yikes, it's the notorious eval!
    var rightTeam = eval(rightTeamSelect.value)();  // Evaluate the string and invoke the returned function
    game = new Soccer(leftTeam, rightTeam);
}

var lastTime;
var game;
var leftTeamSelect = document.getElementById('left-team');
var rightTeamSelect = document.getElementById('right-team');

leftTeamSelect.addEventListener('change', createNewGame);
rightTeamSelect.addEventListener('change', createNewGame);
createNewGame();
run();
