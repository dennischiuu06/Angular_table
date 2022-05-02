import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiceModel } from '../Model/ServiceModel.model';
import { TableRecord } from '../Model/TableRecord.model';

@Component({
  selector: 'app-update-view',
  templateUrl: './update-view.component.html',
  styleUrls: ['./update-view.component.css']
})
export class UpdateViewComponent implements OnInit {
  http: HttpClient;
  serverData!: Object | null;
  url!: string;
  serverDataArr: any;
  updateSoccerPitches: FormGroup;

  serviceModel: ServiceModel = {
    code: '',
    desc: ''
  }

  @Input() updateDialogDisplayStyle!: string;
  @Input() tableRecord!: TableRecord;

  selectedUpdateGIHS!: string;
  selectedUpdateDistrict!: string;
  selectedUpdateAddress!: string;
  selectedUpdateName!: string;
  selectedUpdateHours!: string;
  selectedUpdatePhone!: string;
  selectedUpdateAncillary!: string;
  selectedUpdateRemarks!: string;

  constructor(fb: FormBuilder, http: HttpClient) {
    this.http = http;

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
  }

  ngOnInit(): void { }

  ngOnChanges() {
    this.selectedUpdateGIHS = this.tableRecord.itemGIHS
    this.selectedUpdateDistrict = this.tableRecord.district;
    this.selectedUpdateAddress = this.tableRecord.address;
    this.selectedUpdateName = this.tableRecord.name;
    this.selectedUpdateHours = this.tableRecord.opening_hours;
    this.selectedUpdatePhone = this.tableRecord.phone;
    this.selectedUpdateAncillary = this.tableRecord.ancillary_facilities;
    this.selectedUpdateRemarks = this.tableRecord.remarks;
  }

  @Output() dismissUpdateViewEvent = new EventEmitter<ServiceModel>();

  closePopup() {
    this.updateDialogDisplayStyle = "none"
    this.dismissUpdateViewEvent.emit();
  }

  updateNameAPICall(formValue: any): void {
    // if (formValue == null || formValue.courtNumber == 0) {
    //   // this.showError = 'The new name cannot be empty';
    //   // this.updateDialogDisplayStyle = "none";
    //   this.dismissUpdateViewEvent.emit();
    //   return;
    // }
    
    this.serverData = null;
    let gihs = this.selectedUpdateGIHS;
    this.url = "http://localhost/php/index.php/football/" + gihs + "/" + formValue['editDistrict'] + "/" + formValue['editName'] + "/" + formValue['editAddress'] + "/" + formValue['editHours'] + "/" + formValue['editPhone'] + "/" + formValue['editAncillary'] + "/" + formValue['editRemarks'];
    this.updateDialogDisplayStyle = "none";

    this.http.put(this.url, "").subscribe(
      {
        next: (res) => {
          console.log(res);
          
          this.serverData = res;
          this.serverDataArr = JSON.parse(JSON.stringify(res));

          this.serviceModel.code = this.serverDataArr['code'];
          this.serviceModel.desc = this.serverDataArr['description'];

          this.dismissUpdateViewEvent.emit(this.serviceModel);
        },
        error: (err) => {
          this.serviceModel.code = '500';
          this.serviceModel.desc = this.serverDataArr['description'];

          this.dismissUpdateViewEvent.emit(this.serviceModel);
          this.serverData = "http://localhost/php/index.php/football/" + gihs + "/" + formValue['editDistrict'] + "/" + formValue['editName'] + "/" + formValue['editAddress'] + "/" + formValue['editHours'] + "/" + formValue['editPhone'] + "/" + formValue['editAncillary'] + "/" + formValue['editRemarks'];
        }
      }
    );
  }
}