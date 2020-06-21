import { Component, OnInit } from '@angular/core';
import { User } from '../services/auth/user';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: User = { username: '', password: '' };
  dietPreferences = [
    { name: 'BBQ', checked: false },
    { name: 'Burger', checked: false },
    { name: 'Chinese', checked: false },
    { name: 'Deli', checked: false },
    { name: 'Fast Food', checked: false },
    { name: 'Italian', checked: false },
    { name: 'Japanese', checked: false },
    { name: 'Mexican', checked: false },
    { name: 'Pizza', checked: false }
  ];
  errorMessage: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  signup() {
    const dietPreferences = this.getSelectedPreferences();
    this.authService.signup({ ...this.user, dietPreferences }).subscribe(res => {
      console.log(res);
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  getSelectedPreferences() {
    return this.dietPreferences
      .filter(preference => preference.checked)
      .map(preference => preference.name);
  }
}

