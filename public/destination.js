// Destination color management system for traffic simulation
class DestinationManager {
    // Static method to get destination colors for consistent theming across modules
    static getDestinationColors() {
        return {
            'N': '#0080ff', // Bright Blue for North (Sky/Ocean direction)
            'E': '#ff6600', // Bright Orange for East (Sunrise direction)
            'S': '#ffeb3b', // Bright Yellow for South (Sun direction)
            'W': '#9c27b0'  // Bright Purple for West (Sunset direction)
        };
    }
    
    // Get color for a specific destination
    static getColorForDestination(destination) {
        const colors = DestinationManager.getDestinationColors();
        return colors[destination] || '#ffffff'; // Default to white if destination not found
    }
    
    // Get all destination labels with their colors
    static getDestinationLabels() {
        return {
            'N': { name: 'NORTH', color: '#0080ff' },
            'E': { name: 'EAST', color: '#ff6600' },
            'S': { name: 'SOUTH', color: '#ffeb3b' },
            'W': { name: 'WEST', color: '#9c27b0' }
        };
    }
    
    // Validate if a destination is valid
    static isValidDestination(destination) {
        const colors = DestinationManager.getDestinationColors();
        return destination in colors;
    }
}
