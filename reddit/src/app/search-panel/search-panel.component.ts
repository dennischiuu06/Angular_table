import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TableRecord } from '../Model/tableRecord.model';

@Component({
  selector: 'app-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.css']
})


export class SearchPanelComponent implements OnInit {
  searchSoccerPitches: FormGroup;
  updateSoccerPitches: FormGroup;
  createNewSoccerPitches: FormGroup;

  @Input() searchType!: boolean;
  http: HttpClient;
  serverData!: Object | null;
  url!: string;
  serverDataArr: any;


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

  selectedDistrict!: string;

  itemGIHS!: string;
  selectedUpdateName!: string;
  selectedUpdateDistrict !: string;
  selectedUpdateAddress !: string;
  selectedUpdateHours!: string;
  selectedUpdatePhone !: string;
  selectedUpdateAncillary!: string;
  selectedUpdateRemarks !: string;

  isSuccess: boolean = false;
  isError: boolean = false;
  showError: string = "";

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(fb: FormBuilder, http: HttpClient) {
    this.http = http;
    this.searchSoccerPitches = fb.group(
      {
        'searchDistrict': []
      }
    );

    this.updateSoccerPitches = fb.group(
      {
        'editDistrict': [],
        'editName': [],
        'editAddress': [],
        'editHours': [],
        'editPhone': [],
        'editAncillary': [],
        'editRemarks': [],
      }
    );

    this.createNewSoccerPitches = fb.group(
      {
        'newDistrict': [],
        'newName': [],
        'newAddress': [],
        'newHours': [],
        'newPhone': [],
        'newAncillary': [],
        'newRemarks': [],
      }
    );
  }

  ngOnInit(): void {    
    this.retrieveButtonHandler();
  }

  openReminderMsg(code: string) {
    if (code == "200") {
      this.isSuccess = true

      setTimeout(() => {
        this.isSuccess = false;
      }, 5000);
    } else {
      this.isError = true

      setTimeout(() => {
        this.isError = false;
      }, 5000);
    }
  }

  updateDialogDisplayStyle = "none";
  removeDialogDisplayStyle = "none";
  addDialogDisplayStyle = "none";

  closePopup() {
    this.updateDialogDisplayStyle = "none";
    this.removeDialogDisplayStyle = "none";
    this.addDialogDisplayStyle = "none";
  }

  @Output() deleteEvent = new EventEmitter<{itemGIHS: string, selectedDistrict: string}>();
  @Output() addItemEvent = new EventEmitter();
  @Output() updateItemEvent = new EventEmitter<TableRecord>();


  openDeleteDialog(array: any) {    
    this.deleteEvent.emit({itemGIHS: array['GIHS'], selectedDistrict:  array['district']});
  }

  openUpdateNamePopup(formValue: any) {
    console.log("Update: itemGIHS/" + formValue['GIHS']);

    // this.itemGIHS = formValue['GIHS'];
    // this.selectedUpdateDistrict = formValue['district'];
    // this.selectedUpdateName = formValue['name'];
    // this.selectedUpdateAddress = formValue['address'];
    // this.selectedUpdateAncillary = formValue['ancillary_facilities'];
    // this.selectedUpdateHours = formValue['opening_hours'];
    // this.selectedUpdatePhone = formValue['phone'];
    // this.selectedUpdateRemarks = formValue['remarks'];
    //     this.updateDialogDisplayStyle = "block";

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
    // this.addDialogDisplayStyle = "block";
    this.addItemEvent.emit();
  }



  onSubmit(formValue: any): void {
    this.serverData = null;
    this.url = "http://localhost/php/index.php/football/" + formValue['searchDistrict'];

    this.http.get(this.url).subscribe({
      next: (res) => {
        this.serverData = res;
        this.serverDataArr = JSON.parse(JSON.stringify(res))
      },
      error: (err) => {
        this.serverData = "http://localhost/php/index.php/football/" + formValue['searchDistrict'];
      }
    }
    );
  }

