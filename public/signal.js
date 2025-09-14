// Traffic signal management system
class TrafficSignal {
    constructor(simulation) {
        this.simulation = simulation;
        this.ctx = simulation.ctx;
        this.centerX = simulation.centerX;
        this.centerY = simulation.centerY;
        this.roadWidth = simulation.roadWidth;
        this.roadLength = simulation.roadLength;
        this.tileSize = simulation.tileSize;
        this.junctionSize = simulation.junctionSize;
        
        // Traffic light states - all red initially
        this.trafficLights = {
            N: { L: 'red', S: 'red', R: 'red' },      // North is red
            S: { L: 'red', S: 'red', R: 'red' },      // South is red  
            E: { L: 'red', S: 'red', R: 'red' },      // East is red
            W: { L: 'red', S: 'red', R: 'red' }       // West is red
        };
        
        // Signal positions for click detection
        this.signalPositions = {};
        this.calculateSignalPositions();
        
        // Mouse hover state
        this.hoveredSignal = null; // Will store { road, direction }
    }
    
    calculateSignalPositions() {
        const lightSize = 18;
        const spacing = 25;
        const borderSize = 5;
        
        // Calculate individual light positions for click detection
        this.signalPositions = {
            S: {
                road: 'S',
                orientation: 'horizontal',
                order: ['L', 'S', 'R'],
                baseX: this.centerX - this.roadWidth / 2 - 100,
                baseY: this.centerY + this.junctionSize / 2 + this.tileSize / 2,
                lights: {}
            },
            W: {
                road: 'W',
                orientation: 'vertical',
                order: ['L', 'S', 'R'],
                baseX: this.centerX - this.junctionSize / 2 - this.tileSize / 2 - 20,
                baseY: this.centerY - this.roadWidth / 2 - 100,
                lights: {}
            },
            N: {
                road: 'N',
                orientation: 'horizontal',
                order: ['R', 'S', 'L'],
                baseX: this.centerX + this.roadWidth / 2 + 20,
                baseY: this.centerY - this.junctionSize / 2 - this.tileSize / 2 - 20,
                lights: {}
            },
            E: {
                road: 'E',
                orientation: 'vertical',
                order: ['R', 'S', 'L'],
                baseX: this.centerX + this.junctionSize / 2 + this.tileSize / 2,
                baseY: this.centerY + this.roadWidth / 2 + 20,
                lights: {}
            }
        };
        
        // Calculate individual light click areas
        Object.values(this.signalPositions).forEach(signal => {
            signal.order.forEach((direction, index) => {
                const lightX = signal.orientation === 'horizontal' 
                    ? signal.baseX + index * spacing 
                    : signal.baseX;
                const lightY = signal.orientation === 'horizontal' 
                    ? signal.baseY 
                    : signal.baseY + index * spacing;
                
                signal.lights[direction] = {
                    x: lightX,
                    y: lightY,
                    width: lightSize,
                    height: lightSize,
                    direction: direction
                };
            });
        });
    }
    
    drawTrafficLights() {
        const ctx = this.ctx;
        
        // South signal: left of tile 0, horizontal
        this.drawTrafficLight(ctx, 
            this.centerX - this.roadWidth / 2 - 100, 
            this.centerY + this.junctionSize / 2 + this.tileSize / 2, 
            this.trafficLights.S, 'horizontal', ['L', 'S', 'R'], 'S'
        );
        
        // West signal: top of tile 0, vertical
        this.drawTrafficLight(ctx, 
            this.centerX - this.junctionSize / 2 - this.tileSize / 2 - 20, 
            this.centerY - this.roadWidth / 2 - 100, 
            this.trafficLights.W, 'vertical', ['L', 'S', 'R'], 'W'
        );
        
        // North signal: right of tile 0, horizontal (R,S,L order)
        this.drawTrafficLight(ctx, 
            this.centerX + this.roadWidth / 2 + 20, 
            this.centerY - this.junctionSize / 2 - this.tileSize / 2 - 20, 
            this.trafficLights.N, 'horizontal', ['R', 'S', 'L'], 'N'
        );
        
        // East signal: below tile 0, vertical (R,S,L order)
        this.drawTrafficLight(ctx, 
            this.centerX + this.junctionSize / 2 + this.tileSize / 2, 
            this.centerY + this.roadWidth / 2 + 20, 
            this.trafficLights.E, 'vertical', ['R', 'S', 'L'], 'E'
        );
    }
    
    drawTrafficLight(ctx, x, y, lights, orientation, lightOrder = ['L', 'S', 'R'], road = null) {
        const lightSize = 18;
        const spacing = 25;
        
        // Background
        ctx.fillStyle = '#222';
        const width = orientation === 'horizontal' ? spacing * 3 + 10 : lightSize + 10;
        const height = orientation === 'horizontal' ? lightSize + 10 : spacing * 3 + 10;
        ctx.fillRect(x - 5, y - 5, width, height);
        
        // Border
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 5, y - 5, width, height);
        
