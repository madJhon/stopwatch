import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { FlipperComponent } from './stopwatch/flipper/flipper.component';



@NgModule({
  declarations: [StopwatchComponent, FlipperComponent],
  imports: [CommonModule],
  exports: [StopwatchComponent],
})
export class StopwatchModule {}
