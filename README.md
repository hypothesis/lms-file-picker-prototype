# LMS file picker prototype

This is a prototype of a replacement UI for selecting files to annotate as part
of an assignment created with [Hypothesis' LMS integration](https://github.com/hypothesis/lms).

See https://github.com/hypothesis/lms/issues/470 and
https://github.com/hypothesis/lms/issues/460

## Usage

```sh
# Install dependencies.
npm install

# Run the demo server.
npm start
```

Then browse to http://localhost:8080.

## Tests and code quality checks

Even though this is a prototype, we are looking to potentially reuse the
frontend code in the LMS app.

The prototype uses ESLint for linting and Prettier for formatting. Run lint
and style checks using:

```
npm run lint
```

Format the code with:

```
npm run format
```

Run tests with:

```
npm test
```
