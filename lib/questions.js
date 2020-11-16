const startupQs = [
    {
        type: 'list',
        name: 'option',
        message: "Select desired operation.",
        default: "Add employee",
        choices: [
            "Add department", 
            "Add role",
            "Add employee",
            "View department",
            "View roles",
            "View employees",
            "Update employee role",
            "Update employee manager",
            "View employees by manager",
            // Not in use - future development
            "Delete department",
            "Delete role",
            "Delete employee",
            "View department utilised budget",
            //
            "Exit"
        ]
    }
];

module.exports = {
    startupQs: startupQs

}