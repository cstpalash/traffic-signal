// Road management system for traffic simulation
class Road {
    constructor(simulation) {
        this.simulation = simulation;
        this.ctx = simulation.ctx;
        this.centerX = simulation.centerX;
        this.centerY = simulation.centerY;
        this.roadWidth = simulation.roadWidth;
        this.roadLength = simulation.roadLength;
        this.tileSize = simulation.tileSize;
        this.junctionSize = simulation.junctionSize;
    }
    
    drawRoad() {
        const ctx = this.ctx;
        
        // Draw road background
        ctx.fillStyle = '#444';
        
        // North road
        ctx.fillRect(
            this.centerX - this.roadWidth / 2, 
            this.centerY - this.junctionSize / 2 - this.roadLength, 
            this.roadWidth, 
            this.roadLength
        );
        
        // South road
        ctx.fillRect(
            this.centerX - this.roadWidth / 2, 
            this.centerY + this.junctionSize / 2, 
            this.roadWidth, 
            this.roadLength
        );
        
        // East road
        ctx.fillRect(
            this.centerX + this.junctionSize / 2, 
            this.centerY - this.roadWidth / 2, 
            this.roadLength, 
            this.roadWidth
        );
        
        // West road
        ctx.fillRect(
            this.centerX - this.junctionSize / 2 - this.roadLength, 
            this.centerY - this.roadWidth / 2, 
            this.roadLength, 
            this.roadWidth
        );
        
        // Draw junction
        ctx.fillStyle = '#333';
        ctx.fillRect(
            this.centerX - this.junctionSize / 2,
            this.centerY - this.junctionSize / 2,
            this.junctionSize,
            this.junctionSize
        );
    }
    
    drawLaneDividers() {
        const ctx = this.ctx;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        // Vertical lane dividers (North/South roads)
        ctx.moveTo(this.centerX, this.centerY - this.junctionSize / 2 - this.roadLength);
        ctx.lineTo(this.centerX, this.centerY - this.junctionSize / 2);
        ctx.moveTo(this.centerX, this.centerY + this.junctionSize / 2);
        ctx.lineTo(this.centerX, this.centerY + this.junctionSize / 2 + this.roadLength);
        
        // Horizontal lane dividers (East/West roads)
        ctx.moveTo(this.centerX - this.junctionSize / 2 - this.roadLength, this.centerY);
        ctx.lineTo(this.centerX - this.junctionSize / 2, this.centerY);
        ctx.moveTo(this.centerX + this.junctionSize / 2, this.centerY);
        ctx.lineTo(this.centerX + this.junctionSize / 2 + this.roadLength, this.centerY);
        
        ctx.stroke();
    }
    
