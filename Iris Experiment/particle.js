class Particle {
  
  // Constructor initializes the particle with random position, velocity, and acceleration,
  // as well as a maximum speed limit and a placeholder for the previous position.
  constructor() {
    // Calculate the center of the canvas
    let centerX = width /  2;
    let centerY = height /  2;
    
    // Set the radius of the circle
    let radius = Math.min(width, height) /  2;
    
    // Generate a random angle between  0 and  2π
    let angle = Math.random() *  2 * Math.PI;
    
    // Generate a random distance within the circle's radius
    let distance = Math.sqrt(Math.random()) * radius;
    
    // Convert polar coordinates to Cartesian coordinates
    let posX = centerX + distance * Math.cos(angle);
    let posY = centerY + distance * Math.sin(angle);
    
    // Initialize particle with the calculated position
    this.pos = createVector(posX, posY);
    this.vel = createVector(0,  0); // Initial velocity
    this.acc = createVector(0,  0); // Initial acceleration
    this.maxspeed =  2; // Maximum speed limit
    this.prevPos = this.pos.copy(); // Placeholder for previous position
  }

  // Update method applies acceleration to velocity, limits the speed, and moves the particle
  // Includes the attraction force
  update() {
    // Calculate the direction towards the center
    var dir = createVector(width /  2, height /  2).sub(this.pos);
    // Normalize the direction vector and scale it by the attraction strength
    var force = dir.normalize().mult(dir.mag() * ATTRACTION_STRENGTH);
    
    // Apply the attraction force
    this.applyForce(force);

    // Existing code to handle velocity and position updates
    this.vel.add(this.acc); // Apply acceleration to velocity
    this.vel.limit(this.maxspeed); // Limit the speed
    this.pos.add(this.vel); // Move the particle by velocity
    this.acc.mult(0); // Reset acceleration for the next frame
  }

  // Follow method calculates the index of the vector field based on the particle's current position
  // and applies the corresponding force to the particle.
  follow(vectors) {
    var x = floor(this.pos.x / scl); // Calculate the x index
    var y = floor(this.pos.y / scl); // Calculate the y index
    var index = x + y * cols; // Calculate the index in the vector field
    var force = vectors[index]; // Get the force from the vector field
    this.applyForce(force); // Apply the force to the particle
  }

  // ApplyForce method adds the given force vector to the particle's acceleration
  applyForce(force) {
    this.acc.add(force); // Add force to acceleration
  }

  // Show method draws the particle as a line from its previous position to its current position
  show() {
    // Calculate the gradient color based on the particle's position
    let gradientColor = this.calculateGradientColor();
    
    // Set the stroke color to the calculated gradient color
    stroke(gradientColor);
    
    // Set the stroke weight
    strokeWeight(0.2);
    
    // Draw the line from the previous position to the current position
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    
    // Update the previous position
    this.updatePrev();
  }

  // New method to calculate the gradient color based on the particle's position
  calculateGradientColor() {
    // You can choose to base the gradient on the particle's position or some other property
    // For simplicity, let's base it on the particle's x position
    let gradientPosition = map(this.pos.x,  0, width,  0,  1);
    return lerpColor(color('#f292ed'), color('#f36364'), gradientPosition);
  }
  // UpdatePrev method saves the current position as the previous position for the next frame
  updatePrev() {
    this.prevPos.x = this.pos.x; // Save the current x position
    this.prevPos.y = this.pos.y; // Save the current y position
  }

  // Edges method checks if the particle has hit the edge of the window and wraps it around to the opposite edge
  edges() {
    if (this.pos.x > width) { // Check if past the right edge
      this.pos.x =  0; // Wrap around to the left edge
      this.updatePrev(); // Update the previous position
    }
    if (this.pos.x <  0) { // Check if past the left edge
      this.pos.x = width; // Wrap around to the right edge
      this.updatePrev(); // Update the previous position
    }
    if (this.pos.y > height) { // Check if past the bottom edge
      this.pos.y =  0; // Wrap around to the top edge
      this.updatePrev(); // Update the previous position
    }
    if (this.pos.y <  0) { // Check if past the top edge
      this.pos.y = height; // Wrap around to the bottom edge
      this.updatePrev(); // Update the previous position
    }
  }
}