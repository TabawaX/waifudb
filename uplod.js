import fetch from 'node-fetch' // klo ini perlu install perlu npm/yarn
import fs from 'fs'
import path from 'path'

const token = 'YOUR_TOKEN' // TOKEN GITHUB
const owner = 'TabawaX'
const repo = 'waifudb'
const branch = 'master'
const github_foler = 'uplod otomatis'
const local_folder = './images' 
const db_file = './waifusdb.json' // path write file

const upload_to_github = async (file_name, file_content) => {
  const file_path = `${github_foler}/${file_name}`

  const body = {
    message: `© Zhuanxie`,
    content: file_content,
    branch: branch
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${file_path}`

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      authorization: `bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    console.error(`err ${file_name}:`, await response.text())
    return null
  } else {
    const result = await response.json()
    console.log(`${file_name}`)
    console.log(`raw: ${result.content.download_url}`) 
    return result.content.download_url 
  }
}

const upload_all_files = async () => {
  const waifu_data = [] 

  try {
    const files = fs.readdirSync(local_folder) 

    for (const file of files) {
      const file_path = path.join(local_folder, file)
      const file_content = fs.readFileSync(file_path, 'base64') 

      console.log(`running uplod: ${file}`)
      const raw_url = await upload_to_github(file, file_content) 

      if (raw_url) {
        waifu_data.push({
          name: file.replace(/\.[^/.]+$/, ''),
          waifuurl: [raw_url],
          waifuid: '',
          difficulty: 'easy',
          rcrystal: 0,
          source: '-',
          charisma_level: 0,
          tags: [],
          description: 'none',
          filtered: false
        })
      }
    }
    fs.writeFileSync(db_file, JSON.stringify(waifu_data, null, 2))
    console.log('ok udh di simpen di waifusdb.json.')
  } catch (error) {
    console.error(error)
  }
}

upload_all_files()