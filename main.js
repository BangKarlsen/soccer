(function () {
    function run(timeNow) {
        if(timeNow) {
            var elapsed = timeNow - lastTime;
            lastTime = timeNow;
            game.tick(elapsed);
        }
        requestAnimationFrame(run);
    }

    function createNewGame() {
        var leftTeam = eval(leftTeamSelect.value)();    // Yikes, it's the evil eval!
        var rightTeam = eval(rightTeamSelect.value)();  // Be careful not to eval user-submitted input..
        game = new Soccer(leftTeam, rightTeam);
    }

    var lastTime = 0;
    var game;
    var leftTeamSelect = document.getElementById('left-team');
    var rightTeamSelect = document.getElementById('right-team');
    leftTeamSelect.addEventListener('change', createNewGame);
    rightTeamSelect.addEventListener('change', createNewGame);
    
    createNewGame();
    run();
}())
