import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-flipper',
  templateUrl: './flipper.component.html',
  styleUrls: ['./flipper.component.scss'],
})
export class FlipperComponent implements OnInit, OnChanges {
  @Input() value: string;
  isNew = true;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges({ value }: SimpleChanges) {
    if (value.previousValue !== value.currentValue) {
      this.isNew = true;
      setTimeout(() => (this.isNew = false), 500);
    }
  }
}
