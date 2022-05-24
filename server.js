// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to


// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database


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
      switch (answer.menu) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
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

function viewDepartments() {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    startPrompt();
  });
};

function viewRoles() {
  const sql = `SELECT roles.id, roles.title, departments.department_name AS department, roles.salary FROM roles 
              LEFT JOIN departments ON department_id = departments.id`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    startPrompt();
  });
};

function viewEmployees() {
  const sql = `SELECT employees.first_name, 
                      employees.last_name, 
                      roles.title, 
                      roles.salary, 
                      departments.department_name AS department, 
                      employees.manager_id
                      FROM employees
              LEFT JOIN roles ON employees.role_id = roles.id 
              LEFT JOIN departments ON roles.department_id = departments.id`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    startPrompt();
  });
};

function addDepartment() {
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'Enter name of department?'
      }
    ])
    .then((answer) => {
      const sql = `INSERT INTO departments (name) VALUES (?)`;
      db.query(sql, answer.newDepartment, (err, res) => {
        if (err) throw err;
        console.log(answer.newDepartment + ` added`);
        viewDepartments();
      });
    });
}



function addRole() {

  const sql = `SELECT departments.department_name FROM departments`;

  db.query(sql, (err, res) => {
    if (err) throw err;
    departmentChoices = res.map(obj => obj.department_name)

    inquirer
      .prompt([
        {
          name: 'newRoleTitle',
          type: 'input',
          message: 'Enter title of role'
        },
        {
          name: 'newRoleSalary',
          type: 'input',
          message: 'Enter salary (must be a number)'
        },
        {
          name: 'newRoleDepartment',
          type: 'list',
          message: 'Pick which department role belongs to',
          choices: departmentChoices
        }
      ])
      .then((answer) => {

        for (i = 0; i < departmentChoices.length; i++) {
          if (departmentChoices[i] == answer.newRoleDepartment) {

            var departmentId = i + 1

            const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
            const values = [answer.newRoleTitle, answer.newRoleSalary, departmentId]

            db.query(sql, values, (err, res) => {
              if (err) throw err;
              console.log(answer.newRole + ` added`);
              viewRoles();

            });
          } else { }

        }

      });
  });
}


function addEmployee() {

  const sql_roles = `SELECT roles.title FROM roles`;

  db.query(sql_roles, (err, res) => {
    if (err) throw err;
    roleChoices = res.map(obj => obj.title)

    const sql_employees = `SELECT employees.id, employees.first_name, employees.last_name FROM employees`;

    db.query(sql_employees, (err, res) => {
      if (err) throw err;
      managerChoices = res.map(obj => obj.first_name + " " + obj.last_name)

      inquirer
        .prompt([
          {
            name: 'newEmployeeFirstName',
            type: 'input',
            message: 'Enter first name'
          },
          {
            name: 'newEmployeeLastName',
            type: 'input',
            message: 'Enter last name'
          },
          {
            name: 'newEmployeeRole',
            type: 'list',
            message: 'Pick the role of the employee',
            choices: roleChoices
          },
          {
            name: 'newEmployeeManager',
            type: 'list',
            message: 'Pick a manager',
            choices: managerChoices
          }
        ])
        .then((answer) => {

          for (i = 0; i < res.length; i++) {
            if (answer.newEmployeeManager == (res[0].first_name + " " + res[0].last_name)) {
              managerId = i + 1

              for (i = 0; i < roleChoices.length; i++) {
                if (roleChoices[i] == answer.newEmployeeRole) {

                  var roleId = i + 1

                  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                  const values = [answer.newEmployeeFirstName, answer.newEmployeeLastName, roleId, managerId]

                  db.query(sql, values, (err, res) => {
                    if (err) throw err;
                    console.log(answer.newRole + ` added`);
                    viewEmployees();

                  });
                } else {
                  console.log('error')
                }

              }

            } else {

            }
          }





        })
    })
  })

}


function updateEmployee() {

}

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected');
  startPrompt();
});
