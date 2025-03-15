# Superset Embedding Example

This project demonstrates how to embed an Apache Superset dashboard into a web application using a Node.js Express server. It includes:

- A Node.js application that logs in to Superset, retrieves a CSRF token, generates a guest embedding token, and serves an HTML page embedding the dashboard.
- A sample Superset configuration (`superset_config.py`) that enables embedding via guest tokens.
- Step-by-step instructions on how to set up, run, and deploy the project on GitHub.

## Prerequisites

- **Node.js** (v12+ recommended) and **npm** installed on your machine.
- A running instance of Apache Superset (either installed locally or via Docker).
- The Superset configuration must enable embedding. In the sample configuration file (`superset_config.py`), the flag `EMBEDDED_SUPERSET` is set to `True` and the guest role & token settings are configured.
