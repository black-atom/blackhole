# Black Hole
A Mongo backup tool that uploads backups directly to Google Cloud Storage

## How To Run
This script is meant to run 3 times a day
```
  ./run.sh
```

## Restore
```
  mongorestore --gzip --db databaseName --archive=backupFilePath
```
