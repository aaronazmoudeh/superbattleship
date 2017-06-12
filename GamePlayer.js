var GamePlayer = function(game, cli_input, cli_output, shootAt, fleet, move_backward, move_forward, rotate_cw, rotate_ccw, map_view, is_player_one) {
    
    if (is_player_one) {
	var key = game.registerPlayerOne();
    } else {
	key = game.registerPlayerTwo();
    }
    
    var makeMap = function() {
        var map = $('#map_view');
    for (var i = 0; i < 50; i++) {
        var row = $('<tr></tr>');
        for (var n = 0; n < 50; n++) {
            row.append('<td></td>');
            }
        map.append(row);
        }
    }

    makeMap();
    
    cli_output = $(cli_output);
    cli_input = $(cli_input);
    shootAt = $(shootAt);
    fleet = $(fleet);
    arrowKeys = $(document);
    move_backward = $(move_backward);
    move_forward = $(move_forward);
    rotate_cw = $(rotate_cw);
    rotate_cww = $(rotate_ccw);
    boardShoot = $('td');
//    map_view = $(map_view);
    
    var eventLogHandler = function(e) {
	var cli_msg = $('<div class="cli_msg"></div>');
	
	switch (e.event_type) {
	case SBConstants.TURN_CHANGE_EVENT:
	    if (e.who == SBConstants.PLAYER_ONE) {
		cli_msg.text("Player one's turn (count = " + game.getTurnCount() + ")");
	    } else {
		cli_msg.text("Player two's turn (count = " + game.getTurnCount() + ")");
	    }
	    break;
	case SBConstants.MISS_EVENT:
	    cli_msg.text("Miss event at (" + e.x + ", " + e.y + ")");
	    break;
	case SBConstants.HIT_EVENT:
	    cli_msg.text("Hit event at (" + e.x + ", " + e.y + ")");
	    break;
	case SBConstants.SHIP_SUNK_EVENT:
	    var ship = e.ship;
	    if (ship.isMine(key)) {
		var pos = ship.getPosition(key);
		cli_msg.text("Foe sunk your " + ship.getName() + " at (" + pos.x + ", " + pos.y + ")");
	    } else {
		var pos = ship.getPosition(null); // This works because ship is dead.
		cli_msg.text("You sunk their " + ship.getName() + " at (" + pos.x + ", " + pos.y + ")");
	    }
	    break;
	case SBConstants.GAME_OVER_EVENT:
	    if (is_player_one && e.winner == SBConstants.PLAYER_ONE) {
		cli_msg.text("Game over. You win!");
	    } else {
		cli_msg.text("Game over. You lose!");
	    }
	    break;
	}
	cli_output.prepend(cli_msg);
    };

    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.MISS_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.HIT_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.SHIP_SUNK_EVENT,
			      eventLogHandler);
    game.registerEventHandler(SBConstants.GAME_OVER_EVENT, eventLogHandler);
    

