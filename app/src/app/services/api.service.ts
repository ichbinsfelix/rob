import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Room} from '../models/room';
import {Floor} from '../models/floor';
import {Employee} from '../models/employee';
import {Department} from '../models/department';
import {Meeting} from '../models/meeting';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private readonly restAPI = 'api/';

    constructor(private http: HttpClient) {
    }

    private static getRequestError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Fehler beim Laden der Daten (${error.status})`;
        }
        return throwError(errorMessage);
    }

    private static floorMock(): Observable<Floor[]> {
        const mocked: Floor[] = [
            {id: 0, name: 'Ground Floor'},
            {id: 1, name: 'Second Floor'},
            {id: 2, name: 'Third Floor'},
            {id: 3, name: 'one more'},
            {id: 4, name: 'one more'},
            {id: 5, name: 'one more'},
            {id: 6, name: 'one more'},
            {id: 7, name: 'one more'},
            {id: 8, name: 'one more'},
            {id: 9, name: 'one more'}];
        return of(mocked);
    }

    getFloors(): Observable<Floor[]> {
        return this.http.get<Floor[]>(this.restAPI + 'floor').pipe(
            catchError(ApiService.getRequestError)
        );
    }

    getPlan(floorId: number): Observable<string> {
        return this.http.get(
            this.restAPI + 'floor/' + floorId + '/plan',
            {responseType: 'text'}
        ).pipe(
            catchError(ApiService.getRequestError)
        );
    }

    getRooms(): Observable<Room[]> {
        return this.http.get<Room[]>(this.restAPI + 'room').pipe(
            catchError(ApiService.getRequestError)
        );
    }

    getDepartments(): Observable<Department[]> {
        return this.http.get<Department[]>(this.restAPI + 'department').pipe(
            catchError(ApiService.getRequestError)
        );
    }

    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.restAPI + 'employee').pipe(
            catchError(ApiService.getRequestError)
        );
    }

    getMeetings(): Observable<Meeting[]> {
        return this.http.get<Meeting[]>(this.restAPI + 'meeting').pipe(
            catchError(ApiService.getRequestError)
        );
    }

    getMeetingsForRoom(roomId: number): Observable<Meeting[]> {
        return this.http.get<Meeting[]>(this.restAPI + 'room/' + roomId + '/meeting').pipe(
            catchError(ApiService.getRequestError)
        );
    }

    bookMeeting(meeting: Meeting): Observable<string> {
        return this.http.post(
            this.restAPI + 'room/' + meeting.room_id + '/book',
            meeting,
            {responseType: 'text'}
        );
    }
}
