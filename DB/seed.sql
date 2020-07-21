USE employeeDB;


INSERT INTO department(name)
VALUES ("Accounting");

INSERT INTO department(name)
VALUES ("Legal");

INSERT INTO department(name)
VALUES ("Marketing");

INSERT INTO department(name)
VALUES ("Engineering");

INSERT INTO role (title,salary,department_id)
VALUES ("Accountant",50000,1);

INSERT INTO role (title,salary,department_id)
VALUES("Lawyer",90000,2);


INSERT INTO role (title,salary,department_id)
VALUES("Marketing Lead",9000,3);

INSERT INTO role (title,salary,department_id)
VALUES("Engineer",120000,4);

INSERT INTO role (title,salary,department_id)
VALUES("manager",140000,5);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Steve","miller",1,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Robert","Jhonas",2,2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Micheal","Jackson",3,3);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Pit","bull",4,4);