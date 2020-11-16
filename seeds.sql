-- Use the DB employee_tracker for all the rest of the script
USE employee_tracker;

-- Insert a set of records into the department table
INSERT INTO department (name) VALUES ("Engineering");
INSERT INTO department (name) VALUES ("Human Resources");
INSERT INTO department (name) VALUES ("Maintenance");
INSERT INTO department (name) VALUES ("Communications");

-- Insert a set of records into the role table
INSERT INTO role (title, salary, department_id) 
VALUES ("Engineering Manager", 170000, 0);
INSERT INTO role (title, salary, department_id) 
VALUES ("Engineer", 100000, 0);
INSERT INTO role (title, salary, department_id) 
VALUES ("Human Resources Manager", 200000, 1);
INSERT INTO role (title, salary, department_id) 
VALUES ("Human Resources Consultant", 150000, 1);
INSERT INTO role (title, salary, department_id) 
VALUES ("Maintenance Manager", 100000, 2);
INSERT INTO role (title, salary, department_id) 
VALUES ("Maintenance Engineer", 25000, 2);
INSERT INTO role (title, salary, department_id) 
VALUES ("Communications Manager", 300000, 3);
INSERT INTO role (title, salary, department_id) 
VALUES ("Communications Engineer", 225000, 3);


-- Insert a set of records into the employee table
INSERT INTO employee (first_name, last_name, role_id) 
VALUES ("Bo", "Peep", 0);
INSERT INTO employee (first_name, last_name, role_id) 
VALUES ("Peter", "Piper", 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Humnpty", "Dumpty", 0, 0);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Doc", "Foster", 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Jack", "Nimble", 0, 0);
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES ("Nellie", "Elephant", 1, 1);