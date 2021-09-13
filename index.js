const clear = require('clear');
const fs = require('fs');
const path = require('path');
const rl = require('readline-sync');
const { Chess } = require('chess.js');

if (!fs.existsSync(path.join(__dirname, '/games'))) fs.mkdirSync(path.join(__dirname, '/games')); 

let chess, timestamp, active;

const startGame = () => {
	if (rl.keyInYN('Do you want to play?')) {
		chess = new Chess();
		timestamp = new Date().toISOString();
		if (active === false) clear();
		active = true;
		playGame();
	}
}

const playGame = () => {
	do {
		console.log(chess.ascii());
		const turn = chess.turn() === 'w' ? 'White' : 'Black';
		const move = rl.question(`${turn} to move: `);
		const valid = chess.move(move);
		if (valid === null) {
			clear();
			console.log(`${move} is not a valid move.`);
			continue;
		}
		if (chess.in_stalemate() || chess.in_threefold_repetition() || chess.insufficient_material()) {
			console.log('Draw');
			console.log(chess.fen());
			fs.writeFileSync(path.join(__dirname, `/games/${timestamp}.txt`), chess.pgn());
			active = false;
		} else if (chess.in_checkmate()) {
			console.log(`${turn} wins`);
			console.log(chess.fen());
			fs.writeFileSync(path.join(__dirname, `/games/${timestamp}.txt`), chess.pgn());
			active = false;
		} else {
			clear();
			const history = chess.history();
			console.log(`Last move: ${history[history.length - 1]}`);
		}
	} while (active);
	startGame();
}

clear();
startGame();