import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { formatDuration, intervalToDuration } from 'date-fns';

interface Slot {
  id: string;
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-meet-list',
  templateUrl: './meet-list.component.html',
  styleUrls: ['./meet-list.component.css'],
})
export class MeetListComponent implements OnInit {
  constructor() {}

  @Input() meetings: Slot[] = [];
  @Output() deleteSlot = new EventEmitter();

  ngOnInit(): void {}

  getDuration(start: Date, end: Date) {
    let interval: any = intervalToDuration({
      start: new Date(start),
      end: new Date(end),
    });
    return formatDuration(interval);
  }

  removeSlot(id: string) {
    this.deleteSlot.emit(id);
  }
}
