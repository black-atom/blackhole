require('dotenv').config()
const cron = require('node-cron')
const MongoBackup = require('./MongoBackup')

const {
  KEY_FILE_NAME,
  PROJECT_ID,
  BUCKET_NAME,
  DATABASE_NAME,
  FOLDER_NAME,
} = process.env

const mongoBackup = new MongoBackup(
  KEY_FILE_NAME,
  PROJECT_ID,
  BUCKET_NAME,
  FOLDER_NAME,
  DATABASE_NAME,
)

console.log(`Process ID ${process.pid}`)

const backup = () => Promise
  .resolve()
  .then(() => mongoBackup.createDatabaseBackup())
  .then((fileName) => mongoBackup.backup(fileName))
  .then(() => console.log('Backup made at ' + new Date))
  .catch(console.error)


//run this job every 8 hours
const task = cron.schedule('*/8 * * * *', backup)
backup() // run the fist time