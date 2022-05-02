import { Component } from '@angular/core';
import { ServiceModel } from './Model/ServiceModel.model';
import { TableRecord } from './Model/TableRecord.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'reddit';

  isSuccess!: boolean;
  isError!: boolean;
  successMsg: string = ""
  errorMsg: string = "";

  removeDialogDisplayStyle = "none";
  addDialogDisplayStyle = "none";
  updateDialogDisplayStyle = "none";

  itemGIHS!: string;
  selectedDistrict!: string; 

  tableRecord!: TableRecord;

  ngOnInit(): void {}

  openReminderMsg(code: string, desc: string) {
    if (code == "200") {
      this.isSuccess = true;
      this.successMsg = desc;
      setTimeout(() => {
        this.isSuccess = false;
        window.location.reload();
      }, 3500);

    } else if (code == "500") {
      this.isError = true;
      setTimeout(() => {
        this.isError = false;
      }, 5000);
    }
  }

  deleteViewEventReceiver(object: any) {
    console.log("deleteViewEventReceiver!!!!");
    this.itemGIHS = object['itemGIHS'];
    this.selectedDistrict = object['selectedDistrict'];
    this.removeDialogDisplayStyle = "block";
  }

  addItemEventReceiver() {
    console.log("addItemEventReceiver");

    this.addDialogDisplayStyle = "block";
  }

  updateItemEventReceiver(tableRecord: TableRecord) {
    console.log("updateItemEventReceiver", tableRecord);
    this.tableRecord = tableRecord
    this.updateDialogDisplayStyle = "block";
  }

  dismissAddViewEventReceiver(serviceModel: ServiceModel) {
    this.addDialogDisplayStyle = "none";
    this.openReminderMsg(serviceModel.code, serviceModel.desc);
  }

  dismissEventReceiver(serviceModel: ServiceModel) {
    this.removeDialogDisplayStyle = "none";
    this.openReminderMsg(serviceModel.code, serviceModel.desc);
  }

  dismissUpdateViewEventReceiver(serviceModel: ServiceModel) {
    this.updateDialogDisplayStyle = "none";
    this.openReminderMsg(serviceModel.code, serviceModel.desc);
  }
}
