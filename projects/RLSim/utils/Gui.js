function Gui(player, enemy, world) {
    this.gui = new dat.GUI({ autoPlace: false});
    this.gui.closed = true;
    var playerFolder = this.gui.addFolder('Player');
    playerFolder.add(player, 'jumpVelocity', 0, 25);
    var enemyFolder = this.gui.addFolder('Enemy');
    enemyFolder.add(enemy, 'speed', 0, 10);
    var worldFolder = this.gui.addFolder('World');
    worldFolder.add(world, 'delay', 0, 200);
    worldFolder.add(world, 'gravity', -5, 0);
    document.getElementById("guiContainer").appendChild(this.gui.domElement);
}
