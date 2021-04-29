import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Employee} from '../../models/employee';
import {Department} from '../../models/department';
import {Room} from '../../models/room';
import {BookingService} from '../../services/booking.service';
import {SearchLink} from '../../models/searchLink';
import {RoomService} from '../../services/room.service';
import {MapNavigation} from '../../models/mapNavigation';

@Component({
    selector: 'rob-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent {

    @Input() filter?: string;
    @Input() select?: number;

    @Output() searchAndSelect: EventEmitter<MapNavigation> = new EventEmitter<MapNavigation>();
    @Output() searchAndGoto: EventEmitter<MapNavigation> = new EventEmitter<MapNavigation>();

    constructor(
        public roomService: RoomService,
        private bookingService: BookingService) {
    }

    private static emitIfNotNull(outputProperty: EventEmitter<MapNavigation>, mapNav?: MapNavigation): void {
        if (mapNav) {
            outputProperty.emit(mapNav);
        }
    }

    private static mapNav(floor: number, name: string): MapNavigation {
        return {
            floor: floor - 1,
            name
        };
    }

    selectRoom(searchLink: SearchLink): void {
        const room: Room = searchLink as Room;
        this.searchAndSelect.emit(SearchComponent.mapNav(room.floor_id, room.technicalName));
    }

    bookRoom(searchLink: SearchLink): void {
        const room: Room = searchLink as Room;
        if (room.technicalName) {
            this.searchAndGoto.emit(SearchComponent.mapNav(room.floor_id, room.technicalName));
            if (room && room.currentlyAvailable) {
                this.bookingService.bookRoom(room);
            }
        }
    }

    selectEmployee(searchLink: SearchLink): void {
        const employee: Employee = searchLink as Employee;
        SearchComponent.emitIfNotNull(this.searchAndSelect, this.searchEmployee(employee));
    }

    gotoEmployee(searchLink: SearchLink): void {
        const employee: Employee = searchLink as Employee;
        SearchComponent.emitIfNotNull(this.searchAndGoto, this.searchEmployee(employee));
    }

    selectDepartment(searchLink: SearchLink): void {
        const department: Department = searchLink as Department;
        this.searchAndSelect.emit(SearchComponent.mapNav(department.floor_id, department.name));
    }

    gotoDepartment(searchLink: SearchLink): void {
        const department: Department = searchLink as Department;
        this.searchAndSelect.emit(SearchComponent.mapNav(department.floor_id, department.name));
    }

    private searchEmployee(employee: Employee): MapNavigation | undefined {
        const room: Room | undefined = this.roomService.getRoomById(employee.room_id);
        if (room) {
            return SearchComponent.mapNav(room.floor_id, room.technicalName);
        }
        return undefined;
    }

}
