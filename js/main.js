/* JS for WATS 3020 Roster Project */

class Person {
    constructor(name, email) { //makes 'name' and 'email' available as attributes
        this.name = name;
        this.email = email;
        this.username = email.split('@')[0]; //jhu@seattleu.edu -> [jhu][seattleu.edu]
    } // takes name before the `@` symbol in the `email` value and stores it in 'username'
}

class Student extends Person {
    constructor(name, email) {
        super(name, email); //extends functionality of constructor() method from "Person"
        this.attendance = []; //attendance tracks and records attedance
    }
    // This method gives a percentage of how many days the student was present.
    calculateAttendance() {
        if(this.attendance.length > 0) {
            let counter = 0; //0 stands for "absent", 1 stands for "present"
            for (let mark of this.attendance) {
                counter += mark;
            }
            let attendancePercent = (counter / this.attendance.length) * 100;
            return `${attendancePercent.toFixed(2)}%`;// Attendance percentage is calculated as average of
            // all the items in the attendance array.
        } else {
            return '0%';
        }
    }
}

class Teacher extends Person {
        constructor(name, email, honorific) {
            super(name, email);
            this.honorific = honorific;//supplied when an instance of `Teacher` is created).
        }
}

//Sets up our Course class so we can run the whole roster from it.
class Course {
    constructor(courseCode, courseTitle, courseDescription){
        this.code = courseCode;
        this.title = courseTitle;
        this.description = courseDescription;
        this.teacher = null;
        this.students = [];
    }
    addStudent() {
        let name = prompt("Enter student full name:", "John Doe");
        let email = prompt("Enter student email: ", "jdoe@seattleu.edu");
        let newStudent = new Student(name, email);
        this.students.push(newStudent);
        updateRoster(this);
    }
   //addStudent and setTeacher prompts the user for information required to 
   //create a new `Student` object and 'Teacher' object and adds them to
   //respective arrays.

    setTeacher() {
        let name = prompt("Enter teacher full name: ", "Steve Martin");
        let email = prompt("Enter teacher email: ", "smartin@seattleu.edu");
        let honorific = prompt("Enter honorific: ", "Prof.");
        let newTeacher = new Teacher(name, email, honorific);
        this.teacher = newTeacher;
        updateRoster(this);
    }

    /////////////////////////////////////////
    // `markAttendance()` method /////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    //`markAttendance()` should accept a parameter called `username` containing the
    // `username` that will match the `username` property on the `Student` object.

    // `Student` object is retrieved from the `this.students` Array.

    // When specific `Student` object is retrieved, we can use the appropriate method
    // on the `Student` object to record the attendance.
    markAttendance(username, status = "present") {
        let foundStudent = this.findStudent(username);
        if (status === "present") {
            foundStudent.attendance.push(1);
        } else {
            foundStudent.attendance.push(0);
        }
        updateRoster(this);
    }

    //////////////////////////////////////////////
    // Methods provided for you -- DO NOT EDIT /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    findStudent(username){
        // This method provided for convenience. It takes in a username and looks
        // for that username on student objec ts contained in the `this.students`
        // Array.
        let foundStudent = this.students.find(function(student, index){
            return student.username == username;
        });
        return foundStudent;
    }
}

/////////////////////////////////////////
// Prompt User for Course Info  //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//
// Prompt the user for information to create the Course. In order to create a
// `Course` object, you must gather the following information:
//
let courseCode = prompt("Enter the course code: ", "WATS 3020");

let courseTitle = prompt("Enter the course title: ", "Intro to JavaScript");

let courseDescription = prompt ("Enter the course description:", "Learning to code JS");

// Creates a new `Course` object instance called `myCourse` using the three data points just collected from the user.
let myCourse = new Course(courseCode, courseTitle, courseDescription);

///////////////////////////////////////////////////
//////// Main Script /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// This script runs the page. You should only edit it if you are attempting a //
// stretch goal. Otherwise, this script calls the functions that you have     //
// created above.                                                             //
////////////////////////////////////////////////////////////////////////////////

let rosterTitle = document.querySelector('#course-title');
rosterTitle.innerHTML = `${myCourse.code}: ${myCourse.title}`;

let rosterDescription = document.querySelector('#course-description');
rosterDescription.innerHTML = myCourse.description;

if (myCourse.teacher){
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = `${myCourse.teacher.honorific} ${myCourse.teacher.name}`;
} else {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = "Not Set";
}

let rosterTbody = document.querySelector('#roster tbody');
// Clear Roster Content
rosterTbody.innerHTML = '';

// Create event listener for adding a student.
let addStudentButton = document.querySelector('#add-student');
addStudentButton.addEventListener('click', function(e){
    console.log('Calling addStudent() method.');
    myCourse.addStudent();
})

// Create event listener for adding a teacher.
let addTeacherButton = document.querySelector('#add-teacher');
addTeacherButton.addEventListener('click', function(e){
    console.log('Calling setTeacher() method.');
    myCourse.setTeacher();
})

// Call Update Roster to initialize the content of the page.
updateRoster(myCourse);

function updateRoster(course){
    let rosterTbody = document.querySelector('#roster tbody');
    // Clear Roster Content
    rosterTbody.innerHTML = '';
    if (course.teacher){
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = `${course.teacher.honorific} ${course.teacher.name}`;
    } else {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = "Not Set";
    }
    // Populate Roster Content
    for (student of course.students){
        // Create a new row for the table.
        let newTR = document.createElement('tr');

        // Create table cells for each data point and append them to the new row.
        let nameTD = document.createElement('td');
        nameTD.innerHTML = student.name;
        newTR.appendChild(nameTD);

        let emailTD = document.createElement('td');
        emailTD.innerHTML = student.email;
        newTR.appendChild(emailTD);

        let attendanceTD = document.createElement('td');
        attendanceTD.innerHTML = student.calculateAttendance();
        newTR.appendChild(attendanceTD);

        let actionsTD = document.createElement('td');
        let presentButton = document.createElement('button');
        presentButton.innerHTML = "Present";
        presentButton.setAttribute('data-username', student.username);
        presentButton.setAttribute('class', 'present');
        actionsTD.appendChild(presentButton);

        let absentButton = document.createElement('button');
        absentButton.innerHTML = "Absent";
        absentButton.setAttribute('data-username', student.username);
        absentButton.setAttribute('class', 'absent');
        actionsTD.appendChild(absentButton);

        newTR.appendChild(actionsTD);

        // Append the new row to the roster table.
        rosterTbody.appendChild(newTR);
    }
    // Call function to set event listeners on attendance buttons.
    setupAttendanceButtons();
}

function setupAttendanceButtons(){
    // Set up the event listeners for buttons to mark attendance.
    let presentButtons = document.querySelectorAll('.present');
    for (button of presentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.username} present.`);
            myCourse.markAttendance(e.target.dataset.username);
            updateRoster(myCourse);
        });
    }
    let absentButtons = document.querySelectorAll('.absent');
    for (button of absentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.username} absent.`);
            myCourse.markAttendance(e.target.dataset.username, 'absent');
            updateRoster(myCourse);
        });
    }
}

