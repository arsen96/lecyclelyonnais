export class Zones {
    id: number;
    zone_name: string;
    created_at: string;
    geojson: {
        type: string;
        coordinates: number[][][];
    };
}