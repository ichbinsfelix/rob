import {Injectable} from '@angular/core';
import {interval, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})


export class TimerService {
    counter = 300;

    timerObs = new Observable(observer => {
        interval(1000).subscribe(() => {
            this.counter--;
            observer.next(this.counter);
            if(this.counter <= 0){
                if(localStorage.getItem('rob_defaultFloor')){
                    window.location.href='/'+localStorage.getItem('rob_defaultFloor');
                }else{
                    window.location.href='/0';
                }
            }
        });
    });

    constructor() {
        window.addEventListener('click', () => {
            this.counter = 300;
        });
    }

    getTimer(): Observable<any> {
        return this.timerObs;
    }

}
