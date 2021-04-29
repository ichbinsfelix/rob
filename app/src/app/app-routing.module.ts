import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ScreenComponent} from './components/screen/screen.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/0' },
    { path: ':floor', component: ScreenComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
