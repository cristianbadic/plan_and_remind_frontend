export class EventResponseModel {
  id : number = -1;
  name :string = "";
  eventType : string = "";
  description : string = "";
  eventDate : string = "";
  startTime : string = "";
  endTime : string = "";
  limitDate : string = "";
  creatorFirstName : string = "";
  creatorLastName : string = "";

  //can be: true or false
   isFuture : string = "";

  //can be: created_single, created_group, invited_pending, invited_accepted
   specification : string = "";
}
