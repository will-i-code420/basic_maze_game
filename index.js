const { Engine, Render, Runner, Composite, Bodies } = Matter;

const width = 600;
const height = 600;
const mazeCells = 3;

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
	Bodies.rectangle(width / 2, 0, width, 40, {
		isStatic: true
	}),
	Bodies.rectangle(width / 2, height, width, 40, {
		isStatic: true
	}),
	Bodies.rectangle(0, height / 2, 40, height, {
		isStatic: true
	}),
	Bodies.rectangle(width, height / 2, 40, height, {
		isStatic: true
	})
];
Composite.add(world, borderWalls);

/* Maze Creation
 
maze grid creates cells for maze, false means not visited during creation
xGridWalls is for vertical walls between cells and yGridWalls are horizontal walls between the maze grid cells
false means wall exists and true means no wall
*/
const mazeGrid = Array(mazeCells).fill(null).map(() => Array(mazeCells).fill(false));
const xGridWalls = Array(mazeCells).fill(null).map(() => Array(mazeCells - 1).fill(false));
const yGridWalls = Array(mazeCells - 1).fill(null).map(() => Array(mazeCells).fill(false));
