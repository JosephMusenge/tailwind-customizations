const fs = require('fs');
 const find_files_recursively = require('../utilities/find_files_recursively');
 
 function buildTailwindConfig() {
   let dirname = process.cwd(); 

const configurations  =  {
    myComponents: getStyles(find_files_recursively(
    dirname +  '/components',
    (file_list = []),
    (excludes = 'node_modules|dist|.git'),
    (file_type = '.json$')
    )),
    myBase: getStyles(find_files_recursively(
    dirname +  '/base',
    (file_list = []),
    (excludes = 'node_modules|dist|.git'),
    (file_type = '.json$')
    )),
    myUtilities: getStyles(find_files_recursively(
    dirname +  '/utilities',
    (file_list = []),
    (excludes = 'node_modules|dist|.git'),
    (file_type = '.json$')
    ))
}
 function getStyles(files) {
  const styles = {};

  for (const file of files) {
    // read the file
    const text = fs.readFileSync(file, 'utf8');
    const json = JSON.parse(text);
 // merge the styles from the file into the styles object
    Object.assign(styles, ...json);
  }
 return styles;
}
   let text = '';
  for (const key in configurations) {
  
    // i need text to add on const var ${key} = ${JSON.stringify(configurations[key])};
    text += `const ${key} = ${JSON.stringify(configurations[key])};\n`;
      

  }

  text += `module.exports = {
    myUtilities,
    myComponents,
    myBase
};`;
     fs.writeFileSync(dirname + '/app/tailwind-plugin.js', text  );
 
}
 
buildTailwindConfig();