  retrieveButtonHandler(): void {
    this.serverData = null;
    this.url = "http://localhost/php/index.php/football/selectAll";

    this.http.get(this.url).subscribe({
      next: (res) => {
        this.serverData = res;
        this.serverDataArr = JSON.parse(JSON.stringify(res))
      },
      error: (err) => {
        this.serverData = "http://localhost/php/index.php/football/selectAll";
      }
    });
  }

  // deleteButtonHandler() {
  //   this.serverData = null;
  //   this.url = "http://localhost/php/index.php/football/" + this.itemGIHS;

  //   this.http.delete(this.url).subscribe(
  //     {
  //       next: (res) => {
  //         this.serverData = res;
  //         this.serverDataArr = JSON.parse(JSON.stringify(res));
  //         this.openReminderMsg(this.serverDataArr['code']);
  //         this.retrieveButtonHandler();
  //       },
  //       error: (err) => {
  //         this.serverData = "Failed to call server: " + err;
  //       }
  //     }
  //   );
  //   this.removeDialogDisplayStyle = "none"
  // }

  updateNameAPICall(formValue: any): void {
    if (formValue == null || formValue.courtNumber == 0) {
      this.showError = 'The new name cannot be empty';
      this.updateDialogDisplayStyle = "none";
      return;
    }

    this.serverData = null;
    let gihs = this.itemGIHS;
    this.url = "http://localhost/php/index.php/football/" + gihs + "/" + formValue['editDistrict'] + "/" + formValue['editName'] + "/" + formValue['editAddress'] + "/" + formValue['editHours'] + "/" + formValue['editPhone'] + "/" + formValue['editAncillary'] + "/" + formValue['editRemarks'];
    this.updateDialogDisplayStyle = "none";

    this.http.put(this.url, "").subscribe(
      {
        next: (res) => {
          this.serverDataArr.forEach(function (value: any) {
            if (value['gihs'] == gihs) {
              value["district"] = formValue['editDistrict'];
              value["name"] = formValue['editName'];
              value["address"] = formValue['editAddress'];
              value["opening_hours"] = formValue['editHours'];
              value["phone"] = formValue['editPhone'];
              value["ancillary_facilities"] = formValue['editAncillary'];
              value["remarks"] = formValue['editRemarks'];
            }

          });
          this.serverData = res;
          this.serverDataArr = JSON.parse(JSON.stringify(res));
          this.openReminderMsg(this.serverDataArr['code']);
          this.retrieveButtonHandler();
        },
        error: (err) => {
          this.serverData = "http://localhost/php/index.php/football/" + gihs + "/" + formValue['editDistrict'] + "/" + formValue['editName'] + "/" + formValue['editAddress'] + "/" + formValue['editHours'] + "/" + formValue['editPhone'] + "/" + formValue['editAncillary'] + "/" + formValue['editRemarks'];
        }
      }
    );
  }

  // addNewItemAPICall(formValue: any): void {
  //   if (formValue == null || formValue.courtNumber == 0) {
  //     this.showError = 'The new name cannot be empty';
  //     this.addDialogDisplayStyle = "none";
  //     return;
  //   }

  //   this.serverData = null;
  //   this.url = "http://localhost/php/index.php/football/" + 'gihs' + "/" + formValue['newDistrict'] + "/" + formValue['newName'] + "/" + formValue['newAddress'] + "/" + formValue['newHours'] + "/" + formValue['newPhone'] + "/" + formValue['newAncillary'] + "/" + formValue['newRemarks'];
  //   this.addDialogDisplayStyle = "none";

  //   this.http.post(this.url, "").subscribe(
  //     {
  //       next: (res) => {
  //         console.log(res);
  //         this.isSuccess = true;
  //         this.serverData = res;
  //         this.serverDataArr = JSON.parse(JSON.stringify(res));
  //         this.openReminderMsg(this.serverDataArr['code']);
  //         this.retrieveButtonHandler();

  //       },
  //       error: (err) => {
  //         this.serverData = "http://localhost/php/index.php/football/" + 'gihs' + "/" + formValue['newDistrict'] + "/" + formValue['newName'] + "/" + formValue['newAddress'] + "/" + formValue['newHours'] + "/" + formValue['newPhone'] + "/" + formValue['newAncillary'] + "/" + formValue['newRemarks'];
  //       }
  //     }
  //   );
  // }
}