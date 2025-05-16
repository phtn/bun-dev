# bun-dev

devtools built with bun:ffi(zig)

## The Stack

- TS
- Bun
- Zig

## Run

Launch local server

```zsh
bun dev
# http://localhost:8080
```

## APIs

### Conversions

Types to Zod Schema

```zsh
curl -X POST localhost:8080/ts-to-zod -d <source-path>
```

JSON/Object to Type Interface

```zsh
curl -X POST localhost:8080/obj-to-ts -d <source-path>
```
