import {Pipe, PipeTransform} from '@angular/core';
import {Floor} from '../models/floor';

@Pipe({name: 'reverseFloors'})

export class ReverseFloorsPipe implements PipeTransform {
    transform(floors?: Floor[]): Floor[] | undefined {
        if (floors && floors.slice()) {
            return floors.slice().reverse();
        }
        return floors;
    }
}
