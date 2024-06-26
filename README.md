# Billbudy
A website that helps people keep track of shared expenses and split bills with friends, roommates, relatives or anyone else.


`make start` to start de app

`make create-tables` Creates db's tables.

`make stop` to stop de containers.



`make delete-db` Deletes the volume used for the db.

# Endpoints

## Users
**Base URL**: /users

### Create
**POST** /users

```
{
  "name": "Gaston",
  "lastname": "Avila",
  "username": "avilagaston",
  "email": "gavila@fi.uba.ar",
  "password": "1234",
  "date_of_birth": "11/11/1111"
}
```

### Get user
**GET** /users/{username}

### Get users
**GET** /users

### Login
**POST** /users/login

```
{
  "email": "gavila@fi.uba.ar",
  "password": "1234"
}
```
## Groups
**Base URL**: /groups

### Create
**POST** /groups

```
{
  "name": "Grupo 22",
  "description": "Grupo de gestion nro 22. 1C2024"
}
```

### Create saving group
**POST** /groups

```
{
  "name": "Grupo 22",
  "description": "Grupo de gestion nro 22. 1C2024",
  "objetive": 10000
}
```

### Get groups
**GET** /groups


### Get group
**GET** /groups/{group_id}

### Get group admin
**GET** /groups/{group_id}/admin

### Update group
**PATCH** /groups/{group_id}
```
{
  "description": "This is the new description.",
}
```

## Members

### Add member
**POST** /groups/{group_id}/members
```
{
  "username": "avilagaston"
}
```

### Get members
**GET** /groups/{group_id}/members

### Delete members
**DELETE** /groups/{group_id}/members/{username}

## Balances

### Get balances
**GET** /groups/{group_id}/balances

## Transactions

### Add transaction
**POST** /groups/{group_id}/transactions
```
{
  "amount": 100,
  "participants": ["avilagaston", "avilagaston2"],
  "payer": "avilagaston",
  "description": "Bus tickets",
  "invoices": binary,
  "category": 3
}
```

### Add saving transaction (no participants field)
**POST** /groups/{group_id}/transactions
```
{
  "amount": 100,
  "payer": "avilagaston",
  "description": "Bus tickets",
}
```

(The payer may or may not be a participant)

### Edit transaction
**PATCH** /groups/{group_id}/transactions/{transaction_id}
```
{
  "description": "Bus tickets",
  "invoices": binary,
  "recurrence": "Mensual",
  "selecteddate": "date"
}
```

### Get transactions of a group
**GET** /groups/{group_id}/transactions

### Get transactions of a group by category
**GET** /groups/{group_id}/transactions?category?3

### Get all transactions of a user as a payer
**GET** /transactions/payer

### Get all transactions of a user as a payer by category
**GET** /transactions/payer?category=3

### Get all transactions of a user as a debtor
**GET** /transactions/debtor

### Get all transactions of a user as a debtor by category
**GET** /transactions/debtor?category=3

## Notifications

### Get Notifications
**GET** /notifications

## WIP...
