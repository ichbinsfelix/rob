import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app.component';
import {ScreenComponent} from './components/screen/screen.component';
import {MapComponent} from './components/map/map.component';
import {SearchComponent} from './components/search/search.component';
import {HeaderComponent} from './components/header/header.component';
import {MatCardModule} from '@angular/material/card';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FilterRoomsPipe} from './pipes/filterRooms.pipe';
import {FilterEmployeesPipe} from './pipes/filterEmployees.pipe';
import {FilterDepartmentsPipe} from './pipes/filterDepartments.pipe';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
import {BookingComponent} from './components/booking/booking.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MessageComponent} from './components/message/message.component';
import {NavigationComponent} from './components/navigation/navigation.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {TimerService} from './services/timer.service';
import {SearchPanelComponent} from './components/searchPanel/searchPanel.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatDateFormats, MatNativeDateModule} from '@angular/material/core';
import {ReverseFloorsPipe} from './pipes/reverseFloors.pipe';

const config: SocketIoConfig = { url: '/', options: {} };

export const GRI_DATE_FORMATS: MatDateFormats = {
    ...MAT_NATIVE_DATE_FORMATS,
    display: {
        ...MAT_NATIVE_DATE_FORMATS.display,
        dateInput: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        } as Intl.DateTimeFormatOptions,
    }
};

@NgModule({
    declarations: [
        AppComponent,
        ScreenComponent,
        MapComponent,
        SearchComponent,
        HeaderComponent,
        FilterRoomsPipe,
        FilterEmployeesPipe,
        FilterDepartmentsPipe,
        ReverseFloorsPipe,
        BookingComponent,
        MessageComponent,
        NavigationComponent,
        SearchPanelComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        MatCardModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule,
        SocketIoModule.forRoot(config)
    ],
    entryComponents: [BookingComponent],
    providers: [
        TimerService,
        { provide: MAT_DATE_FORMATS, useValue: GRI_DATE_FORMATS },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
