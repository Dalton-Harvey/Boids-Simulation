const SIZE = 5;
const BOID_COUNT = 1000;
const COHERENCE = 0.01;
const SEPERATION = 0.08;
const ALIGNMENT = 0.3;
const COHERENCE_RADIUS = 6;
const SEPERATION_RADIUS = 2;
const MAXSPEED = 1;
const FOV = Math.PI;
const height = 1080;
const width = 1920;
let cols,rows,grid,boids;

function setup(){
    createCanvas(width, height); 
    rows = height/SIZE;
    cols = width/SIZE;
    boids = initBoids();
    grid = makeGrid()

    frameRate(60);
}

function makeGrid(){ 
    let newGrid = Array.from({length: rows}, ()=> Array(cols).fill(0));

    for(let b = 0; b < BOID_COUNT; b++){
        let boid = boids[b];
        let r = Math.min(Math.round(boid.pos.y), rows - 1);
        let c = Math.min(Math.round(boid.pos.x), cols - 1);
        newGrid[r][c] = 1;
    }

    return newGrid
}

function initBoids(){
    let newBoids = []
    for(let b = 0; b < BOID_COUNT; b++){
        newBoids.push({
            vel: {x:random(-1,1),y:random(-1,1)},
            pos: {y:random(rows), x:random(cols)},
         }); 
    } 

    return newBoids;
}

function draw(){
    background(0)

    for(let b = 0; b < BOID_COUNT; b++){
        let boid = boids[b];
        push();
        translate(boid.pos.x * SIZE, boid.pos.y * SIZE);
        rotate(atan2(boid.vel.y, boid.vel.x));
        fill(255);
        noStroke();
        triangle(SIZE, 0, -SIZE/2, -SIZE/2, -SIZE/2, SIZE/2);
        pop();
        // fill(255);
        // noStroke();
        // rect(boid.pos.x * SIZE, boid.pos.y * SIZE, SIZE,SIZE);
    }

    moveBoids();
}

function boidDetection(boid, other, radius){ 
    let dx = other.pos.x - boid.pos.x;
    let dy = other.pos.y - boid.pos.y;

    let dist = Math.sqrt(dx*dx + dy*dy);
    
    if(dist > radius) return false; //to far
    if(dist == 0) return false; //self

    dx /= dist;
    dy /= dist;

    let speed = Math.sqrt(boid.vel.x * boid.vel.x + boid.vel.y * boid.vel.y);
    let fx = boid.vel.x / speed;
    let fy = boid.vel.y / speed;

    let dot = fx*dx + fy*dy;

    //dot = 1 neighbor is in front, dot = 0 neighbor is exactly 90 degrees, dot = -1 neighbor is behind
    return dot > cos(FOV);
}

function findVel(boid){
    let newVel = {x: boid.vel.x, y: boid.vel.y};
    let spottedBoids = []
    let toCloseBoids = []
    let avgX = 0, avgY = 0
    let avgVX = 0, avgVY = 0;
    let sX =0, sY = 0;
    
    for(let b = 0; b < BOID_COUNT; b++){ 

        if(boids[b] == boid) continue;
        
        if(boidDetection(boid,boids[b], SEPERATION_RADIUS))
        {
            toCloseBoids.push(boids[b]);

            let eX = boid.pos.x - boids[b].pos.x;
            let eY = boid.pos.y - boids[b].pos.y;
            let dist = Math.sqrt(eX * eX + eY * eY);

            eX /= dist;
            eY /= dist;
            eX /= dist;
            eY /= dist;

            sX += eX;
            sY += eY;
        }
        else if(boidDetection(boid,boids[b], COHERENCE_RADIUS))//either out of range or out of FOV
        {
            spottedBoids.push(boids[b]);

            avgX += boids[b].pos.x;
            avgY += boids[b].pos.y;

            avgVX += boids[b].vel.x;
            avgVY += boids[b].vel.y;
        }

    } 

    if(spottedBoids.length > 0){ 
        //Coherence
        avgX /= spottedBoids.length
        avgY /= spottedBoids.length

        let dx = avgX - boid.pos.x;
        let dy = avgY - boid.pos.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        dx /= dist;
        dy /= dist;

        newVel.x += dx * COHERENCE;
        newVel.y += dy * COHERENCE;

        //Alignment
        avgVX /= spottedBoids.length;
        avgVY /= spottedBoids.length;
        let speed = Math.sqrt(avgVX * avgVX + avgVY * avgVY);
        avgVX /= speed;
        avgVY /= speed;
        newVel.x += avgVX * ALIGNMENT;
        newVel.y += avgVY * ALIGNMENT;

    }

    //Seperation - Move away from boids too close
    if(toCloseBoids.length > 0){
        sX/= toCloseBoids.length; 
        sY/= toCloseBoids.length; 
        newVel.x += sX * SEPERATION;
        newVel.y += sY * SEPERATION;
    }

    let speed = Math.sqrt(newVel.x * newVel.x + newVel.y*newVel.y);
    if(speed > MAXSPEED){ 
        newVel.x = (newVel.x/speed) * MAXSPEED;
        newVel.y = (newVel.y/speed) * MAXSPEED;
    }
    return newVel;
}

function moveBoids(){

    for(let b = 0; b < BOID_COUNT; b++){
        let boid = boids[b]; 

        newVel = findVel(boid)

        boid.vel.x = newVel.x;
        boid.vel.y = newVel.y;

        boid.pos.x += boid.vel.x;
        boid.pos.y += boid.vel.y;

        if(boid.pos.y > rows)
            boid.pos.y = 0;
        else if(boid.pos.y < 0)
            boid.pos.y = rows; 

        if(boid.pos.x > cols)
            boid.pos.x = 0;
        else if(boid.pos.x < 0)
            boid.pos.x = cols;

        boids[b] = boid;
    }

}
