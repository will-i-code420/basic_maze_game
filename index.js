const { Engine, Render, Runner, Composite, Bodies, Body, Events } = Matter;

const width = window.innerWidth;
const height = window.innerHeight;
const mazeRows = 10;
const mazeColumns = 6;
const rowLength = width / mazeRows;
const columnLength = height / mazeColumns;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
	element: document.body,
	engine,
	options: {
		wireframes: true,
		width,
		height
	}
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Border Walls
const borderWalls = [
	Bodies.rectangle(width / 2, 0, width, 2, {
		isStatic: true
	}),
	Bodies.rectangle(width / 2, height, width, 2, {
		isStatic: true
	}),
	Bodies.rectangle(0, height / 2, 2, height, {
		isStatic: true
	}),
	Bodies.rectangle(width, height / 2, 2, height, {
		isStatic: true
	})
];
Composite.add(world, borderWalls);

/* Maze Creation
 
mazeGrid creates cells for maze itself, false means not visited during creation/removal of vertical/horizontal walls
xGridWalls is for vertical walls between cells and yGridWalls are horizontal walls between the maze grid cells
false means wall exists and true means no wall
*/

const shuffle = (arr) => {
	let counter = arr.length;
	while (counter !== 0) {
		const randomIdx = Math.floor(Math.random() * counter);
		counter--;
		const temp = arr[counter];
		arr[counter] = arr[randomIdx];
		arr[randomIdx] = temp;
	}
	return arr;
};

const mazeGrid = Array(mazeColumns).fill(null).map(() => Array(mazeRows).fill(false));
const xGridWalls = Array(mazeColumns).fill(null).map(() => Array(mazeRows - 1).fill(false));
const yGridWalls = Array(mazeColumns - 1).fill(null).map(() => Array(mazeRows).fill(false));
const startRow = Math.floor(Math.random() * mazeColumns);
const startColumn = Math.floor(Math.random() * mazeRows);

const loopMazeCells = (x, y) => {
	// if visited the cell at [x,y] return
	console.log('loop maze cells start', mazeGrid[x][y]);
	if (mazeGrid[x][y]) return;

	// mark cell as visited
	mazeGrid[x][y] = true;
	console.log('marked', mazeGrid[x][y]);
	// assemble random list of neighbors
	const neighbors = shuffle([
		[ x - 1, y, 'up' ],
		[ x + 1, y, 'down' ],
		[ x, y - 1, 'left' ],
		[ x, y + 1, 'right' ]
	]);
	console.log(neighbors);
	// for each neighbor
	for (let neighbor of neighbors) {
		const [ nextX, nextY, direction ] = neighbor;
		console.log('neighbor loop', nextX, nextY, direction);
		// see if neighbor out of bounds
		if (nextX < 0 || nextX >= mazeColumns || nextY < 0 || nextY >= mazeRows) {
			continue;
		}

		// if visited that neighbor continue to next neighbor
		if (mazeGrid[nextX][nextY]) {
			continue;
		}
		// remove wall from either x or y gridWalls based on next neighbor
		switch (direction) {
			case 'up':
				yGridWalls[x - 1][y] = true;
				break;
			case 'down':
				yGridWalls[x][y] = true;
				break;
			case 'left':
				xGridWalls[x][y - 1] = true;
				break;
			case 'right':
				xGridWalls[x][y] = true;
				break;

			default:
				break;
		}
		// visit next cell
		loopMazeCells(nextX, nextY);
	}
};

loopMazeCells(startRow, startColumn);

yGridWalls.forEach((row, i) => {
	row.forEach((open, col) => {
		if (open) return;
		const wall = Bodies.rectangle(col * rowLength + rowLength / 2, i * columnLength + columnLength, rowLength, 5, {
			isStatic: true,
			label: 'wall'
		});
		Composite.add(world, wall);
	});
});

xGridWalls.forEach((row, i) => {
	row.forEach((open, col) => {
		if (open) return;
		const wall = Bodies.rectangle(
			col * rowLength + rowLength,
			i * columnLength + columnLength / 2,
			5,
			columnLength,
			{
				isStatic: true,
				label: 'wall'
			}
		);
		Composite.add(world, wall);
	});
});

// Goal Creation

const goal = Bodies.rectangle(width - rowLength / 2, height - columnLength / 2, rowLength * 0.65, columnLength * 0.65, {
	isStatic: true,
	wireframes: false,
	label: 'goal'
});
Composite.add(world, goal);

// Player Creation
const playerRadius = Math.min(rowLength, columnLength) * 0.25;
const player = Bodies.circle(rowLength / 2, columnLength / 2, playerRadius, {
	label: 'player'
});
Composite.add(world, player);

document.addEventListener('keydown', (e) => {
	const { x, y } = player.velocity;
	switch (e.key) {
		// move up using w or up arrow keys
		case 'w':
		case 'W':
		case 'ArrowUp':
			Body.setVelocity(player, { x, y: y - 5 });
			break;
		// move right using d or right arrow keys
		case 'd':
		case 'D':
		case 'ArrowRight':
			Body.setVelocity(player, { x: x + 5, y });
			break;
		// move down using s or down arrow keys
		case 's':
		case 'S':
		case 'ArrowDown':
			Body.setVelocity(player, { x, y: y + 5 });
			break;
		// move left using a or left arrow keys
		case 'a':
		case 'A':
		case 'ArrowLeft':
			Body.setVelocity(player, { x: x - 5, y });
			break;

		default:
			break;
	}
});

// Game Win Conditions

Events.on(engine, 'collisionStart', (e) => {
	e.pairs.forEach((collision) => {
		const winTerms = [ 'goal', 'player' ];
		const { bodyA, bodyB } = collision;
		if (winTerms.includes(bodyA.label) && winTerms.includes(bodyB.label)) {
			world.gravity.y = 1;
			world.bodies.forEach((body) => {
				if (body.label === 'wall') Body.setStatic(body, false);
			});
		}
	});
});
