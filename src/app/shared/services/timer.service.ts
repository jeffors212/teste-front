import {Injectable, OnDestroy} from '@angular/core';
import {BnNgIdleService} from 'bn-ng-idle';
import {Subscription, timer} from 'rxjs';

export interface TimerControl {
  name: string,
  type?: "normal" | "to_time",
  duration_seconds?: number,
  start?: number,
  ended: boolean,
  time_str?: string,
  on_step?: (control: TimerControl) => any,
  on_timeout: (control: TimerControl) => any,
  restart?: (duration_seconds?: number) => any
}

@Injectable()
export class Timer implements OnDestroy {
  private original_controls = [];
  private controls: TimerControl[] = [];

  private subscription: Subscription;
  public started = false;

  public on_step: CallableFunction = undefined;

  constructor(private bnIdle: BnNgIdleService) {

  }

  ngOnDestroy() {
    this.stop();
  }

  set_control(t: TimerControl) {
    t.time_str = Timer.FormatTime(0);
    if (!t.restart) {
      t.restart = (duration_seconds?: number) => {
        if (duration_seconds) t.duration_seconds = duration_seconds;
        t.ended = false;
        t.start = new Date().getTime();
        console.log(t.name, 'Refreshed', t.duration_seconds);
      };
    }
    this.controls.push(t);
    return t;
  }

  private refresh_timer() {
    for (const control of this.controls) {
      control.restart();
    }
  }

  start() {
    if (this.started) {
      console.log('Timer already started');
      return;
    }
    console.log('Timer started');
    this.started = true;

    this.refresh_timer();

    this.subscription = this.bnIdle.startWatching(0.5).subscribe(value => {
      let now = new Date().getTime();

      // console.log('Step', now);

      for (const control of this.controls) {
        let part = (control.duration_seconds * 1000);

        let distance = (control.start + part) - now;

        if (control?.type === 'to_time') {
          distance = (control.duration_seconds * 1000) - now;
        }


        control.time_str = distance > 0 ? Timer.FormatTime(distance) : 'Timeout!';
        if (control.on_step) control.on_step(control);


        if ((control.start + part) <= now) {
          if (!control.ended) {
            control.on_timeout(control);
            control.ended = true;
          }
        }
      }

      if (this.on_step) this.on_step();

    });


  }

  stop() {
    if (this.subscription) {
      this.bnIdle.stopTimer();
    }
    this.started = false;
  }


  private static FormatTime(ms: number): string {
    let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  private static sec_to_ms(sec: number) {

  }

}