        // Lights
        lightOrder.forEach((direction, index) => {
            const lightX = orientation === 'horizontal' ? x + index * spacing : x;
            const lightY = orientation === 'horizontal' ? y : y + index * spacing;
            
            // Check if this individual light is hovered
            const isLightHovered = this.hoveredSignal && 
                                   this.hoveredSignal.road === road && 
                                   this.hoveredSignal.direction === direction;
            
            // Light circle background with hover effect
            if (isLightHovered) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(lightX - 2, lightY - 2, lightSize + 4, lightSize + 4);
            }
            
            // Light circle with enhanced glow effect
            ctx.beginPath();
            ctx.arc(lightX + lightSize/2, lightY + lightSize/2, lightSize/2 - 2, 0, 2 * Math.PI);
            
            // Add glow effect for active lights or hover effect
            if (lights[direction] === 'green') {
                ctx.shadowColor = '#00ff00';
                ctx.shadowBlur = isLightHovered ? 15 : 10;
                ctx.fillStyle = '#00ff00';
            } else {
                ctx.shadowColor = isLightHovered ? '#ff6666' : '#ff0000';
                ctx.shadowBlur = isLightHovered ? 8 : 5;
                ctx.fillStyle = isLightHovered ? '#ff6666' : '#ff0000';
            }
            
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow
            
            // Enhanced border for hovered light
            ctx.strokeStyle = isLightHovered ? '#fff' : '#333';
            ctx.lineWidth = isLightHovered ? 2 : 1;
            ctx.stroke();
            
            // Label
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(direction, lightX + lightSize/2, lightY);
        });
    }
    
    toggleTrafficLight(road) {
        const lights = this.trafficLights[road];
        const directions = ['L', 'S', 'R'];
        
        directions.forEach(dir => {
            lights[dir] = lights[dir] === 'red' ? 'green' : 'red';
        });
    }
    
    // Check if a click position is within a signal light area
    isClickOnSignal(x, y) {
        for (const [road, signal] of Object.entries(this.signalPositions)) {
            for (const [direction, light] of Object.entries(signal.lights)) {
                if (x >= light.x && x <= light.x + light.width && 
                    y >= light.y && y <= light.y + light.height) {
                    return { road: road, direction: direction };
                }
            }
        }
        return null;
    }
    
    // Handle individual signal light click - toggle only the clicked light
    handleSignalClick(clickInfo) {
        if (clickInfo && clickInfo.road && clickInfo.direction && this.trafficLights[clickInfo.road]) {
            const currentState = this.trafficLights[clickInfo.road][clickInfo.direction];
            const newState = currentState === 'red' ? 'green' : 'red';
            
            // No conflict checking - allow any signal to be toggled
            this.trafficLights[clickInfo.road][clickInfo.direction] = newState;
            console.log(`✅ Traffic signal ${clickInfo.road}-${clickInfo.direction} toggled to: ${newState}`);
            
            return true;
        }
        return false;
    }
    
    // Get all signal status for API
    getAllSignalStatus() {
        const status = {
            timestamp: new Date().toISOString(),
            signals: this.trafficLights
        };
        return status;
    }
    
    // Reset all signals to red
    resetAllSignals() {
        this.trafficLights = {
            N: { L: 'red', S: 'red', R: 'red' },
            S: { L: 'red', S: 'red', R: 'red' },
            E: { L: 'red', S: 'red', R: 'red' },
            W: { L: 'red', S: 'red', R: 'red' }
        };
        console.log('🔴 All traffic signals reset to red');
    }
    
    setTrafficLight(road, direction, state) {
        if (this.trafficLights[road] && ['L', 'S', 'R'].includes(direction)) {
            this.trafficLights[road][direction] = state;
        }
    }
    
    getTrafficLightState(road, direction) {
        return this.trafficLights[road] ? this.trafficLights[road][direction] : null;
    }
    
    // Get signal state for movement from a road (returns green if any direction is green)
    getSignalState(road) {
        if (!this.trafficLights[road]) return 'red';
        
        // A road is considered "green" if any of its movement directions is green
        const lights = this.trafficLights[road];
        const hasGreen = lights.L === 'green' || lights.S === 'green' || lights.R === 'green';
        return hasGreen ? 'green' : 'red';
    }
    
    // Get the movement direction (L, S, R) for a car based on its current road and destination
    getMovementDirection(fromRoad, toRoad) {
        if (fromRoad === toRoad) return 'S'; // Same road = straight (shouldn't happen in junction)
        
        // Define movement mappings for each road (LEFT-SIDE DRIVING)
        const movementMap = {
            'N': { 'E': 'L', 'S': 'S', 'W': 'R' }, // From North: East=Left, South=Straight, West=Right
            'E': { 'S': 'L', 'W': 'S', 'N': 'R' }, // From East: South=Left, West=Straight, North=Right
            'S': { 'W': 'L', 'N': 'S', 'E': 'R' }, // From South: West=Left, North=Straight, East=Right
            'W': { 'N': 'L', 'E': 'S', 'S': 'R' }  // From West: North=Left, East=Straight, South=Right
        };
        
        return movementMap[fromRoad] ? movementMap[fromRoad][toRoad] : null;
    }
    
    // Check if a specific movement is allowed (check the specific L, S, R signal)
    isMovementAllowed(fromRoad, toRoad) {
        const direction = this.getMovementDirection(fromRoad, toRoad);
        if (!direction) return false;
        
        const signalState = this.getTrafficLightState(fromRoad, direction);
        console.log(`Movement check: ${fromRoad} → ${toRoad} (${direction}) = ${signalState}`);
        
        // Special logging for E-L signal validation
        if (fromRoad === 'E' && direction === 'L') {
            console.log(`🔍 E-L Signal Test: East to ${toRoad} = ${direction} signal is ${signalState}`);
        }
        
        return signalState === 'green';
    }
    
    render() {
        this.drawTrafficLights();
    }
}
