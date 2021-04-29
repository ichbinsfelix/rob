import {Injectable} from '@angular/core';
import {UtilService} from './util.service';
import {Room} from '../models/room';
import {ApiService} from './api.service';
import {Employee} from '../models/employee';
import {Department} from '../models/department';
import {RoomAvailabilityService} from './roomAvailability.service';

@Injectable({
    providedIn: 'root'
})
export class RoomService {

    rooms?: Room[];
    employees?: Employee[];
    departments?: Department[];

    error?: string;

    constructor(private apiService: ApiService,
                private roomAvailabilityService: RoomAvailabilityService) {
    }

    getRoomById(id: number): Room | undefined {
        return this.rooms?.filter(room => room.id === id).pop();
    }

    getRoomByTechnicalName(technicalName: string): Room | undefined {
        return this.rooms?.filter(room => room.technicalName === technicalName).pop();
    }

    loadRoomData(): void {
        this.apiService.getRooms().subscribe(
            result => {
                this.rooms = result
                    .map(room => this.roomCreator(room))
                    .sort((a, b) => UtilService.alphabeticByDisplayName(a, b));
            },
            error => {
                this.error = error;
            }
        );
        this.apiService.getEmployees().subscribe(
            result => {
                this.employees = result
                    .sort((a, b) => UtilService.alphabeticByDisplayName(a, b));
            },
            error => {
                this.error = error;
            }
        );
        this.apiService.getDepartments().subscribe(
            result => {
                this.departments = result
                    .map(dep => Object.assign(dep, {displayName: dep.floor_id + ' - ' + dep.name}))
                    .sort((a, b) => UtilService
                        .alphabeticByDisplayName(a, b)
                    );
            },
            error => {
                this.error = error;
            }
        );
    }

    private roomCreator(room: Room): Room {
        this.roomAvailabilityService.updateRoomAvailability(room);
        return Object.assign(room, {displayName: room.technicalName + ' - ' + room.displayName});
    }


}
