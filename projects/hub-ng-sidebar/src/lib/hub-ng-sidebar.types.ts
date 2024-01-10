import {TemplateRef} from "@angular/core";

export interface RoleChecker {
  roles?: string[],
  or?: RoleChecker
}

export interface UserSection {
  avatar?: string,
  name: string,
  actions?: UserAction[] | null,
  menu?: MenuItem[] | null,
  template?: TemplateRef<any>,
  show?: boolean
}

export class UserAction {
  icon?: string | null;
  tooltip?: string | null;
  routeLink?: string | null;
  queryParams?: object | null;
  on_click?: MenuCallback | null;

  constructor(
    icon: string | null,
    tooltip?: string | null,
    routeLink?: string | null,
    queryParams?: object | null,
    on_click?: MenuCallback | null
  ) {
    this.icon = icon;
    this.tooltip = tooltip;
    this.routeLink = routeLink;
    this.queryParams = queryParams;
    this.on_click = on_click;
  }
}

export type MenuCallback = (item: MenuItem | UserSection) => void;


export class MenuItem {
  label?: string | null;
  icon?: string | null;
  tooltip?: string | null;
  routeLink?: string | null;
  queryParams?: object | null;
  on_click?: MenuCallback | null;
  match_type?: 'prefix' | 'exact' | null;
  submenu?: MenuItem[] | null;
  roles?: RoleChecker | null;


  constructor(
    label?: string | null,
    icon?: string | null,
    tooltip?: string | null,
    routeLink?: string | null,
    queryParams?: object | null,
    on_click?: MenuCallback | null,
    match_type?: 'prefix' | 'exact' | null,
    submenu?: MenuItem[] | null,
    roles?: RoleChecker | null
  ) {
    this.label = label;
    this.icon = icon;
    this.tooltip = tooltip;
    this.routeLink = routeLink;
    this.queryParams = queryParams;
    this.on_click = on_click;
    this.match_type = match_type;
    this.submenu = submenu;
    this.roles = roles;
  }
}

export class MenuSeparator extends MenuItem {
  type?: 'line' | 'label';

  constructor(type: 'line' | 'label' = "line", label?: string, icon?: string) {
    super();
    this.type = type;
    this.label = label;
    this.icon = icon;
  }
}
