class Department {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    addToDB(connection) {
        console.log("Adding '" + this.name + "' to departments...\n");
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: this.name
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
        console.log("Deleting entry from departments...\n");
        connection.query(
            "DELETE FROM department WHERE ?",
            {
                name: this.name
            },
            function (err, res) {
                if (err) throw err;
                console.log("Department '" + this.name + "' deleted.");
            });
    }

    static setupQs = [
        {
            type: 'input',
            name: 'name',
            message: "Please enter department name.",
            default: ""
        }
    ];

    static getAll(connection) {
        console.log("Getting all departments...\n");
        return new Promise(resAll => {
            connection.query("SELECT * FROM department",
                function (err, res) {
                    if (err) throw err;
                    resAll(res);
                });
        })
    }

    static getNames(connection) {
        console.log("Getting names of departments...\n");
        return new Promise(resName => {
            connection.query("SELECT name FROM department",
                function (err, res) {
                    if (err) throw err;
                    resName(res.map(dept => dept.name));
                });
        })
    }

    static getID(connection, name) {
        console.log("Getting id of department...\n");
        return new Promise(resID => {
            connection.query("SELECT id FROM department WHERE name = '" + name + "'",
                function (err, res, field) {
                    if (err) throw err;
                    resID(res.map(dept => dept.id));
                });
        })
    }
}

module.exports = Department;