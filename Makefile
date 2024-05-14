.PHONY: start stop create-users create-groups create-members create-tables delete-db

start:
	docker compose up -d --build

stop:
	docker compose down

create-users:
	docker exec -it billbudy_db psql -U billbudyUser -d billbudy -c "CREATE TABLE IF NOT EXISTS users (username VARCHAR(100) PRIMARY KEY, name VARCHAR(100), lastname VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(100), date_of_birth DATE);"

create-groups:
	docker exec -it billbudy_db psql -U billbudyUser -d billbudy -c "CREATE TABLE IF NOT EXISTS groups (id SERIAL PRIMARY KEY, name VARCHAR(100), description VARCHAR(400), admin VARCHAR(100), FOREIGN KEY (admin) REFERENCES users(username));"

create-members:
	docker exec -it billbudy_db psql -U billbudyUser -d billbudy -c "CREATE TABLE IF NOT EXISTS members (group_id INT, username VARCHAR(100), balance FLOAT, PRIMARY KEY (group_id, username), FOREIGN KEY (group_id) REFERENCES groups(id), FOREIGN KEY (username) REFERENCES users(username));"

create-tables: create-users create-groups create-members
	
delete-db:
	docker volume rm gestion_db_data
