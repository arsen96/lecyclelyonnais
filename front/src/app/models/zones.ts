import { PlanningModel } from "./planningModel";
import { Technician } from "./technicians";

export class Zones {
    id: number;
    zone_name: string;
    created_at: string;
    geojson: {
        type: string;
        coordinates: number[][][];
    };
    model_planification: {
        maintenance: Partial<PlanningModel>;
        repair: Partial<PlanningModel>;  
    };
    technicians: Partial<Technician>[];
}
