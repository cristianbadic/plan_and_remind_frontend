import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './register/register.component';
import { UsersListComponent } from './users-list/users-list.component';
import { RelationshipsComponent } from './relationships/relationships.component';
import { NotificationsComponent } from './notifications/notifications.component';
import {EventsComponent} from "./events/events.component";
import { PhoneNumberComponent } from './phone-number/phone-number.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: 'phone-number', component: PhoneNumberComponent,
    canActivate: [AuthGuard], },
  { path: 'forbidden', component: NotFoundComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'register', component: RegisterComponent },
  {path:'friends', component: UsersListComponent,
  canActivate: [AuthGuard]},
  {path:'events', component: EventsComponent,
    canActivate: [AuthGuard]},
  {path:'relationships', component: RelationshipsComponent,
  canActivate: [AuthGuard]},
  {path:'notifications', component: NotificationsComponent,
  canActivate: [AuthGuard]},
  {path:'edit-profile', component: EditProfileComponent,
  canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
