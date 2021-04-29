import {Component} from '@angular/core';
import {DateAdapter} from '@angular/material/core';

@Component({
    selector: 'rob-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'rob';


    constructor(private readonly adapter: DateAdapter<Date>) {
        this.adapter.setLocale('de-ch');
    }


}
