import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { dataMock } from '../mockData/mock';

@Component({
  selector: 'app-search-example',
  templateUrl: './search-example.component.html',
  styleUrls: ['./search-example.component.css']
})
export class SearchExampleComponent implements OnInit {

  dataSource = dataMock;
  deleteButtonHandler(id: number) {
    console.log("Remove!!!!");
  }

  ngOnInit(): void {
    console.log("dataSource", this.dataSource);

  }
}