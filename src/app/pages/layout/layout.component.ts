import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LayoutService, LayoutSettings, Preferences, Theme } from "./layout.service";
import { MenuItem, UserAction, UserSection } from "../../../../projects/hub-ng-sidebar/src/lib/hub-ng-sidebar.types";
import { Router } from "@angular/router";


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @ViewChild('breadcrumb', {read: ElementRef, static: false})
  private breadcrumb_ref: ElementRef | undefined;

  breadcrumb_right: TemplateRef<any> = undefined;
  breadcrumb_center: TemplateRef<any> = undefined;

  menu: MenuItem[] = [
    {
      routeLink: 'dashboard',
      icon: 'fa fa-font-awesome',
      label: 'Competition',
    },
    {
      routeLink: 'athlete',
      icon: 'fa fa-male',
      label: 'Add athlete',
    },
  ];
  actions = {
    light_icon: 'fad fa-sun',
    light_text: 'Modo claro (Mudar para escuro)',
    dark_icon: 'fas fa-moon',
    dark_text: 'Modo escuro (Mudar para claro)',
    collapse_icon: 'fad fa-chevron-up fa-rotate-270',
    collapse_text: 'Minimizar Sidebar',
    uncollapse_icon: 'fad fa-chevron-up fa-rotate-90',
    uncollapse_text: 'Maximizar Sidebar',
    user_theme: {
      active: {
        // icon : 'fad fa-star-half',
        icon: 'fad fa-tint',
        text: 'Remover tema do cliente',
      },
      inactive: {
        // icon : 'fad fa-star-half fa-flip-horizontal',
        icon: 'fad fa-tint-slash',
        text: 'Usar tema do cliente',
      },
    },
  };
  environment = environment;

  breadcrumb_config = {
    show: true,
    sticky: true,
    stuck: false,
  };

  layout: LayoutSettings = {
    hidden: true,
    collapsed: false,
    smartphone: false,
    max_columns: 6,
  };

  user_avatar_default = 'https://placedog.net/128/128';
  user_section: UserSection = {
    name: `John Doe`,
    actions: null
  };

  client_section = {
    logo: '/assets/images/generic-logo-black.png',
    logo_dark_mode: '/assets/images/generic-logo-white.png',
    show_design: true
  };

  pathNow = '';

  avatar_click = {
    use_dog: false,
    count: 0,
    timeout: undefined
  };
  debug_click = {
    clicks_required: 10,
    count: 0,
    timeout: undefined,
    get_message: () => {
      if (this.debug_click.count >= 4 || (this.ls.debug && this.debug_click.count >= 1)) {
        return 'Keep clicking ' + this.debug_click.count;
      }
      if (this.ls.debug) return 'Debug mode enabled!';

      return '';
    }
  };


  get collapsedSidebar() {
    return this.layout.collapsed && !this.layout.smartphone;
  }

  get hiddenSidebar() {
    return this.layout.hidden && this.layout.smartphone;
  }



  constructor(
    public ls: LayoutService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.ls.set_layout(this.layout);
  }

  ngOnInit(): void {
    this.pathNow = this.router.url.split('?')[0];

    this.ls.breadcrumb_right.subscribe((value) => {
      // this.breadcrumb_right = value;
      setTimeout(() => {
        this.breadcrumb_right = value;
        this.cdr.detectChanges();
      });
    });
    this.ls.breadcrumb_center.subscribe((value) => {
      // this.breadcrumb_center = value;
      setTimeout(() => {
        this.breadcrumb_center = value;
        this.cdr.detectChanges();
      });
    });

    this.on_resize();



    this.ls.preferences_load({user_theme: true});

    this.ls.preferences_on_change().subscribe((preferences: Preferences) => {
      console.log('On Preferences change', preferences);
      this.layout.collapsed = preferences.collapsed_sidebar;

      // @ts-ignore
      let theme = preferences.theme || window.document.querySelector(':root').dataset.theme;


      this.user_section.actions = [
        new UserAction(
          this.layout.collapsed && !this.layout.smartphone ? this.actions.uncollapse_icon : this.actions.collapse_icon,
          this.layout.collapsed ? this.actions.uncollapse_text : this.actions.collapse_text,
          null,
          null,
          (item: UserAction) => {
            if (this.layout.smartphone) {
              this.toggle_sidebar();
              return;
            }
            this.layout.collapsed = !this.layout.collapsed;
            // this.ls.set_collapsed(this.layout.collapsed);
            this.ls.preferences = {collapsed_sidebar: this.layout.collapsed};
            if (this.layout.collapsed) {
              item.icon = this.actions.uncollapse_icon;
              item.tooltip = this.actions.uncollapse_text;
            } else {
              item.icon = this.actions.collapse_icon;
              item.tooltip = this.actions.collapse_text;
            }
          },
        ),
        new UserAction(
          theme == 'light' ? this.actions.light_icon : this.actions.dark_icon,
          theme == 'light' ? this.actions.light_text : this.actions.dark_text,
          null,
          null,
          (item: UserAction) => {
            if (theme === 'light') {
              this.ls.preferences = {theme: "dark"};
            } else {
              this.ls.preferences = {theme: "light"};
            }
            if (theme == 'light') {
              item.icon = this.actions.light_icon;
              item.tooltip = this.actions.light_text;
            } else {
              item.icon = this.actions.dark_icon;
              item.tooltip = this.actions.dark_text;
            }
          },
        ),
        new UserAction(
          this.ls.preferences.user_theme ? this.actions.user_theme.active.icon : this.actions.user_theme.inactive.icon,
          this.ls.preferences.user_theme ? this.actions.user_theme.active.text : this.actions.user_theme.inactive.text,
          null,
          null,
          (item: UserAction) => {
            // this.toogle_design();
            item.icon = this.ls.preferences.user_theme ? this.actions.user_theme.active.icon : this.actions.user_theme.inactive.icon;
            item.tooltip = this.ls.preferences.user_theme ? this.actions.user_theme.active.text : this.actions.user_theme.inactive.text;

            this.ls.preferences = {user_theme: !this.ls.preferences.user_theme};

          }),
        new UserAction('fad fa-sign-out-alt', 'Sair', null, null, () => {
          // this.as.logout();
        })
      ];

      this.cdr.detectChanges();
    });


  }

  getYear() {
    return new Date().getFullYear();
  }

  toggle_sidebar() {
    this.layout.hidden = !this.hiddenSidebar;
  }

  logout(): void {
    // this.as.logout();
  }




  //region Events
  @HostListener('scroll', ['$event'])
  on_scroll(event: WheelEvent) {
    // @ts-ignore
    // console.log('scroll', this.breadcrumb_ref?.nativeElement.offsetTop, event.target, event?.target.scrollTop);
    // console.log('scroll', this.breadcrumb_ref?.nativeElement.offsetTop, event.target);
    // @ts-ignore
    if (this.breadcrumb_ref?.nativeElement.offsetTop + 10 <= event?.target.scrollTop) {
      // console.log('stuck');
      this.breadcrumb_config.stuck = true;
      // this.breadcrumb_ref?.nativeElement.classList.add('stuck');
      // this.breadcrumb_ref?.nativeElement.setAttribute('stuck', true);
    } else {
      this.breadcrumb_config.stuck = false;
      // this.breadcrumb_ref?.nativeElement.classList.remove('stuck');
      // this.breadcrumb_ref?.nativeElement.removeAttribute('stuck');
    }
  }

  @HostListener('window:resize', ['$event'])
  on_resize() {
    if (window.innerWidth <= 720) {
      this.layout.max_columns = 1;
      this.layout.smartphone = true;
      this.layout.collapsed = true;
      this.ls.set_layout(this.layout);
    } else if (window.innerWidth <= 992) {
      this.layout.max_columns = 2;
      this.layout.smartphone = true;
      this.layout.collapsed = true;
      this.ls.set_layout(this.layout);
    } else {
      this.layout.max_columns = 10;
      this.layout.smartphone = false;
      this.layout.collapsed = false;
      this.ls.set_layout(this.layout);
    }
  }

  on_navigate() {
    if (this.layout.smartphone) this.layout.collapsed = true;
    if (this.pathNow != this.router.url.split('?')[0]) this.ls.clear_breadcrumb();
    if (!this.hiddenSidebar) this.toggle_sidebar();
    this.pathNow = this.router.url.split('?')[0];
  };

  on_avatar_click(event: MouseEvent, clicks = 5) {
    event.preventDefault();
    this.avatar_click.count++;
    clearTimeout(this.avatar_click.timeout);

    this.avatar_click.timeout = setTimeout(() => {
      this.avatar_click.count = 0;
    }, 400);

    if (this.avatar_click.count >= 2) {
      this.avatar_click.use_dog = !this.avatar_click.use_dog;
    }


  }

  debug_toogle(event: MouseEvent) {
    event.preventDefault();
    // console.info('debug_toogle', event);
    this.debug_click.count++;
    clearTimeout(this.debug_click.timeout);

    this.debug_click.timeout = setTimeout(() => {
      this.debug_click.count = 0;
      this.cdr.detectChanges();
      event.target.dispatchEvent(new Event('mouseup'));
    }, 500);

    if (this.debug_click.count >= this.debug_click.clicks_required) {
      this.debug_click.count = 0;
      this.ls.debug = !this.ls.debug;
    }

  }

}
