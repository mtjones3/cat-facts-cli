# cat-facts-cli

A colorful CLI that displays random cat facts with ASCII cat art and speech bubbles.

```
   ___      _     ___        _
  / __|__ _| |_  | __|_ _ __| |_ ___
 | (__/ _` |  _| | _/ _` / _|  _(_-<
  \___\__,_|\__| |_|\__,_\__|\__/__/

 _______________________________________________
/ According to a Gallup poll, most American pet \
\ owners obtain their cats by adopting strays.  /
 -----------------------------------------------
    \
     \
       /\_/\
      ( o.o )
       > ^ <
      /|   |\
     (_|   |_)
```

## Install

```bash
npm install -g cat-facts-cli
```

## Usage

```bash
cat-facts          # show one random cat fact
cat-facts -n 3     # show three random cat facts
cat-facts --help   # show usage info
cat-facts --version
```

## Options

| Flag | Description |
|------|-------------|
| `-n, --count <number>` | Number of cat facts to display (default: 1) |
| `-h, --help` | Show help |
| `-v, --version` | Show version |

## How it works

Facts are fetched from the [catfact.ninja](https://catfact.ninja/fact) API. If the API is unreachable, a built-in set of fallback facts is used instead.

## License

MIT
