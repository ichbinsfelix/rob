import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {BookingComponent} from '../components/booking/booking.component';
import {Room} from '../models/room';
import {Meeting} from '../models/meeting';
import {UtilService} from './util.service';
import {RoomAvailabilityService} from './roomAvailability.service';
import {ApiService} from './api.service';

@Injectable({
    providedIn: 'root'
})
export class BookingService {


    constructor(private dialog: MatDialog,
                private roomAvailabilityService: RoomAvailabilityService,
                private apiService: ApiService) {

    }

    bookRoom(room: Room): void {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            room
        };
        dialogConfig.position = {
            left: room.left,
            top: room.top
        };

        this.dialog.open(BookingComponent, dialogConfig);

        const dialogRef = this.dialog.open(BookingComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            data => {
                if (data && data.time) {
                    this.setupMeeting(room, data.time, data.name ? data.name : 'Adhoc Meeting');
                }
            },
            error => {
                console.log('dialog error', error);
            },
            () => {
                console.log('dialog completed');
                this.dialog.closeAll();
            }
        );
    }

    private setupMeeting(room: Room, minutes: number, name: string): void {
        const startTime: Date = new Date();
        const duration: number = minutes * UtilService.minute;
        const endTime: Date = new Date(startTime.getTime() + duration);

        const meeting: Meeting = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            room_id: room.id,
            start: startTime,
            end: endTime,
            subject: name
        };

        this.apiService.bookMeeting(meeting).subscribe(
            () => {
                this.roomAvailabilityService.updateRoomAvailability(room);
                this.updateRoomAvailabilityAfterMeeting(room, duration);
            },
            error => {
                console.error('bookMeeting', error);
            },
            () => {
                console.log('Meeting booking completed ' + room.displayName);
            }
        );
    }

    private updateRoomAvailabilityAfterMeeting(room: Room, duration: number): void {
        setTimeout(() => {
            this.roomAvailabilityService.updateRoomAvailability(room);
        }, duration);
    }


}
