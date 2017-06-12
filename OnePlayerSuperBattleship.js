$(document).ready(function () {
     
    var game = new SuperBattleship();
    var player_one = new GamePlayer(game, $('#CLI'),
            $('#output'), $('#shootAt'), $('#fleet'), $('#move_backward'), $('#move_forward'), $('#rotate_cw'), $('#rotate_ccw'), $('#map_view'), true);
//    game, cli_input, cli_output, shootAt, fleet, move_backward, move_forward, rotate_cw, rotate_ccw, map_view is_player_one
    var ai_player_two = new DumbAI(game, false);
    game.startGame();
});