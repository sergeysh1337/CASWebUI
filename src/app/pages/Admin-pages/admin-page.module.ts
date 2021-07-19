import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AddEditTeacherComponent } from './teachers/components/add-edit-teacher/add-edit-teacher.component';
import { TeachersComponent } from './teachers/teachers.component';
import { CoursesComponent } from './courses/courses.component';
import { ExamsComponent } from './exams/exams.component';
import { GroupsComponent } from './groups/groups.component';
import { HolidayComponent } from './holiday/holiday.component';
import { LinksComponent } from './links/links.component';
import { ReportsComponent } from './reports/reports.component';
import { RequestsComponent } from './requests/requests.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { AngularMaterialModule } from 'src/app/Core/material-module/angular-material.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AddEditStudentComponent } from './students/components/add-edit-student/add-edit-student.component';
import { EventModalComponent } from './time-table/components/event-modal/event-modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { StudentsComponent } from './students/students.component';
import { EmailComponent } from './email/email.component';
import { FacultiesComponent } from './faculty/faculties.component';
import { AddEditFacultyComponent } from './faculty/components/add-edit-faculty/add-edit-faculty.component';
import { AddEditGroupComponent } from './groups/components/add-edit-group/add-edit-group.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AdminPageComponent } from './admin-page.component';
import { AdminPageRoutingModule } from './admin-page-routing.module';
import { AddEditHolidayComponent } from './holiday/components/add-edit-holiday/add-edit-holiday.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';





@NgModule({
  declarations: [
    GroupsComponent,
    HolidayComponent,
    ExamsComponent,
    ReportsComponent,
    LinksComponent,
    RequestsComponent,
    TeachersComponent,
    AddEditTeacherComponent,
    TimeTableComponent,
    CoursesComponent,
    EventModalComponent,
    AddEditStudentComponent,
    StudentsComponent,
    EmailComponent,
    FacultiesComponent,
    AddEditFacultyComponent,
    AddEditGroupComponent,
    DashboardComponent,
    AdminPageComponent,
    AddEditHolidayComponent,
  ],
  imports: [
    AngularMaterialModule,
    MatIconModule,
    FlexLayoutModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatCheckboxModule,
    CommonModule,
    AdminPageRoutingModule,
    FormsModule, 
    //BrowserAnimationsModule,
    //BrowserModule,
    NgbModalModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    NgxChartsModule,
    RouterModule,
    FlatpickrModule.forRoot(
      ),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  exports: [
    GroupsComponent,
    HolidayComponent,
    TimeTableComponent,
    ExamsComponent,
    ReportsComponent,
    LinksComponent,
    RequestsComponent,
    TimeTableComponent,
    TeachersComponent,
    AddEditTeacherComponent,
    CoursesComponent,
    AddEditStudentComponent,  
    FacultiesComponent,
    AddEditFacultyComponent,
    AddEditGroupComponent,
    DashboardComponent


  ]
})
export class AdminPageModule { }