export class LoggedUser {
    constructor(
        public id: number,
        public email: string,
        public phoneNrConfirmation: string,
        private jwtToken: string,
        private tokenExpirationDate: Date
    ){}
    
    get token() {
        if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
          return null;
        }
        return this.jwtToken;
      }
}
