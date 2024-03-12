import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './register/register.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppMaterialModule } from './app.material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { UsersListComponent } from './users-list/users-list.component';
import { UserItemComponent } from './user-item/user-item.component';
import { RelationshipsComponent } from './relationships/relationships.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CommonModule, DatePipe } from '@angular/common';
import {EventsComponent} from "./events/events.component";
import {InvitationItemComponent} from "./invitation-item/invitation-item.component";
import {MatListModule} from "@angular/material/list";
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {InviteesListDialogComponent} from "./invitees-list-dialog/invitees-list-dialog.component";
import {EventItemComponent} from "./event-item/event-item.component";
import {ConfirmationDialogComponent} from "./confirmation-dialog/confirmation-dialog.component";
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { AddSinglePopupComponent } from './add-single-popup/add-single-popup.component';
import { AddGroupPopupComponent } from './add-group-popup/add-group-popup.component';
import { CheckOverlapPopupComponent } from './check-overlap-popup/check-overlap-popup.component';
import { ConfirmRegisterPopupComponent } from './confirm-register-popup/confirm-register-popup.component';
import { PhoneNumberComponent } from './phone-number/phone-number.component';
import { PhoneNumberConfirmatiomPopupComponent } from './phone-number-confirmatiom-popup/phone-number-confirmatiom-popup.component';
import { InviteAdditionalPopupComponent } from './invite-additional-popup/invite-additional-popup.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { AcceptInvitationOverlapComponent } from './accept-invitation-overlap/accept-invitation-overlap.component';
import { AcceptInvitationAddReminderComponent } from './accept-invitation-add-reminder/accept-invitation-add-reminder.component';
import { FailedAcceptPopupComponent } from './failed-accept-popup/failed-accept-popup.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    RegisterComponent,
    NotFoundComponent,
    UsersListComponent,
    UserItemComponent,
    RelationshipsComponent,
    NotificationsComponent,
    InvitationItemComponent,
    InviteesListDialogComponent,
    EventItemComponent,
    ConfirmationDialogComponent,
    EventsComponent, AddSinglePopupComponent, AddGroupPopupComponent, CheckOverlapPopupComponent, ConfirmRegisterPopupComponent, PhoneNumberComponent, PhoneNumberConfirmatiomPopupComponent, InviteAdditionalPopupComponent, EditProfileComponent, SpinnerComponent, AcceptInvitationOverlapComponent, AcceptInvitationAddReminderComponent, FailedAcceptPopupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    FlexLayoutModule,
    MatListModule,
    NgxMaterialTimepickerModule,
    MatDialogModule,
  ],
  providers: [DatePipe, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true } },
    {
      provide: MatDialogRef,
      useValue: {}
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
