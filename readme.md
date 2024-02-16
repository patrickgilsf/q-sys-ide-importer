# Q-Sys ide imoprter

> Write Q-Sys code in your IDE, automatically import to your core

## Installation

Install NodeJS, then:

```bash
git clone https://github.com/patrickgilsf/q-sys-ide-importer.git
```

Install dependencies

```bash
git install
```

### Setup your `init.json` file in `/lib/init.json`

```js
{
  "name": "Insert name here", //name of your program
  "ip": "", //ip address of your core
  "imports": [ //array of objects, file is the file name is "../lua/<file name>", comp is the component in the design
    {"file": "import.lua", "comp": "Import"}
  ]
}
```

### Setup your Q-Sys file

`init.json` has a `component` property that needs to match the text controller/UCI you are trying to write code for, and "Script Access" has to be set to "All", or "External":

![Type Test](img/import_properties.png)

## Authentication

Your Q-Sys core might be hardened with authentication for QRC.
> [!WARNING]
> this is separate from authenticaion on the core itself

Authentication is performed in Q-Sys Administator:
![Image](img/qsys-admin.png)

If your core is authenticated, create a file called `.env` at the root of the repo, and add these credentials to the file

```js
QSysUN="TestUser"
QSysPin=1234
```

## Write your code

Write your control code in `/lua/<file name>.lua`file name must correspond in `init.json/imports.file` 
> [!WARNING]
> Make sure you have a control for every instance of `Controls.control` in your code

## Uploading Data

Once your environment is set up properly, open a command line at the root of the repo and run

```js
node app
```

OR you can have it auto run on every save, with

```js
nodemon app
```

## Contributions and issues

Feel free to submit Pull Requests for bug fixes, or feel free to [open up an issue](https://github.com/patrickgilsf/q-sys-ide-importer/issues).
