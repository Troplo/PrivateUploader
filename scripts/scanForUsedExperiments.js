const fs = require("fs")
const path = require("path")

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, file))
    }
  })

  return arrayOfFiles
}

const searchFlags = (files) => {
  const flagPatterns = [
    /experiments\.experiments\.(\w+)/g, // experiments.experiments.FLAG
    /experiments\.(\w+)/g, // experiments.FLAG
    /experiments\["(\w+)"]/g, // experiments["FLAG"]
    /experiments\['(\w+)']/g // experiments['FLAG']
  ]

  const flagCounts = {}

  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8")
    flagPatterns.forEach((pattern) => {
      let match
      while ((match = pattern.exec(content)) !== null) {
        const flag = match[1]
        if (flag !== flag.toUpperCase()) {
          continue
        }
        if (flagCounts[flag]) {
          flagCounts[flag]++
        } else {
          flagCounts[flag] = 1
        }
      }
    })
  })

  return flagCounts
}

const main = (src = "../frontend/src") => {
  const parentDir = path.join(__dirname, src)
  const allFiles = getAllFiles(parentDir)
  const tsAndVueFiles = allFiles.filter(
    (file) =>
      file.endsWith(".ts") || file.endsWith(".vue") || file.endsWith(".js")
  )
  const flagCounts = searchFlags(tsAndVueFiles)

  console.log(`\nExperiments for ${src}:`)
  for (const [flag, count] of Object.entries(flagCounts)) {
    console.log(`${flag}: ${count}`)
  }
}

// v4
main()
// v5 (unused)
main("../../Flowinity5/src")
// v3
main("../../TPUv3/frontend/src")
// v2
main("../../TPUFlowinityImages-v2/ui/src")
// v1
main("../../TPUFlowinityImages/ui/src")
