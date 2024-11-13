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
    technician_id: number;
    client:User
    bicycle:Bicycle
}
