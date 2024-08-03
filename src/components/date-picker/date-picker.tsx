import { Component, h, State, Element } from '@stencil/core';

@Component({
  tag: 'rf-date-picker',
  styleUrl: './date-picker.css',
  shadow: true,
})
export class DatePicker {
  @Element() element: HTMLElement;
  divDates: HTMLDivElement;
  nextBtn: HTMLButtonElement;
  prevBtn: HTMLButtonElement;
  monthInput: HTMLSelectElement;
  yearInput: HTMLInputElement;
  dateInput: HTMLInputElement;

  @State() isOpen = false;
  open() {
    this.isOpen = !this.isOpen;
  }

  // handle apply button click 
  handleApplyBtn(){
    this.dateInput.value = this.selectedDate.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
  }

  //handle next month nav
  handleNextBtn() {
    if (this.month === 11) {
      this.year++;
    }
    this.month = (this.month + 1) % 12;
    this.displayDates();
  }

  // handle prev month nav
  handlePrevBtn() {
    if (this.month === 0) {
      this.year--;
    }
    this.month = (this.month - 1 + 12) % 12;
    this.displayDates();
  }

  //  handle month input change change
  changeMonth() {
    this.month = this.monthInput.selectedIndex;
    this.displayDates();
  }

  // handle year input change event
  changeYear() {
    this.year = Number(this.yearInput.value);
    this.displayDates();
  }

  updateYearMonth() {
    this.monthInput.selectedIndex = this.month;
    this.yearInput.value = this.year.toString();
  }

  handleClick(dates: HTMLDivElement, e: Event) {
    const button = e.target as HTMLButtonElement;
    //remove the 'selected' class from other buttons
    const selected = dates.querySelector('.selected');
    selected && selected.classList.remove('selected');

    // add the 'selected' class to current button
    button.classList.add('selected');

    // set the selected date
    this.selectedDate = new Date(this.year, this.month, parseInt(button.textContent));
  }

  selectedDate = new Date();
  year = this.selectedDate.getFullYear();
  month = this.selectedDate.getMonth();

  //render the dates in the calendar interface
  displayDates = () => {
    const dates = this.divDates;
    //update year & month whenever the dates are updated
    this.updateYearMonth();

    // clear the dates
    dates.innerHTML = '';
    //* display the last week of previous month

    //get the last date of previous month
    const lastOfPrevMonth = new Date(this.year, this.month, 0);
    for (let i = 0; i <= lastOfPrevMonth.getDay(); i++) {
      const text = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;
      const button = this.createButton(text.toString(), true, -1);
      dates.appendChild(button);
    }
    //* display the current month

    //get the last date of the month
    const lastOfMonth = new Date(this.year, this.month + 1, 0);
    for (let i = 1; i <= lastOfMonth.getDate(); i++) {
      const button = this.createButton(i.toString(), false);
      button.addEventListener('click', event => this.handleClick(dates, event));
      dates.appendChild(button);
    }
    //* display the first week of next month
    const firstOfNextMonth = new Date(this.year, this.month + 1, 1);
    for (let i = firstOfNextMonth.getDay(); i < 7; i++) {
      const text = firstOfNextMonth.getDate() - firstOfNextMonth.getDay() + i;
      const button = this.createButton(text.toString(), true, 1);
      dates.appendChild(button);
    }
  };

  createButton = (text: string, isDisabled = false, type = 0 ) => {
    const currentDate = new Date();

    // determine the date to compare based on the button type
    let comparisonDate = new Date(this.year, this.month + type, Number(text));
    
    // check if the current button is the date today
    const isToday = currentDate.getDate().toString() === text && currentDate.getFullYear() === this.year && currentDate.getMonth() === (this.month + type);

    // check if the current button is selected
    const selected = this.selectedDate.getTime() === comparisonDate.getTime();

    const button = document.createElement('button');
    button.textContent = text;
    button.disabled = isDisabled;
    button.classList.toggle('today', isToday); //if is today true,add class 'today'
    button.classList.toggle('selected', selected);
    return button;
  };

  componentDidLoad() {
    this.displayDates();
  }
  render() {
    return (
      <div class="datepicker-container">
        <input type="text" class="date-input" placeholder="Select date" onClick={this.open.bind(this)} ref={el => this.dateInput = el} />

        <div class="datepicker" hidden={!this.isOpen}>
          <div class="datepicker-header">
            <button class="prev" ref={el => (this.prevBtn = el)} onClick={this.handlePrevBtn.bind(this)}>
              Prev
            </button>

            <div>
              <select class="month-input" ref={el => (this.monthInput = el)} onChange={this.changeMonth.bind(this)}>
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
              <input type="number" class="year-input" ref={el => (this.yearInput = el)} onInput={this.changeYear.bind(this)} />
            </div>

            <button class="next" ref={el => (this.nextBtn = el)} onClick={this.handleNextBtn.bind(this)}>
              Next
            </button>
          </div>

          <div class="days">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div class="dates" ref={el => (this.divDates = el)}></div>

          <div class="datepicker-footer">
            <button class="cancel" onClick={this.open.bind(this)}>
              Cancel
            </button>
            <button class="apply" onClick={()=>{this.open(); this.handleApplyBtn()}}>
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  }
}
