
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { interval, fromEvent, Subject, merge } from 'rxjs';
import {
  map,
  buffer,
  debounceTime,
  tap,
  filter,
  takeUntil,
  repeatWhen,
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'stopwatch';

  @ViewChild('wait') btnwait: ElementRef;

  started: boolean = false;
  stoped: boolean = true;
  reseted: boolean = false;
  waiting: boolean = false;

  start() {
    this.started = true;
  }

  stop() {
    this.stoped = true;
  }
  reset() {
    this.reseted = true;
  }

  ngAfterViewInit() {
    const btn$ = fromEvent(this.btnwait.nativeElement, 'click');
    const buff$ = btn$.pipe(debounceTime(300));

    const click$ = btn$
      .pipe(
        buffer(buff$),
        map((list) => {
          return list.length;
        }),
        filter((x) => x === 2)
      )
      .subscribe(() => {
        this.waiting = true;
      });
  }
}
