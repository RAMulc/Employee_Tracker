const Department = require("./department");

class Role {
    constructor(id, title, salary, departmentID) {
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.departmentID = departmentID;
    }

    addToDB(connection) {
        console.log("Adding '" + this.title + "' to roles...\n");
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: this.title,
                salary: this.salary,
                department_id: this.departmentID
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
        console.log("Deleting entry from roles...\n");
        connection.query(
            "DELETE FROM role WHERE ?",
            {
                title: this.title
            },
            function (err, res) {
                if (err) throw err;
                console.log("Role: '" + this.name + "' deleted.");
            });
    }

    static async setupQs(connection) {
        const depts = await Department.getNames(connection);
        return new Promise(resQs => {
            const qs = [{
                type: 'input',
                name: 'title',
                message: "Please enter role title.",
                default: ""
            },
            {
                type: 'input',
                name: 'salary',
                message: "Please enter salary.",
                default: ""
            },
            {
                type: 'list',
                name: 'department',
                message: "Please select department.",
                default: depts[0],
                choices: depts
            }];
            resQs(qs);
        })
        
    } 

    static async selRoles(connection) {
        const roles = await Role.getTitles(connection);
        return new Promise(resQs => {
            const qs = [
            {
                type: 'list',
                name: 'role',
                message: "Please select new role",
                default: roles[0],
                choices: roles
            }];
            resQs(qs);
        })
    }

    static getAll(connection) {
        console.log("Getting all roles...\n");
        return new Promise(resAll => {
            let queryString = "SELECT role.id, role.title, role.salary, ";
            queryString += "department.name ";
            queryString += "FROM role ";
            queryString += "JOIN department ON department.id = role.department_id ";

            connection.query(queryString,
                function (err, res) {
                    if (err) throw err;
                    //console.log(res);
                    resAll(res);
                });
        })
    }

    static getTitles(connection) {
        console.log("Getting roles...\n");
        return new Promise(resName => {
            connection.query("SELECT id,title FROM role",
                function (err, res) {
                    if (err) throw err;
                    //console.log(res);
                    resName(res.map(title => title.id + "," + title.title));
                });
        })
    }

    static getID(connection, title) {
        console.log("Getting id of role...\n");
        return new Promise(resID => {
            connection.query("SELECT id FROM role WHERE title = ?", [title],
                function (err, res) {
                    if (err) throw err;
                    console.log(res);
                    resID(res.map(role => role.id));
                });
        })
    }

}

module.exports = Role;