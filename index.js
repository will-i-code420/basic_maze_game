const { Engine, Render, Runner, Composite, Bodies } = Matter;

const width = 600;
const height = 600;
const mazeCells = 3;
const mazeCellLength = width / mazeCells;

const engine = Engine.create();
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

const mazeGrid = Array(mazeCells).fill(null).map(() => Array(mazeCells).fill(false));
const xGridWalls = Array(mazeCells).fill(null).map(() => Array(mazeCells - 1).fill(false));
const yGridWalls = Array(mazeCells - 1).fill(null).map(() => Array(mazeCells).fill(false));

const startX = Math.floor(Math.random() * mazeCells);
const startY = Math.floor(Math.random() * mazeCells);

const loopMazeCells = (x, y) => {
	// if visited the cell at [x,y] return
	if (mazeGrid[x][y]) return;

	// mark cell as visited
	mazeGrid[x][y] = true;

	// assemble random list of neighbors
	const neighbors = shuffle([
		[ x - 1, y, 'up' ],
		[ x + 1, y, 'down' ],
		[ x, y - 1, 'left' ],
		[ x, y + 1, 'right' ]
	]);

	// for each neighbor
	for (let neighbor of neighbors) {
		const [ nextX, nextY, direction ] = neighbor;

		// see if neighbor out of bounds
		if (nextX < 0 || nextX >= mazeCells || nextY < 0 || nextY >= mazeCells) continue;

		// if visited that neighbor continue to next neighbor
		if (mazeGrid[nextX][nextY]) continue;
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
		loopMazeCells(nextX, nextY);
	}
	// visit next cell
};

loopMazeCells(startX, startY);

yGridWalls.forEach((row, i) => {
	row.forEach((open, col) => {
		if (open) return;
		const wall = Bodies.rectangle(
			col * mazeCellLength + mazeCellLength / 2,
			i * mazeCellLength + mazeCellLength,
			mazeCellLength,
			1,
			{
				isStatic: true
			}
		);
		Composite.add(world, wall);
	});
});

xGridWalls.forEach((row, i) => {
	row.forEach((open, col) => {
		if (open) return;
		const wall = Bodies.rectangle(
			col * mazeCellLength + mazeCellLength,
			i * mazeCellLength + mazeCellLength / 2,
			1,
			mazeCellLength,
			{
				isStatic: true
			}
		);
		Composite.add(world, wall);
	});
});

// Goal Creation

const goal = Bodies.rectangle(
	width - mazeCellLength / 2,
	height - mazeCellLength / 2,
	mazeCellLength * 0.65,
	mazeCellLength * 0.65,
	{
		isStatic: true,
		wireframes: false
	}
);
Composite.add(world, goal);

// Player Creation

const player = Bodies.circle(mazeCellLength / 2, mazeCellLength / 2, mazeCellLength * 0.25, { isStatic: true });
Composite.add(world, player);
