import {Component, HostListener, OnInit} from '@angular/core';

@Component({
    selector: 'rob-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    time = '14:33';
    date = 'Monday 15. February 2021';
    resolution: string = HeaderComponent.getResolution();
    clickCounter = 5;

    constructor() {
        setInterval(() => {
            this.date = new Date().toLocaleString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'CET'
            });
            this.time = new Date()
                .toLocaleString('en-GB', {hour: 'numeric', minute: 'numeric', timeZone: 'CET'});
        });
    }

    private static getResolution(): string {
        return window.innerWidth + 'x' + window.innerHeight;
    }
    @HostListener('window:resize')
    onResize() {
        this.resolution = HeaderComponent.getResolution();
    }

    ngOnInit(): void {

    }

    reset(): void{

    }

    onClick(){
        this.clickCounter--;
        if(this.clickCounter <= 0){
            localStorage.removeItem('rob_defaultFloor');
        }
        setTimeout(() => {
            this.clickCounter = 5;
        },1000);
    }

}
