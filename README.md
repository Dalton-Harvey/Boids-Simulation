# Boids Simulation

A browser-based flocking simulation built with p5.js, implementing Craig Reynolds' Boids algorithm. Three simple rules — cohesion, separation, and alignment — produce emergent flocking behavior resembling birds or schooling fish.

## Demo

Open `index.html` in any browser. No build step or dependencies required beyond the local p5.js file.

## How It Works

Each boid follows three rules every frame:

- **Cohesion** — steer toward the average position of nearby boids
- **Separation** — steer away from boids that are too close
- **Alignment** — match the average velocity of nearby boids

Boids only react to neighbors within a forward-facing field of view, ignoring anything behind them. The combination of these rules produces complex group behavior from no central coordination.

## Project Structure

```
boids/
  index.html    # Shell, loads p5 and sketch
  boids.js      # All simulation logic
  p5.min.js     # p5.js local copy
```

## Configuration

All tunable constants are at the top of `boids.js`:

| Constant | Description |
|---|---|
| `BOID_COUNT` | Number of boids |
| `COHERENCE` | Strength of cohesion force |
| `SEPARATION` | Strength of separation force |
| `ALIGNMENT` | Strength of alignment force |
| `COHERENCE_RADIUS` | Perception radius in grid units |
| `SEPARATION_RADIUS` | Separation trigger radius in grid units |
| `MAXSPEED` | Maximum boid velocity |

## Built With

- [p5.js](https://p5js.org/) — rendering and math utilities
