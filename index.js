const { Engine, Render, Runner, Composite, Bodies, MouseConstraint, Mouse } = Matter;

const width = 800;
const height = 600;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	element: document.body,
	engine,
	options: {
		wireframes: false,
		width,
		height
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

// Random Shapes
for (let i = 0; i < 10; i++) {
	const x = Math.random() * width;
	const y = Math.random() * height;
	Composite.add(world, Bodies.rectangle(x, y, 50, 50));
	Composite.add(world, Bodies.polygon(x, y, 5, 60));
	Composite.add(
		world,
		Bodies.circle(x, y, 20, {
			render: {
				fillStyle: 'blue'
			}
		})
	);
}
