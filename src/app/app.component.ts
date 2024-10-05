import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, homeOutline, settingsOutline, cartOutline, basketOutline, personOutline, pizzaOutline, bookOutline } from 'ionicons/icons';
import { User } from './models/user.model';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  user: User | any = null;

  public appPages = [
    { title: 'Inicio', url: '/menu', icon: 'home-outline' },
    { title: 'Tu pedido actual', url: '/order/:id', icon: 'cart-outline' },
    { title: 'Tus pedidos', url: '/orders', icon: 'basket-outline' },
    { title: 'Tus datos personales', url: '/datos', icon: 'person-outline' },
    { title: 'Quienes somos', url: '/who', icon: 'pizza-outline' },
    { title: 'Aviso legal', url: '/legal', icon: 'book-outline' },
    { title: 'Cerrar sesión', url: '/logout', icon: 'log-out-outline' },
  ];
  constructor(private userService: UserService) {
    addIcons({cartOutline,basketOutline,personOutline,pizzaOutline,bookOutline,homeOutline,heartOutline,settingsOutline,mailOutline,mailSharp,paperPlaneOutline,paperPlaneSharp,heartSharp,archiveOutline,archiveSharp,trashOutline,trashSharp,warningOutline,warningSharp,bookmarkOutline,bookmarkSharp});
    this.userService.getUser().then(async (user: any) => {
      this.user = user;
      console.log('User: ', this.user);
    });

  }

}
