import {Injectable, TemplateRef} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

export interface LayoutSettings {
  hidden?: boolean;
  collapsed?: boolean;
  smartphone?: boolean;
  max_columns?: number;
}

export type Theme = 'light' | 'dark' | undefined;

export type DebugViewType = 'flatten' | 'unflatten' | 'raw';

export type AceTheme = 'eclipse' | 'one_dark' | 'nord_dark' | 'solarized_dark' | 'solarized_light';

export interface Preferences {
  collapsed_sidebar?: boolean;
  theme?: Theme;
  user_theme?: boolean;
  debug_view_type?: DebugViewType;
  ace_theme?: {
    light?: AceTheme,
    dark?: AceTheme,
  };
  decision_list_auto_load?: boolean;
}

@Injectable()
export class LayoutService {
  private _debug: BehaviorSubject<boolean> = new BehaviorSubject(null);

  private _preferences: BehaviorSubject<Preferences> = new BehaviorSubject({});

  private _loading: BehaviorSubject<{ loading: boolean; message?: string }> = new BehaviorSubject(null);

  private _layout$: BehaviorSubject<LayoutSettings> = new BehaviorSubject({});

  private _breadcrumb_right$: BehaviorSubject<TemplateRef<any>> = new BehaviorSubject(undefined);

  private _breadcrumb_center$: BehaviorSubject<TemplateRef<any>> = new BehaviorSubject(undefined);

  public constructor() {
  }

  private clear_obj(obj) {
    Object.keys(obj).forEach(key => {
      if ([null, undefined] .includes(obj[key])) delete obj[key];
    });
    return obj;
  }


  //region Debug
  get debug() {
    return this._debug.value ?? environment.debug;
  }

  set debug(debug: boolean) {
    this._debug.next(debug);
  }

  debug_on_change() {
    return this._debug.asObservable();
  }
  //endregion


  //region Preferences - Local Storage
  preferences_load(default_preferences: Preferences = {}) {
    let preferences = JSON.parse(window.localStorage.getItem('finq_preferences')) as Preferences || {};
    this._preferences.next({...this.clear_obj(default_preferences), ...this.clear_obj(preferences)});
  }

  get preferences() {
    return this._preferences.value;
  }

  set preferences(preferences: Preferences) {
    let previous = this.preferences;
    let next = {...this.clear_obj(previous), ...this.clear_obj(preferences)} as Preferences;
    window.localStorage.setItem('finq_preferences', JSON.stringify(next))
    this._preferences.next(next)

  }

  preferences_on_change() {
    return this._preferences.asObservable();
  }
  //endregion






  get loading() {
    return this._loading.asObservable();
  }

  global_loading(loading: boolean, message?: string) {
    this._loading.next({loading, message});
  }


  // Reponsive Layout

  public get layout(): Observable<LayoutSettings> {
    return this._layout$.asObservable();
  }

  public set_layout(layout: LayoutSettings): void {
    this._layout$.next(layout);
  }

  // Breadcrumb

  public get breadcrumb_right(): Observable<TemplateRef<any>> {
    return this._breadcrumb_right$.asObservable();
  }

  public set_breadcrumb_right(template: TemplateRef<any>) {
    this._breadcrumb_right$.next(template);
  }

  public get breadcrumb_center(): Observable<TemplateRef<any>> {
    return this._breadcrumb_center$.asObservable();
  }

  public set_breadcrumb_center(template: TemplateRef<any>) {
    this._breadcrumb_center$.next(template);
  }

  public clear_breadcrumb() {
    this.set_breadcrumb_right(undefined);
    this.set_breadcrumb_center(undefined);
  }
}
