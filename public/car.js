// Car management system for canvas-based traffic simulation
class CarManager {
    constructor(simulation) {
        this.simulation = simulation;
        this.ctx = simulation.ctx;
        this.cars = [];
        this.nextCarId = 1;
    }
    
    addCar(destination, road, lane, tile) {
        const coords = this.simulation.getCarCoordinates(road, lane, tile);
        if (coords) {
            const car = {
                id: this.nextCarId++,
                road: road,
                lane: lane,
                tile: tile,
                destination: destination,
                x: coords.x,
                y: coords.y,
                color: this.getDestinationColor(destination),
                speed: 1 + Math.random() * 2,
                size: 20,
                moving: false,
                waitTime: 0
            };
            this.cars.push(car);
            return car;
        }
        return null;
    }
    
    getDestinationColor(destination) {
        return DestinationManager.getColorForDestination(destination);
    }
    
    // Static method to get destination colors for use by other modules
    static getDestinationColors() {
        return DestinationManager.getDestinationColors();
    }
    
    removeCar(carId) {
        this.cars = this.cars.filter(car => car.id !== carId);
    }
    
    clearAllCars() {
        this.cars = [];
    }
    
    resetCarIds() {
        this.nextCarId = 1;
    }
    
    moveCarToTile(carId, newRoad, newTile) {
        const car = this.cars.find(c => c.id === carId);
        if (car) {
            const coords = this.simulation.getCarCoordinates(newRoad, newTile, car.destination);
            if (coords) {
                car.road = newRoad;
                car.tile = newTile;
                car.x = coords.x;
                car.y = coords.y;
                return true;
            }
        }
        return false;
    }
    
    drawCars() {
        const ctx = this.ctx;
        
        this.cars.forEach(car => {
            ctx.save();
            
            // Create gradient for car body
            const gradient = ctx.createRadialGradient(
                car.x - car.size/4, car.y - car.size/4, 0,
                car.x, car.y, car.size/2
            );
            gradient.addColorStop(0, this.lightenColor(car.color, 30));
            gradient.addColorStop(1, car.color);
            
            // Draw car shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(
                car.x - car.size / 2 + 2, 
                car.y - car.size / 2 + 2, 
                car.size, 
                car.size
            );
            
            // Draw car body with gradient
            ctx.fillStyle = gradient;
            ctx.fillRect(
                car.x - car.size / 2, 
                car.y - car.size / 2, 
                car.size, 
                car.size
            );
            
            // Car border with subtle glow
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(
                car.x - car.size / 2, 
                car.y - car.size / 2, 
                car.size, 
                car.size
            );
            
            // Inner highlight
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(
                car.x - car.size / 2 + 1, 
                car.y - car.size / 2 + 1, 
                car.size - 2, 
                car.size - 2
            );
            
            // Car ID with better styling - improved visibility
            ctx.font = 'bold 10px Inter, Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // White outline for contrast
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.strokeText(car.id.toString(), car.x, car.y);
            
            // Black text on top
            ctx.fillStyle = '#000000';
            ctx.fillText(car.id.toString(), car.x, car.y);
            
            // Show wait time at top right corner of the car only if it's waiting (wait time > 0)
            if (car.waitTime > 0) {
                ctx.font = 'bold 9px Inter, Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Wait time text (just number + s)
                const waitText = `${car.waitTime}s`;
                const textWidth = ctx.measureText(waitText).width;
                const badgeWidth = Math.max(textWidth + 6, 16); // Minimum width for circle
                const badgeHeight = 14;
                const badgeRadius = badgeHeight / 2;
                
                // Position at top right corner of car
                const badgeX = car.x + car.size/2 - badgeWidth/2;
                const badgeY = car.y - car.size/2 - badgeHeight/2;
                
                // Draw rounded badge background
                ctx.fillStyle = 'rgba(220, 20, 20, 0.9)'; // Darker red for better contrast
                ctx.beginPath();
                ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, badgeRadius);
                ctx.fill();
                
                // Add subtle border
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // White text for wait time
                ctx.fillStyle = '#ffffff';
                ctx.fillText(waitText, badgeX + badgeWidth/2, badgeY + badgeHeight/2);
            }
            
            ctx.restore();
        });
    }
    
    // Helper function to lighten colors for gradient effect
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16),
              amt = Math.round(2.55 * percent),
              R = (num >> 16) + amt,
              G = (num >> 8 & 0x00FF) + amt,
              B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                     (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                     (B < 255 ? B < 1 ? 0 : B : 255))
                     .toString(16).slice(1);
    }
    
    updateCars() {
        // Movement is now controlled by the simulation system
        // This method is kept for cleanup of cars that have exited
        
        // Remove cars that are marked for removal or have exited
        this.cars = this.cars.filter(car => 
            car.tile <= 12 // Allow some buffer beyond tile 10
        );
    }
    
    getCarCount() {
        return this.cars.length;
    }
    
    getMovingCarCount() {
        return this.cars.filter(car => car.moving).length;
    }
    
    getWaitingCarCount() {
        return this.cars.filter(car => !car.moving).length;
    }
    
    getTotalWaitTime() {
        return this.cars.reduce((total, car) => total + car.waitTime, 0);
    }
    
    getAverageWaitTime() {
        const carCount = this.cars.length;
        if (carCount === 0) return 0;
        return Math.round((this.getTotalWaitTime() / carCount) * 10) / 10; // Round to 1 decimal place
    }
    
    getCarsByRoad(road) {
        return this.cars.filter(car => car.road === road);
    }
    
    getCarById(carId) {
        return this.cars.find(car => car.id === carId);
    }
    
    startCar(carId) {
        const car = this.getCarById(carId);
        if (car) {
            car.moving = true;
        }
    }
    
    stopCar(carId) {
        const car = this.getCarById(carId);
        if (car) {
            car.moving = false;
        }
    }
    
    render() {
        this.drawCars();
    }
}

// Car utility class for individual car instances
class Car {
    constructor(id, road, tile, destination, color = null) {
        this.id = id;
        this.road = road;
        this.tile = tile;
        this.destination = destination;
        this.color = color || this.getDestinationColor(destination);
        this.speed = 1 + Math.random() * 2;
        this.size = 20;
        this.moving = false;
    }
    
    getDestinationColor(destination) {
        return DestinationManager.getColorForDestination(destination);
    }
    
    getInfo() {
        return {
            id: this.id,
            road: this.road,
            tile: this.tile,
            destination: this.destination,
            color: this.color,
            speed: this.speed,
            moving: this.moving
        };
    }
}
