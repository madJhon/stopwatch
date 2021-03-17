import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { interval, Subject, VirtualTimeScheduler } from 'rxjs';
import { tap, filter, takeUntil, repeatWhen, delay } from 'rxjs/operators';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnInit {
  @Input() counter: number = 0;

  @Input()
  set started(value: boolean) {
    if (!value) {
      return;
    }

    if (!this._isWaiting) {
      this._start$.next();
    }
    this._isWaiting = false;

    this.startedChange.emit(true);
    this.waitingChange.emit(false);
    this.stopedChange.emit(false);
  }

  @Input()
  set stoped(value: boolean) {
    if (!value) {
      return;
    }

    this.counter = 0;
    this._isWaiting = false;
    this._stop$.next();

    this.resetTime();

    this.counterChange.emit(this.counter);
    this.stopedChange.emit(true);
    this.waitingChange.emit(false);
    this.startedChange.emit(false);
  }

  @Input()
  set waiting(value: boolean) {
    if (!value) {
      return;
    }

    this._isWaiting = true;
    this.startedChange.emit(false);
    this.waitingChange.emit(true);
  }

  private resetTime() {
    this.hours = '00';
    this.minutes = '00';
    this.seconds = '00';
  }

  reset() {
    this.counter = 0;
    this.resetTime();
    this.counterChange.emit(this.counter);
  }

  @Output()
  readonly counterChange = new EventEmitter<number>(true);

  @Output()
  readonly startedChange = new EventEmitter<boolean>(true);

  @Output()
  readonly stopedChange = new EventEmitter<boolean>(true);

  @Output()
  readonly waitingChange = new EventEmitter<boolean>(true);

  hours: string;
  minutes: string;
  seconds: string;

  private _isWaiting = false;

  private _start$ = new Subject<void>();
  private _stop$ = new Subject<void>();

  ngOnInit(): void {
    this.hours = '00';
    this.minutes = '00';
    this.seconds = '00';

    interval(1000)
      .pipe(
        delay(0),
        takeUntil(this._stop$),
        repeatWhen(() => this._start$),
        filter(() => !this._isWaiting),
        tap((_) => {
          this.counter = this.counter + 1;
          this.counterChange.emit(this.counter);

          this.hours = this.currentHours;
          this.minutes = this.currentMinutes;
          this.seconds = this.currentSeconds;
        })
      )
      .subscribe();

    this._stop$.next();
  }

  private time(i) {
    return i < 10 ? '0' + i : i;
  }

  private get currentHours() {
    return this.time(Math.floor(this.counter / 3600));
  }

  private get currentMinutes() {
    return this.time(Math.floor((this.counter % 3600) / 60));
  }

  private get currentSeconds() {
    return this.time(Math.floor((this.counter % 3600) % 60));
  }

  ngOnDestroy() {
    this._stop$.next();
    this._stop$.complete();
  }
}
