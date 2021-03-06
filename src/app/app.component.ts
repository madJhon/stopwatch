import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit} from '@angular/core';
import { interval, fromEvent, Subject, merge} from 'rxjs';
import { map, buffer, debounceTime, tap, filter, takeUntil, repeatWhen} from 'rxjs/operators'



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  title = 'stopwatch';
  @ViewChild('wait') btnwait: ElementRef;
  timer: string;
  isRunning = false;
  isWaiting = false;


  private counter = 0;
  private start$ = new Subject<void>();
  private stop$ = new Subject<void>();

  ngOnInit(): void {
    this.timer = this.getDisplayTimer(this.counter);
  }


  private checkTime(i) {
     return i < 10 ? "0" + i : i;
  };

  private getDisplayTimer(time: number) {

    if (!time) {
      return "00:00:00";
    }

    const hours = this.checkTime(Math.floor(time / 3600));
    const minutes = this.checkTime(Math.floor(time % 3600 / 60));
    const seconds = this.checkTime(Math.floor(time % 3600 % 60));

    return hours + ':' + minutes + ':' + seconds;
  }

  startTimer(){
    if(!this.isWaiting) {
      this.counter = 0;
      this.isRunning = true;
      this.start$.next();
    }
    this.isWaiting = false;
  }

  stopTimer(){
     this.counter = 0;
     this.timer = this.getDisplayTimer(this.counter);
     this.isWaiting = false;
     this.isRunning = false;
     this.stop$.next();
  }

  resetTimer(){
    this.counter = 0;
    this.timer = this.getDisplayTimer(this.counter);
    this.isWaiting = false;
  }

  ngAfterViewInit() {
    const btn$ = fromEvent(this.btnwait.nativeElement, 'click');
    const buff$ = btn$.pipe(debounceTime(300));

    const click$ = btn$.pipe(
      takeUntil(this.stop$),
      repeatWhen(() => this.start$),
      buffer(buff$),
      map(list => {
        return list.length;
      }),
      filter(x => x === 2),
    ).subscribe(() => {
      this.isWaiting = true;
    });


    interval(1000).pipe(
      takeUntil(this.stop$),
      repeatWhen(() => this.start$),
      filter(() => !this.isWaiting),
      tap(_ => {
        this.counter = this.counter + 1;
        this.timer = this.getDisplayTimer(this.counter);
      })).subscribe();

      this.stop$.next();
  }


  ngOnDestroy(){
    this.stopTimer();
  }
}
