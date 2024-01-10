import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRouteSnapshot, NavigationEnd, Router, UrlSegment} from '@angular/router';
import {Subscription} from "rxjs";

interface Breadcrumb {
  name: string,
  icon?: string,
  url: string,
}

export type TextTransform = 'capitalize' | 'uppercase' | 'lowercase' | 'unset';


@Component({
  selector: 'hub-breadcrumb-menu',
  templateUrl: 'hub-ng-breadcrumb-menu.component.html',
  styleUrls: ['hub-ng-breadcrumb-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HubNgBreadcrumbMenuComponent implements OnInit, OnDestroy {
  @Input()
  public base_title: string = '';

  public breadcrumbs: Breadcrumb[] = [];

  @Input()
  public use_url: boolean = false;


  @Input()
  public center_content?: TemplateRef<any> = undefined;


  @Input()
  public right_content?: TemplateRef<any> = undefined;

  @Input()
  public set_page_title: boolean = true;

  @Input()
  public title_separator: string = '>';

  @Input()
  public breadcrumb_separator: string = '/';

  @Input()
  public text_transform: TextTransform = 'unset';

  @Input()
  public sticky: boolean = true;


  @ViewChild('breadcrumb', {static: true})
  private breadcrumb_ref: ElementRef | undefined;

  private router_subscribe: Subscription | undefined;

  constructor(
    public router: Router,
    public title: Title,
    private element_ref: ElementRef
  ) {
    console.log('Hub Breadcrumb', 'created');
    if (!this.base_title) this.base_title = this.title.getTitle();
  }


  ngOnInit(): void {
    console.log('Hub Breadcrumb', 'init');
    this.set_breadcrumbs_recursive(this.router.routerState.snapshot.root);
    this.set_title();

    this.router_subscribe = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.breadcrumbs = [];
        this.set_breadcrumbs_recursive(this.router.routerState.snapshot.root);
        this.set_title();
      }
    });
  }

  ngOnDestroy(): void {
    this.router_subscribe?.unsubscribe();
  }

  private set_title() {
    let page_title = '';
    this.breadcrumbs.forEach(breadcrumb => {
      page_title += ` ${this.title_separator} ` + breadcrumb.name;
    });
    if (this.set_page_title) {
      this.title.setTitle(this.base_title + page_title);
    }
  }

  private set_breadcrumbs_recursive(node: ActivatedRouteSnapshot) {
    if (node.url) {
      let url_segments: UrlSegment[] = [];
      node.pathFromRoot.forEach(routerState => {
        url_segments = url_segments.concat(routerState.url);
      });
      let url = url_segments.map(urlSegment => urlSegment.path).join(this.breadcrumb_separator);
      let name = node.data['breadcrumb'];
      if ((this.use_url || node.data['breadcrumb_use_url'] == true) && !name) name = url_segments.pop()?.path;
      if (name) {
        let breadcrumb = this.breadcrumbs.find(value => value.name === name);
        if (!breadcrumb) {
          this.breadcrumbs.push({
            name: name,
            url: `/${url}`
          });
        }

      }
    }

    if (node?.firstChild) {
      this.set_breadcrumbs_recursive(node.firstChild);
    }
  }

  // @HostListener('window:scroll', ['$event'])
  // on_scroll(event: Event) {
  //   if (this.breadcrumb_ref?.nativeElement.offsetTop == window.scrollY) {
  //     this.breadcrumb_ref?.nativeElement.classList.add('stuck');
  //     this.breadcrumb_ref?.nativeElement.setAttribute('stuck', true);
  //   } else {
  //     this.breadcrumb_ref?.nativeElement.classList.remove('stuck');
  //     this.breadcrumb_ref?.nativeElement.removeAttribute('stuck');
  //   }
  //
  // }

}
