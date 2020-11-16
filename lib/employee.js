const Role = require("./role");

class Employee {
    constructor(id, firstName, lastName, roleID, managerID) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roleID = roleID;
        this.managerID = managerID;
    }

    addToDB(connection) {
        console.log("Adding '" + this.firstName + " " + this.lastName + "' to employees...\n");
        console.log(this.firstName, this.lastName, this.role_id, this.managerID);
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: this.firstName,
                last_name: this.lastName,
                role_id: this.roleID,
                manager_id: this.managerID
            },
            function (err, res) {
                if (err) {
                    if (err.errno = 1062) {
                        console.log(err.sqlMessage);
                        return false;
                    }
                    console.log("ERROR", err.code);
                    return false;
                }
                return true;
            });
    }

    deleteFromDB(connection) {
        console.log("Deleting entry from employees...\n");
        connection.query(
            "DELETE FROM employee WHERE ?",
            {
                id: this.id
            },
            function (err, res) {
                if (err) throw err;
                console.log("Employee: '" + this.first_name + " " + this.last_name + "' deleted.");
            });
    }

    static updateRole(connection, empID, roleID) {
        console.log("Updating role...\n");
        connection.query("UPDATE employee SET role_id = ? WHERE id = ?",
            [roleID, empID],
            function (err, res) {
                if (err) throw err;
                console.log("Employee role updated.");
            });
    }

    static updateManager(connection, empID, manID) {
        console.log("Updating manager...\n");
        connection.query("UPDATE employee SET manager_id = ? WHERE id = ?",
            [manID, empID],
            function (err, res) {
                if (err) throw err;
                console.log("Employee manager updated.");
            });
    }

    static async setupQs(connection) {
        const roles = await Role.getTitles(connection);
        const emps = await Employee.getNames(connection);
        return new Promise(resQs => {
            const qs = [
                {
                    type: 'input',
                    name: 'fname',
                    message: "Please enter first name.",
                    default: ""
                },
                {
                    type: 'input',
                    name: 'sname',
                    message: "Please enter family name.",
                    default: ""
                },
                {
                    type: 'list',
                    name: 'role',
                    message: "Please select role.",
                    default: roles[0],
                    choices: roles
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Please select manager.",
                    default: emps[0],
                    choices: emps
                }];
            resQs(qs);
        })

    }

    static async selEmps(connection, pType) {
        const emps = await Employee.getNames(connection);
        return new Promise(resQs => {
            const qs = [
                {
                    type: 'list',
                    name: 'name',
                    message: "Please select " + pType,
                    default: emps[0],
                    choices: emps
                }];
            resQs(qs);
        })
    }

    static getAll(connection) {
        console.log("Getting all employees...\n");
        return new Promise(resAll => {
            connection.query("SELECT * FROM employee",
                function (err, res) {
                    if (err) throw err;
                    //console.log(res);
                    resAll(res);
                });
        })
    }

    static getAllJoin(connection) {
        console.log("Getting all employees...\n");
        return new Promise(resAll => {
            let queryString = "SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, ";
            queryString += "role.title, role.salary, department.name ";
            queryString += "FROM employee ";
            queryString += "LEFT JOIN role ON role.id = employee.role_id ";
            queryString += "LEFT JOIN department ON role.department_id = department.id ";

            connection.query(queryString,
                function (err, res) {
                    if (err) throw err;
                    //console.log(res);
                    resAll(res);
                });
        })
    }

    static getAllManager(connection) {
        //console.log("Getting all employees...\n");
        return new Promise(resAll => {
            let queryString = "SELECT id, employee.first_name, employee.last_name, ";
            queryString += "department.name ";
            queryString += "FROM employee ";
            queryString += "JOIN department ON department.id = employee.role_id ";

            connection.query(queryString,
                function (err, res) {
                    if (err) throw err;
                    //console.log(res);
                    resAll(res);
                });
        })
    }

    static getNames(connection) {
        console.log("Getting names of employees...\n");
        return new Promise(resName => {
            connection.query("SELECT id,last_name, first_name FROM employee",
                function (err, res) {
                    if (err) throw err;
                    //console.log(res);
                    resName(res.map(name => name.id + " " + name.last_name + ", " + name.first_name));
                });
        })
    }

    static getEmployeeByManager(connection, manID) {
        console.log("Getting names of direct reports...\n");
        return new Promise(resName => {
            connection.query("SELECT last_name, first_name FROM employee WHERE manager_id = ?",[manID],
                function (err, res) {
                    if (err) throw err;
                    //console.log(res);
                    resName(res.map(name => name.last_name + ", " + name.first_name));
                });
        })
    }

    // This will return the id of the employee with the provided names.
    // Needs to be updated to cater for more than one staff member with the same name
    static getID(connection, firstName, lastName) {
        console.log("Getting id of employee...\n");
        return new Promise(resID => {
            connection.query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [firstName, lastName],
                function (err, res) {
                    if (err) throw err;
                    console.log(res);
                    resID(res.map(emp => emp.id));
                });
        })
    }
}

module.exports = Employee;