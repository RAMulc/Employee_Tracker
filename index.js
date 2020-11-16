var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();

const Department = require("./lib/department");
const Employee = require("./lib/employee");
const Role = require("./lib/role");
const questions = require("./lib/questions.js");

const Startup = [];

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: process.env.DB_PASS,
    database: "employee_tracker"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    startOperations();
});

async function startOperations() {
    const opType = await inquirer.prompt(questions.startupQs);
    console.log(opType);
    switch (opType["option"]) {
        case "Add department":
            addToDB("dept");
            break;
        case "Add role":
            addToDB("role");
            break;
        case "Add employee":
            addToDB("emp");
            break;
        case "View department":
            displayDB("dept");
            break;
        case "View roles":
            displayDB("role");
            break;
        case "View employees":
            displayDB("emp");
            break;
        case "Update employee role":
            updateRole();
            break;
        case "Update employee manager":
            updateManager();
            break;
        case "View employees by manager":
            ManagerReports();
            break;
        case "Delete department":
            console.log("Function disabled, for future development\n");
            // Need to check if a role is assigned to department before deleting
            // Better to not delete. Update an is_active column instead.
            startOperations();
            break;
        case "Delete role":
            console.log("Function disabled, for future development\n");
            // Need to check if a employee is assigned to role before deleting
            // Better to not delete. Update an is_active column instead.
            startOperations();
            break;
        case "Delete employee":
            console.log("Function disabled, for future development\n");
            // Better to not delete. Update an is_active column instead.
            startOperations();
            break;
        case "View department utilised budget":
            console.log("Function disabled, for future development\n");
            startOperations();
            break;
        case "Exit":
            connection.end();
            console.log("\n\nThank you for using the Employee Tracker. \nSee you again soon. \n\nGoodbye.")
            break;
        default:
            console.log("Something went wrong. Please try agaian.")
            startOperations();
            break;
    }
}

async function addToDB(dataType) {

    switch (dataType) {
        case "dept":
            const resDept = await inquirer.prompt(Department.setupQs);
            let dept = new Department(null, resDept["name"]);
            dept.addToDB(connection);
            break;
        case "role":
            const roleq = await Role.setupQs(connection);
            const resRole = await inquirer.prompt(roleq);
            const depID = await Department.getID(connection, resRole["department"]);
            let role = new Role(null, resRole["title"], resRole["salary"], depID[0]);
            role.addToDB(connection);
            break;
        case "emp":
            const empq = await Employee.setupQs(connection);
            const resEmp = await inquirer.prompt(empq);
            const roleID = resEmp["role"].split(",")[0];
            const manID = resEmp["manager"].split(" ")[0];
            let emp = new Employee(null, resEmp["fname"], resEmp["sname"], roleID, manID);
            emp.addToDB(connection);
            break;

    }
    startOperations();
}

async function displayDB(dataType) {

    switch (dataType) {
        case "dept":
            const depts = await Department.getAll(connection);
            console.table(depts);
            console.log("\n");
            break;
        case "role":
            const roles = await Role.getAll(connection);
            console.table(roles);
            console.log("\n");
            break;
        case "emp":
            const emps = await Employee.getAllJoin(connection);
            for (let i= 0; i < emps.length; i++) {
                let manID = emps[i].manager_id;
                for (let j= 0; j < emps.length; j++) {
                    if (manID === null) {
                        emps[i].manager = "";
                    }
                    else if (emps[j].id === manID) {
                        emps[i].manager = emps[j].last_name + ", " + emps[j].first_name;
                        break;
                    }
                };
            }
            console.table(emps);
            console.log("\n");
            break;

    }
    startOperations();
}

async function updateRole() {
    const empq = await Employee.selEmps(connection, "employee");
    const resEmp = await inquirer.prompt(empq);
    const empID = resEmp["name"].split(" ")[0];

    const roleq = await Role.selRoles(connection);
    const resRole = await inquirer.prompt(roleq);
    const roleID = resRole["role"].split(",")[0];
    Employee.updateRole(connection, empID, roleID);

    startOperations();
}

async function updateManager() {
    const empq = await Employee.selEmps(connection, "employee");
    const resEmp = await inquirer.prompt(empq);
    const empID = resEmp["name"].split(" ")[0];

    const manq = await Employee.selEmps(connection, "new manager");
    const resMan = await inquirer.prompt(manq);
    const manID = resMan["name"].split(" ")[0];
    Employee.updateManager(connection, empID, manID);

    startOperations();
}

async function ManagerReports() {
    const manq = await Employee.selEmps(connection, "manager");
    const resMan = await inquirer.prompt(manq);
    const manID = resMan["name"].split(" ")[0];

    const reports = await Employee.getEmployeeByManager(connection, manID);
    console.table(reports);
    console.log("\n");

    startOperations();
}