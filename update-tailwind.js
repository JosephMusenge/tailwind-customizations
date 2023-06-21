const fs = require('fs');
const find_files_recursively = require('../utilities/FS/find_files_recursively');

 
function buildTailwindConfig(tailwindConfig) {
  const dirname = process.cwd();
  const themes_directory = dirname + '/themes';

  //  find all json files in the themes directory
  const files = find_files_recursively(
    themes_directory,
    (file_list = []),
    (excludes = 'node_modules|dist|.git'),
    (file_type = '.json$')
  );

  let components = {};
  let base = {};
  let utilities = {};

  for (const file of files) {
    // read the file
    const text = fs.readFileSync(file, 'utf8');
    const json = JSON.parse(text);
    //  if file name contains components
    if (file.includes('components')) {
      // merge the styles from the file into the styles object
      Object.assign(components, ...json);
    }
    //  if file name contains base
    if (file.includes('base')) {
      // merge the styles from the file into the styles object
      Object.assign(base, ...json);
    }
    //  if file name contains utilities
    if (file.includes('utilities')) {
      // merge the styles from the file into the styles object
      Object.assign(utilities, ...json);
    }
  }
  const configurations = {
    components,
    base,
    utilities,
  };
  let text = '';
  for (const key in configurations) {
    text += `\n const ${key} = ${JSON.stringify(configurations[key])};`;

    //  add line breaks after  ,
    text = text.replace(/},/g, '},\n');
  }
  text +=  `\n module.exports = {
    components,
    base,
    utilities,
  };`;

  // where there are more than one \n replace with one
  text = text.replace(/\n+/g, '\n');
  

  fs.writeFileSync(dirname + '/app/tailwind-plugin.js', text);

};

buildTailwindConfig();
  