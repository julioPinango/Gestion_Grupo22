.PHONY: start stop create-users create-groups create-members create-transactions create-notifications create-tables delete-db

start:
	docker compose up -d --build

stop:
	docker compose down

create-users:
	docker exec -it billbudy_db psql -U billbudyUser -d billbudy -c "CREATE TABLE IF NOT EXISTS users (username VARCHAR(100) PRIMARY KEY, name VARCHAR(100), lastname VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(100), date_of_birth DATE);"

create-groups:
	docker exec -it billbudy_db psql -U billbudyUser -d billbudy -c "CREATE TABLE IF NOT EXISTS groups (id SERIAL PRIMARY KEY, name VARCHAR(100), description VARCHAR(400), admin VARCHAR(100), objetive INT, savings INT, FOREIGN KEY (admin) REFERENCES users(username));"

create-members:
	docker exec -it billbudy_db psql -U billbudyUser -d billbudy -c "CREATE TABLE IF NOT EXISTS members (group_id INT, username VARCHAR(100), balance FLOAT, PRIMARY KEY (group_id, username), FOREIGN KEY (group_id) REFERENCES groups(id), FOREIGN KEY (username) REFERENCES users(username));"

create-transactions:
	docker exec -it billbudy_db psql -U billbudyUser -d billbudy -c "CREATE TABLE IF NOT EXISTS transactions (id SERIAL PRIMARY KEY, group_id INT, payer VARCHAR(100), amount FLOAT, description VARCHAR(400),recurrence VARCHAR(20) CHECK (recurrence IN ('Única vez', 'Mensual', 'Semanal', 'Diario')), invoice BYTEA, selectedDate DATE, category INT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (group_id) REFERENCES groups(id), FOREIGN KEY (payer) REFERENCES users(username));"

create-debtors:
	docker exec -it billbudy_db psql -U billbudyUser -d billbudy -c "CREATE TABLE IF NOT EXISTS debtors (transaction_id INT, debtor VARCHAR(100), amount FLOAT , PRIMARY KEY (transaction_id, debtor), FOREIGN KEY (debtor) REFERENCES users(username), FOREIGN KEY (transaction_id) REFERENCES transactions(id));"

create-notifications:
	docker exec -it billbudy_db psql -U billbudyUser -d billbudy -c "CREATE TABLE IF NOT EXISTS notifications (id SERIAL PRIMARY KEY, group_id INT, from_username VARCHAR(100), to_username VARCHAR(100), amount FLOAT, description VARCHAR(400), recurrence VARCHAR(20), selectedDate DATE, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (group_id) REFERENCES groups(id), FOREIGN KEY (from_username) REFERENCES users(username), FOREIGN KEY (to_username) REFERENCES users(username));"

create-tables: create-users create-groups create-members create-transactions create-debtors create-notifications
	
delete-db:
	docker volume rm gestion_db_data
