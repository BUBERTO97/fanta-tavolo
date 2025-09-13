import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import {from, map, Observable, of, switchMap} from 'rxjs';
import {doc, Firestore, getDoc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly firestore = inject(Firestore);


  user$ = authState(this.auth);

  register({ email, password }: any) {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login({ email, password }: any) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(signOut(this.auth)).subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(
      switchMap(user => {
        if (!user) {
          return of(false);
        }
        const userDoc = doc(this.firestore, `users/${user.uid}`);
        return from(getDoc(userDoc)).pipe(
          map(snapshot => snapshot.exists() && snapshot.data()?.['role'] === 'admin')
        );
      })
    );
  }
}
