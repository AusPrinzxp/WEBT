create database virtual_fridge;

use virtual_fridge;

create table food (
	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	foodname VARCHAR(20) NOT NULL,
	fooddesc VARCHAR(200),
	calories INT NOT NULL,
	vegan BOOLEAN NOT NULL
);

INSERT INTO `food` (`foodname`, `fooddesc`, `calories`, `vegan`) VALUES
('Apple', 'Fruit', 50, 1),
('Carrot', 'Vegetable', 80, 1),
('Steak', 'Meat', 400, 0);