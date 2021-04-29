import {Component} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {RoomAvailabilityService} from '../../services/roomAvailability.service';
import {RoomService} from '../../services/room.service';
import {Room} from '../../models/room';

interface BookingMessage {
    id: number;
    room: string;
    organizer: string;
    start: Date;
    end: Date;
    hidden: boolean;
}

@Component({
    selector: 'rob-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css'],
})
export class MessageComponent {

    serverMessages: BookingMessage[] = [];

    private readonly maxAmountOfDisplayedMessages = 5;
    private readonly maxSecondsToDisplayMessage = 10;

    constructor(private socket: Socket,
                private roomService: RoomService,
                private roomAvailabilityService: RoomAvailabilityService,) {

        const sub = this.socket.fromEvent('message');
        sub.subscribe(
            (socketMessage: any) => {
                const validMessage = MessageComponent.verifyMessageType(socketMessage);
                if (validMessage) {
                    this.displayMessage(validMessage);
                } else {
                    console.warn('Websocket message is not of type BookingMessage:', socketMessage);
                }
            },
            (err: any) => console.log(err),
            () => console.log('Completed!')
        );
        //this.startMessageMock();
    }

    private static verifyMessageType(socketMessage: BookingMessage): BookingMessage | null {
        try {
            if (socketMessage.id &&
                socketMessage.start &&
                socketMessage.end &&
                socketMessage.room &&
                socketMessage.organizer) {
                const start = new Date(socketMessage.start);
                const end = new Date(socketMessage.end);
                if (start.getTime() < end.getTime()) {
                    return {
                        id: socketMessage.id,
                        start,
                        end,
                        room: socketMessage.room,
                        organizer: socketMessage.organizer,
                        hidden: false
                    };
                }
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    private displayMessage(message: BookingMessage): void {
        this.notifyRoom(message.room);
        this.serverMessages.unshift(message);
        if (this.serverMessages.length > this.maxAmountOfDisplayedMessages) {
            this.hideMessage(this.serverMessages[this.maxAmountOfDisplayedMessages]);
        }
        setTimeout(() => {
            this.hideMessage(message);
        }, this.maxSecondsToDisplayMessage * 1000);
        this.waitForEndOfMeeting(message);
    }

    private waitForEndOfMeeting(message: BookingMessage): void {
        const duration: number = message.end.getTime() - message.start.getTime();
        setTimeout(() => {
            this.notifyRoom(message.room);
        }, duration);
    }

    private hideMessage(message: BookingMessage): void {
        const waitForHideAnimation = 3000;
        if (!message.hidden) {
            message.hidden = true;
            setTimeout(() => {
                this.serverMessages.pop();
            }, waitForHideAnimation);
        }
    }

    private notifyRoom(technicalName: string): void {
        const room: Room | undefined = this.roomService.getRoomByTechnicalName(technicalName);
        if (room) {
            this.roomAvailabilityService.updateRoomAvailability(room);
        } else {
            console.error('Room ' + technicalName + ' from message not found!');
        }
    }

    private startMessageMock(): void {
        setInterval(() => {
            this.displayMessage({
                room: 'test',
                organizer: 'bla',
                start: new Date(),
                end: new Date(new Date().getTime() + 1000000),
                id: 1,
                hidden: false
            });
        }, 1500);
    }
}
