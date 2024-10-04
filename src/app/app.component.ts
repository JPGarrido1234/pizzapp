import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp, homeOutline, settingsOutline, cartOutline, basketOutline, personOutline, pizzaOutline, bookOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonButton, RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/menu', icon: 'home-outline' },
    { title: 'Tu pedido actual', url: '/order/:id', icon: 'cart-outline' },
    { title: 'Tus pedidos', url: '/orders', icon: 'basket-outline' },
    { title: 'Tus datos personales', url: '/datos', icon: 'person-outline' },
    { title: 'Quienes somos', url: '/who', icon: 'pizza-outline' },
    { title: 'Aviso legal', url: '/legal', icon: 'book-outline' },
  ];
  constructor() {
    addIcons({cartOutline,basketOutline,personOutline,pizzaOutline,bookOutline,homeOutline,heartOutline,settingsOutline,mailOutline,mailSharp,paperPlaneOutline,paperPlaneSharp,heartSharp,archiveOutline,archiveSharp,trashOutline,trashSharp,warningOutline,warningSharp,bookmarkOutline,bookmarkSharp});
  }

}
