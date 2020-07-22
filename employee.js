const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "VenkatHimaja@08",
    database: "employeeDB"
})

connection.connect(function (err) {
    if (err) throw err;
    initial();
});

function initial() {
    inquirer.prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Departments",
                "View Roles",
                "View All Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Departments":
                    viewDept();
                    break;
                case "View Roles":
                    viewRoles();
                    break;
                case "View All Employees":
                    viewEmployees();
                    break;
                case "Add Department":
                    addDept();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Exit":
                    connection.end();
                    break;


            }
        });
}

function viewDept() {
    const query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        initial();
    });
}

function viewRoles() {
    const query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        initial();
    });
}

function viewEmployees() {
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, " +
        "department.name FROM employee " +
        "LEFT JOIN role on employee.role_id = role.id " +
        "LEFT JOIN department on role.department_id = department.id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        initial();
    });
}

function addDept() {
    inquirer.prompt({
            name: "department",
            type: "input",
            message: "What department would you like to add?"
        })
        .then(function (answer) {
            connection.query("INSERT INTO department SET ?", {
                name: answer.department
            }, function (err) {
                if (err) throw err;
                console.log(`${answer.department} department was successfully updated. \n`);
                initial();
            });
        });
}

function addRole() {
    let array = [];
    const query = "SELECT id as value,name as name FROM department";
    connection.query(query, function (err, res) {
        if (err) throw err;
        array = JSON.parse(JSON.stringify(res));
        const questions = [{
                type: "input",
                name: "title",
                message: "What is the name of new role?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is salary for this role?"
            },
            {
                type: "list",
                name: "department",
                message: "To Which department does the new role belong?",
                choices: array

            }
        ];
        inquirer.prompt(questions).then(answer => {
            connection.query("INSERT INTO role (title,salary,department_id)VALUES(?,?,?)",
                [answer.title, answer.salary, answer.department],
                function (err, res) {
                    if (err) throw err;
                    if (res.affectedRows > 0) {
                        console.log(res.affectedRows + " record added successfully!");
                    }
                    console.log("");
                    initial();
                })
        })
    })
}

function addEmployee() {
    inquirer.prompt([{
                type: "input",
                name: "first_name",
                message: "What is your first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is your last name?"
            }
        ]).then(function (answer) {
                const query = "SELECT id as value, title as name FROM role";
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    let array = JSON.parse(JSON.stringify(res));
                    inquirer
                        .prompt({
                            name: "role",
                            type: "list",
                            message: "Choose a role for the new employee",
                            choices: array
                        }).then(function (answer1) {
                            var query = "SELECT employee.id as value, CONCAT(employee.first_name, ' ', employee.last_name) as name " +
                                "FROM employee INNER JOIN role ON employee.role_id = role.id ";
                            connection.query(query, function (err, res) {
                                if (err) throw err;
                                let array2 = JSON.parse(JSON.stringify(res));
                                inquirer
                                    .prompt({
                                        name: "manager",
                                        type: "list",
                                        message: "Assign a manager for the new employee",
                                        choices: array2
                                    }).then(function (answer2) {
                                        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ( ?, ?, ?, ?)",
                                            [answer.first_name, answer.last_name, answer1.role, answer2.manager],
                                            function (err, res) {
                                                if (err) throw err;
                                                if (res.affectedRows > 0) {
                                                    console.log(res.affectedRows + " record added successfully!");
                                                }
                                                console.log("");
                                                initial();
                                            });
                                    });
                            });
                        });
                });
            });
}

            function updateEmployeeRole() {
                const query = "SELECT employee.id as value," + "CONCAT(employee.first_name,' ',employee.last_name)as name FROM employee WHERE manager_id IS NOT NULL";
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    let array = JSON.parse(JSON.stringify(res));
                    inquirer.prompt({
                        name: "employee",
                        type: "list",
                        message: "Which employee/'s role do you want to change? ",
                        choices: array
                    }).then(function (answer1) {
                        const query = "SELECT id as value, title as name FROM role";
                        connection.query(query, function (err, res) {
                            if (err) throw err;
                            let array2 = JSON.parse(JSON.stringify(res));
                            inquirer
                                .prompt({
                                    name: "role",
                                    type: "list",
                                    message: "Which is the new role?",
                                    choices: array2
                                })
                                .then(function (answer2) {
                                    connection.query("UPDATE employee SET role_id = ? WHERE employee_id = ?",
                                        [answer2.role, answer1.employee],
                                        function (err, res) {
                                            if (err) {
                                                if (err) {
                                                    console.log("Not allowed due to foreign key !");
                                                } else {
                                                    console.log("An error occured!");
                                                }
                                                return initial();
                                            }
                                            if (res.affectedRows > 0) {
                                                console.log(res.affectedRows + " record updated successfully!");
                                            }
                                            console.log("");
                                            initial();
                                        });
                                });
                        });
                    });
                });
            }