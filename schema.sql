-- Drop the employee_tracker DB if it already exists --
DROP DATABASE IF EXISTS employee_tracker;

-- Create the DB "employee_tracker"
CREATE DATABASE employee_tracker;

-- Use the DB employee_tracker for all the rest of the script
USE employee_tracker;

-- Create the table "department"
CREATE TABLE department (
  id int AUTO_INCREMENT NOT NULL,
  name varchar(30) NOT NULL,
  is_active bool default true,
  UNIQUE (name),
  PRIMARY KEY(id)
);

-- Create the table "role"
CREATE TABLE role (
  id int AUTO_INCREMENT NOT NULL,
  title varchar(30) NOT NULL,
  salary decimal NOT NULL,
  department_id int NOT NULL,
  is_active bool default true,
  UNIQUE (title),
  PRIMARY KEY(id)
);

-- Create the table "employee"
CREATE TABLE employee (
  id int AUTO_INCREMENT NOT NULL,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id int NOT NULL,
  manager_id int,
  is_active bool default true,
  PRIMARY KEY(id)
);