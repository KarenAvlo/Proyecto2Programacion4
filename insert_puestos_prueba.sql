USE bolsa_empleo;

START TRANSACTION;

-- Puestos PUBLICOS recientes
INSERT INTO puesto (activo, descripcion, fecha_publicacion, salario_ofrecido, moneda, tipo_publicacion, email_empresa)
VALUES (b'1', 'Desarrollador Frontend React', NOW() - INTERVAL 1 HOUR, 1450000.00, 'CRC', 'PUBLICA', 'softlab@empresa.com');
SET @puesto_frontend_react = LAST_INSERT_ID();
INSERT INTO puesto_caracteristica (nivel_deseado, id_caracteristica, id_puesto)
VALUES
    (4, 14, @puesto_frontend_react), -- React
    (4, 10, @puesto_frontend_react), -- JavaScript
    (3, 9, @puesto_frontend_react);  -- CSS

INSERT INTO puesto (activo, descripcion, fecha_publicacion, salario_ofrecido, moneda, tipo_publicacion, email_empresa)
VALUES (b'1', 'Analista Backend Java', NOW() - INTERVAL 2 HOUR, 1900000.00, 'CRC', 'PUBLICA', 'empresa@bolsa.com');
SET @puesto_backend_java = LAST_INSERT_ID();
INSERT INTO puesto_caracteristica (nivel_deseado, id_caracteristica, id_puesto)
VALUES
    (4, 3, @puesto_backend_java),  -- Java
    (3, 18, @puesto_backend_java), -- MySQL
    (3, 29, @puesto_backend_java); -- Git/GitHub

INSERT INTO puesto (activo, descripcion, fecha_publicacion, salario_ofrecido, moneda, tipo_publicacion, email_empresa)
VALUES (b'1', 'Ingeniero DevOps Junior', NOW() - INTERVAL 3 HOUR, 2100.00, 'USD', 'PUBLICA', 'contacto@innovatech.com');
SET @puesto_devops_junior = LAST_INSERT_ID();
INSERT INTO puesto_caracteristica (nivel_deseado, id_caracteristica, id_puesto)
VALUES
    (3, 25, @puesto_devops_junior), -- Docker
    (2, 26, @puesto_devops_junior), -- Kubernetes
    (3, 22, @puesto_devops_junior); -- AWS

INSERT INTO puesto (activo, descripcion, fecha_publicacion, salario_ofrecido, moneda, tipo_publicacion, email_empresa)
VALUES (b'1', 'Administrador de Bases de Datos', NOW() - INTERVAL 4 HOUR, 1700000.00, 'CRC', 'PUBLICA', 'rrhh@bancofinanciero.com');
SET @puesto_dba = LAST_INSERT_ID();
INSERT INTO puesto_caracteristica (nivel_deseado, id_caracteristica, id_puesto)
VALUES
    (4, 18, @puesto_dba), -- MySQL
    (3, 17, @puesto_dba), -- PostgreSQl
    (3, 20, @puesto_dba); -- Oracle

-- Puestos PRIVADOS recientes
INSERT INTO puesto (activo, descripcion, fecha_publicacion, salario_ofrecido, moneda, tipo_publicacion, email_empresa)
VALUES (b'1', 'Arquitecto Cloud Senior', NOW() - INTERVAL 30 MINUTE, 4200.00, 'USD', 'PRIVADA', 'contacto@innovatech.com');
SET @puesto_cloud_senior = LAST_INSERT_ID();
INSERT INTO puesto_caracteristica (nivel_deseado, id_caracteristica, id_puesto)
VALUES
    (5, 22, @puesto_cloud_senior), -- AWS
    (4, 23, @puesto_cloud_senior), -- Azure
    (4, 26, @puesto_cloud_senior); -- Kubernetes

INSERT INTO puesto (activo, descripcion, fecha_publicacion, salario_ofrecido, moneda, tipo_publicacion, email_empresa)
VALUES (b'1', 'Full Stack Developer Privado', NOW() - INTERVAL 90 MINUTE, 2600.00, 'USD', 'PRIVADA', 'websoftcr@empresa.com');
SET @puesto_fullstack_privado = LAST_INSERT_ID();
INSERT INTO puesto_caracteristica (nivel_deseado, id_caracteristica, id_puesto)
VALUES
    (4, 14, @puesto_fullstack_privado), -- React
    (4, 3, @puesto_fullstack_privado),  -- Java
    (3, 18, @puesto_fullstack_privado); -- MySQL

INSERT INTO puesto (activo, descripcion, fecha_publicacion, salario_ofrecido, moneda, tipo_publicacion, email_empresa)
VALUES (b'1', 'Scrum Master Tecnico', NOW() - INTERVAL 2 HOUR, 2300.00, 'USD', 'PRIVADA', 'softlab@empresa.com');
SET @puesto_scrum_master = LAST_INSERT_ID();
INSERT INTO puesto_caracteristica (nivel_deseado, id_caracteristica, id_puesto)
VALUES
    (5, 28, @puesto_scrum_master), -- Scrum
    (4, 34, @puesto_scrum_master), -- Comunicacion Asertiva
    (4, 35, @puesto_scrum_master); -- Trabajo en Equipo

INSERT INTO puesto (activo, descripcion, fecha_publicacion, salario_ofrecido, moneda, tipo_publicacion, email_empresa)
VALUES (b'1', 'Desarrollador Python para Datos', NOW() - INTERVAL 3 HOUR, 1800000.00, 'CRC', 'PRIVADA', 'empresa@bolsa.com');
SET @puesto_python_datos = LAST_INSERT_ID();
INSERT INTO puesto_caracteristica (nivel_deseado, id_caracteristica, id_puesto)
VALUES
    (4, 6, @puesto_python_datos),  -- Python
    (3, 16, @puesto_python_datos), -- SQL Server
    (3, 19, @puesto_python_datos); -- MongoDB

COMMIT;
