import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Todo {
  // id?: string;
  task: string;
  priority: number;
  createdAt: number;
}


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todosCollection: AngularFirestoreCollection<Todo>;

  private todos: Observable<Todo[]>;

  constructor( private db: AngularFirestore ) { 
    this.todosCollection = db.collection<Todo>('todos')

    this.todos = this.todosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        })
      })
    )
  }

  getTodos(){
    return this.todos;
  }

  getTodo(id: string){
    return this.todosCollection.doc<Todo>(id).valueChanges();
  }

  updateTodo(todo: Todo, id: string){
    return this.todosCollection.doc(id).update(todo);
  }

  addTodo(todo: Todo){
    return this.todosCollection.add(todo);
  }

  removeTodo(item){
    return this.todosCollection.doc(item.id).delete();
  }
}
