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

### Get group
**GET** /groups/{group_id}

### Get groups
**GET** /groups

## Members

### Add member
**POST** /groups/{group_id}/members
```
{
  "username": "avilagaston",
}
```

### Get members
**GET** /groups/{group_id}/members

### Delete members
**DELETE** /groups/{group_id}/members/{username}

## Balances

### Get balances
**GET** /groups/{group_id}/balances

### Add balances
**POST** /groups/{group_id}/balances
```
{
  "expenses": 100,
}
```

## WIP...
