export class InvitedUserModel {
  constructor(invitee : InvitedUserModel) {
    this.id = invitee.id;
    this.firstName = invitee.firstName;
    this.lastName = invitee.lastName;
    this.statusToInvitation = invitee.statusToInvitation;
  }

  id: number = -1;
  firstName : string = "";
  lastName: string = "";

  //can be: accepted, declined sau pending
  statusToInvitation: string = "";
}
