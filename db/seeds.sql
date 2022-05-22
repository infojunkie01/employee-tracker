INSERT INTO department (name)
VALUES
    ('Engineering'),
    ('Design'),
    ('HR');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Software Engineer', 100000.00, 1),
    ('Senior Software Engineer', 150000.00, 1),
    ('Designer', 100000.00, 2),
    ('Senior designer', 150000.00, 2),
    ('HR manager', 100000.00, 3);
    

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Jane', 'Doe', 2, NULL),
    ('John', 'Doe', 1, 1),
    ('Janet', 'Doe', 3, 4),
    ('Jim', 'Doe', 4, NULL),
    ('Jeff', 'Doe', 5, NULL);


