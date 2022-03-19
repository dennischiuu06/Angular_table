import { Component } from '@angular/core';
import { dataMock } from './mockData/mock';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'reddit';
  dataSource = dataMock;

  deleteButtonHandler(id: number) {
    console.log("Remove!!!!");
  }

  ngOnInit(): void {

  }

}
