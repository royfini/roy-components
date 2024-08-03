import { Component, h, Element, State } from '@stencil/core';
import tailwind from '../../output.css';

@Component({
  tag: 'rf-select-search',
  styleUrl: './select-search.css',
  shadow: true,
})
export class SelectSearch {
  @Element() element: HTMLElement;

  componentDidLoad() {
    const shadowRoot = this.element.shadowRoot;
    if (shadowRoot) {
      const style = document.createElement('style');
      style.textContent = tailwind;
      shadowRoot.appendChild(style);
    }
  }

  data = [
    { code: '+961', img: 'https://flagcdn.com/w320/lb.png' },
    { code: '+392', img: 'https://flagcdn.com/w320/it.png' },
    { code: '+1', img: 'https://flagcdn.com/w320/us.png' },
    { code: '+34', img: 'https://flagcdn.com/w320/es.png' },
  ];

  @State() array = this.data;

  @State() isOpen = false;
  open() {
    this.isOpen = !this.isOpen;
  }

  @State() country = { code: '+961', img: 'https://flagcdn.com/w320/lb.png' };
  setCountry(value: { code: string; img: string }) {
    this.isOpen = false;
    this.country = value;
    this.array = this.data;
  }

  @State() searchValue = '';
  search(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value;
    let result = this.arraySearch();
    if ((this.searchValue = '')) {
      this.array = this.data;
    } else {
      this.array = result;
    }
  }

  arraySearch() {
    return this.data.filter(item => item.code.toLowerCase().includes(this.searchValue.toLowerCase()));
  }

  render() {
    let list = null;

    if (this.isOpen) {
      list = (
        <div class="flex flex-col items-center justify-start w-full h-16 max-h-16 overflow-y-scroll thin-scrollbar">
          <div class="flex flex-row relative">
            <input type="text" class="w-full px-1 outline-none bg-gray-300" onInput={this.search.bind(this)} value={this.searchValue}></input>
            <svg
              class="w-5 h-4 absolute right-1 top-1 z-10"
              data-slot="icon"
              fill="none"
              stroke-width="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path>
            </svg>
          </div>
          {this.array.map(data => (
            <button
              onClick={this.setCountry.bind(this, data)}
              class="w-full flex flex-row justify-between items-center px-3 hover:border-2 hover:border-gray-200 bg-gray-50  hover:bg-gray-200"
            >
              <div>{data.code}</div>
              <img class="w-5 h-4" src={data.img} />
            </button>
          ))}
        </div>
      );
    }

    return (
      <div class="flex flex-col w-32 items-center">
        <div class="flex flex-row w-full justify-between px-1 items-center bg-gray-50">
          <div class="w-3/4 flex flex-row justify-center items-center">
            <div>{this.country.code}</div>
            <img class="w-5 h-4" src={this.country.img} />
          </div>
          <div class="w-1/4">
            <button class="w-full" onClick={this.open.bind(this)}>
              <svg class="w-5 h-4" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"></path>
              </svg>
            </button>
          </div>
        </div>
        {list}
      </div>
    );
  }
}
