# TCP Socket Appointment Scheduler

This project is a client-server application built with Node.js that uses TCP sockets to manage a real-time, shared appointment schedule. The server maintains a list of events, and multiple clients can connect to add, list, update, and remove appointments.

Appointment data is persisted to an `appointments.json` file on the server-side, ensuring that information is not lost between server restarts.

## Features

- **Concurrent TCP Server**: Capable of handling multiple client connections simultaneously.
- **CRUD Operations**: Clients can perform the four basic data operations:
    - **C**reate (Add)
    - **R**ead (List)
    - **U**pdate
    - **D**elete
- **Data Persistence**: The schedule is saved to a JSON file on the server.
- **Command-Line Interface**: The client provides an interactive prompt for sending commands.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [Yarn](https://yarnpkg.com/) (or another package manager like npm)

## How to Run

1.  **Clone the Repository**
    ```sh
    git clone <YOUR_REPOSITORY_URL>
    cd <YOUR_PROJECT_NAME>
    ```

2.  **Install Dependencies**
    ```sh
    yarn install
    ```

3.  **Start the Server**
    Open a terminal and run the following command. The server will start listening for connections on port 3000.
    ```sh
    node server/server.js
    ```
    You will see a confirmation message: `[INFO] TCP Scheduler Server started and listening on 127.0.0.1:3000`.

4.  **Start the Client**
    Open a **new** terminal (leave the server terminal running) and run the command below.
    ```sh
    node client/client.js
    ```
    After connecting, a `>` prompt will appear, ready to receive your commands.

## Available Commands

Commands must be entered into the client terminal. Arguments containing spaces (such as title and description) must be enclosed in double quotes.

---

### **ADD**

Adds a new appointment to the schedule.

**Format:**
`ADD <date> <time> <duration_min> "<title>" "[optional_description]"`

**Example:**
```
> ADD 2025-10-26 15:00 90 "Project Sync Meeting" "Discuss next project milestones"
```

---

### **LIST**

Lists appointments. Can be used to list all events or filter by a specific date.

**Format:**
`LIST` or `LIST <date>`

**Examples:**
```
> LIST
> LIST 2025-10-26
```

---

### **UPDATE**

Updates a specific field of an existing appointment, identified by its `id`.

**Format:**
`UPDATE <id> <field> "<new_value>"`

**Updatable fields:** `date`, `time`, `duration`, `title`, `description`.

**Example:**
```
> UPDATE 1 title "General Project Sync Meeting"
```

---

### **DELETE**

Removes an appointment from the schedule, identified by its `id`.

**Format:**
`DELETE <id>`

**Example:**
```
> DELETE 2
```