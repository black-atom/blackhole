const fs = require('fs')
const path = require('path')
const shell = require('shelljs');
const { Storage } = require('@google-cloud/storage');
const moment = require('moment')

class MongoBackup {
  constructor(keyFilename, projectId, bucketId, folderName = "backup", databaseName) {
    const storage = new  Storage({
      keyFilename: path.resolve(__dirname, '../credentials', keyFilename),
      projectId,
    })

    this.folderName = folderName
    this.bucket = storage.bucket(bucketId)
    this.databaseName = databaseName
  }

  _generateFileName () {
    const dateStr = moment().format('DD-MM-YY-HH-mm-SSS')
    return `${this.folderName}/${this.databaseName}-${dateStr}.gz`
  }

  async createDatabaseBackup () {
    const filename = this._generateFileName()
    return new Promise((resolve, reject) => {
      shell.exec(
        `mongodump --archive=${filename} --gzip --db ${this.databaseName}`,
        {
          silent: true,
        },
        (code, stdout, stderr) => {
          if(code === 0) {
            resolve(filename)
          } else {
            reject()
          }
        })
    })
  }

  async backup(filename) {
    const file = await this.bucket.upload(filename, {
      destination: filename,
      gzip: true,
    })

    console.log(`${filename} uploaded to ${this.bucket.name}.`);
  }
}

module.exports = MongoBackup

