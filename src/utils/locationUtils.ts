// Helper function to determine if a location is coastal
export function isCoastalLocation(lat: number, lng: number): boolean {
    // Simple proximity check - this would be more sophisticated in a real app
    // Returns true if the location is within ~50km of a coastline
    const coastalPoints = [
        // Major coastal point coordinates around the world
        // Format: [lat, lng]
        [14.5995, 120.9842], // Manila
        [13.0827, 80.2707],  // Chennai
        [25.0330, 121.5654], // Taipei
        [22.3193, 114.1694], // Hong Kong
        [1.3521, 103.8198],  // Singapore
        [31.2304, 121.4737], // Shanghai
        [35.6762, 139.6503], // Tokyo
        [19.0760, 72.8777],  // Mumbai
        [41.0082, 28.9784],  // Istanbul
        // Add more key coastal points as needed
    ];
    
    // Check if within ~50km of any coastal point (rough approximation)
    return coastalPoints.some(point => {
        const distance = Math.sqrt(
            Math.pow(lat - point[0], 2) + 
            Math.pow(lng - point[1], 2)
        );
        return distance < 0.5; // ~50km at equator
    });
}

// Helper function to determine if a location is mountainous
export function isMountainousRegion(lat: number, lng: number): boolean {
    // Simple check for known mountainous regions
    const mountainRegions = [
        // Format: [lat, lng, radius]
        [27.9881, 86.9250, 3],  // Himalayas
        [45.8326, 6.8652, 1],   // Alps
        [39.1911, -106.8175, 1], // Rocky Mountains
        [36.5785, -118.2923, 1], // Sierra Nevada
        [33.9249, 75.7898, 1],  // Karakoram
        [-8.4095, -74.3976, 2],  // Andes
        // Add more mountain ranges as needed
    ];
    
    return mountainRegions.some(region => {
        const distance = Math.sqrt(
            Math.pow(lat - region[0], 2) + 
            Math.pow(lng - region[1], 2)
        );
        return distance < region[2];
    });
}
