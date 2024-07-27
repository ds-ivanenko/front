## Installation

### Prerequisites
- Node.js (v20.x or later)
- npm (v10.x or later)

### Steps

1. **Install npm dependencies:**
    ```sh
    npm install
    ```

2. **Create a `.env` file:**
   Create a `.env` file in the theme root directory and add the following line:
    ```env
    BROWSERSYNC_PROXY=your-local-dev-url
    ```
   Replace `your-local-dev-url` with the URL you use to access your local site (e.g., `http://site.local`).

## Usage

### Development
To start the development environment, run:
```sh
gulp
