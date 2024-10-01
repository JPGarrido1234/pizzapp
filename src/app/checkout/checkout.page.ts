import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage {

    constructor(private router: Router, public modalCtrl: ModalController) {
    }

    ionViewDidLoad() {
    }

    async showPopup() {
      /*
        let profileModal = this.modalCtrl.create(PopupPage);
        profileModal.present();

        setTimeout(() => {
            profileModal.dismiss();
            this.navCtrl.setRoot(MenuPage);
        }, 1500);
        */

        /*
        const profileModal = await this.modalCtrl.create({
          component: PopupPage
        });
        await profileModal.present();

        setTimeout(async () => {
          await profileModal.dismiss();
          this.router.navigate(['/menu']); // Navega a la página del menú
        }, 1500);
        */
    }


}
