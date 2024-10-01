import { Component, OnInit } from '@angular/core';
import { NgForm  } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {

  error_msg: string = '';
  disable: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  async resetPassword() {

  }

  login(form: NgForm) {

  }
}
