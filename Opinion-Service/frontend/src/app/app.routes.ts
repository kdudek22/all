import { Routes } from '@angular/router';
import { OpinionsComponent } from './sites/opinions/opinions.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/opinions',
        pathMatch: 'full'
    },
    {
        path: 'opinions',
        component: OpinionsComponent
    }
];
