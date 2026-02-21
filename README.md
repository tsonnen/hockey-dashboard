**NOTE**: This project is a testbed for utilizing LLMs and agentic development to learn how to effectively use them. As a result, the codebase is not optimized, or the _'cleanest'_. Please feel free to contribute to make it better!

# Hockey Dashboard

This is a basic project to allow for seeing all of the hockey games in North America on a given date.

[See it in Action](https://hockey-dashboard.vercel.app/)

## Contributing

All contributions are welcome! Please feel free to browse existing issues and submit a PR!

## Documentation

Internal reference documentation for the external APIs used in this project:

- [NHL API Documentation](external-api-docs/nhlApi.md)
- [HockeyTech (PWHL) API Documentation](external-api-docs/hockeyTechApi.md)

### Get Started

```bash
pnpm i
pnpm prepare
```

```bash
pnpm dev
```

#### Tests

```bash
pnpm test
pnpm playwright:test
```
