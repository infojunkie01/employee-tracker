const inquirer = require("inquirer");
const db = require('./db/connection');

const startPrompt = () => {
  inquirer
  .prompt([
      {
        type: "list",
        name: "menu",
        message: "Pick an option",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add department",
          "Add role",
          "Add employee",
          "Update employee role",
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      //console.log(answers)
      switch (answer.menu) {
        case "View all departments":
          viewTable('departments');
          break;
        case "View all roles":
          viewTable('roles');
          break;
        case "View all employees":
          viewTable('employees');
          break;
        case "Add department":
          addDepartment();
          break;
        case "Add role":
          addRole();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Update employee role":
          updateEmployee();
          break;
        case "Quit":
          db.end() 
          break;
      }
    });
};


function viewTable(table) {
  const sql = `SELECT * FROM ${table}`;
  db.query(sql, (err, res) => {
      if (err) throw err;
      console.table(res);
      startPrompt();
  });
};

function addDepartment(){

}

function addRole(){
  
}

function addEmployee(){
  
}


function updateEmployee(){
  
}

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected');
  startPrompt();
});
