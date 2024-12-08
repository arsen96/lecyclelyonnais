import { Technician } from "./technicians";

export class User {
    id:number;
    first_name:string;
    last_name:string;
    email:string;
    address:string;
    role: 'client' | 'technician';
}
