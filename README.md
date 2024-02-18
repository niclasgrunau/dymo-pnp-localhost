# dymo-pnp-localhost

## Intro

This project introduces a comprehensive web application built on the MERN (MongoDB, Express, React, Node.js) stack, tailored for customizable label printing with seamless integration of a DYMO PNP LabelManager. The primary objective is to provide users with a robust platform where they can effortlessly create, customize, and print labels according to their specific requirements.

The application architecture is divided into two main components: a Node.js backend serving as the server-side logic and API endpoints, and a React frontend offering an intuitive user interface for label customization and management. Additionally, a local server component facilitates the direct connection to a DYMO PNP LabelManager device for printing commands.

Note: the code of this version is not documented. For a documented version, check out the [server version](https://github.com/niclasgrunau/dymo-pnp).

This version of the project is designed to run locally on your machine. Follow these steps to deploy it:

---

### Cloning the Project

First, clone this project to your local machine:

```bash
git clone https://github.com/niclasgrunau/dymo-pnp-localhost.git
```

### Installing Dependencies

Navigate to the root directory of the project and install dependencies:

```bash
cd dymo-pnp-localhost
npm install
```

Then, navigate to the backend directory and install backend dependencies:

```bash
cd backend
npm install
```

Next, navigate to the frontend directory and install frontend dependencies:

```bash
cd ../frontend
npm install
```

---

### Installing Local Packages

Before running the application, you need to install 2 essential packages.

#### ImageMagick

ImageMagick is a powerful software suite used for manipulating images. It is employed to resize labels to a fitting size for the DYMO PNP LabelManager without compromising quality. You can download it from [here](https://imagemagick.org/script/download.php).

#### CUPS

CUPS (Common Unix Printing System) is a printing system for Unix-like operating systems, including Linux and MacOS. It facilitates printing tasks and is utilized to print labels via a shell script in this application. You can find instructions for downloading it for [Linux](https://ubuntu.com/server/docs/service-cups), [MacOS](https://x-series-support.lightspeedhq.com/hc/en-us/articles/205052024-Enabling-CUPS-Printer-Interface-for-Mac) or [Windows](https://project-insanity.org/2022/11/01/use-cups-printing-server-on-windows-10/).

---

### Running the Project

Now that you have installed all dependencies and locla packages, you can start the backend and frontend servers:

#### Backend Server

In the backend directory, run:

```bash
npm start
```

#### Frontend Server

In the frontend directory, run:

```bash
npm start
```

---

### Accessing the Application

Once both the backend and frontend servers are running, you can access the application by opening your web browser and navigating to [http://localhost:3000](http://localhost:3000).

Please feel free to modify the port configurations in the code if you wish to run the application on different ports.

---

### Frontend

![Screenshot 1](https://github.com/niclasgrunau/dymo-pnp-localhost/blob/main/docs/frontend_img1.png)

![Screenshot 2](https://github.com/niclasgrunau/dymo-pnp-localhost/blob/main/docs/frontend_img2.png)

---

### API Endpoints
### User Routes

#### `GET /users/getUsers`

This endpoint retrieves all users from the database.

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| None      |        |             |

#### Response

- 200 OK: Returns an array of users.
- 404 Not Found: No users found in the database.


#### `POST /users/register`

This endpoint registers a new user with the provided name, email, and password.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `name`    | string | The name of the user.             |
| `email`   | string | The email of the user.            |
| `password`| string | The password of the user.         |

#### Response

- 201 Created: User registered successfully.
- 400 Bad Request: Email already registered.
- 500 Error: Internal Server Error.


#### `POST /users/login`

This endpoint authenticates a user with the provided email and password.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `email`   | string | The email of the user.            |
| `password`| string | The password of the user.         |

#### Response

- 200 OK: Login successful.
- 401 Unauthorized: Invalid credentials.
- 500 Error: Internal Server Error.

### Label Routes

#### `POST /labels/save`

This endpoint saves a new label to the database.

| Parameter          | Type    | Description                              |
| ------------------ | ------- | ---------------------------------------- |
| `userId`           | string  | The ID of the user associated with the label. |
| `name`             | string  | The name of the label.                   |
| `text`             | string  | The text content of the label.           |
| `fontStyle`        | string  | The font style of the label.             |
| `fontSize`         | number  | The font size of the label.              |
| `isBold`           | boolean | Indicates if the label text is bold.     |
| `isItalic`         | boolean | Indicates if the label text is italicized. |
| `isUnderline`      | boolean | Indicates if the label text is underlined. |
| `textAlignment`    | string  | The text alignment of the label.         |
| `verticalAlignment`| string  | The vertical alignment of the label.     |
| `isQRCodeUsed`     | boolean | Indicates if a QR code is used in the label. |
| `url`              | string  | The URL associated with the label.       |
| `shortenedUrl`     | string  | The shortened URL associated with the label. |
| `createdAt`        | Date    | The creation date of the label.          |

#### Response

- 201 Created: Label saved successfully.
- 500 Internal Server Error: Error saving label.

#### `GET /labels/user/:userId`

This endpoint retrieves all labels associated with a specific user.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `userId`  | string | The ID of the user.                |

#### Response

- 200 OK: Returns an array of labels.
- 404 Not Found: User not found.
- 500 Error: Internal Server Error.

#### `DELETE /labels/:labelId`

This endpoint deletes a label with the specified ID.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| `labelId` | string | The ID of the label to be deleted. |

#### Response

- 200 OK: Label deleted successfully.
- 500 Internal Server Error: Error deleting label.
  
## Image Routes

#### `POST /image/saveImage`

This endpoint saves the generated image to the server.

| Parameter   | Type   | Description                                    |
| ----------- | ------ | ---------------------------------------------- |
| `imageData` | string | The base64 encoded image data to be saved.     |

#### Response

- 200 OK: Image saved successfully.
- 500 Internal Server Error: Error saving the image.

#### `POST /image/resize`

This endpoint resizes the saved image by executing a shell script with the package ImageMagick.

#### Response

- 200 OK: Image resized successfully.
- 500 Internal Server Error: Error resizing the image.

#### `POST /image/download-command`

This endpoint downloads the resized image and sends a print command to a printer by executing a shell script with the package CUPS.

#### Response

- 200 OK: Download command executed successfully.
- 500 Internal Server Error: Error executing the download command.

### Other Routes

#### TinyURL

If the URL entered by the user is too long, the QR code becomes too detailed to be read after printing. For this reason, a TinyURL API has been integrated to shorten entered URLs. In this way, the QR code refers to the shortened URL and the shortened URL leads to the entered URL.

| Parameter   | Type   | Description                                    |
| ----------- | ------ | ---------------------------------------------- |
| `url`       | string | The URL input by the user                      |
| `domain`    | string | tinyurl.com                                    |

---

### MongoDB Models

#### User Model

| Attribute  | Type     | Required | Unique |
| ---------- | -------- | -------- | ------ |
| name       | String   | Yes      | No     |
| email      | String   | Yes      | Yes    |
| password   | String   | Yes      | No     |
| labels     | Array    | No       | No     |

#### Label Model

| Attribute          | Type     | Required | Unique |
| ------------------ | -------- | -------- | ------ |
| user               | ObjectId | Yes      | No     |
| name               | String   | Yes      | No     |
| text               | String   | No       | No     |
| fontStyle          | String   | Yes      | No     |
| fontSize           | Number   | Yes      | No     |
| isBold             | Boolean  | Yes      | No     |
| isItalic           | Boolean  | Yes      | No     |
| isUnderline        | Boolean  | Yes      | No     |
| textAlignment      | String   | Yes      | No     |
| verticalAlignment  | String   | Yes      | No     |
| isQRCodeUsed       | Boolean  | Yes      | No     |
| url                | String   | No       | No     |
| shortenedUrl       | String   | No       | No     |
| createdAt          | Date     | Yes      | No     |

---
