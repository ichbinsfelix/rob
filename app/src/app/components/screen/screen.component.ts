import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TimerService} from '../../services/timer.service';
import {RoomService} from '../../services/room.service';
import {MapNavigation} from '../../models/mapNavigation';

@Component({
    selector: 'rob-screen',
    templateUrl: './screen.component.html',
    styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {

    floor!: number;
    search: boolean;
    filter?: string;

    select: string | undefined;
    goto: string | undefined;
    roomId: number | undefined;

    constructor(private route: ActivatedRoute,
                private timerService: TimerService,
                public roomService: RoomService) {
        this.search = false;
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(paramMap => {
            const floorParam: string = paramMap.get('floor') ? paramMap.get('floor') + '' : '';
            this.floor = +floorParam;

            if (!localStorage.getItem('rob_defaultFloor')) {
                localStorage.setItem('rob_defaultFloor', floorParam);
            } else {
                console.log('your default floor is ' + localStorage.getItem('rob_defaultFloor'));
            }
        });
        this.roomService.loadRoomData();

        this.timerService.getTimer().subscribe(
            result => {
                if (result % 10 === 0 || result < 10) {
                    console.log(result + ' seconds until reload');
                }

            }, error => {
                console.log(error);
            }
        );
    }

    mapClicked(technicalName: string): void {
        this.roomId = this.roomService.getRoomByTechnicalName(technicalName)?.id;
    }

    selectElement(mapNavigation: MapNavigation): void {
        this.floor = mapNavigation.floor;
        this.select = mapNavigation.name;
    }

    gotoElement(mapNavigation: MapNavigation): void {
        this.floor = mapNavigation.floor;
        this.goto = mapNavigation.name;
    }

}
