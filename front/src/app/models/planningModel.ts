export class PlanningModel {
    id:number;
    name:string;
    available_days:any
    intervention_type:string;
    slot_duration:{minutes:number,hours:number};
    start_time:string;
    end_time:string;
}
