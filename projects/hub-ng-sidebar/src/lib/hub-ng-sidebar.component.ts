import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MenuItem, MenuSeparator, RoleChecker, UserAction, UserSection } from './hub-ng-sidebar.types';
import { AvailbleBSPositions } from 'ngx-bootstrap/positioning';

@Component({
  selector: 'hub-ng-sidebar',
  templateUrl: './hub-ng-sidebar.component.html',
  styleUrls: ['./hub-ng-sidebar.component.scss'],
})
export class HubNgSidebarComponent implements OnInit, OnDestroy {
  private base_title = '';

  public start_padding = 0.8; // rem
  public level_padding = 1.5; // rem
  public level_padding_unit = 'em';

  @Input()
  public tooltip_placement: AvailbleBSPositions = 'top';

  @Input()
  public roles: string[] = [];

  @Input()
  public items: MenuItem[] = [];

  @Input()
  public collapsed = false;

  @Input()
  public touch_mode = false;

  @Output()
  public on_navigate: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public on_avatar_click: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  private router_subscribe: Subscription | undefined;

  @Input()
  // public default_avatar: string | null | undefined = 'https://quintao.ninja/files/uploads/977040001662762203-jack2.jpeg';
  public default_avatar: string | null | undefined;

  @Input()
  public user_section: UserSection | undefined;

  constructor(public router: Router, title: Title) {
    this.base_title = title.getTitle();
  }

  public ngOnInit(): void {
    // @ts-ignore
    this.router_subscribe = this.router.events.subscribe((value) => {
      if (value instanceof NavigationEnd) {
        this.on_navigate.emit();
      }
    });
  }

  ngOnDestroy(): void {
    this.router_subscribe?.unsubscribe();
  }

  public is_separator(menu_item: MenuItem) {
    if (menu_item instanceof MenuSeparator) {
      return menu_item.type;
    }
    return false;
  }

  toggle_submenu(event: MouseEvent, link?: string) {
    // console.log('toggle_submenu', this.router.url, link);
    // @ts-ignore
    if (!link || link == this.router.url) event.currentTarget.classList.toggle('hide');
  }

  private _check_roles(checker?: RoleChecker): string[] {
    if (!checker || Object.keys(checker).length === 0) return [];
    let _errors = [];

    for (let key of Object.keys(checker)) {
      if (checker.roles)
        for (const role_name of checker.roles) {
          let resp = this.roles.find((value) => value === role_name);
          if (!resp) _errors.push(role_name);
        }
      if (_errors.length > 0 && checker.or) {
        return this._check_roles(checker.or);
      }
    }
    return _errors;
  }

  check_roles(checker: RoleChecker, _throw = true) {
    let errors = this._check_roles(checker);
    return !(errors && errors.length > 0);
  }

  public get_user_action_grid(items: any[]) {
    return `repeat(${items.length}, auto)`;
  }

  toggle(event: MouseEvent) {
    if (!event.defaultPrevented && this.user_section?.menu && this.user_section.menu?.length > 0)
      this.user_section.show = !this.user_section.show;
  }

  trigger_on_click(item: MenuItem | UserAction, event?: MouseEvent) {
    if (event) event.preventDefault();
    if (item.on_click) {
      item.on_click(item);
    }
  }

  get_avatar_url() {
    return `url(${this.user_section?.avatar ?? this.default_avatar})`;
  }

  _on_avatar_click($event: MouseEvent) {
    this.on_avatar_click.emit($event);
  }
}
