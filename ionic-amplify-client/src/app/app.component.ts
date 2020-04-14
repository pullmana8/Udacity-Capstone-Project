import { Component } from '@angular/core'

import { Platform } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'

import { APIService } from './API.service'
import { createTodo } from 'src/graphql/mutations'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private apiService: APIService
  ) {
    this.initializeApp()
  }

  createTodo() {
    this.apiService.CreateTodo({
      name: 'ionic',
      description: 'testing',
    })
  }

  todos: Array<any>

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault()
      this.splashScreen.hide()
      this.apiService.ListTodos().then((evt) => {
        this.todos = evt.items
      })
      this.apiService.OnCreateTodoListener.subscribe((evt) => {
        const data = (evt as any).value.data.onCreateTodo
        this.todos = [...this.todos, data]
      })
    })
  }
}