//    var mapDrawHandler = function(e) {
//	map.empty();
//	
//	var map_str = "";
//
//	map_str += "   ";
//	for (var x=0; x<game.getBoardSize(); x++) {
//	    map_str += Math.floor(x/10);
//	}
//	map_str += "\n";
//	map_str += "   ";
//	for (var x=0; x<game.getBoardSize(); x++) {
//	    map_str += x%10;
//	}
//	map_str += "\n";
//	for (var x=-3; x<game.getBoardSize()+1; x++) {
//	    map_str += "-";
//	}
//	map_str += "\n";
//	
//	for (var y=0; y<game.getBoardSize(); y++) {
//	    map_str += Math.floor(y/10);
//	    map_str += y%10;
//	    map_str += "|";
//	    for (var x=0; x<game.getBoardSize(); x++) {
//		var sqr = game.queryLocation(key, x, y);
//		switch (sqr.type) {
//		case "miss":
//		    document.createElement("td")
//		    break;
//		case "p1":
//		    if (sqr.state == SBConstants.OK) {
//			map_str += "1";
//		    } else {
//			map_str += "X";
//		    }
//		    break;
//		case "p2":
//		    if (sqr.state == SBConstants.OK) {
//			map_str += "2";
//		    } else {
//			map_str += "X";
//		    }
//		    break;
//		case "empty":
//		    map_str += ".";
//		    break;
//		case "invisible":
//		    map_str += "?";
//		    break;
//		}
//	    }
//	    map_str += "|";
//	    map_str += "\n";
//	}
//	for (var x=-3; x<game.getBoardSize()+1; x++) {
//	    map_str += "-";
//	}
//	map_str += "\n";
//
//	map.append($('<pre></pre>').text(map_str));
//    };
    
     var mapDrawHandler = function (e) {
         $('td').each(function() {
                var col = $(this).parent().children().index($(this));
                var row = $(this).parent().parent().children().index($(this).parent());
                var sqr = game.queryLocation(key, col, row);
                switch(sqr.type) {
                    case "miss":
                        $(this).attr("class", "miss");
                        break;
                    case "p1":
                        if (sqr.state == SBConstants.OK) {
                        $(this).attr("class", "player1");
                    }
                        else {
                            $(this).attr("class", "hit");
                    }
                        break;
                    case "p2":
                        if (sqr.state == SBConstants.OK) {
                            $(this).attr("class", "player2");
                    }
                        else {
                            $(this).attr("class", "hit");
                    }
                        break;
                    case "empty":
                        $(this).attr("class", "empty");
                        break;
                    case "invisible":
                        $(this).attr("class", "invisible");
                        break;
                
            }
    });
                     };
     
    game.registerEventHandler(SBConstants.TURN_CHANGE_EVENT,
			      mapDrawHandler);
    //shooting using the CLI
    shootAt.on('click', function () {
        var cmd_str = $('#CLI').val();
        var cmd_array = cmd_str.split(' ');
        var x = parseInt(cmd_array[0]);
		var y = parseInt(cmd_array[1]);
		game.shootAt(key, x, y);
    });
    //shooting by clicking a square on the board
    boardShoot.click(function() {
        col = $(this).parent().children().index($(this));
        row = $(this).parent().parent().children().index($(this).parent());
        game.shootAt(key, col, row);
    });
    
    fleet.on('click', function () {
        var fleet = game.getFleetByKey(key);
		var fleet_ul = $('<ul></ul>');
		fleet.forEach(function (s) {
		    var ship_str = "<li>" + s.getName();
		    var ship_pos = s.getPosition(key);
		    ship_str += "<ul>";
		    ship_str += "<li>Position: " + ship_pos.x + ", " + ship_pos.y + "</li>";
		    ship_str += "<li>Direction: " + ship_pos.direction + "</li>";
		    ship_str += "<li>Size: " + s.getSize() + "</li>";
		    if (s.getStatus() == SBConstants.ALIVE) {
			ship_str += "<li>Status: ALIVE</li>";
		    } else {
			ship_str += "<li>Status: DEAD</li>";
		    }
		    ship_str += "</ul></li>";
		    fleet_ul.append(ship_str);
		})
		cli_output.prepend($('<div class="cli_msg"></div>').append(fleet_ul));
    });
    
    //this function uses the arrow keys to move the selected ship forward and backward (up and down arrows) and rotate the ship clockwise and
    //counterclockwise (right and left)
    arrowKeys.keydown(function(e) {
    switch(e.which) {
        case 37: // left - rotates ccw
            var ship_name = $('input[name="ship"]:checked').val();
            var ship = game.getShipByName(key, ship_name);
            if (ship != null) {
		    game.rotateShipCCW(key, ship);
        } 
        break;

        case 38: // up - moves forward
            var ship_name = $('input[name="ship"]:checked').val();
            var ship = game.getShipByName(key, ship_name);
            if (ship != null) {
		    game.moveShipForward(key, ship);
        }
        break;

        case 39: // right - rotates cw
            var ship_name = $('input[name="ship"]:checked').val();
            var ship = game.getShipByName(key, ship_name);
            if (ship != null) {
		    game.rotateShipCW(key, ship);
        } 
        break;

        case 40: // down - moves backward
            var ship_name = $('input[name="ship"]:checked').val();
            var ship = game.getShipByName(key, ship_name);
            if (ship != null) {
		    game.moveShipBackward(key, ship);
		}
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});
    //the rest of the functions move or rotate the ships using the buttons on the interface labelled as such
    move_backward.on('click', function() {
        var ship_name = $('input[name="ship"]:checked').val();
        var ship = game.getShipByName(key, ship_name);
		if (ship != null) {
		    game.moveShipBackward(key, ship);
		}
    });
    
    move_forward.on('click', function() {
        var ship_name = $('input[name="ship"]:checked').val();
        var ship = game.getShipByName(key, ship_name);
		if (ship != null) {
		    game.moveShipForward(key, ship);
        }
    });
    
    rotate_cw.on('click', function() {
        var ship_name = $('input[name="ship"]:checked').val();
        var ship = game.getShipByName(key, ship_name);
        if (ship != null) {
		    game.rotateShipCW(key, ship);
        }
    });
    
    rotate_ccw.on('click', function() {
        var ship_name = $('input[name="ship"]:checked').val();
        var ship = game.getShipByName(key, ship_name);
        if (ship != null) {
		    game.rotateShipCCW(key, ship);
        }
    });

//    cli_input.on('keypress', function (e) {
//	if (e.keyCode == 13) {
//	    var cmd_str = $(this).val();
////	    $(this).val('');
//	    var cmd_array = cmd_str.split(' ');
//	    if (cmd_array[0] == "shootAt") {
//		var x = parseInt(cmd_array[1]);
//		var y = parseInt(cmd_array[2]);
//		game.shootAt(key, x, y);
//	    } else if (cmd_array[0] == "fleetInfo") {
//		var fleet = game.getFleetByKey(key);
//		var fleet_ul = $('<ul></ul>');
//		fleet.forEach(function (s) {
//		    var ship_str = "<li>" + s.getName();
//		    var ship_pos = s.getPosition(key);
//		    ship_str += "<ul>";
//		    ship_str += "<li>Position: " + ship_pos.x + ", " + ship_pos.y + "</li>";
//		    ship_str += "<li>Direction: " + ship_pos.direction + "</li>";
//		    ship_str += "<li>Size: " + s.getSize() + "</li>";
//		    if (s.getStatus() == SBConstants.ALIVE) {
//			ship_str += "<li>Status: ALIVE</li>";
//		    } else {
//			ship_str += "<li>Status: DEAD</li>";
//		    }
//		    ship_str += "</ul></li>";
//		    fleet_ul.append(ship_str);
//		})
//		cli_output.prepend($('<div class="cli_msg"></div>').append(fleet_ul));
//	    } else if (cmd_array[0] == "moveForward") {
//		var ship_name = cmd_array[1];
//		var ship = game.getShipByName(key, ship_name);
//		if (ship != null) {
//		    game.moveShipForward(key, ship);
//		}
//	    } else if (cmd_array[0] == "moveBackward") {
//		var ship_name = cmd_array[1];
//		var ship = game.getShipByName(key, ship_name);
//		if (ship != null) {
//		    game.moveShipBackward(key, ship);
//		}
//	    } else if (cmd_array[0] == "rotateCW") {
//		var ship_name = cmd_array[1];
//		var ship = game.getShipByName(key, ship_name);
//		if (ship != null) {
//		    game.rotateShipCW(key, ship);
//		}
//	    } else if (cmd_array[0] == "rotateCCW") {
//		var ship_name = cmd_array[1];
//		var ship = game.getShipByName(key, ship_name);
//		if (ship != null) {
//		    game.rotateShipCCW(key, ship);
//		}
//	    }
//	}
//    });
};
