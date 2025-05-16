import { Box, Button, Text } from '@radix-ui/themes';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
} from 'react-simple-maps';

const geoUrl =
    'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

type Props = {
    userLocation: { lat: number; lng: number } | null;
    center: [number, number];
    zoom: number;
    locating: boolean;
    onShareLocation: () => void;
};

export function LocationMap({
    userLocation,
    center,
    zoom,
    locating,
    onShareLocation
}: Props) {
    return (
        <Box mb="5" style={{ background: '#e0f2fe', borderRadius: 12, padding: 16 }}>
            <Button
                size="2"
                color="blue"
                onClick={onShareLocation}
                disabled={locating}
                style={{ marginBottom: 12 }}
            >
                {locating ? 'Locating...' : 'Share My Location'}
            </Button>
            <div style={{ width: '100%', maxWidth: 480, height: 260 }}>
                <ComposableMap projection="geoMercator" width={480} height={260}>
                    <ZoomableGroup center={center} zoom={zoom}>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map(geo => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        style={{
                                            default: { fill: '#b6e0fe', outline: 'none' },
                                            hover: { fill: '#38bdf8', outline: 'none' },
                                            pressed: { fill: '#0ea5e9', outline: 'none' }
                                        }}
                                    />
                                ))
                            }
                        </Geographies>
                        {userLocation && (
                            <Marker coordinates={[userLocation.lng, userLocation.lat]}>
                                <circle r={6} fill="#FF5533" stroke="#fff" strokeWidth={2} />
                            </Marker>
                        )}
                    </ZoomableGroup>
                </ComposableMap>
            </div>
            {userLocation && (
                <Text as="p" size="2" mt="2" style={{ color: '#0e7490' }}>
                    Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </Text>
            )}
        </Box>
    );
}
