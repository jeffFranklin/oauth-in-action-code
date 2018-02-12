# OAuth 2 in Action Notes - UW / IAM

This is a fork of Justin Richer's repository, with the readme ripped out and replaced with notes for setting up and running the exercises. - Jeff

## Notes

### node / npm setup / installation
don't use macports or any of those to install node. rather, just go to https://nodejs.org and download and install the latest version. I prefer avoiding sudo (admin mode) if possible. For instance, in mac, you could create a `local/bin` directory off of your home directory, and put node and npm there. From your terminal, you could run `export PATH=$PATH:$HOME/local/bin` and your npm commands will then work. Add that command to your `~/.bash_profile` and it will work that way forever.
### getting this repo
`git clone https://github.com/jeffFranklin/oauth-in-action-code`, or you can use the original as `git clone https://github.com/oauthinaction/oauth-in-action-code`. Having cloned you can `cd oauth-in-action-code` to work within this repo.
### first exercise setup
```
cd exercises/ch-3-ex-1
npm install
```

