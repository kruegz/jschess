var board,
    game = new Chess();

// do not pick up pieces if the game is over
// only pick up pieces for White
var onDragStart = function(source, piece, position, orientation) {
  if (game.in_checkmate() === true || game.in_draw() === true ||
    piece.search(/^b/) !== -1) {
    return false;
  }
};

var generateMove = new Function;

var makeMove = function() {
  var move = generateMove(game);
  game.move(move);
  board.position(game.fen());
};

var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  // make random legal move for black
  window.setTimeout(makeMove, 250);
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};


board = ChessBoard('board', cfg);
var editor = ace.edit("aceEditor");
editor.getSession().setMode("ace/mode/javascript");

$("#reset").click(function() {
    // Get user-written code
    //var userCodeString = $("#userCode").val();
    var userCodeString = editor.getValue();
    
    // Wrap user code with function creating syntax
    var userCodeStringWrapped = "function createUserCode() {" + userCodeString + "} var userCode = new createUserCode(); return userCode;";
    
    // Interpret the user code
    var userCodeFunc = new Function(userCodeStringWrapped);
    
    // Create and instance of user code
    var userCode = userCodeFunc();

    // Assign generateMove func to be the user written function
    generateMove = userCode.generateMove;
    
    // Reset the board
    board.start(true);
});