import {Injectable} from '@angular/core';
import {Room} from '../models/room';
import {Meeting} from '../models/meeting';
import {ApiService} from './api.service';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoomAvailabilityService {

    roomAvailabilityChanged$: Subject<string> = new Subject();

    constructor(private apiService: ApiService) {
    }

    private static nextMeeting(meetings: Meeting[]): number {
        let nextMeeting = 999;
        if (meetings) {
            meetings.forEach(meeting => {
                if (nextMeeting > 0) {
                    const now: number = new Date().getTime();
                    const start = new Date(meeting.start).getTime();
                    const end = new Date(meeting.end).getTime();
                    if (start < now && end > now) {
                        nextMeeting = 0;
                    } else if (start > now) {
                        const timeToMeeting = start - now;
                        if (timeToMeeting < nextMeeting) {
                            nextMeeting = timeToMeeting;
                        }
                    }
                }
            });
        }
        return nextMeeting;
    }

    updateRoomAvailability(room: Room): void {
        if (room.isMeetingRoom) {
            this.apiService.getMeetingsForRoom(room.id).subscribe(
                meetings => {
                    console.log('meeting result for room ' + room.displayName, meetings);
                    const wasAvailable = room.currentlyAvailable;
                    room.currentlyAvailable = RoomAvailabilityService.nextMeeting(meetings);
                    if (wasAvailable !== room.currentlyAvailable) {
                        this.roomAvailabilityChanged$.next(room.technicalName);
                    }
                },
                error => {
                    console.error('updateRoomAvailability' + room.displayName, error);
                }
            );
        }
    }
}
