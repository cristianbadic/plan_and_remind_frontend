// import { Component, OnInit } from '@angular/core';
// import { User } from '../shared/models/user.model';
// import { UserService } from '../services/user.service';
// import { HttpErrorResponse } from '@angular/common/http';
// import { NgForm } from '@angular/forms';
// import { UserResponse } from '../shared/models/user-response.model';

// @Component({
//   selector: 'app-users-management',
//   templateUrl: './users-management.component.html',
//   styleUrls: ['./users-management.component.css']
// })
// export class UsersManagementComponent implements OnInit{
//   public users: UserResponse[];
//   public editUser: User;
//   public deleteUser: User;
 

//   constructor(private userService: UserService){}

//   ngOnInit() {
//     this.getUsers();
//   }

//   public getUsers(): void {
//     // this.userService.getUsers().subscribe(
//     //   (response: User[]) => {
//     //     this.users = response;
//     //     console.log(this.users);
//     //   },
//     //   (error: HttpErrorResponse) => {
//     //     alert(error.message);
//     //   }
//     // );
//     this.userService.getUsers().subscribe(
//       {
//         next: (response: UserResponse[]) =>  {
//             this.users = response;
//             console.log(this.users);
//             console.log(this.users.length);
//           },
//         error: (error: HttpErrorResponse) =>  alert(error.message)
//     });
//   }

//   public onAddUser(addForm: NgForm): void {
//     document.getElementById('add-user-form').click();

//     // this.userService.addUser(addForm.value).subscribe(
//     //   (response: User) => {
//     //     console.log(response);
//     //     this.getUsers();
//     //     addForm.reset();
//     //   },
//     //   (error: HttpErrorResponse) => {
//     //     alert(error.message);
//     //     addForm.reset();
//     //   }
//     // );

//     this.userService.addUser(addForm.value).subscribe(
//       {
//         next: (response: void) =>  {
//           console.log(response);
//           this.getUsers();
//           addForm.reset();
//           },
//         error: (error: HttpErrorResponse) =>  {
//           alert(error.message);
//           addForm.reset();
//         }
//     });
//   }

//   public onUpdateUser(user: User): void {
//     this.userService.updateUser(user).subscribe(
//       (response: void) => {
//         console.log(response);
//         this.getUsers();
//       },
//       (error: HttpErrorResponse) => {
//         alert(error.message);
//       }
//     );
//   }

//   public onDeleteUser(userId: number): void {
//     this.userService.deleteUser(userId).subscribe(
//       (response: void) => {
//         console.log(response);
//         this.getUsers();
//       },
//       (error: HttpErrorResponse) => {
//         alert(error.message);
//       }
//     );
//   }

//   public searchUsers(key: string): void {
//     console.log(key);
//     const results: UserResponse[] = [];
//     for (const user of this.users) {
//       if (user.lastName.toLowerCase().indexOf(key.toLowerCase()) !== -1
//       || user.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
//       || user.firstName.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
//         results.push(user);
//       }
//     }
//     // pt a avea totul displayed daca nu avem useri
//     this.users = results;
//     if (results.length === 0 || !key) {
//       this.getUsers();
//     }
//   }

//   public onOpenModal(user: User, mode: string): void {
//     const container = document.getElementById('main-container');
//     const button = document.createElement('button');
//     button.type = 'button';
//     button.style.display = 'none';
    
//     button.setAttribute('data-toggle', 'modal');
//     button.setAttribute('title', 'Some button');
//     if (mode === 'add') {
//       button.setAttribute('data-target', '#addUserModal');
//     }
//     if (mode === 'edit') {
//       this.editUser = user;
//       button.setAttribute('data-target', '#updateUserModal');
//     }
//     if (mode === 'delete') {
//       this.deleteUser = user;
//       button.setAttribute('data-target', '#deleteUserModal');
//     }
//     container.appendChild(button);
//     button.click();
//   }
// }
