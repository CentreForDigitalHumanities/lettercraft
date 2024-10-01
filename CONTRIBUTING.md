# Contributing

This document contains basic information for developing the Lettercraft application.

## Before you start

You need to install the following software:

 - PostgreSQL >= 10, client, server and C libraries
 - Python >= 3.8, <= 3.10
 - virtualenv
 - WSGI-compatible webserver (deployment only)
 - [Visual C++ for Python][1] (Windows only)
 - Node.js >= 16, <= 18
 - Yarn

[1]: https://wiki.python.org/moin/WindowsCompilers


## How it works

This project integrates two isolated subprojects, each inside its own subdirectory with its own code, package dependencies and tests:

- **backend**: the server side web application based on [Django](https://www.djangoproject.com)
- **frontend**: the client side web application based on [Angular](https://angular.dev)

Each subproject is configurable from the outside. Integration is achieved using "magic configuration" which is contained inside the root directory together with this document. In this way, the subprojects can stay truly isolated from each other.

If you are reading this document, you'll likely be working with the integrated project as a whole rather than with one of the subprojects in isolation. In this case, this document should be your primary source of information on how to develop or deploy the project. However, we recommend that you also read the "How it works" section in the README of each subproject.

## Development

### Quickstart

First time after cloning this project:

```sh
python bootstrap.py
```

This will also activate a Python virtual environment. From within the environment, you can run the application in [development mode](#development-mode-vs-production-mode) (hit ctrl-C to stop):

```sh
yarn start
```

This will run the backend and frontend applications, and watch all source files for changes. On every change, unittests rerun, frontend code rebuilds and open browser tabs refresh automatically (livereload).

Some useful URLs:

- https://localhost:8000/ to view the homepage for the frontend
- https://localhost:8000/admin/ to view the backend admin
- https://localhost:8000/api/graphql to explore the GraphQL API

### Working with GraphQL

Lettercraft uses a GraphQL API for research data. (User authentication / management is not handled with GraphQL.)

If you have worked on other applications from our lab, working with GraphQL may be new to you. See [Working with GraphQL](https://github.com/CentreForDigitalHumanities/dh-graphql/blob/main/Working%20with%20GraphQL.md) for a detailed guide on working with GraphQL in a Django/Angular project.

One notable change from the development workflow in other applications is code generation: frontend types are automatically generated based on the backend definitions.

While you have a backend development server running, run `yarn codegen` in a separate terminal. This process will watch the frontend and backend for changes to keep generated types up to date.

(Alternatively, you can `yarn codegen-once`. This will start a backend server, run code generation once, and exit. Note that this only works if the backend isn't already running, and does not work on Windows.)

### Recommended order of development

For new features, it often makes sense to use a "bottom-up" approach, described below. Of course, you may have reasons to choose otherwise.

1. Update backend models, including migrations.
2. Adjust or add backend functions, including unit tests.
3. Adjust backend queries and mutations.
4. Integrate updated queries/mutations in the frontend.
5. Add new frontend functionality, including unit tests.
6. Update technical documentation.

### Commands for common tasks

The `package.json` next to this document defines several shortcut commands to help streamline development. Most may be regarded as implementation details of other commands, although each command could be used directly. Below, we discuss the commands that are most likely to be useful to you. For full details, consult the `package.json`.

#### Installation

Install the pinned versions of all package dependencies in all subprojects:

```sh
yarn
```

Alternatively, you can use separate commands for the frontend and backend:

```sh
yarn install-back
yarn install-front
```

#### Running a development server

As described above, `yarn start` will start a development server. While it can be useful to start the whole application with a single command, most developers prefer to run each service in a separate terminal while working on the code. This makes the terminal output easier to read.

You can do this with the following commands (running each in a separate terminal):

```sh
yarn start-back # start the backend
yarn start-front # start the frontend
yarn watch-back # send livereload requests when the backend is updated (optional)
yarn codegen # run frontend code generation when the backend is updated
```

Note: it's not necessary to run `yarn codegen` if you won't be making changes that affect the GraphQL API. (For instance, if you're only working on the frontend.)

#### Running unit tests

You can run all unit tests with:

```sh
yarn test
```

Backend tests are run with [pytest](https://docs.pytest.org), frontend tests with [jasmine](https://jasmine.github.io/). For more detailed control over testing, like running a single test, consult the documentation of those libraries.

#### Running Django commands

Run `python manage.py` within the `backend` directory:

```sh
yarn django [SUBCOMMAND] [OPTIONS]
```

`yarn django` is a shorthand for `yarn back python manage.py`. This command is useful for managing database migrations, among other things.

### Managing dependencies

#### Python dependencies

Python dependencies are managed using pip and recorded in [requirements.in](/backend/requirements.in) / [requirements.txt](/backend/requirements.txt). To update dependencies:

- Edit `requirements.in` to describe the new dependencies.
- Run `pip-compile` to update the full manifest in `requirements.txt`.
- Run `pip install -r requirements.txt` to update your Python environment.

#### Frontend dependencies

Frontend dependencies are managed using [yarn](https://classic.yarnpkg.com/en/). See the [usage guide](https://classic.yarnpkg.com/en/docs/usage) for details.

### Development mode vs production mode

The purpose of development mode is to facilitate live development, as the name implies. The purpose of production mode is to simulate deployment conditions as closely as possible, in order to check whether everything still works under such conditions. A complete overview of the differences is given below.

dimension  |  Development mode  |  Production mode
-----------|--------------------|-----------------
command  |  `yarn start`  |  `yarn start-p`
base address  |  http://localhost:8000  |  http://localhost:4200
backend server (Django)  |  in charge of everything  |  serves backend only
frontend server (angular-cli)  |  serves  |  watch and build
static files  |  served directly by Django's staticfiles app  |  collected by Django, served by gulp-connect
backend `DEBUG` setting  |  `True`  |  `False`
backend `ALLOWED_HOSTS`  |  -  |  restricted to `localhost`
frontend sourcemaps  |  yes  |  no
frontend optimization  |  no  |  yes


## Deployment

Both the backend and frontend applications have a section dedicated to deployment in their own READMEs. You should read these sections entirely before proceeding. All instructions in these sections still apply, though it is good to know that you can use the following shorthand commands from the integrated project root:

```console

# collect static files of both backend and frontend, with overridden settings
$ yarn django collectstatic --settings SETTINGS --pythonpath path/to/SETTINGS.py
```

You should build the frontend before collecting all static files.
