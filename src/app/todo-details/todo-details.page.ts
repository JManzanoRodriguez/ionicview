import { Component, OnInit } from '@angular/core';
import { Todo, TodoService } from '../services/todo.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})
export class TodoDetailsPage implements OnInit {

  todo: Todo = {} as Todo;
  // {
  //   task: 'test123',
  //   createdAt: new Date().getTime(),
  //   priority: 2
  // };

  todoId = null;

  constructor( private todoservice: TodoService,
               private route: ActivatedRoute,
               private loadingController: LoadingController,
               private nav: NavController ) { }

  ngOnInit() {
    this.todoId = this.route.snapshot.params['id'];
    if (this.todoId){
      this.loadTodo();
    }
  }

  async loadTodo() {
    const loading = await this.loadingController.create({ });
    await loading.present();

    this.todoservice.getTodo(this.todoId).subscribe(res => {
      loading.dismiss();
      this.todo = res;
    });
  }

  async saveTodo() {
    const loading = await this.loadingController.create({ });
    await loading.present();

    if (this.todoId){
      this.todoservice.updateTodo(this.todo, this.todoId).then( () => {
        loading.dismiss();
        this.nav.goBack();
      })
    }else{
      this.todoservice.addTodo(this.todo);
      loading.dismiss();
      this.nav.goBack();
    }
  }

}
