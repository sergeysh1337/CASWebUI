import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TeacherService } from 'src/services/WebApiService/teacher.service';
import { Teacher } from 'src/services/models/teacher';
import { TeacherUtils } from 'src/services/utils/teacherUtils';
import { SelectionModel } from '@angular/cdk/collections';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditTeacherComponent } from './components/add-edit-teacher/add-edit-teacher.component';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit, OnDestroy {
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
    'TeachesCourses',
  'action'];
  dataSource!: MatTableDataSource<Teacher>;

  teacherList: Teacher[] = [];
  teacherListSubscription!: Subscription;
  removeTeacher!: Teacher;
  isLoading=true;
  isSelected=false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;
  @ViewChild('myTable')
  myTable!: MatTable<any>;


  
  constructor(private teacherUtils: TeacherUtils, private teacherService: TeacherService, private modalService: NgbModal,public datepipe: DatePipe, private alertService: AlertService) {}
  ngOnInit(): void {
    this.getAllTeacherData();
  }
  selection = new SelectionModel<Teacher>(true, []);

  getAllTeacherData(){
    this.teacherListSubscription = timer(0, 60000).pipe(
      switchMap(()=> this.teacherService.getAllTeachers())
    ).subscribe((list: Teacher[])=>{
      this.teacherList = list;
      this.dataSource = new MatTableDataSource(this.teacherList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading=false;
      console.log("Get teacher refreshed");
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if(numSelected !== undefined)
      this.isSelected=true;
    else
      this.isSelected=false;
    return numSelected === numRows;
    
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if(this.isAllSelected())
    {
      this.selection.clear();
      this.isSelected=false;
    }
      else
      {
        this.dataSource.data.forEach(row => this.selection.select(row));
        this.isSelected=true;
      }
        
  }
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModal(teacher: Teacher = {Id: ""} ){
    const ref = this.modalService.open(AddEditTeacherComponent, { centered: true });
    ref.componentInstance.teacher = teacher;
    ref.componentInstance.teacher.Birth_date=this.datepipe.transform(teacher.Birth_date,'yyyy-MM-dd');
    ref.componentInstance.teacherList = this.teacherList;
    ref.result.then((result) => {
      if (result !== 'Close click') {
        this.dataSource.data = result;
      }
      });
  }

  openDelete(teacher:Teacher = {Id: ""} ){
    this.removeTeacher={
      Id: teacher.Id,
      First_name: teacher.First_name,
      Last_name: teacher.Last_name
    }
  }

  deleteSelectedTeachers()
  {
    if(this.selection.hasValue())
    {
      this.selection.selected.forEach(selected=>(this.deleteTeacher(selected.Id)));
      this.refreshData();
    }
  }

  deleteTeacher(id: string){
    if(id!==null || id!==undefined){
      this.teacherService.deleteById(id).subscribe(res => {
        if(res)
        {
          this.teacherList = this.teacherList.filter(item => item.Id !== id);
          this.dataSource.data = this.teacherList;
          this.alertService.successResponseFromDataBase();
        }
        else
        this.alertService.errorResponseFromDataBase();
      });
    }
  }

  refreshData(){
    if(this.teacherListSubscription)
      this.teacherListSubscription.unsubscribe();
    this.getAllTeacherData();
  }
  
  ngOnDestroy()
  {
    if(this.teacherListSubscription)
      this.teacherListSubscription.unsubscribe();
  }
}

