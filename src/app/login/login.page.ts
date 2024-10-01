import { Component, OnInit } from '@angular/core';
import { NgForm  } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  error_msg: string = '';
  disable: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  async resetPassword() {

  }

  login(form: NgForm) {

  }
}
