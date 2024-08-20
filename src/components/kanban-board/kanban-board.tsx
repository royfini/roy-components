import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'rf-kanban-board',
  styleUrl: './kanban-board.css',
  shadow: true,
})
export class Board {
  @State() todoItems: string[] = ['Task 1', 'Task 2', 'Task 3'];
  @State() inProgressItems: string[] = ['Task 4', 'Task 5'];
  @State() doneItems: string[] = [];
  @State() placeholderIndex: number = -1; // Track the index where the placeholder should appear
  @State() dragTargetArray: string = ''; // Track the target column

  onDragStart(event: DragEvent, item: string, sourceArray: 'todoItems' | 'inProgressItems' | 'doneItems') {
    event.dataTransfer.setData('text', JSON.stringify({ item, sourceArray }));
    this.placeholderIndex = -1;
    this.dragTargetArray = ''; // Reset on drag start
  }

  onDragOver(event: DragEvent, targetArray: 'todoItems' | 'inProgressItems' | 'doneItems') {
    event.preventDefault();

    // Only update if dragging over a different column
    if (this.dragTargetArray !== targetArray) {
      this.dragTargetArray = targetArray;
    }

    const dropTarget = event.target as HTMLElement;
    const targetRect = dropTarget.getBoundingClientRect();
    const dropPosition = event.clientY - targetRect.top;

    const children = Array.from(dropTarget.closest('.column').children).filter(child => child.classList.contains('item'));

    let insertIndex = children.findIndex(child => {
      const rect = (child as HTMLElement).getBoundingClientRect();
      return dropPosition < rect.top + rect.height / 2;
    });

    if (insertIndex === -1) {
      insertIndex = this[targetArray].length;
    }

    this.placeholderIndex = insertIndex;
  }

  onDrop(event: DragEvent, targetArray: 'todoItems' | 'inProgressItems' | 'doneItems') {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData('text'));
    const { item, sourceArray } = data;

    // Remove item from source array
    this[sourceArray] = this[sourceArray].filter(i => i !== item);

    // Insert item at placeholder index
    this[targetArray] = [...this[targetArray].slice(0, this.placeholderIndex), item, ...this[targetArray].slice(this.placeholderIndex)];

    // Reset state
    this.placeholderIndex = -1;
    this.dragTargetArray = '';
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  renderColumn(title: string, items: string[], arrayName: 'todoItems' | 'inProgressItems' | 'doneItems') {
    return (
      <div class="column" onDrop={event => this.onDrop(event, arrayName)} onDragOver={event => this.onDragOver(event, arrayName)}>
        <h3>{title}</h3>
        {items.map((item, index) => [
          index === this.placeholderIndex && this.dragTargetArray === arrayName ? <div class="placeholder"></div> : null, // Insert placeholder only in the target column
          <div class="item" draggable={true} onDragStart={event => this.onDragStart(event, item, arrayName)}>
            {item}
          </div>,
        ])}
        {this.placeholderIndex === items.length && this.dragTargetArray === arrayName ? <div class="placeholder"></div> : null} {/* Placeholder at the end */}
      </div>
    );
  }

  render() {
    return (
      <div class="kanban-board">
        {this.renderColumn('To Do', this.todoItems, 'todoItems')}
        {this.renderColumn('In Progress', this.inProgressItems, 'inProgressItems')}
        {this.renderColumn('Done', this.doneItems, 'doneItems')}
      </div>
    );
  }
}
