import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TableRecord } from '../Model/TableRecord.model';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})


export class SearchPanelComponent implements OnInit {
  searchSoccerPitches: FormGroup;
  http: HttpClient;
  serverData!: Object | null;
  url!: string;
  serverDataArr: any;


  @Input() isSuccess = false;

  tableRecord: TableRecord = {
    itemGIHS: "",
    district: "",
    name: "",
    address: "",
    ancillary_facilities: "",
    opening_hours: "",
    phone: "",
    remarks: "",
  };
  
  searchEmpty = false;

  constructor(fb: FormBuilder, http: HttpClient) {
    this.http = http;
    this.searchSoccerPitches = fb.group(
      {
        'searchDistrict': []
      }
    );
  }

  ngOnInit(): void {    
    this.retrieveButtonHandler();
  }

  ngOnChanges(): void {
    if (this.isSuccess) {
      this.retrieveButtonHandler();
    }
  }

  @Output() deleteEvent = new EventEmitter<{itemGIHS: string, selectedDistrict: string}>();
  @Output() addItemEvent = new EventEmitter();
  @Output() updateItemEvent = new EventEmitter<TableRecord>();


  openDeleteDialog(array: any) {    
    this.deleteEvent.emit({itemGIHS: array['GIHS'], selectedDistrict:  array['district']});
  }

  openUpdateNamePopup(formValue: any) {
    this.tableRecord.itemGIHS = formValue['GIHS'];
    this.tableRecord.district = formValue['district'];
    this.tableRecord.name = formValue['name'];
    this.tableRecord.address = formValue['address'];
    this.tableRecord.ancillary_facilities = formValue['ancillary_facilities'];
    this.tableRecord.opening_hours = formValue['opening_hours'];
    this.tableRecord.phone = formValue['phone'];
    this.tableRecord.remarks = formValue['remarks'];

    this.updateItemEvent.emit(this.tableRecord);
  }


  openAddItemDialog() {
    this.addItemEvent.emit();
  }

  onSubmit(formValue: any): void {
    this.serverData = null;
    this.url = "http://localhost/server/index.php/football/" + formValue['searchDistrict'];

    this.http.get(this.url).subscribe({
      next: (res) => {
        this.serverData = res;
        this.serverDataArr = JSON.parse(JSON.stringify(res))        

        if (this.serverDataArr.length == 0) {          
          this.searchEmpty = true;
        } else {
          this.searchEmpty = false;
        }

      },
      error: (err) => {
        this.serverData = "http://localhost/server/index.php/football/" + formValue['searchDistrict'];
      }
    }
    );
  }

  retrieveButtonHandler(): void {
    this.serverData = null;
    this.url = "http://localhost/server/index.php/football/selectAll";

    this.http.get(this.url).subscribe({
      next: (res) => {
        this.serverData = res;
        this.serverDataArr = JSON.parse(JSON.stringify(res))
      },
      error: (err) => {
        this.serverData = "http://localhost/server/index.php/football/selectAll";
      }
    });
  }
}