import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserCustom } from '../model/user/user.model';

@Injectable()
export class UserListService {

    private userListRef = this.db.list<UserCustom>('UsuariosT');

    constructor(private db: AngularFireDatabase) { }

    getUserList() {
        return this.userListRef;
    }

    addUser(user: UserCustom) {
        return this.userListRef.push(user);
    }

    updateUser(user: UserCustom) {
        return this.userListRef.update(user.key, user);
    }

    removeUser(user: UserCustom) {
        return this.userListRef.remove(user.key);
    }
}