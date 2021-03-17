import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StopwatchModule } from './stopwatch/stopwatch.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, StopwatchModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
