/// <reference path="./Game.ts" />

var cnt = 0;
function animate() {
    cnt++;

    requestAnimationFrame(animate);

    if (cnt % 2) {
        //_update();
        Game.getInstance().update();
        //_draw();
        Game.getInstance().draw();
    }
}


window.onload = () => {
    Game.getInstance().initialize();
    //game = new Game();  
    animate();
};


