import {Pipe, PipeTransform} from '@angular/core';
import {Room} from '../models/room';
import {UtilService as Util} from '../services/util.service';

@Pipe({name: 'filterRooms'})
export class FilterRoomsPipe implements PipeTransform {

    transform(rooms: Room[], searchParameter: string | undefined): Room[] {
        if (searchParameter && rooms) {
            rooms = rooms.filter(room => Util.contains(searchParameter, room.technicalName, room.displayName));
        }
        return rooms;
    }
}
