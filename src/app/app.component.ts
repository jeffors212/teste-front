import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { LayoutService, Theme } from "./pages/layout/layout.service";
import { Timer, TimerControl } from "./shared/services/timer.service";
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public loading = false;
  public loading_message = 'Carregando...';
  public title = 'template-teste-frontend-angular';

  private console = { log: null, warn: null, info: null, debug: null, error: null };

  public timers: TimerControl[] = [];
  public session_timer: TimerControl = undefined;

  private debug_config = {
    dragging: false,
  };

  constructor(
    public ls: LayoutService,
    private timer: Timer,
    private router: Router,
    public sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {
    // @ts-ignore
    window.finqi_debug = (debug = true) => {
      this.ls.debug = debug;
      this.set_mode();
      console.clear();
      console.debug('Debug mode: ', this.ls.debug);
      this.cdr.detectChanges();
    };

    // @ts-ignore
    window.bind_keys = () => {
      let key_codes = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Konami code
      let key_index = 0;
      let key_timeout;
      console.log('Bind keys to debug!');

      const key_watcher = (event: KeyboardEvent) => {
        if (event['keyCode'] == key_codes[key_index++]) {
          clearTimeout(key_timeout);
          if (key_index == key_codes.length) {
            key_index = 0;
            // @ts-ignore
            this.ls.debug = !this.ls.debug;
          }
          key_timeout = setTimeout(() => {
            key_index = 0;
          }, 1000);
        } else key_index = 0;
      };

      window.removeEventListener('keyup', key_watcher, true);
      if (key_codes.length > 0) window.addEventListener('keyup', key_watcher, true);
    };

    // @ts-ignore
    window.bind_keys();
  }

  ngOnInit(): void {
    this.set_mode();

    this.ls.loading.subscribe((value) => {
      if (!value) return;
      this.loading = value.loading;
      if (value.message) this.loading_message = value.message;
      else
        setTimeout(() => {
          this.loading_message = '';
        }, 300);
    });

    this.ls.preferences_on_change().subscribe(({ theme }) => {
      this.set_theme(theme);
    });

    this.set_color_scheme_event_listener();
    if (this.router.url == '/') {
    //   if (this.ls.user) {
    //     this.router.navigate(['credit-analysis']);
    //     let {userAccessLevel} = this.ls.user;
    //     if (userAccessLevel == 100 || userAccessLevel == 80) this.router.navigate(['dashboard']);
    //     else if (userAccessLevel == 50 || userAccessLevel == 10) this.router.navigate(['customer-input']);
    //     else if (userAccessLevel == 11) this.router.navigate(['limit-calculation']);
    //   } else this.router.navigate(['login']);
      this.router.navigate(['dashboard'])
    }

    // this.ls.on_login.subscribe((value) => {
    //   console.log('OnLogin', value);
    //   if (value.token && value.user) this.set_timers();
    //   else this.remove_timers();
    // });
    //
    // if (this.ls.user && this.ls.token) {
    //   this.ls.set_login_data(this.ls.user, this.ls.token, this.ls.auth_user);
    // }
    //
    // if (!this.ls.user) {
    //   this.as.logout();
    //   return;
    // }
  }

  set_color_scheme_event_listener() {
    let color_scheme = window.matchMedia('(prefers-color-scheme: dark)');
    color_scheme.addEventListener('change', (e) => {
      let browser_theme = e.matches ? 'dark' : ('light' as Theme);
      this.ls.preferences = { theme: browser_theme };
      console.debug('Theme event', browser_theme);
    });
  }

  set_theme(theme) {
    let match = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let browser_theme = match ? 'dark' : 'light';
    let root = document.querySelector(':root');
    // @ts-ignore
    root.dataset.theme = theme || browser_theme;
  }

  set_mode() {
    if (!this.console.log) this.console.log = window.console.log;
    if (!this.console.warn) this.console.warn = window.console.warn;
    if (!this.console.info) this.console.info = window.console.info;
    if (!this.console.debug) this.console.debug = window.console.debug;
    if (!this.console.error) this.console.error = window.console.error;

    const ignored = (message?: any, ...optionalParams: any[]) => {
      return;
    };

    // @ts-ignore
    if (!this.ls.debug) {
      window.console.log = ignored;
      window.console.warn = ignored;
      window.console.info = ignored;
      window.console.debug = ignored;
      window.console.error = ignored;
    } else {
      window.console.log = this.console.log;
      window.console.warn = this.console.warn;
      window.console.info = this.console.info;
      window.console.debug = this.console.debug;
      window.console.error = this.console.error;
    }
  }

  // set_timers() {
  //   console.log('Token expiration:', this.ls.token.expiration);
  //
  //   let tcontrol = this.timer.set_control({
  //     name: 'Token Timer',
  //     type: 'to_time',
  //     duration_seconds: this.ls.token.expiration,
  //     // duration_seconds: 600,
  //     ended: false,
  //     on_timeout: (control) => {
  //       console.log('Inner token timeout', control.time_str);
  //       this.as.refresh_token(this.ls.token.refresh_token).subscribe((value) => {
  //         this.ls.token = value;
  //         control.restart(value.expiration);
  //       });
  //     },
  //   });
  //
  //   let scontrol = this.timer.set_control({
  //     name: 'Session Timer',
  //     duration_seconds: this.ls.user.client.parameters.performance.sessioncontroltimeoutseconds
  //       ? this.ls.user.client.parameters.performance.sessioncontroltimeoutseconds
  //       : 900,
  //     // duration_seconds: 20,
  //     ended: false,
  //     on_timeout: (control) => {
  //       console.log('Inner session timeout', control.time_str);
  //       this.toastr.info('Faça um novo login. ', 'Sessão expirada', {disableTimeOut: true})
  //       this.as.logout();
  //       // control.restart(this.ls.user.client.parameters.performance.sessioncontroltimeoutseconds);
  //     },
  //   });
  //
  //   this.session_timer = scontrol;
  //
  //   this.timers.push(tcontrol);
  //   this.timers.push(scontrol);
  //
  //
  //   this.timer.on_step = () => {
  //     // console.log('On step!');
  //     // this.cdr.detectChanges();
  //   };
  //
  //   this.timer.start();
  // }

  remove_timers() {
    this.timers = [];
    this.timer.stop();
  }

  on_drag_start(event: MouseEvent) {
    console.log(event);
    this.debug_config.dragging = true;
  }

  @HostListener('click', ['$event'])
  on_click(event) {
    if(this.session_timer) this.session_timer.restart();
  }

  @HostListener('mousemove', ['$event'])
  on_drag_move(event) {
    if (this.debug_config.dragging) {
      console.log(event);
    }
  }

  @HostListener('mouseup', ['$event'])
  on_drag_end(event: MouseEvent) {
    this.debug_config.dragging = false;
  }
}
