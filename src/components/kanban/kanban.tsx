import { Component, h, State, Element } from '@stencil/core';

@Component({
  tag: 'rf-kanban',
  styleUrl: './kanban.css',
  shadow: true,
})
export class Kanban {
  @Element() element: HTMLElement;
  @State() todos: string[] = ['Get groceries', 'Feed the dogs', 'Mow the lawn'];
  @State() doing: string[] = ['Binge 80 hours of Game of Thrones'];
  @State() done: string[] = ['Watch video of a man raising a grocery store lobster as a pet'];
  @State() inputValue = '';

  addTodos(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.inputValue = value;
  }
  submitTodos(event: Event) {
    event.preventDefault();
    let value = this.inputValue;
    this.todos.push(value);
    this.inputValue = '';
  }

  @State() draggingIndex: number | null = null;
  dragStart(index: number) {
    this.draggingIndex = index;
  }
  dragEnd() {
    this.draggingIndex = null;
  }

  componentDidLoad() {
    const droppables = this.element.shadowRoot.querySelectorAll('.swim-lane');
    droppables.forEach(zone => {
      zone.addEventListener('dragover', (e:MouseEvent) => {
        e.preventDefault();
        
        const bottomTask = this.insertAboveTask(zone, e.clientY);
        const curTask = this.element.shadowRoot.querySelector('.is-dragging');
        
        if (!bottomTask) {
          zone.appendChild(curTask);
        } else {
          zone.insertBefore(curTask, bottomTask);
        }
      });
    });
  }

  insertAboveTask = (zone, mouseY) => {
    const els = zone.querySelectorAll('.task:not(.is-dragging)');

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach(task => {
      const { top } = task.getBoundingClientRect();

      const offset = mouseY - top;

      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestTask = task;
      }
    });

    return closestTask;
  };

  render() {
    return (
      <div class="board">
        <form class="todo-form" onSubmit={this.submitTodos.bind(this)}>
          <input type="text" placeholder="New TOD0..." value={this.inputValue} onInput={this.addTodos.bind(this)}></input>
          <button type="submit">Add +</button>
        </form>

        <div class="lanes">
          <div class="swim-lane" id='todos'>
            <h3 class="heading">TODO</h3>
            {this.todos.map((item, index) => (
              <p
                class={{ 'task': true, 'is-dragging': this.draggingIndex === index }}
                draggable={true}
                onDragStart={this.dragStart.bind(this, index)}
                onDragEnd={this.dragEnd.bind(this)}
              >
                {item}
              </p>
            ))}
          </div>
          <div class="swim-lane" id='doing'>
            <h3 class="heading">Doing</h3>

            {this.doing.map((item, index) => (
              <p
                class={{ 'task': true, 'is-dragging': this.draggingIndex === index }}
                draggable={true}
                onDragStart={this.dragStart.bind(this, index)}
                onDragEnd={this.dragEnd.bind(this)}
              >
                {item}
              </p>
            ))}
          </div>
          <div class="swim-lane" id='done'>
            <h3 class="heading">Done</h3>

            {this.done.map((item, index) => (
              <p
                class={{ 'task': true, 'is-dragging': this.draggingIndex === index }}
                draggable={true}
                onDragStart={this.dragStart.bind(this, index)}
                onDragEnd={this.dragEnd.bind(this)}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
