const { Engine, Render, Runner, Composite, Bodies, MouseConstraint, Mouse } = Matter;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		width: 800,
		height: 600
	}
});

Render.run(render);
Runner.run(Runner.create(), engine);
Composite.add(
	world,
	MouseConstraint.create(engine, {
		mouse: Mouse.create(render.canvas)
	})
);

// Border Walls
const borderWalls = [
	Bodies.rectangle(400, 0, 800, 40, {
		isStatic: true
	}),
	Bodies.rectangle(400, 600, 800, 40, {
		isStatic: true
	}),
	Bodies.rectangle(0, 300, 40, 600, {
		isStatic: true
	}),
	Bodies.rectangle(800, 300, 40, 600, {
		isStatic: true
	})
];
Composite.add(world, borderWalls);
