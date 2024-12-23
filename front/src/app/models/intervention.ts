import { Bicycle } from "./bicycle";
import { Technician } from "./technicians";
import { User } from "./user";

export class Intervention {
    id: number;
    date: Date;
    type: string;
    description: string;
    status: string;
    appointment_start: Date;
    appointment_end: Date;
    technician:Technician;
    client_info: Partial<User>;
    technician_photos: string[];
    client_id:number;
    bicycle:Bicycle;
    created_at: Date;
    uploadedPhotos: string[];
    comments: string[];
}
