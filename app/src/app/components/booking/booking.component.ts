import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Room} from '../../models/room';

@Component({
    selector: 'rob-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.css']
})
export class BookingComponent {

    form: FormGroup;
    room: Room;
    booking = false;
    bookingButtons = [1, 15, 30, 60];

    constructor(private dialogRef: MatDialogRef<BookingComponent>,
                private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) data: { room: Room }) {
        this.room = data.room;
        this.form = fb.group({
            name: ['', []],
            time: ['', []]
        });
    }

    save(): void {
        this.dialogRef.close(this.form.value);
    }

    close(): void {
        if (this.booking) {
            this.booking = false;
        } else {
            this.dialogRef.close();
        }
    }

    book(minutes: number): void {
        this.form.value.time = minutes;
        this.startBooking();
    }

    private startBooking(): void {
        this.booking = true;
    }
}
