import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { isThisSecond } from 'date-fns';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Message, OutlookMessage, ReceiverDetails } from 'src/services/models/message';
import { Faculty, Group } from 'src/services/models/models';
import { Student } from 'src/services/models/student';
import { FacultyService } from 'src/services/WebApiService/faculty.service';
import { GroupService } from 'src/services/WebApiService/group.service';
import { MessageService } from 'src/services/WebApiService/message.service';
import { StudentService } from 'src/services/WebApiService/student.service';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.scss']
})

  export class ComposeComponent implements OnInit {

    FormData: FormGroup;
    public attachments:boolean = false;
    public carbonCopy:boolean = false;
    public blindCarbonCopy:boolean = false;
    public studentList:Student[]=[];
    public facultyList:Faculty[]=[];
    public groupList:Group[]=[];
    public receiverList:ReceiverDetails[]=[];
    public isFaculty:boolean=false;
    selectedFaculty: string[];
    selectedStudent: any;
    selectedGroup: any;

    public isGroup:boolean=false;
    public isStudent:boolean=false;
    selectedOptions:[];
    selectedOption:any;
    faculty:any;

  
    constructor(private builder: FormBuilder,
      private studentService:StudentService,
      private facultyService:FacultyService,
      private groupService:GroupService,
      private alertService:AlertService,
      private messageService:MessageService) { }
      
    ngOnInit() {
      this.FormData = this.builder.group({
      Description: new FormControl('', [Validators.required]),
      Subject: new FormControl('',[Validators.required,Validators.required]),
      faculties: new FormControl(''),
      groups: new FormControl(''),
      students: new FormControl(''),
      category: new FormControl(''),
      

    

      
      })

      }
choosenFaculty(e:any)
  {          
               
  }
 onSubmit(value:any)
 {
   if(this.isStudent)
   {
     console.log(this.FormData.value)
     this.sendMessage(this.FormData.value);
   }
  else if(this.isGroup)
  {
    this.studentService.getStudentsByGroups(this.FormData.value.groups).subscribe(studentList=>{
      let emails:string[]=[];
      if(studentList)
      {
        studentList.forEach(student=>{
         emails.push(student.Email);

        })
        this.FormData.value.students=emails;
        this.sendMessage(this.FormData.value);
      }
       
   });
  }
  else 
  {
    this.studentService.getStudentsByFaculties(this.FormData.value.faculties).subscribe(studentList=>{
      let emails:string[]=[];
      if(studentList)
      {
        studentList.forEach(student=>{
         emails.push(student.Email);

        })
        this.FormData.value.students=emails;
        this.sendMessage(this.FormData.value);
      }
       
   });

  }
 }

sendMessage(message:any)
{
  const msgToSend:Message={
    Description:message.Description,
    Subject:message.Subject,
    DateTime:new Date(),
    Receiver:message.students,
    Status:true
  }
  this.messageService.create(msgToSend).subscribe(res=>{
     if(res)
       console.log("succeded");
  });
}
 
choosenCategory(e:any)
    {
      if(e.value == 'faculty')
      {
        this.getAllFaculties();
       this.isFaculty=true;
       this.isGroup=false;
       this.isStudent=false;
      }

      
       else if(e.value == 'group')
       {
        this.getAllGroups();
         this.isGroup=true;
         this.isFaculty=false;
        this.isStudent=false;
       }

       else
       {
        this.getAllStudents();
        this.isStudent=true;
        this.isFaculty=false;
        this.isGroup=false;
       }
    }

   getAllFaculties()
   {
    this.facultyService.getAllFaculties().subscribe((list: Faculty[])=>{
      this.facultyList = list;
    });
   }
   getAllGroups()
   {
    this.groupService.getAllGroups().subscribe((list: Group[])=>{
      this.groupList = list;
    });
   }

   getAllStudents()
   {
    this.studentService.getAllstudents().subscribe((list: Student[])=>{
      this.studentList = list;
      this.studentList.map(
        (student: any) => {
          student.full_name = student.First_name + ' ' + student.Last_name;
          return student;
        });
    });
   }

  }
  
    
  
    

