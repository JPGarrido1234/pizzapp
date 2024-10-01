import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonButton, RouterLink, RouterLinkActive, CommonModule, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, IonRouterOutlet],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'ios-home-outline' },
    { title: 'Menú', url: '/menu', icon: 'ios-home-outline' },
    { title: 'Tu pedido actual', url: '/pedido/:id', icon: 'ios-cart-outline' },
    { title: 'Tus pedidos', url: '/pedidos', icon: 'ios-basket-outline' },
    { title: 'Tus datos personales', url: '/datos', icon: 'ios-person-outline' },
    { title: 'Quienes somos', url: '/who', icon: 'ios-pizza-outline' },
    { title: 'Aviso legal', url: '/legal', icon: 'ios-book-outline' },
  ];
  constructor() {
    addIcons({ mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp });
  }

  openPage(url: string) {
    console.log('openPage', url);
  }
}
