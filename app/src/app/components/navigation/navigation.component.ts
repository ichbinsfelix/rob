import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Floor} from '../../models/floor';
import {ApiService} from '../../services/api.service';

@Component({
    selector: 'rob-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

    @Input() floor!: number;
    @Input() search!: boolean;
    @Output() searchChange = new EventEmitter<boolean>();
    @Output() filterChange = new EventEmitter<string>();

    floors?: Floor[];
    filter?: string;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.apiService.getFloors().subscribe(
            result => {
                this.floors = result;
            },
            error => {
                console.error('floor loading error', error);
            }
        );
    }

    showHideSearch() {
        this.search = !this.search;
        this.searchChange.emit(this.search);
    }

    filterChanged() {
        this.filterChange.emit(this.filter);
    }
}
