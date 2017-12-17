import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../providers/providers';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = 'PreloadPage';
    // rootPage: any = 'LoginPage';

    pages: Array<{title: string, component: any, icon:string}>;

    constructor(private auth: AuthService,
                public platform: Platform, 
                public statusBar: StatusBar, 
                public splashScreen: SplashScreen, 
                public loadingCtrl: LoadingController) {

        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home',       component: 'HomePage',    icon: 'home'},
            { title: 'My Farmers', component: 'FarmersPage', icon: 'people'},
            { title: 'Account',    component: 'HomePage',    icon: 'analytics'},
            { title: 'Settings',   component: 'HomePage',    icon: 'settings'},
        ];

    }

    initializeApp() {
        setTimeout( () => {

            this.platform.ready().then(() => {
                // Okay, so the platform is ready and our plugins are available.
                // Here you can do any higher level native things you might need.
                this.statusBar.styleDefault();
                this.splashScreen.hide();
                this.auth.isAuthenticated().subscribe(success => {
                    if(success){
                        this.nav.setRoot('HomePage');
                    }
                    else{
                        this.nav.setRoot('LoginPage');
                    }
                });
            });
        }, 2000);
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if(page){
            this.nav.setRoot(page.component);
        }
    }

    logout(){
        let loading = this.presentLoading('Please wait...');
        loading.present();

        this.auth.logout().subscribe();
        this.nav.setRoot('LoginPage');
        loading.dismiss();
    }


    presentLoading(text: string) {
        let loading = this.loadingCtrl.create({
            content: text
        });

        return loading;
    }
}
