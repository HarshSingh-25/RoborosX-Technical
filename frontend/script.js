const { response } = require("express");

var selectedRow = null
 
function onForm()
{
    
    const name= document.getElementById("fullName").value;
    const password=  document.getElementById("password").value;
    if(password=="" || name=="")
    {confirm('enter valid credentials');
    }
else{
    const data = {
        username:  name,
        password: password,
         
    };
   

    fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
        console.log(data);
         
        confirm(`Login successful as ${data.userType}`);
        if(data.userType=='ADMIN'){
           
        window.location.href = '/frontend/main-admin-login-crud/main.html';
        }
        else if(data.userType=='VENDOR'){
          
        window.location.href = '/frontend/main-vendor-login-crud/main-vendor.html';
        }
        else
        {    
            window.location.href='/frontend/user-login/mainuser.html'
        }
    })
    .catch(error => {
       console.log(`Error: ${error.message}`);
    });
}
} 



function onFormSubmit() {
    const name= document.getElementById("fullName").value;
const password=  document.getElementById("password").value;
const LoginType= document.getElementById("mySelect").value;
    if(password=="" || name==""){
        confirm("enter valid credentials");
    }
     else if(LoginType=="")
     confirm("Enter the Login Type");
     else
     {
        const data = {
            name:  name,
            password: password,
            Logintype: LoginType
        };
        console.log(data);
         fetch("http://localhost:8080/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {console.log(data) 
           confirm('data added successfully') ; window.location.href = '/frontend/mainpage.html';}   )
        .catch(error => console.error(error));
        
     }
     
}

// function readFormData() {
//     var formData = {};
//     formData["fullName"] = document.getElementById("fullName").value;
//     formData["password"] = document.getElementById("empCode").value;

//     formData["mySelect"] = document.getElementById("city").value;
//     return formData;
// }

function insertNewRecord(data) {
    var table = document.getElementById("employeeList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.fullName;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.empCode;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.salary;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.city;
    cell4 = newRow.insertCell(4);
    cell4.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
}

function resetForm() {
    document.getElementById("fullName").value = "";
    document.getElementById("empCode").value = "";
    document.getElementById("salary").value = "";
    document.getElementById("city").value = "";
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("fullName").value = selectedRow.cells[0].innerHTML;
    document.getElementById("empCode").value = selectedRow.cells[1].innerHTML;
    document.getElementById("salary").value = selectedRow.cells[2].innerHTML;
    document.getElementById("city").value = selectedRow.cells[3].innerHTML;
}
function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.fullName;
    selectedRow.cells[1].innerHTML = formData.empCode;
    selectedRow.cells[2].innerHTML = formData.salary;
    selectedRow.cells[3].innerHTML = formData.city;
}

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        row = td.parentElement.parentElement;
        document.getElementById("employeeList").deleteRow(row.rowIndex);
        resetForm();
    }
}
function validate() {
    isValid = true;
    if (document.getElementById("fullName").value == "") {
        isValid = false;
        document.getElementById("fullNameValidationError").classList.remove("hide");
    } else {
        isValid = true;
        if (!document.getElementById("fullNameValidationError").classList.contains("hide"))
            document.getElementById("fullNameValidationError").classList.add("hide");
    }
    return isValid;
}