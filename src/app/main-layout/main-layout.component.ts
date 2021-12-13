import {Component, OnInit} from '@angular/core';
import {MediaObserver} from '@angular/flex-layout';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  sideMenuMode: 'over' | 'side' = 'over';
  sideMenuOpened = false;
  showMenuLabel = true;
  showMenu = true;
  isHomePage = false;

  constructor(
    public mediaObserver: MediaObserver,
    private router: Router) {
      // Hide sidenav and toolbar on home page
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
        console.log(this.router.url);
        console.log(event);
        if (this.router.url === '/home') {
          this.showMenu = false;
          this.isHomePage = true;
        } else {
          this.showMenu = true;
          this.isHomePage = false;
        }
      });

      mediaObserver.asObservable().subscribe((mediaChange) => {
        const screen = mediaChange[0].mqAlias;
        if (screen === 'xs') {
         this.sideMenuMode = 'over';
         this.sideMenuOpened = false;
         this.showMenuLabel = true;
        } else {
         this.sideMenuMode = 'side';
         this.sideMenuOpened = true;
        }
       });

    }

  ngOnInit(): void {
  }

  navigate(path): void {
    this.router.navigate([path]).then(() => {
      if (path === '/home') {
        // window.location.reload();
      }
    });
  }

}