    drawRoadTiles() {
        const ctx = this.ctx;
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.font = 'bold 16px Inter, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let tile = 0; tile <= 9; tile++) {
            // North road tiles (from junction outward)
            const northY = this.centerY - this.junctionSize / 2 - (tile + 1) * this.tileSize;
            ctx.strokeRect(
                this.centerX - this.roadWidth / 2,
                northY,
                this.roadWidth,
                this.tileSize
            );
            
            // Enhanced tile number with outline for visibility
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.strokeText(tile.toString(), this.centerX, northY + this.tileSize / 2);
            ctx.fillStyle = '#000000';
            ctx.fillText(tile.toString(), this.centerX, northY + this.tileSize / 2);
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1;
            
            // South road tiles (from junction outward)
            const southY = this.centerY + this.junctionSize / 2 + tile * this.tileSize;
            ctx.strokeRect(
                this.centerX - this.roadWidth / 2,
                southY,
                this.roadWidth,
                this.tileSize
            );
            
            // Enhanced tile number with outline for visibility
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.strokeText(tile.toString(), this.centerX, southY + this.tileSize / 2);
            ctx.fillStyle = '#000000';
            ctx.fillText(tile.toString(), this.centerX, southY + this.tileSize / 2);
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1;
            
            // East road tiles (from junction outward)
            const eastX = this.centerX + this.junctionSize / 2 + tile * this.tileSize;
            ctx.strokeRect(
                eastX,
                this.centerY - this.roadWidth / 2,
                this.tileSize,
                this.roadWidth
            );
            
            // Enhanced tile number with outline for visibility
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.strokeText(tile.toString(), eastX + this.tileSize / 2, this.centerY);
            ctx.fillStyle = '#000000';
            ctx.fillText(tile.toString(), eastX + this.tileSize / 2, this.centerY);
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1;
            
            // West road tiles (from junction outward)
            const westX = this.centerX - this.junctionSize / 2 - (tile + 1) * this.tileSize;
            ctx.strokeRect(
                westX,
                this.centerY - this.roadWidth / 2,
                this.tileSize,
                this.roadWidth
            );
            
            // Enhanced tile number with outline for visibility
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.strokeText(tile.toString(), westX + this.tileSize / 2, this.centerY);
            ctx.fillStyle = '#000000';
            ctx.fillText(tile.toString(), westX + this.tileSize / 2, this.centerY);
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1;
        }
    }
    
    drawLabels() {
        const ctx = this.ctx;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        
        // Get destination colors from centralized DestinationManager
        const colors = DestinationManager.getDestinationColors();
        
        // Marathahalli Junction road labels - positioned 25px away from the end of each road
        // North: Whitefield Road - to IT Parks, ITPL, Prestige Tech Park (Blue)
        ctx.fillStyle = colors.N;
        ctx.fillText('WHITEFIELD ROAD', this.centerX, this.centerY - this.junctionSize / 2 - this.roadLength - 40);
        ctx.font = 'normal 10px Arial';
        ctx.fillText('→ IT Parks, ITPL, Tech Parks', this.centerX, this.centerY - this.junctionSize / 2 - this.roadLength - 25);
        ctx.font = 'bold 14px Arial';
        
        // South: Outer Ring Road - to Electronic City, Sarjapur, Koramangala (Brown)
        ctx.fillStyle = colors.S;
        ctx.fillText('OUTER RING ROAD', this.centerX, this.centerY + this.junctionSize / 2 + this.roadLength + 40);
        ctx.font = 'normal 10px Arial';
        ctx.fillText('→ Electronic City, Sarjapur', this.centerX, this.centerY + this.junctionSize / 2 + this.roadLength + 25);
        ctx.font = 'bold 14px Arial';
        
        // West: Airport Road - to Bangalore Airport, Hennur, Hebbal (Purple)
        ctx.fillStyle = colors.W;
        ctx.save();
        ctx.translate(this.centerX - this.junctionSize / 2 - this.roadLength - 40, this.centerY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('AIRPORT ROAD', 0, 0);
        ctx.font = 'normal 10px Arial';
        ctx.fillText('→ BLR Airport, Hebbal', 0, 15);
        ctx.restore();
        ctx.font = 'bold 14px Arial';
        
        // East: Varthur Road - to Brookefield, Kundalahalli, HAL (Yellow)
        ctx.fillStyle = colors.E;
        ctx.save();
        ctx.translate(this.centerX + this.junctionSize / 2 + this.roadLength + 40, this.centerY);
        ctx.rotate(Math.PI / 2);
        ctx.fillText('VARTHUR ROAD', 0, 0);
        ctx.font = 'normal 10px Arial';
        ctx.fillText('→ Brookefield, HAL', 0, 15);
        ctx.restore();
        ctx.font = 'bold 14px Arial';
    }
    
    drawLaneArrows() {
        const ctx = this.ctx;
        const laneWidth = this.simulation.laneWidth;
        
        // Arrow styling
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // Draw one arrow per lane at tile 5 (middle of each road)
        this.drawArrowsForTile(5);
    }
    
    drawArrowsForTile(tile) {
        const ctx = this.ctx;
        const laneWidth = this.simulation.laneWidth;
        const arrowSize = 12;
        
        // LEFT-SIDE DRIVING: Inbound lanes are on the right, outbound lanes are on the left
        
        // North Road Arrows
        const northY = this.centerY - this.junctionSize / 2 - tile * this.tileSize;
        // Inbound lane (right side, cars going toward junction - south direction)
        this.drawArrow(
            this.centerX + laneWidth / 2 - arrowSize, 
            northY, 
            Math.PI, // 180 degrees - pointing south
            arrowSize
        );
        // Outbound lane (left side, cars going away from junction - north direction)
        this.drawArrow(
            this.centerX - laneWidth / 2 + arrowSize, 
            northY, 
            0, // 0 degrees - pointing north
            arrowSize
        );
        
        // South Road Arrows
        const southY = this.centerY + this.junctionSize / 2 + tile * this.tileSize;
        // Inbound lane (right side, cars going toward junction - north direction)
        this.drawArrow(
            this.centerX - laneWidth / 2 + arrowSize, 
            southY, 
            0, // 0 degrees - pointing north
            arrowSize
        );
        // Outbound lane (left side, cars going away from junction - south direction)
        this.drawArrow(
            this.centerX + laneWidth / 2 - arrowSize, 
            southY, 
            Math.PI, // 180 degrees - pointing south
            arrowSize
        );
        
        // East Road Arrows
        const eastX = this.centerX + this.junctionSize / 2 + tile * this.tileSize;
        // Inbound lane (right side, cars going toward junction - west direction)
        this.drawArrow(
            eastX, 
            this.centerY + laneWidth / 2 - arrowSize, 
            Math.PI * 1.5, // 270 degrees - pointing west
            arrowSize
        );
        // Outbound lane (left side, cars going away from junction - east direction)
        this.drawArrow(
            eastX, 
            this.centerY - laneWidth / 2 + arrowSize, 
            Math.PI * 0.5, // 90 degrees - pointing east
            arrowSize
        );
        
        // West Road Arrows
        const westX = this.centerX - this.junctionSize / 2 - tile * this.tileSize;
        // Inbound lane (right side, cars going toward junction - east direction)
        this.drawArrow(
            westX, 
            this.centerY - laneWidth / 2 + arrowSize, 
            Math.PI * 0.5, // 90 degrees - pointing east
            arrowSize
        );
        // Outbound lane (left side, cars going away from junction - west direction)
        this.drawArrow(
            westX, 
            this.centerY + laneWidth / 2 - arrowSize, 
            Math.PI * 1.5, // 270 degrees - pointing west
            arrowSize
        );
    }
    
    drawArrow(x, y, rotation, size) {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Draw arrow shape
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(-size * 0.6, size * 0.4);
        ctx.lineTo(-size * 0.3, size * 0.4);
        ctx.lineTo(-size * 0.3, size);
        ctx.lineTo(size * 0.3, size);
        ctx.lineTo(size * 0.3, size * 0.4);
        ctx.lineTo(size * 0.6, size * 0.4);
        ctx.closePath();
        
        // Fill and stroke the arrow
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }
    
    render() {
        this.drawRoad();
        this.drawLaneDividers();
        this.drawRoadTiles();
        this.drawLaneArrows();
        this.drawLabels();
    }
}
