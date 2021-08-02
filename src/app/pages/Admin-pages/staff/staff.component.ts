import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {SelectionModel} from '@angular/cdk/collections';
import { Subscription, Subject, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Admin } from 'src/services/models/admin';
import { AdminService } from 'src/services/WebApiService/admin.service';
import { UploadFileService } from 'src/services/WebApiService/uploadFile.service';
import { AddEditStaffComponent } from './components/add-edit-staff/add-edit-staff.component';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'Id' ,
    'First_name',
    'Last_name',
    'Image' ,
    'Email',
    'Phone',
    'Gender',
    'Birth_date',
    'Address',
    'action'];

    dataSource!: MatTableDataSource<Admin>;
    adminList: Admin[] = [];
    adminListSubscription!: Subscription;
    removeAdmin: Admin;
    refresh: Subject<any> = new Subject();
    isLoading=false;

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;
    @ViewChild(MatSort)
    sort: MatSort = new MatSort;
    @ViewChild('TABLE') table: ElementRef;
    constructor(private adminService: AdminService,
      private modalService: NgbModal,
      public datepipe:DatePipe, 
      private uploadFileService: UploadFileService, 
      private alertService: AlertService) {}

  ngOnInit(): void {
    this.isLoading=true;
    this.getAllAdminData();
  }
  selection = new SelectionModel<Admin>(true, []);


  getAllAdminData(){
    this.adminListSubscription = timer(0, 60000).pipe(
      switchMap(()=> this.adminService.getAllAdmins())
    ).subscribe((list: Admin[])=>{
      this.adminList = list;
      this.dataSource = new MatTableDataSource(this.adminList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading=false;
    });
    
  }

   openModal(admin: Admin = {Id: ""} ){
    const ref = this.modalService.open(AddEditStaffComponent, { centered: true });
    ref.componentInstance.admin = admin;
    ref.componentInstance.admin.Birth_date=this.datepipe.transform(admin.Birth_date,'yyyy-MM-dd');
    ref.componentInstance.adminList = this.adminList; 
    ref.result.then((result) => {
      if (result !== 'Close click') {
       this.dataSource.data = result;
      }
      });

    }
  openDelete(admin:Admin = {Id: ""} ){
    this.removeAdmin={
      Id: admin.Id,
      First_name: admin.First_name,
      Last_name: admin.Last_name
    }
  }
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteAdmin(id: string){
    if(id!==null || id!==undefined){
      this.adminService.deleteById(id).subscribe(res => {
        if(res)
        {
          this.adminList = this.adminList.filter(item => item.Id !== id);
          this.dataSource.data = this.adminList;
          this.alertService.successResponseFromDataBase();
        }
        else
        this.alertService.errorResponseFromDataBase();
      });
    }
  }
  refreshData(){
    if(this.adminListSubscription)
      this.adminListSubscription.unsubscribe();
    this.getAllAdminData();
  }
  ngOnDestroy(){
    if(this.adminListSubscription)
      this.adminListSubscription.unsubscribe();
  }

}