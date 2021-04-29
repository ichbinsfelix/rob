import {Injectable} from '@angular/core';
import {SearchLink} from '../models/searchLink';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    public static readonly minute: number = 1000 * 60;

    public static contains(needle: string, ...haystack: string[]): boolean {
        return haystack
            .filter(stack => stack.toLowerCase().includes(needle.toLowerCase()))
            .length > 0;
    }

    public static alphabeticByDisplayName(a: SearchLink, b: SearchLink) {
        if (a.displayName < b.displayName) {
            return -1;
        }
        if (a.displayName > b.displayName) {
            return 1;
        }
        return 0;
    }

}
