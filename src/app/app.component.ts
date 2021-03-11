import { ThrowStmt } from '@angular/compiler';
import { Component } from '@angular/core';
import { addMinutes, set, getTime, isBefore, isAfter, format } from 'date-fns';

interface Slot {
  id: string;
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todayDate: string = format(new Date(), 'yyyy-MM-dd');
  dateInput: string = '';
  timeInput: string = '';
  durationInput: number = 0;

  meetings: Slot[] = [];
  slot: Slot = {
    id: '',
    start: new Date(),
    end: new Date(),
  };
  canSave: boolean = false;
  isAvailable: boolean = false;

  constructor() {
    //this.durationInput = 0;
  }

  ngOnInit() {
    let meetings = localStorage.getItem('meetings');
    if (meetings) {
      this.meetings = JSON.parse(meetings);
      this.sortMeetings();
    }
  }

  sortMeetings() {
    this.meetings = this.meetings.map((m: Slot) => {
      return {
        id: m.id,
        start: new Date(m.start),
        end: new Date(m.end),
      };
    });
    this.meetings = this.meetings.sort((a: Slot, b: Slot) => {
      return getTime(new Date(a.start)) - getTime(new Date(b.start));
    });
  }

  generateSlot() {
    let timeParts = this.timeInput.split(':').map(Number);
    let start = set(new Date(this.dateInput), {
      hours: timeParts[0],
      minutes: timeParts[1],
    });
    let end = addMinutes(start, this.durationInput);
    return { id: Date.now().toString(), start, end };
  }

  checkSlot() {
    this.slot = this.generateSlot();

    if (isBefore(this.slot.start, new Date())) {
      return alert(
        "You can't create meeting before " + format(new Date(), 'hh:mm a')
      );
    }

    let isBusy = this.meetings.some((m: Slot) => {
      return (
        isBefore(this.slot.start, m.end) && isAfter(this.slot.end, m.start)
      );
    });

    if (isBusy) {
      alert('Slot Busy!');
    } else {
      this.canSave = true;
      alert('Slot Available!');
    }
  }

  saveSlot() {
    this.meetings.push(this.slot);
    this.syncMeetings();
    this.resetFields();
  }

  syncMeetings() {
    this.sortMeetings();
    localStorage.setItem('meetings', JSON.stringify(this.meetings));
  }

  deleteSlot(id: string) {
    this.meetings = this.meetings.filter((m) => m.id !== id);
    this.syncMeetings();
  }

  resetFields() {
    this.dateInput = '';
    this.timeInput = '';
    this.durationInput = 0;
    this.canSave = false;
  }
}
